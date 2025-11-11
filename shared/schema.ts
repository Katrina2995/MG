import { sql } from "drizzle-orm";
import { 
  pgTable, 
  text, 
  varchar, 
  integer, 
  timestamp, 
  pgEnum,
  boolean,
  index
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const userRoleEnum = pgEnum("user_role", ["AUTHOR", "EDITOR", "ADMIN"]);
export const postStatusEnum = pgEnum("post_status", ["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"]);

export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").notNull().default("AUTHOR"),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  emailVerified: boolean("email_verified").notNull().default(false),
  verificationToken: text("verification_token"),
  resetToken: text("reset_token"),
  resetTokenExpiry: timestamp("reset_token_expiry"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const posts = pgTable("posts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: varchar("title", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 500 }).notNull().unique(),
  summary: text("summary"),
  content: text("content").notNull(), // markdown
  htmlContent: text("html_content"), // cached HTML
  status: postStatusEnum("status").notNull().default("DRAFT"),
  metaTitle: varchar("meta_title", { length: 60 }),
  metaDescription: varchar("meta_description", { length: 160 }),
  canonicalUrl: text("canonical_url"),
  metaRobots: varchar("meta_robots", { length: 50 }),
  featuredImage: text("featured_image"),
  authorId: integer("author_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  publishedAt: timestamp("published_at"),
  searchVector: text("search_vector"), // for full-text search
}, (table) => ({
  slugIdx: index("slug_idx").on(table.slug),
  statusIdx: index("status_idx").on(table.status),
  authorIdx: index("author_idx").on(table.authorId),
  publishedAtIdx: index("published_at_idx").on(table.publishedAt),
}));

export const tags = pgTable("tags", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  slugIdx: index("tag_slug_idx").on(table.slug),
}));

export const postTags = pgTable("post_tags", {
  postId: integer("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
  tagId: integer("tag_id").notNull().references(() => tags.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  postTagIdx: index("post_tag_idx").on(table.postId, table.tagId),
}));

export const comments = pgTable("comments", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  content: text("content").notNull(),
  authorId: integer("author_id").notNull().references(() => users.id),
  postId: integer("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
  approved: boolean("approved").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  postIdx: index("comment_post_idx").on(table.postId),
  authorIdx: index("comment_author_idx").on(table.authorId),
}));

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  postTags: many(postTags),
  comments: many(comments),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  postTags: many(postTags),
}));

export const postTagsRelations = relations(postTags, ({ one }) => ({
  post: one(posts, {
    fields: [postTags.postId],
    references: [posts.id],
  }),
  tag: one(tags, {
    fields: [postTags.tagId],
    references: [tags.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  author: one(users, {
    fields: [comments.authorId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
}));

// Zod Schemas
export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email(),
  username: z.string().min(3).max(255),
  passwordHash: z.string().min(8),
});

export const insertPostSchema = createInsertSchema(posts, {
  title: z.string().min(1).max(500),
  slug: z.string().min(1).max(500),
  content: z.string().min(1),
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
});

export const insertTagSchema = createInsertSchema(tags, {
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
});

export const insertCommentSchema = createInsertSchema(comments, {
  content: z.string().min(1),
});

export const selectUserSchema = createSelectSchema(users);
export const selectPostSchema = createSelectSchema(posts);
export const selectTagSchema = createSelectSchema(tags);
export const selectCommentSchema = createSelectSchema(comments);

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type UserRole = typeof users.$inferSelect.role;

export type InsertPost = z.infer<typeof insertPostSchema>;
export type Post = typeof posts.$inferSelect;
export type PostStatus = typeof posts.$inferSelect.status;

export type InsertTag = z.infer<typeof insertTagSchema>;
export type Tag = typeof tags.$inferSelect;

export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;
