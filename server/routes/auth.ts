import { type Express, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { hashPassword, verifyPassword, generateToken } from "../auth";
import { storage } from "../storage";
import { sendVerificationEmail, sendPasswordResetEmail } from "../email";
import type { User } from "@shared/schema";

// Validation schemas
const registerSchema = z.object({
  username: z.string().min(3).max(255),
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8),
});

// Middleware to check if user is authenticated
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// Middleware to check user role
export function requireRole(...roles: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    next();
  };
}

export function registerAuthRoutes(app: Express) {
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

  // Register
  app.post('/api/auth/register', async (req: Request, res: Response) => {
    try {
      const data = registerSchema.parse(req.body);

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(data.email);
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const existingUsername = await storage.getUserByUsername(data.username);
      if (existingUsername) {
        return res.status(400).json({ error: 'Username already taken' });
      }

      // Hash password and create user
      const passwordHash = await hashPassword(data.password);
      const verificationToken = generateToken();

      const user = await storage.createUser({
        username: data.username,
        email: data.email,
        passwordHash,
        role: 'AUTHOR',
        verificationToken,
        emailVerified: false,
      });

      // Send verification email
      await sendVerificationEmail(data.email, verificationToken, baseUrl);

      res.json({
        message: 'Registration successful. Please check your email to verify your account.',
        userId: user.id,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid input', details: error.errors });
      }
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  });

  // Verify email
  app.get('/api/auth/verify-email', async (req: Request, res: Response) => {
    try {
      const { token } = req.query;
      
      if (!token || typeof token !== 'string') {
        return res.status(400).json({ error: 'Invalid verification token' });
      }

      const user = await storage.verifyUserEmail(token);
      
      if (!user) {
        return res.status(400).json({ error: 'Invalid or expired verification token' });
      }

      res.json({ message: 'Email verified successfully. You can now log in.' });
    } catch (error) {
      console.error('Email verification error:', error);
      res.status(500).json({ error: 'Verification failed' });
    }
  });

  // Login
  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      const data = loginSchema.parse(req.body);

      const user = await storage.getUserByEmail(data.email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      if (!user.emailVerified) {
        return res.status(401).json({ error: 'Please verify your email before logging in' });
      }

      const isValid = await verifyPassword(data.password, user.passwordHash);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Set session
      req.session.userId = user.id;
      req.session.user = user;

      // Don't send password hash to client
      const { passwordHash, verificationToken, resetToken, resetTokenExpiry, ...safeUser } = user;

      res.json({
        message: 'Login successful',
        user: safeUser,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid input', details: error.errors });
      }
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  });

  // Logout
  app.post('/api/auth/logout', (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Logout failed' });
      }
      res.json({ message: 'Logout successful' });
    });
  });

  // Get current user
  app.get('/api/auth/me', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const { passwordHash, verificationToken, resetToken, resetTokenExpiry, ...safeUser } = user;
      res.json({ user: safeUser });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ error: 'Failed to get user' });
    }
  });

  // Forgot password
  app.post('/api/auth/forgot-password', async (req: Request, res: Response) => {
    try {
      const data = forgotPasswordSchema.parse(req.body);

      const user = await storage.getUserByEmail(data.email);
      
      // Always return success to prevent email enumeration
      if (!user) {
        return res.json({ message: 'If your email is registered, you will receive a password reset link.' });
      }

      const resetToken = generateToken();
      const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await storage.setResetToken(data.email, resetToken, expiry);
      await sendPasswordResetEmail(data.email, resetToken, baseUrl);

      res.json({ message: 'If your email is registered, you will receive a password reset link.' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid input', details: error.errors });
      }
      console.error('Forgot password error:', error);
      res.status(500).json({ error: 'Request failed' });
    }
  });

  // Reset password
  app.post('/api/auth/reset-password', async (req: Request, res: Response) => {
    try {
      const data = resetPasswordSchema.parse(req.body);

      const passwordHash = await hashPassword(data.password);
      const user = await storage.resetPassword(data.token, passwordHash);

      if (!user) {
        return res.status(400).json({ error: 'Invalid or expired reset token' });
      }

      res.json({ message: 'Password reset successful. You can now log in with your new password.' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid input', details: error.errors });
      }
      console.error('Reset password error:', error);
      res.status(500).json({ error: 'Password reset failed' });
    }
  });
}
