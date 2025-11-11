import { type Express, type Request, type Response } from "express";
import { z } from "zod";
import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";
import { storage } from "../storage";
import { generateSlug, generateUniqueSlug, truncateDescription } from "../auth";
import { requireAuth, requireRole } from "./auth";
import type { PostStatus } from "@shared/schema";

// Validation schemas
const createPostSchema = z.object({
  title: z.string().min(1).max(500),
  summary: z.string().optional(),
  content: z.string().min(1),
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
  canonicalUrl: z.string().url().optional(),
  metaRobots: z.string().max(50).optional(),
  featuredImage: z.string().optional(),
  tagIds: z.array(z.number()).optional(),
});

const updatePostSchema = createPostSchema.partial();

const createTagSchema = z.object({
  name: z.string().min(1).max(100),
});

export function registerBlogRoutes(app: Express) {
  // Get all published posts (public)
  app.get('/api/blog/posts', async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;

      const posts = await storage.getPublishedPosts(limit, offset);
      res.json({ posts });
    } catch (error) {
      console.error('Get posts error:', error);
      res.status(500).json({ error: 'Failed to get posts' });
    }
  });

  // Get single post by slug (public)
  app.get('/api/blog/posts/slug/:slug', async (req: Request, res: Response) => {
    try {
      const post = await storage.getPostBySlug(req.params.slug);
      
      if (!post || post.status !== 'PUBLISHED') {
        return res.status(404).json({ error: 'Post not found' });
      }

      res.json({ post });
    } catch (error) {
      console.error('Get post error:', error);
      res.status(500).json({ error: 'Failed to get post' });
    }
  });

  // Search posts (public)
  app.get('/api/blog/search', async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;
      
      if (!query) {
        return res.status(400).json({ error: 'Search query is required' });
      }

      const posts = await storage.searchPosts(query);
      res.json({ posts });
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ error: 'Search failed' });
    }
  });

  // Get posts by tag (public)
  app.get('/api/blog/tag/:slug', async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const posts = await storage.getPostsByTag(req.params.slug, limit);
      res.json({ posts });
    } catch (error) {
      console.error('Get posts by tag error:', error);
      res.status(500).json({ error: 'Failed to get posts' });
    }
  });

  // Get all tags (public)
  app.get('/api/blog/tags', async (req: Request, res: Response) => {
    try {
      const tags = await storage.getAllTags();
      res.json({ tags });
    } catch (error) {
      console.error('Get tags error:', error);
      res.status(500).json({ error: 'Failed to get tags' });
    }
  });

  // Create post (author+)
  app.post('/api/blog/posts', requireAuth, async (req: Request, res: Response) => {
    try {
      const data = createPostSchema.parse(req.body);
      
      // Generate slug from title
      const baseSlug = generateSlug(data.title);
      const existingSlugs = await storage.checkSlugExists(baseSlug) ? [baseSlug] : [];
      const slug = generateUniqueSlug(baseSlug, existingSlugs);

      // Convert markdown to HTML and sanitize
      const htmlContent = DOMPurify.sanitize(marked(data.content) as string);

      // Truncate meta description if needed
      const metaDescription = data.metaDescription 
        ? truncateDescription(data.metaDescription, 160)
        : data.summary 
          ? truncateDescription(data.summary, 160)
          : undefined;

      const post = await storage.createPost({
        ...data,
        slug,
        htmlContent,
        metaDescription,
        authorId: req.session.userId!,
        status: 'DRAFT',
      });

      // Add tags if provided
      if (data.tagIds && data.tagIds.length > 0) {
        await storage.setPostTags(post.id, data.tagIds);
      }

      const fullPost = await storage.getPost(post.id);
      res.json({ post: fullPost });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid input', details: error.errors });
      }
      console.error('Create post error:', error);
      res.status(500).json({ error: 'Failed to create post' });
    }
  });

  // Update post (author or editor)
  app.put('/api/blog/posts/:id', requireAuth, async (req: Request, res: Response) => {
    try {
      const postId = parseInt(req.params.id);
      const data = updatePostSchema.parse(req.body);

      // Check if user owns the post or is editor/admin
      const existingPost = await storage.getPost(postId);
      if (!existingPost) {
        return res.status(404).json({ error: 'Post not found' });
      }

      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const canEdit = existingPost.authorId === user.id || ['EDITOR', 'ADMIN'].includes(user.role);
      if (!canEdit) {
        return res.status(403).json({ error: 'You do not have permission to edit this post' });
      }

      // Update slug if title changed
      let updates: any = { ...data };
      if (data.title && data.title !== existingPost.title) {
        const baseSlug = generateSlug(data.title);
        const existingSlugs = await storage.checkSlugExists(baseSlug, postId) ? [baseSlug] : [];
        updates.slug = generateUniqueSlug(baseSlug, existingSlugs);
      }

      // Convert markdown to HTML if content changed
      if (data.content) {
        updates.htmlContent = DOMPurify.sanitize(marked(data.content) as string);
      }

      // Truncate meta description if provided
      if (data.metaDescription) {
        updates.metaDescription = truncateDescription(data.metaDescription, 160);
      }

      const post = await storage.updatePost(postId, updates);

      // Update tags if provided
      if (data.tagIds !== undefined) {
        await storage.setPostTags(postId, data.tagIds);
      }

      const fullPost = await storage.getPost(postId);
      res.json({ post: fullPost });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid input', details: error.errors });
      }
      console.error('Update post error:', error);
      res.status(500).json({ error: 'Failed to update post' });
    }
  });

  // Submit post for review (author)
  app.post('/api/blog/posts/:id/submit', requireAuth, async (req: Request, res: Response) => {
    try {
      const postId = parseInt(req.params.id);
      
      const existingPost = await storage.getPost(postId);
      if (!existingPost) {
        return res.status(404).json({ error: 'Post not found' });
      }

      if (existingPost.authorId !== req.session.userId) {
        return res.status(403).json({ error: 'You do not have permission to submit this post' });
      }

      if (existingPost.status !== 'DRAFT') {
        return res.status(400).json({ error: 'Only draft posts can be submitted for review' });
      }

      const post = await storage.updatePostStatus(postId, 'REVIEW');
      res.json({ post });
    } catch (error) {
      console.error('Submit post error:', error);
      res.status(500).json({ error: 'Failed to submit post' });
    }
  });

  // Publish post (editor+)
  app.post('/api/blog/posts/:id/publish', requireRole('EDITOR', 'ADMIN'), async (req: Request, res: Response) => {
    try {
      const postId = parseInt(req.params.id);
      
      const post = await storage.publishPost(postId);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      // TODO: Trigger sitemap and RSS regeneration
      
      res.json({ post });
    } catch (error) {
      console.error('Publish post error:', error);
      res.status(500).json({ error: 'Failed to publish post' });
    }
  });

  // Get posts by status (editor+)
  app.get('/api/blog/admin/posts', requireRole('EDITOR', 'ADMIN'), async (req: Request, res: Response) => {
    try {
      const status = (req.query.status as PostStatus) || 'REVIEW';
      const limit = parseInt(req.query.limit as string) || 50;

      const posts = await storage.getPostsByStatus(status, limit);
      res.json({ posts });
    } catch (error) {
      console.error('Get admin posts error:', error);
      res.status(500).json({ error: 'Failed to get posts' });
    }
  });

  // Get user's own posts
  app.get('/api/blog/my-posts', requireAuth, async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const posts = await storage.getPostsByAuthor(req.session.userId!, limit);
      res.json({ posts });
    } catch (error) {
      console.error('Get my posts error:', error);
      res.status(500).json({ error: 'Failed to get posts' });
    }
  });

  // Delete post (admin or author)
  app.delete('/api/blog/posts/:id', requireAuth, async (req: Request, res: Response) => {
    try {
      const postId = parseInt(req.params.id);
      
      const post = await storage.getPost(postId);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const canDelete = post.authorId === user.id || user.role === 'ADMIN';
      if (!canDelete) {
        return res.status(403).json({ error: 'You do not have permission to delete this post' });
      }

      await storage.deletePost(postId);
      res.json({ message: 'Post deleted successfully' });
    } catch (error) {
      console.error('Delete post error:', error);
      res.status(500).json({ error: 'Failed to delete post' });
    }
  });

  // Create tag (editor+)
  app.post('/api/blog/tags', requireRole('EDITOR', 'ADMIN'), async (req: Request, res: Response) => {
    try {
      const data = createTagSchema.parse(req.body);
      const slug = generateSlug(data.name);

      const tag = await storage.createTag({
        name: data.name,
        slug,
      });

      res.json({ tag });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid input', details: error.errors });
      }
      console.error('Create tag error:', error);
      res.status(500).json({ error: 'Failed to create tag' });
    }
  });

  // Get comments for a post (public)
  app.get('/api/blog/posts/:id/comments', async (req: Request, res: Response) => {
    try {
      const postId = parseInt(req.params.id);
      const comments = await storage.getCommentsByPost(postId);
      res.json({ comments });
    } catch (error) {
      console.error('Get comments error:', error);
      res.status(500).json({ error: 'Failed to get comments' });
    }
  });

  // Create comment (authenticated)
  app.post('/api/blog/posts/:id/comments', requireAuth, async (req: Request, res: Response) => {
    try {
      const postId = parseInt(req.params.id);
      const { content } = req.body;

      if (!content || typeof content !== 'string') {
        return res.status(400).json({ error: 'Comment content is required' });
      }

      const comment = await storage.createComment({
        content,
        authorId: req.session.userId!,
        postId,
      });

      res.json({ comment });
    } catch (error) {
      console.error('Create comment error:', error);
      res.status(500).json({ error: 'Failed to create comment' });
    }
  });

  // Approve comment (editor+)
  app.post('/api/blog/comments/:id/approve', requireRole('EDITOR', 'ADMIN'), async (req: Request, res: Response) => {
    try {
      const commentId = parseInt(req.params.id);
      const comment = await storage.approveComment(commentId);
      
      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }

      res.json({ comment });
    } catch (error) {
      console.error('Approve comment error:', error);
      res.status(500).json({ error: 'Failed to approve comment' });
    }
  });

  // Update user role (admin only)
  app.put('/api/blog/users/:id/role', requireRole('ADMIN'), async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const { role } = req.body;

      if (!['AUTHOR', 'EDITOR', 'ADMIN'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
      }

      const user = await storage.updateUserRole(userId, role);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const { passwordHash, verificationToken, resetToken, resetTokenExpiry, ...safeUser } = user;
      res.json({ user: safeUser });
    } catch (error) {
      console.error('Update user role error:', error);
      res.status(500).json({ error: 'Failed to update user role' });
    }
  });
}
