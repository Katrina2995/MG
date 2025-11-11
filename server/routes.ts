import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { registerAuthRoutes } from "./routes/auth";
import { registerBlogRoutes } from "./routes/blog";
import { registerSEORoutes } from "./routes/seo";

export async function registerRoutes(app: Express): Promise<Server> {
  // Register auth routes
  registerAuthRoutes(app);
  
  // Register blog routes
  registerBlogRoutes(app);

  // Register SEO routes (sitemap, RSS, robots.txt)
  registerSEORoutes(app, storage);

  const httpServer = createServer(app);

  return httpServer;
}
