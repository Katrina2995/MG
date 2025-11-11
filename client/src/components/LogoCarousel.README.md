# LogoCarousel Component

A reusable, infinite logo carousel component with full accessibility support, reduced motion handling, and host page theme adaptation.

## Features

✅ **Infinite Seamless Scroll** - Smooth right-to-left animation with no jitter at loop points  
✅ **Smart Pause Behavior** - Automatically pauses on hover and when offscreen (Intersection Observer)  
✅ **Reduced Motion Support** - Respects `prefers-reduced-motion` with static or keyboard-scrollable fallback  
✅ **Full Accessibility** - ARIA roles, keyboard navigation, screen reader support  
✅ **Performance Optimized** - Lazy loading, GPU transforms, minimal layout shifts  
✅ **Theme Adaptive** - Inherits colors from host page, no hardcoded palette  
✅ **Optional Links** - Supports clickable logos with external links  

## Installation

The component is located at `client/src/components/LogoCarousel.tsx`.

### Dependencies
- React 18+
- TypeScript
- CSS Modules or scoped CSS support

## Basic Usage

```tsx
import LogoCarousel from '@/components/LogoCarousel';

function MyPage() {
  return (
    <div>
      <h1>Our Clients</h1>
      <LogoCarousel />
    </div>
  );
}
```

## Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `speed` | `number` | `60` | Animation speed in pixels per second |
| `gap` | `number` | `2` | Gap between logos in rem units |
| `duplicateTrack` | `boolean` | `true` | Enable seamless loop by duplicating the track |
| `pauseOnHover` | `boolean` | `true` | Pause animation when hovering over the carousel |
| `reduceMotionFallback` | `'static' \| 'paged'` | `'static'` | Behavior when `prefers-reduced-motion` is enabled. 'static' disables animation and shows all logos. 'paged' allows horizontal keyboard scrolling with snap points. |

## Advanced Usage

### Custom Speed and Spacing

```tsx
<LogoCarousel 
  speed={100}
  gap={3}
/>
```

### Disable Hover Pause

```tsx
<LogoCarousel 
  pauseOnHover={false}
/>
```

### Paged Fallback for Reduced Motion

```tsx
<LogoCarousel 
  reduceMotionFallback="paged"
/>
```

## Adding Logos

### 1. Add Logo Files

Place your logo images in the `/public/client_logos` directory. Supported formats:
- PNG
- JPG/JPEG
- SVG (recommended)
- WebP

**Example:**
```
/public/client_logos
  ├── acme_corp.svg
  ├── tech_solutions.png
  ├── innovation_labs.svg
  └── global_industries.jpg
```

**Note:** After adding new logo files, you need to update the filename list in `client/src/utils/getClientLogos.ts` to include them. Add the filename to the `logoFilenames` array:

```typescript
const logoFilenames = [
  'acme_corp.svg',
  'tech_solutions.svg',
  'your_new_logo.svg',  // Add your new logo here
  // ...
];
```

### 2. Alt Text Generation

Alt text is automatically generated from filenames:
- `acme_corp.svg` → "Acme Corp"
- `tech_solutions.png` → "Tech Solutions"
- `innovation-labs.svg` → "Innovation Labs"

### 3. Add Links (Optional)

Create or edit `/client/src/data/client_logo_links.json`:

```json
{
  "acme_corp.svg": "https://acme.com",
  "tech_solutions.png": "https://techsolutions.com"
}
```

Logos with links will be clickable and open in a new tab.

## Theming & Styling

The carousel adapts to your page's styling using CSS custom properties. You can customize it by setting these variables:

