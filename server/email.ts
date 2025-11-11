import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

// Create reusable transporter
let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!transporter) {
    // In development, use ethereal email for testing
    // In production, configure with real SMTP settings
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // For development, log to console
      console.log('Email service not configured. Set SMTP_* environment variables for production.');
      transporter = nodemailer.createTransport({
        streamTransport: true,
        newline: 'unix',
        buffer: true
      });
    }
  }
  return transporter;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const transport = getTransporter();
    
    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@millergroup.blog',
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html || options.text,
    };

    const info = await transport.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    
    // In development with stream transport, log the message
    if ((info as any).message) {
      console.log('Email content:', (info as any).message.toString());
    }
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

export async function sendVerificationEmail(email: string, token: string, baseUrl: string): Promise<boolean> {
  const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${token}`;
  
  return sendEmail({
    to: email,
    subject: 'Verify your email address',
    text: `Please verify your email address by clicking this link: ${verificationUrl}`,
    html: `
      <h2>Verify Your Email</h2>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}">Verify Email</a>
      <p>If you didn't create this account, you can safely ignore this email.</p>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, token: string, baseUrl: string): Promise<boolean> {
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;
  
  return sendEmail({
    to: email,
    subject: 'Reset your password',
    text: `Click this link to reset your password: ${resetUrl}`,
    html: `
      <h2>Reset Your Password</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request a password reset, you can safely ignore this email.</p>
    `,
  });
}
