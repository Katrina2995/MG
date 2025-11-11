import type { Express, Request, Response } from "express";
import type { IStorage } from "../storage";
import type { Post, User } from "@shared/schema";

export function registerSEORoutes(app: Express, storage: IStorage) {
  // Sitemap.xml
  app.get("/blog/sitemap.xml", async (req: Request, res: Response) => {
    try {
      const posts = await storage.getPublishedPosts(1000);
      const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;

      const urls = [
        {
          loc: `${baseUrl}/blog`,
          changefreq: "daily",
          priority: "1.0",
          lastmod: new Date().toISOString(),
        },
        ...posts.map((post: Post & { author: User }) => ({
          loc: `${baseUrl}/blog/post/${post.slug}`,
          changefreq: "weekly",
          priority: "0.8",
          lastmod: post.updatedAt?.toISOString() || post.publishedAt?.toISOString() || new Date().toISOString(),
        })),
      ];

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

      res.header("Content-Type", "application/xml");
      res.send(sitemap);
    } catch (error: any) {
      console.error("Sitemap generation error:", error);
      res.status(500).send("Error generating sitemap");
    }
  });

  // RSS Feed
  app.get("/blog/rss.xml", async (req: Request, res: Response) => {
    try {
      const posts = await storage.getPublishedPosts(50);
      const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;

      const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>MILLERGROUP Intelligence Blog</title>
    <link>${baseUrl}/blog</link>
    <description>Expert insights on private investigations, security consulting, and professional surveillance techniques</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/blog/rss.xml" rel="self" type="application/rss+xml" />
${posts
  .map(
    (post: Post & { author: User }) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${baseUrl}/blog/post/${post.slug}</link>
      <description>${escapeXml(post.summary || "")}</description>
      <author>${escapeXml(post.author?.username || "MILLERGROUP Intelligence")}</author>
      <pubDate>${post.publishedAt ? new Date(post.publishedAt).toUTCString() : new Date().toUTCString()}</pubDate>
      <guid>${baseUrl}/blog/post/${post.slug}</guid>
    </item>`
  )
  .join("\n")}
  </channel>
</rss>`;

      res.header("Content-Type", "application/xml");
      res.send(rss);
    } catch (error: any) {
      console.error("RSS feed generation error:", error);
      res.status(500).send("Error generating RSS feed");
    }
  });

  // robots.txt
  app.get("/robots.txt", (req: Request, res: Response) => {
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
    
    const robotsTxt = `User-agent: *
Allow: /
Disallow: /blog/admin
Disallow: /blog/new
Disallow: /blog/edit
Disallow: /api/

Sitemap: ${baseUrl}/blog/sitemap.xml
`;

    res.header("Content-Type", "text/plain");
    res.send(robotsTxt);
  });
}

// Helper function to escape XML special characters
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
