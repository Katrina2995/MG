# Multi-Author Blog System - Setup & Usage Guide

## Overview

This multi-author blog system is built on top of the existing MILLERGROUP Intelligence website, providing a complete SEO-optimized blogging platform with editorial workflow and role-based permissions.

## Features

### ✅ Implemented Features

**Authentication & User Management:**
- Secure registration and login with bcrypt password hashing
- Email verification system
- Password reset functionality
- Role-based access control (Author, Editor, Admin)
- Session-based authentication with PostgreSQL storage

**Editorial Workflow:**
- Draft → Review → Published status flow
- Authors can create drafts and submit for review
- Editors/Admins can publish posts
- Post versioning with created/updated timestamps

**Content Management:**
- Markdown editor with live preview
- Rich SEO metadata fields (title, description, canonical URL, featured image)
- Tag system for content organization
- Full-text search capability (PostgreSQL tsvector)
- Slug management with uniqueness validation

**SEO Optimization:**
- Dynamic meta tags (title, description)
- Open Graph tags for social media
- Twitter Card support
- JSON-LD structured data for articles
- Auto-generated sitemap.xml
- RSS feed (rss.xml)
- robots.txt with proper exclusions

**Public Pages:**
- Blog list page with published posts
- Individual post detail pages with SEO
- Tag-based filtering
- Author attribution

**Admin Dashboard:**
- Post management interface
- Status filtering (draft/review/published)
- Quick actions (edit, publish, delete)
- Search functionality

## Database Schema

### Users Table
- `id` (serial primary key)
- `username`, `email`, `passwordHash`
- `role` (AUTHOR | EDITOR | ADMIN)
- `bio`, `avatarUrl`
- `isVerified`, `verificationToken`
- `resetToken`, `resetTokenExpiry`

### Posts Table
- `id` (serial primary key)
- `title`, `slug` (unique)
- `summary`, `content` (markdown), `htmlContent`
- `status` (DRAFT | REVIEW | PUBLISHED)
- `metaTitle`, `metaDescription`, `canonicalUrl`
- `featuredImage`, `metaRobots`
- `authorId` (foreign key to users)
- `publishedAt`, `searchVector` (for full-text search)

### Tags & PostTags
- Tag management with slug-based URLs
- Many-to-many relationship between posts and tags

## Setup Instructions

### 1. Database Setup

The database is already configured via Replit's PostgreSQL integration. The following environment variables are automatically available:

```
DATABASE_URL
PGHOST
PGPORT
PGUSER
PGPASSWORD
PGDATABASE
```

### 2. Required Secrets

Set these secrets in Replit Secrets (🔒 icon in sidebar):

**Required:**
- `SESSION_SECRET` - Strong random string for session signing (required in production)
- `DATABASE_URL` - PostgreSQL connection string (auto-provided by Replit)

