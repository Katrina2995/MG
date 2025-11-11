import { eq, desc, and, or, like, sql, inArray } from "drizzle-orm";
import { db } from "./db";
import {
  users,
  posts,
  tags,
  postTags,
  comments,
  type User,
  type InsertUser,
  type Post,
  type InsertPost,
  type Tag,
  type InsertTag,
  type Comment,
  type InsertComment,
  type PostStatus,
  type UserRole,
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: Omit<InsertUser, 'id'>): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  updateUserRole(id: number, role: UserRole): Promise<User | undefined>;
  verifyUserEmail(token: string): Promise<User | undefined>;
  setResetToken(email: string, token: string, expiry: Date): Promise<User | undefined>;
  resetPassword(token: string, passwordHash: string): Promise<User | undefined>;

  // Post operations
  getPost(id: number): Promise<(Post & { author: User; tags: Tag[] }) | undefined>;
  getPostBySlug(slug: string): Promise<(Post & { author: User; tags: Tag[] }) | undefined>;
  getPublishedPosts(limit?: number, offset?: number): Promise<(Post & { author: User })[]>;
  getPostsByStatus(status: PostStatus, limit?: number): Promise<(Post & { author: User })[]>;
  getPostsByAuthor(authorId: number, limit?: number): Promise<Post[]>;
  createPost(post: Omit<InsertPost, 'id'>): Promise<Post>;
  updatePost(id: number, updates: Partial<Post>): Promise<Post | undefined>;
  updatePostStatus(id: number, status: PostStatus): Promise<Post | undefined>;
  publishPost(id: number): Promise<Post | undefined>;
  deletePost(id: number): Promise<boolean>;
  searchPosts(query: string): Promise<(Post & { author: User })[]>;
  checkSlugExists(slug: string, excludeId?: number): Promise<boolean>;

  // Tag operations
  getTag(id: number): Promise<Tag | undefined>;
  getTagBySlug(slug: string): Promise<Tag | undefined>;
  getAllTags(): Promise<Tag[]>;
  createTag(tag: Omit<InsertTag, 'id'>): Promise<Tag>;
  getPostsByTag(tagSlug: string, limit?: number): Promise<(Post & { author: User })[]>;
  
  // Post-Tag operations
  addTagToPost(postId: number, tagId: number): Promise<void>;
  removeTagFromPost(postId: number, tagId: number): Promise<void>;
  setPostTags(postId: number, tagIds: number[]): Promise<void>;

  // Comment operations
  getCommentsByPost(postId: number): Promise<(Comment & { author: User })[]>;
  createComment(comment: Omit<InsertComment, 'id'>): Promise<Comment>;
  approveComment(id: number): Promise<Comment | undefined>;
  deleteComment(id: number): Promise<boolean>;
}

export class DbStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: Omit<InsertUser, 'id'>): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db.update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async updateUserRole(id: number, role: UserRole): Promise<User | undefined> {
    const [user] = await db.update(users)
      .set({ role })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async verifyUserEmail(token: string): Promise<User | undefined> {
    const [user] = await db.update(users)
      .set({ emailVerified: true, verificationToken: null })
      .where(eq(users.verificationToken, token))
      .returning();
    return user;
  }

  async setResetToken(email: string, token: string, expiry: Date): Promise<User | undefined> {
    const [user] = await db.update(users)
      .set({ resetToken: token, resetTokenExpiry: expiry })
      .where(eq(users.email, email))
      .returning();
    return user;
  }

  async resetPassword(token: string, passwordHash: string): Promise<User | undefined> {
    const [user] = await db.update(users)
      .set({ 
        passwordHash, 
        resetToken: null, 
        resetTokenExpiry: null 
      })
      .where(and(
        eq(users.resetToken, token),
        sql`${users.resetTokenExpiry} > NOW()`
      ))
      .returning();
    return user;
  }

  // Post operations
  async getPost(id: number): Promise<(Post & { author: User; tags: Tag[] }) | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    if (!post) return undefined;

    const [author] = await db.select().from(users).where(eq(users.id, post.authorId));
    const postTagRows = await db
      .select({ tag: tags })
      .from(postTags)
      .innerJoin(tags, eq(postTags.tagId, tags.id))
      .where(eq(postTags.postId, id));

