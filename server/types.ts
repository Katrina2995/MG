import { type User } from "@shared/schema";

declare module "express-session" {
  interface SessionData {
    userId?: number;
    user?: User;
  }
}

export interface AuthenticatedRequest extends Express.Request {
  session: Express.Session & {
    userId?: number;
    user?: User;
  };
}
