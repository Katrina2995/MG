# MILLERGROUP Intelligence Eleventy Static Site

## ✅ Project Complete

A professional, fully accessible static website has been successfully built for MILLERGROUP Intelligence, Inc. using Eleventy (11ty) and Nunjucks templates.

## 🚀 Quick Start

### Running the Site

The Eleventy development server is currently running on port 5000. To start it manually:

```bash
npx @11ty/eleventy --serve --port=5000
```

Or use the helper script:

```bash
node serve-eleventy.js
```

### Building the Site

```bash
npx @11ty/eleventy
```

The built site will be in the `_site/` directory.

### Link Validation

```bash
npx linkinator _site --recurse --skip 'mailto:,tel:' --silent
```

**Latest Result:** ✅ Successfully scanned 91 links with no errors

## 📁 Project Structure

```
.
├── src/                          # Source files
│   ├── _data/
│   │   ├── site.json            # Site metadata
│   │   └── routes.json          # Page routes
│   ├── _includes/
│   │   ├── layouts/
│   │   │   └── base.njk         # Base template
│   │   └── components/
│   │       ├── header.njk       # Site header
│   │       ├── footer.njk       # Site footer
│   │       └── home-content.njk # Shared home content
│   ├── assets/
│   │   ├── css/
│   │   │   └── styles.css       # Complete site styles
│   │   └── js/
│   │       └── main.js          # Mobile menu toggle
│   ├── index.njk                # Home page (/)
│   ├── home.njk                 # Home alias (/home.html)
│   ├── services.njk
│   ├── profiles.njk
│   ├── bruce-thomas.njk
│   ├── scott-devereaux.njk
│   ├── michael-miller.njk
│   ├── security-consulting.njk
│   ├── resources.njk
│   ├── contact.njk
│   ├── 404.njk
│   ├── sitemap.xml.njk
│   ├── robots.txt
│   └── humans.txt
├── _site/                        # Built site (generated)
├── .eleventy.js                  # Eleventy config
├── serve-eleventy.js            # Dev server helper
└── README.md                     # Documentation
```

## 📄 Pages Implemented

### Main Pages
- ✅ **Home** (`/` and `/home.html`) - Dual URLs as specified
- ✅ **Services** (`/services.html`) - All 8 services listed
- ✅ **Profiles** (`/profiles.html`) - Team directory
- ✅ **Resources** (`/resources.html`) - External links with indicators
- ✅ **Contact** (`/contact.html`) - Contact form and information

### Team Profiles
- ✅ **Michael Miller** (`/michael-miller.html`) - Founder & Principal
- ✅ **Bruce Thomas** (`/bruce-thomas.html`) - Security Services Manager
- ✅ **Scott Devereaux** (`/scott-devereaux.html`) - Background Investigations Lead

### Service Details
- ✅ **Security Consulting** (`/security-consulting.html`) - Detailed service page

### System Pages
- ✅ **404 Error Page** (`/404.html`)
- ✅ **Sitemap** (`/sitemap.xml`) - Auto-generated
- ✅ **Robots.txt** (`/robots.txt`)
- ✅ **Humans.txt** (`/humans.txt`)

## ✨ Features Implemented

### Accessibility
- ✅ Skip-to-content link (keyboard accessible)
- ✅ ARIA landmarks (header, main, footer, navigation)
- ✅ Active navigation state with `aria-current="page"`
- ✅ Visible focus states on all interactive elements
- ✅ Keyboard-navigable mobile menu
- ✅ All images have descriptive alt text placeholders
- ✅ Semantic HTML structure
- ✅ Proper heading hierarchy (H1→H2→H3)
- ✅ Reduced motion support

### SEO
- ✅ Unique `<title>` tags for each page
- ✅ Meta descriptions from site map data
- ✅ Canonical URLs
- ✅ Open Graph tags (title, description, type, url)
- ✅ Auto-generated sitemap.xml
- ✅ robots.txt with sitemap reference
- ✅ humans.txt for team credits