```css
:root {
  /* Control button styling */
  --carousel-control-bg: rgba(0, 0, 0, 0.05);
  --carousel-control-color: currentColor;
  --carousel-control-border: rgba(0, 0, 0, 0.1);
  --carousel-control-bg-hover: rgba(0, 0, 0, 0.1);
  --carousel-control-bg-active: rgba(0, 0, 0, 0.15);
  
  /* Focus indicator color */
  --carousel-focus-color: #3b82f6;
  
  /* Logo background */
  --carousel-logo-bg: transparent;
  --carousel-logo-shadow: rgba(0, 0, 0, 0.1);
  
  /* Text color for empty/loading states */
  --carousel-text-muted: rgba(0, 0, 0, 0.6);
}
```

### Default Behavior
If no CSS variables are set, the component uses:
- `currentColor` for text and borders
- `transparent` backgrounds
- Neutral, accessible fallbacks

### Dark Mode
The component includes dark mode support that activates automatically when the host page uses `prefers-color-scheme: dark`.

## Accessibility Features

### ARIA Support
- `role="region"` with `aria-label` for the carousel region
- `role="list"` and `role="listitem"` for semantic structure
- `aria-controls` and `aria-pressed` for play/pause control
- Live region announcements for state changes

### Keyboard Navigation
- **Tab** - Navigate between logo items
- **Space/Enter** - Toggle pause/resume (when focused on control or logos)

### Screen Reader Support
- Auto-generated alt text for all logos
- Status announcements when paused/playing
- Skip link support for carousel region

### Reduced Motion
When `prefers-reduced-motion: reduce` is detected, behavior depends on the `reduceMotionFallback` prop:

**Static mode (default):**
- Animation automatically disabled
- All logos displayed without scrolling
- No movement or animation

**Paged mode:**
- Animation automatically disabled
- Carousel becomes a keyboard-scrollable horizontal strip
- Scroll snap points for smooth navigation
- Users can scroll left/right to view logos

## Performance Optimizations

### Lazy Loading
All logo images use `loading="lazy"` to defer offscreen image loading.

### GPU Acceleration
Animations use `transform: translateX()` for GPU-accelerated rendering.

### Intersection Observer
The carousel pauses automatically when not visible in the viewport to save CPU/battery.

### SSR Compatibility
- No layout shift on initial load
- Graceful fallback for environments without JavaScript

## Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **CSS Features**: CSS Grid, Custom Properties, Intersection Observer
- **Fallbacks**: Static display for older browsers, accessible in all environments

## Testing

### Manual Testing Checklist
- [ ] Logos load and display correctly
- [ ] Infinite scroll animates smoothly with no visible gaps
- [ ] Hover pauses the animation
- [ ] Play/pause button works
- [ ] Carousel pauses when scrolled offscreen
- [ ] Reduced motion setting disables animation
- [ ] Keyboard navigation works (Tab, Space, Enter)
- [ ] Screen reader announces carousel state
- [ ] Links (if configured) open in new tabs

### E2E Testing
See `/demo/logos` page for interactive testing and configuration.

## Troubleshooting

### Logos Not Appearing
1. Check that logo files are in `/public/client_logos` directory
2. Verify file extensions are supported (png, jpg, jpeg, svg, webp)
3. Ensure filenames are added to the `logoFilenames` array in `client/src/utils/getClientLogos.ts`
4. Check browser console for 404 errors on logo files

### Animation Stuttering
1. Reduce the `speed` prop value
2. Ensure logos are optimized (especially SVGs)
3. Check if hardware acceleration is enabled in browser

### Gap at Loop Point
- Enable `duplicateTrack={true}` (default)
- Ensure sufficient logos for smooth scrolling

### Links Not Working
1. Verify `/client/src/data/client_logo_links.json` exists
2. Check filename matches exactly (case-sensitive)
3. Ensure URLs are valid and start with `http://` or `https://`

## Demo

Visit `/demo/logos` to see the carousel in action with:
- Live configuration controls
- Multiple theming examples
- Responsive preview
- Accessibility testing tools

## License

Part of the MILLERGROUP Intelligence project.

## Support

For issues or questions, please refer to the main project documentation.