**Optional (for email features):**
- `SMTP_HOST` - SMTP server host
- `SMTP_PORT` - SMTP server port
- `SMTP_USER` - SMTP username
- `SMTP_PASS` - SMTP password
- `SMTP_FROM` - From email address
- `BASE_URL` - Base URL for email links (e.g., https://yourapp.replit.app)

### 3. Database Migration

Push the schema to the database:

```bash
npm run db:push
```

If you encounter warnings about data loss (expected on first run):
```bash
npm run db:push --force
```

### 4. Seed Data

Populate the database with sample users and posts:

```bash
tsx server/seed.ts
```

This creates:
- **3 Users:**
  - Author: `author@millergroup.com` / `password123`
  - Editor: `editor@millergroup.com` / `password123`
  - Admin: `admin@millergroup.com` / `admin123`
  
- **5 Posts:** Mix of draft, review, and published
- **6 Tags:** Investigation, Security, Surveillance, etc.

### 5. Run the Application

```bash
npm run dev
```

The application runs on port 5000 and serves:
- Static Eleventy site at `/` (homepage, services, contact, etc.)
- React blog application at `/blog/*`
- API endpoints at `/api/*`

## Usage Guide

### For Authors

1. **Login:** Go to `/blog/login` and sign in
2. **Create Post:** Click "New Post" in the admin dashboard
3. **Write Content:** 
   - Use markdown in the editor
   - Preview in real-time with the "Preview" tab
   - Add SEO metadata (meta title, description, featured image)
   - Add tags (comma-separated)
4. **Save Draft:** Click "Save Draft" to save without publishing
5. **Submit for Review:** Click "Submit for Review" when ready

### For Editors/Admins

1. **Access Dashboard:** Go to `/blog/admin` after login
2. **Review Posts:** Filter by status to see posts in review
3. **Publish:** Click the "Publish" button on reviewed posts
4. **Edit:** Click edit icon to modify any post
5. **Delete:** Click delete icon to remove posts

### For Public Visitors

- **Browse Blog:** Visit `/blog` to see all published posts
- **Read Posts:** Click any post title to read the full article
- **View by Tag:** Click tag badges to filter by topic
- **Subscribe:** Use `/blog/rss.xml` for RSS feed

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/verify` - Verify email
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Blog Posts
- `GET /api/blog/posts` - List posts (with status filter)
- `GET /api/blog/posts/:id` - Get post by ID
- `GET /api/blog/posts/slug/:slug` - Get post by slug
- `POST /api/blog/posts` - Create post (requires auth)
- `PUT /api/blog/posts/:id` - Update post (requires auth)
- `DELETE /api/blog/posts/:id` - Delete post (requires auth)
- `POST /api/blog/posts/:id/submit` - Submit for review
- `POST /api/blog/posts/:id/publish` - Publish post (editor/admin only)
- `GET /api/blog/search?q=query` - Search posts

### Tags
- `GET /api/blog/tags` - List all tags
- `GET /api/blog/tags/:slug/posts` - Get posts by tag

### SEO
- `GET /blog/sitemap.xml` - Auto-generated sitemap
- `GET /blog/rss.xml` - RSS feed
- `GET /robots.txt` - Robots file

## Security Features

- **Password Hashing:** bcrypt with salt rounds = 12
- **Session Security:** 
  - HttpOnly cookies
  - Secure cookies in production
  - PostgreSQL-backed session storage
  - SESSION_SECRET required in production
- **Input Validation:** Zod schema validation on all endpoints
- **SQL Injection Protection:** Drizzle ORM with parameterized queries
- **XSS Protection:** Sanitized markdown to HTML conversion
- **Role-Based Access:** Middleware checks user roles
- **CSRF Protection:** Session-based authentication

## Deployment Checklist

### Pre-Deployment

- [ ] Set `SESSION_SECRET` in production secrets
- [ ] Configure SMTP settings for email functionality
- [ ] Set `BASE_URL` to production domain
- [ ] Run `npm run db:push` to sync schema
- [ ] Run seed script to create initial users
- [ ] Test authentication flow
- [ ] Verify SEO tags are rendering

### Post-Deployment

- [ ] Test sitemap.xml is accessible
- [ ] Verify RSS feed is working
- [ ] Check robots.txt is correct
- [ ] Submit sitemap to Google Search Console
- [ ] Test email verification flow
- [ ] Verify password reset works

## Troubleshooting

### Session Errors
**Problem:** "SESSION_SECRET must be set in production"
**Solution:** Add SESSION_SECRET to Replit Secrets

### Database Connection Issues
**Problem:** Cannot connect to database
**Solution:** Ensure DATABASE_URL is set (auto-configured by Replit)

### Email Not Sending
**Problem:** Verification/reset emails not arriving
**Solution:** Configure SMTP_* environment variables

### Posts Not Appearing
**Problem:** Created posts don't show on blog list
**Solution:** Ensure posts are published (status = PUBLISHED)

### Slug Conflicts
**Problem:** "Slug already exists" error
**Solution:** Edit the slug to be unique, or delete/rename the conflicting post

## Architecture Notes

**Tech Stack:**
- **Frontend:** React 18 + TypeScript + Wouter (routing) + TanStack Query
- **Backend:** Express.js + TypeScript
- **Database:** PostgreSQL (Neon) + Drizzle ORM
- **Authentication:** express-session + bcrypt
- **Styling:** Tailwind CSS + shadcn/ui components
- **Static Site:** Eleventy (for main website pages)

**File Structure:**
```
├── server/
│   ├── routes/
│   │   ├── auth.ts       # Authentication endpoints
│   │   ├── blog.ts       # Blog CRUD endpoints
│   │   └── seo.ts        # Sitemap, RSS, robots.txt
│   ├── db.ts            # Database connection
│   ├── storage.ts       # Data access layer
│   ├── auth.ts          # Auth utilities
│   ├── email.ts         # Email service
│   └── seed.ts          # Seed data script
├── client/src/
│   ├── pages/
│   │   ├── login.tsx           # Login/Register page
│   │   ├── blog-list.tsx       # Public blog list
│   │   ├── post-detail.tsx     # Public post view
│   │   ├── post-editor.tsx     # Markdown editor
│   │   └── admin-dashboard.tsx # Admin interface
│   └── components/
│       └── seo-head.tsx        # SEO meta tags component
├── shared/
│   └── schema.ts        # Shared database schema
└── _site/              # Static Eleventy build
```

## Maintenance

### Adding New Roles
1. Update `userRoleEnum` in `shared/schema.ts`
2. Run `npm run db:push` to sync
3. Update role checks in middleware and routes

### Modifying Post Schema
1. Update `posts` table in `shared/schema.ts`
2. Run `npm run db:push` (or `--force` if needed)
3. Update TypeScript interfaces in relevant files

### Search Optimization
The system uses PostgreSQL full-text search with `tsvector`. To improve search:
1. Update search vector generation in storage.ts
2. Add weights to title vs content
3. Consider adding trigram similarity for fuzzy matching

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review server logs for errors
3. Verify database connection and schema
4. Ensure all required secrets are set