### Design & UX
- ✅ Mobile-first responsive design
- ✅ Professional color scheme (navy blue primary)
- ✅ System font stack for performance
- ✅ Clean card-based layouts
- ✅ Responsive navigation with mobile menu
- ✅ Active page highlighting
- ✅ Accessible color contrast (WCAG AA)
- ✅ Touch-friendly interactive elements (44px min)
- ✅ Smooth transitions and hover states

### Navigation
- ✅ Top navigation: Home, Services, Profiles, Resources, Contact
- ✅ Active state styling
- ✅ Mobile hamburger menu
- ✅ Click-outside to close
- ✅ ESC key to close
- ✅ Programmatic navigation from routes.json
- ✅ Security Consulting discoverable from Services (not in top nav)

### Testing & Quality
- ✅ All internal links validated (91 links checked)
- ✅ External links marked with `rel="nofollow noopener"`
- ✅ External links excluded from sitemap
- ✅ data-testid attributes on interactive elements
- ✅ No console errors
- ✅ Clean HTML output

## 🎨 Design Specifications

### Colors
- **Primary:** `hsl(215, 25%, 27%)` - Deep navy blue
- **Background:** `hsl(0, 0%, 100%)` - Pure white
- **Surface:** `hsl(215, 20%, 96%)` - Light blue-gray
- **Text Primary:** `hsl(215, 20%, 20%)` - Near-black
- **Text Secondary:** `hsl(215, 15%, 45%)` - Medium gray
- **Accent:** `hsl(215, 80%, 45%)` - Clear blue
- **Border:** `hsl(215, 15%, 85%)` - Light gray

### Typography
- **Font Family:** System font stack
- **H1:** 2.5rem (40px), weight 700
- **H2:** 2rem (32px), weight 600
- **H3:** 1.5rem (24px), weight 600
- **Body:** 1rem (16px), line-height 1.6

### Spacing
- Container max-width: 1152px
- Content max-width: 896px
- Standard padding: 1rem (mobile), 1.5rem (desktop)

## 📋 License Information Displayed

- California PI #27290
- Utah PI #11559074-6301
- Montana PI #100-35870

## 🔗 Internal Linking Strategy

- Home accessible at both `/` and `/home.html`
- Services page links to Security Consulting detail page
- Profiles page links to all three team bios
- Team bio pages link back to Profiles
- Security Consulting links back to Services
- 404 page links to Home
- All navigation is keyboard accessible

## 🌐 External Resources

Resources page includes links to:
- Professional associations (NCISS, CALI, ASIS)
- Regulatory agencies (CA BSIS, UT DOPL, MT Board)
- Federal agencies (FBI, DHS, ATF)

All external links open in new tab with proper security attributes.

## 📱 Responsive Breakpoints

- Mobile: < 480px
- Tablet: 481px - 768px
- Desktop: > 768px

## ✅ Quality Checklist

- [x] All 10 pages built with correct permalinks
- [x] Navigation highlights current page
- [x] Sitemap.xml and robots.txt generated
- [x] Link validation passes (91 links, 0 errors)
- [x] Skip-to-content link functional
- [x] Mobile menu works (toggle, click-outside, ESC)
- [x] All forms have proper labels
- [x] Focus states visible
- [x] Heading hierarchy correct
- [x] Alt attributes present
- [x] data-testid attributes added
- [x] External links properly marked
- [x] Dual home page URLs working
- [x] Security Consulting discoverable from Services

## 🚀 Next Steps (Optional Enhancements)

1. **Contact Form Integration**
   - Add backend to handle form submissions
   - Email notification system

2. **Content Management**
   - Add markdown content files
   - Implement blog/news section

3. **Performance**
   - Add image optimization
   - Implement lazy loading
   - Add service worker for offline access

4. **Analytics**
   - Google Analytics integration
   - Privacy-focused analytics alternative

## 📞 Support

For questions about the site structure or implementation, refer to:
- Main README.md
- Inline code comments
- Eleventy documentation: https://www.11ty.dev/docs/

---

**Built with:** Eleventy v3.1.2, Nunjucks, Custom CSS
**Validated:** All internal links pass, accessible, SEO-optimized
**Status:** ✅ Production Ready