    return {
      ...post,
      author,
      tags: postTagRows.map((row: { tag: Tag }) => row.tag),
    };
  }

  async getPostBySlug(slug: string): Promise<(Post & { author: User; tags: Tag[] }) | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.slug, slug));
    if (!post) return undefined;

    const [author] = await db.select().from(users).where(eq(users.id, post.authorId));
    const postTagRows = await db
      .select({ tag: tags })
      .from(postTags)
      .innerJoin(tags, eq(postTags.tagId, tags.id))
      .where(eq(postTags.postId, post.id));

    return {
      ...post,
      author,
      tags: postTagRows.map((row: { tag: Tag }) => row.tag),
    };
  }

  async getPublishedPosts(limit: number = 20, offset: number = 0): Promise<(Post & { author: User })[]> {
    const postsData = await db
      .select({ post: posts, author: users })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .where(eq(posts.status, 'PUBLISHED'))
      .orderBy(desc(posts.publishedAt))
      .limit(limit)
      .offset(offset);

    return postsData.map(({ post, author }: { post: Post; author: User }) => ({ ...post, author }));
  }

  async getPostsByStatus(status: PostStatus, limit: number = 50): Promise<(Post & { author: User })[]> {
    const postsData = await db
      .select({ post: posts, author: users })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .where(eq(posts.status, status))
      .orderBy(desc(posts.updatedAt))
      .limit(limit);

    return postsData.map(({ post, author }: { post: Post; author: User }) => ({ ...post, author }));
  }

  async getPostsByAuthor(authorId: number, limit: number = 50): Promise<Post[]> {
    return db.select().from(posts)
      .where(eq(posts.authorId, authorId))
      .orderBy(desc(posts.updatedAt))
      .limit(limit);
  }

  async createPost(insertPost: Omit<InsertPost, 'id'>): Promise<Post> {
    const [post] = await db.insert(posts).values(insertPost).returning();
    return post;
  }

  async updatePost(id: number, updates: Partial<Post>): Promise<Post | undefined> {
    const [post] = await db.update(posts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(posts.id, id))
      .returning();
    return post;
  }

  async updatePostStatus(id: number, status: PostStatus): Promise<Post | undefined> {
    const [post] = await db.update(posts)
      .set({ status, updatedAt: new Date() })
      .where(eq(posts.id, id))
      .returning();
    return post;
  }

  async publishPost(id: number): Promise<Post | undefined> {
    const [post] = await db.update(posts)
      .set({ 
        status: 'PUBLISHED', 
        publishedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(posts.id, id))
      .returning();
    return post;
  }

  async deletePost(id: number): Promise<boolean> {
    const result = await db.delete(posts).where(eq(posts.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async searchPosts(query: string): Promise<(Post & { author: User })[]> {
    const searchPattern = `%${query}%`;
    const postsData = await db
      .select({ post: posts, author: users })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .where(
        and(
          eq(posts.status, 'PUBLISHED'),
          or(
            like(posts.title, searchPattern),
            like(posts.content, searchPattern),
            like(posts.summary, searchPattern)
          )
        )
      )
      .orderBy(desc(posts.publishedAt))
      .limit(50);

    return postsData.map(({ post, author }: { post: Post; author: User }) => ({ ...post, author }));
  }

  async checkSlugExists(slug: string, excludeId?: number): Promise<boolean> {
    const conditions = [eq(posts.slug, slug)];
    if (excludeId) {
      conditions.push(sql`${posts.id} != ${excludeId}`);
    }

    const [result] = await db
      .select({ id: posts.id })
      .from(posts)
      .where(and(...conditions));

    return !!result;
  }

  // Tag operations
  async getTag(id: number): Promise<Tag | undefined> {
    const [tag] = await db.select().from(tags).where(eq(tags.id, id));
    return tag;
  }

  async getTagBySlug(slug: string): Promise<Tag | undefined> {
    const [tag] = await db.select().from(tags).where(eq(tags.slug, slug));
    return tag;
  }

  async getAllTags(): Promise<Tag[]> {
    return db.select().from(tags).orderBy(tags.name);
  }

  async createTag(insertTag: Omit<InsertTag, 'id'>): Promise<Tag> {
    const [tag] = await db.insert(tags).values(insertTag).returning();
    return tag;
  }

  async getPostsByTag(tagSlug: string, limit: number = 20): Promise<(Post & { author: User })[]> {
    const postsData = await db
      .select({ post: posts, author: users })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .innerJoin(postTags, eq(posts.id, postTags.postId))
      .innerJoin(tags, eq(postTags.tagId, tags.id))
      .where(and(
        eq(posts.status, 'PUBLISHED'),
        eq(tags.slug, tagSlug)
      ))
      .orderBy(desc(posts.publishedAt))
      .limit(limit);

    return postsData.map(({ post, author }: { post: Post; author: User }) => ({ ...post, author }));
  }

  // Post-Tag operations
  async addTagToPost(postId: number, tagId: number): Promise<void> {
    await db.insert(postTags).values({ postId, tagId }).onConflictDoNothing();
  }

  async removeTagFromPost(postId: number, tagId: number): Promise<void> {
    await db.delete(postTags)
      .where(and(
        eq(postTags.postId, postId),
        eq(postTags.tagId, tagId)
      ));
  }

  async setPostTags(postId: number, tagIds: number[]): Promise<void> {
    // Remove all existing tags
    await db.delete(postTags).where(eq(postTags.postId, postId));
    
    // Add new tags
    if (tagIds.length > 0) {
      await db.insert(postTags)
        .values(tagIds.map(tagId => ({ postId, tagId })));
    }
  }

  // Comment operations
  async getCommentsByPost(postId: number): Promise<(Comment & { author: User })[]> {
    const commentsData = await db
      .select({ comment: comments, author: users })
      .from(comments)
      .innerJoin(users, eq(comments.authorId, users.id))
      .where(and(
        eq(comments.postId, postId),
        eq(comments.approved, true)
      ))
      .orderBy(comments.createdAt);

    return commentsData.map(({ comment, author }: { comment: Comment; author: User }) => ({ ...comment, author }));
  }

  async createComment(insertComment: Omit<InsertComment, 'id'>): Promise<Comment> {
    const [comment] = await db.insert(comments).values(insertComment).returning();
    return comment;
  }

  async approveComment(id: number): Promise<Comment | undefined> {
    const [comment] = await db.update(comments)
      .set({ approved: true })
      .where(eq(comments.id, id))
      .returning();
    return comment;
  }

  async deleteComment(id: number): Promise<boolean> {
    const result = await db.delete(comments).where(eq(comments.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }
}

export const storage = new DbStorage();
