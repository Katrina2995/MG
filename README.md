# MILLERGROUP Intelligence, Inc. - Static Website

A professional static website built with Eleventy (11ty) and Nunjucks templates for MILLERGROUP Intelligence, Inc., a private investigation and security consulting firm.

## Quick Start

### Installation

```bash
npm install
```

### Development

Start the development server (serves on port 5000):

```bash
npm run dev
```

The site will be available at `http://localhost:5000`

### Build

Build the static site for production:

```bash
npm run build
```

The built site will be in the `_site` directory.

### Link Validation

Check all internal links after building:

```bash
npm run check:links
```

## Project Structure

```
.
├── src/                      # Source files
│   ├── _data/               # Data files
│   │   ├── site.json        # Site metadata (name, contact, licenses)
│   │   └── routes.json      # Page routes for navigation
│   ├── _includes/           # Templates and components
│   │   ├── layouts/
│   │   │   └── base.njk     # Base layout template
│   │   └── components/
│   │       ├── header.njk   # Site header with navigation
│   │       └── footer.njk   # Site footer
│   ├── assets/
│   │   ├── css/
│   │   │   └── styles.css   # All site styles
│   │   └── js/
│   │       └── main.js      # Mobile menu toggle
│   ├── index.njk            # Home page (/)
│   ├── home.njk             # Home page alias (/home.html)
│   ├── services.njk         # Services overview
│   ├── profiles.njk         # Team profiles listing
│   ├── resources.njk        # External resources
│   ├── contact.njk          # Contact page with form
│   ├── security-consulting.njk  # Security consulting detail
│   ├── bruce-thomas.njk     # Team member bio
│   ├── scott-devereaux.njk  # Team member bio
│   ├── michael-miller.njk   # Team member bio
│   ├── 404.njk             # 404 error page
│   ├── sitemap.xml.njk     # Auto-generated sitemap
│   ├── robots.txt          # Search engine instructions
│   └── humans.txt          # Credits and info
├── _site/                   # Built site (generated)
├── .eleventy.js            # Eleventy configuration
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## Adding a New Page

1. **Create the page file** in the `src/` directory:

```njk
---
layout: layouts/base.njk
title: Your Page Title
description: Your page description for SEO
permalink: /your-page.html
---

<div class="container">
  <div class="content-container">
    <h1>{{ title }}</h1>
    <p>Your content here...</p>
  </div>
</div>
```

2. **Add the route to `src/_data/routes.json`** (if you want it in navigation):

```json
{
  "url": "/your-page.html",
  "title": "Your Page",
  "description": "Your page description",
  "inNav": true
}
```

3. **Rebuild** the site:

```bash
npm run build
```

## Features

- **Accessible**: Skip links, ARIA landmarks, keyboard navigation
- **Responsive**: Mobile-first design that works on all devices
- **SEO Optimized**: Meta descriptions, Open Graph tags, sitemap.xml
- **Professional Design**: Clean, trustworthy aesthetic for investigative services
- **Internal Link Validation**: Automated checking of all internal links

## Pages

- **Home** (`/` and `/home.html`) - Company overview and core services
- **Services** (`/services.html`) - Complete service offerings
- **Security Consulting** (`/security-consulting.html`) - Detailed security services
- **Profiles** (`/profiles.html`) - Team member directory
  - Michael Miller (`/michael-miller.html`)
  - Bruce Thomas (`/bruce-thomas.html`)
  - Scott Devereaux (`/scott-devereaux.html`)
- **Resources** (`/resources.html`) - External professional links
- **Contact** (`/contact.html`) - Contact form and information

## Technologies

- **Eleventy (11ty)** - Static site generator
- **Nunjucks** - Templating engine
- **Custom CSS** - No frameworks, mobile-first responsive design
- **Linkinator** - Link validation tool

## License Information

The site displays professional investigator licenses:
- California PI #27290
- Utah PI #11559074-6301
- Montana PI #100-35870

## Support

For questions or issues with the website, please contact the development team.
