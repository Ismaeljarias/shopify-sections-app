# sections-app

A free Shopify app providing a reusable library of theme sections built entirely with Theme App Extensions.

## Overview

This app is a production-ready, frontend-only Shopify app that delivers high-quality, accessible theme sections to merchants. All functionality is implemented using Shopify 2.0 Theme App Extensions with zero backend infrastructure.

## Features

### Fully Implemented Blocks

1. **Hero Banner** - Image or video background with heading, subheading, and CTA button
2. **Testimonials Slider** - Horizontal scroll-snap slider with avatars, ratings, and navigation
3. **FAQ Accordion** - Keyboard-accessible accordion with smooth transitions

### Template Blocks (Stubs)

- Product showcase grid
- Newsletter signup
- Trust badges
- Countdown timer
- Before/after slider
- Video section
- Logo cloud
- Feature comparison table
- Timeline
- Image gallery

## Technical Details

- **Framework**: Shopify Theme App Extensions only
- **Target**: `section` blocks
- **JavaScript**: Vanilla JS (where required)
- **CSS**: Mobile-first, scoped, BEM methodology
- **Accessibility**: WCAG 2.1 AA compliant
- **Performance**: Lighthouse 90+ target

## Architecture

All blocks are implemented as Theme App Extension App Blocks using `"target": "section"` and are compatible with all theme templates (`"templates": ["*"]`).

### Project Structure

```
sections-app/
├── shopify.app.toml
├── extensions/
│   └── theme-extension/
│       ├── blocks/              # App blocks
│       ├── snippets/            # Reusable components
│       ├── assets/              # CSS and JS files
│       └── locales/             # Translation files
└── README.md
```

## Development

### Prerequisites

- Node.js (latest LTS)
- Shopify CLI
- Shopify Partner account
- Development store

### Local Development

```bash
npm run dev
```

### Deployment

```bash
shopify app deploy
```

## Design System

### Typography

- h1: `clamp(1.5rem, 4vw, 3rem)`
- Body: 16px, line-height 1.6
- Font: system-ui, -apple-system, sans-serif

### Spacing

- Section padding: `clamp(2rem, 5vw, 4rem)`
- Container max-width: 1200px
- Base unit: 1rem

### Responsive Breakpoints

- Mobile: <768px
- Tablet: ≥768px
- Desktop: ≥1024px

## License

Proprietary - Free to use via Shopify App Store

## Support

For issues and feature requests, contact support through the Shopify App Store listing.
