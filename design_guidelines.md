# Design Guidelines for MILLERGROUP Intelligence, Inc.

## Design Approach

**Selected Approach:** Design System - Apple Human Interface Guidelines adapted for web
**Justification:** As a professional services firm in private investigation and security consulting, MILLERGROUP requires a design that conveys trust, authority, and professionalism. The utility-focused nature (clients need clear service information, team credentials, and contact details) combined with the need for long-term stability makes a clean, systematic approach ideal.

**Key Design Principles:**
- Professional Authority: Design should inspire confidence and trust
- Clarity Over Flash: Information accessibility takes precedence over decoration
- Understated Sophistication: Refined without being showy
- Credibility First: Every element reinforces expertise and legitimacy

---

## Core Design Elements

### A. Color Palette

**Light Mode (Primary):**
- Primary: 215 25% 27% (Deep navy blue - professional, trustworthy)
- Background: 0 0% 100% (Pure white - clean, professional)
- Surface: 215 20% 96% (Very light blue-gray - subtle depth)
- Text Primary: 215 20% 20% (Near-black with blue undertone)
- Text Secondary: 215 15% 45% (Medium gray-blue)
- Accent: 215 80% 45% (Clear blue - for CTAs and links only)
- Border: 215 15% 85% (Light gray-blue - subtle separation)

**Dark Mode:**
- Primary: 215 60% 55% (Lighter blue - accessibility)
- Background: 215 25% 12% (Very dark blue-black)
- Surface: 215 20% 16% (Slightly lighter for cards/sections)
- Text Primary: 215 15% 95% (Off-white)
- Text Secondary: 215 12% 70% (Light gray)
- Border: 215 15% 25% (Dark border)

### B. Typography

**Font System:**
- Primary: System font stack (-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)
- Monospace: For license numbers, technical details (ui-monospace, monospace)

**Type Scale:**
- H1: 2.5rem (40px) / font-weight: 700 / line-height: 1.1 / letter-spacing: -0.02em
- H2: 2rem (32px) / font-weight: 600 / line-height: 1.2
- H3: 1.5rem (24px) / font-weight: 600 / line-height: 1.3
- H4: 1.25rem (20px) / font-weight: 600 / line-height: 1.4
- Body Large: 1.125rem (18px) / font-weight: 400 / line-height: 1.6
- Body: 1rem (16px) / font-weight: 400 / line-height: 1.6
- Small: 0.875rem (14px) / font-weight: 400 / line-height: 1.5

### C. Layout System

**Spacing Primitives:** Use Tailwind units: 2, 4, 6, 8, 12, 16, 20
- Micro spacing: p-2, gap-2 (8px) - between related small elements
- Standard spacing: p-4, gap-4 (16px) - default component padding
- Section spacing: py-12 to py-16 (48-64px) - between page sections
- Large spacing: py-20 (80px) - major section breaks

**Grid System:**
- Max container width: max-w-6xl (1152px)
- Content width: max-w-4xl (896px) for text-heavy pages
- Gutter: px-4 (mobile), px-6 (tablet), px-8 (desktop)

### D. Component Library

**Navigation:**
- Clean horizontal nav with subtle dividers
- Active state: Primary color text + 2px bottom border
- Mobile: Slide-in drawer from right with backdrop blur
- Logo: Text-based, bold weight, primary color

**Cards (Team Profiles, Services):**
- White/surface background with subtle border
- 16px padding, 8px border-radius
- Minimal shadow: 0 1px 3px rgba(0,0,0,0.1)
- Hover: Lift slightly with shadow increase

**Buttons:**
- Primary CTA: Filled with primary color, white text, 12px padding, 6px radius
- Secondary: Outlined with primary color border, primary text
- Focus state: 2px offset ring in primary color

**Forms (Contact Page):**
- Clean input fields with 1px border
- 12px padding, 6px border-radius
- Focus: Primary color border, no shadow
- Labels above inputs, secondary text color

**Footer:**
- Three-column layout (desktop): Company info | Quick links | Licenses/Contact
- Dark background (surface color in dark mode, inverted in light)
- Subtle divider above footer
- Compact, 40px vertical padding

### E. Page-Specific Guidelines

**Home/Index Page:**
- Hero: Clean text-focused hero (no large image) - 60vh height
  - H1 with company name, large and bold
  - Tagline below in secondary color
  - Two-button CTA group (Services, Contact)
- Services Grid: 3-column (desktop), 2-column (tablet), 1-column (mobile)
- Trust Indicators: License numbers displayed subtly, location badges
- Call-to-Action section before footer

**Services Page:**
- Services listed in clean cards with icon placeholders
- Link to Security Consulting page clearly visible
- Brief description under each service (2-3 lines max)

**Profiles Landing:**
- Three-column grid of team member cards
- Each card: Photo placeholder (circular, 120px) + Name (H3) + Title + "View Profile" link

**Individual Profile Pages:**
- Split layout: Photo placeholder (left, 300px square) + Bio content (right)
- Credentials section with list styling
- Back to Profiles link at top

**Resources Page:**
- Simple list of external links
- External link indicator icon (↗) after each link
- Clear visual separation from internal links

**Contact Page:**
- Two-column: Contact form (left) | Office info + Map placeholder (right)
- Form fields: Name, Email, Phone, Message
- Office addresses with license numbers below

---

## Images

**Hero Section (Home Page):**
No large hero image - text-focused hero with solid background color. Professional and direct.

**Team Profile Photos:**
- Circular headshots (profiles landing): 120px diameter
- Square professional photos (individual bio pages): 300x300px
- Style: Professional business headshots, neutral backgrounds
- Placement: Profile landing cards and individual bio page left column

**Service Icons/Illustrations:**
Use simple, professional icons (not photos) for service cards. Minimal, line-style icons in primary color.

---

## Accessibility & Polish

- All interactive elements have visible focus rings (2px offset, primary color)
- Minimum touch target: 44px height for all buttons/links
- Color contrast meets WCAG AA (4.5:1 for normal text, 3:1 for large text)
- Skip-to-content link: Visually hidden until focused
- Reduced motion respected: No animations when prefers-reduced-motion is set
- Form validation: Clear error states with descriptive messages in red (0 65% 50%)