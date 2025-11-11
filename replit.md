# MILLERGROUP Intelligence Static Site

## Overview
This project delivers a professional static website for MILLERGROUP Intelligence, Inc., a private investigation and security consulting firm. Built with Eleventy (11ty) and Nunjucks, the site prioritizes a clean, accessible, and mobile-first design. Its primary purpose is to showcase the company's services, team, and contact information, emphasizing trust and professionalism. The site targets individuals seeking personal investigation services, focusing on core offerings like infidelity investigations and process serving with a compassionate and confidential approach. It highlights local expertise, over 30 years of experience, and complete confidentiality, encapsulated by the tagline: "When You Need Answers, We Find Them."

**Current Contact Information:**
- Address: 6300 Sagewood Dr #H407, Park City, UT 84098
- Phone: (435) 631-2526
- Email: info@millergroupinc.com

**Current Licenses:**
- CA License: Private Investigator 22870
- UT License: Private Investigator P110771
- MT License: Private Investigator 40874 (Private Montana, LLC)

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Static Site Generation (Primary Application)
**Technology Stack:**
- **Eleventy (11ty)**: Static site generator.
- **Nunjucks**: Templating engine.
- **Custom CSS**: Professional design system using CSS custom properties.
- **Vanilla JavaScript**: Minimal client-side interactivity (mobile menu).

**Architecture Pattern:**
The static site uses a data-driven template approach where page metadata and routes are defined in JSON, Nunjucks templates provide reusable structures, and content uses frontmatter and template inheritance. The build output is a deployment-ready static site.

**Key Design Decisions:**
- **Accessibility-first**: Semantic HTML, ARIA landmarks, keyboard navigation, skip links.
- **Mobile-first responsive design**: Optimized breakpoints for various devices.
- **Professional aesthetic**: Navy blue primary color with teal accents, system font stack, minimal JavaScript.
- **Content Strategy**: Focus on individual clients, emphasizing core services (infidelity, process serving), trust, local expertise, and a professional yet empathetic tone.
- **Key Features**: 
  - Circular service cards (280px diameter) with selective crosshair overlays
  - Homepage cards display clean images without icons or crosshairs for a professional appearance
  - Services page contains 8 expandable service cards
  - Infinite logo carousel on the homepage with accessibility features and dynamic logo loading
  - Centralized contact and license information in `site.json` for consistency across all pages

### React Application (Scaffolded but Unused for Static Site)
**Technology Stack:**
- **React 18** with **TypeScript**.
- **Vite**: Build tool.
- **Wouter**: Lightweight routing.
- **TanStack Query**: Server state management.
- **Radix UI**: Headless component library.
- **Tailwind CSS**: Utility-first styling with shadcn/ui.

**Architecture Pattern:**
A standard single-page application scaffold with client-side routing, component-based UI, and API integration readiness. Currently serves a 404 page.

### Backend Infrastructure (Configured but Minimal)
**Technology Stack:**
- **Express.js**: HTTP server.
- **Drizzle ORM**: Database toolkit.
- **PostgreSQL**: Database (via Neon serverless driver).
- **connect-pg-simple**: PostgreSQL-backed session management.

**Architecture Pattern:**
The backend is scaffolded with basic server routes and a storage abstraction layer. It can serve Eleventy static files or the React SPA. The primary use case is serving the pre-built static HTML.

## External Dependencies

### Static Site Generation
- **@11ty/eleventy**
- **nunjucks**

### React UI Components (Unused in Static Site)
- **@radix-ui/***: Headless UI primitives.
- **@tanstack/react-query**: Server state management.
- **wouter**: Client-side routing.
- **react-hook-form** + **@hookform/resolvers**: Form handling.

### Backend & Database (Configured but Minimal)
- **express**: HTTP server.
- **drizzle-orm** + **drizzle-kit**: ORM.
- **@neondatabase/serverless**: PostgreSQL driver.
- **connect-pg-simple**: PostgreSQL session store.
- **zod**: Schema validation.

### Development Tools
- **vite**: Build tool for React app.
- **typescript**: Type checking.
- **tailwindcss**: Utility CSS framework.
- **esbuild**: Bundler for server code.
- **tsx**: TypeScript execution.
- **linkinator**: Link validation.

### Design System & UI
- **class-variance-authority**
- **tailwind-merge** + **clsx**
- **lucide-react**: Icon library.