# sections-app

A library of production-ready Shopify theme sections built entirely with Theme App Extensions. No backend required.

## Overview

This app delivers high-quality, accessible theme sections to merchants using Shopify 2.0 Theme App Extensions. It is designed to be lightweight, performant, and easy to integrate with any Shopify theme.

## Features

### Fully Implemented Sections

These sections are fully functional, styled, and ready for production use. The **Testimonials Slider** and **FAQ Accordion** use **dynamic blocks**, allowing merchants to add or remove items directly from the theme editor via "Add block".

1. **Hero Banner** (`hero-banner.liquid`)

   - **Media Support**: Background image with responsive sizing or MP4 video background.
   - **Content**: Customizable heading, subheading, and CTA button.
   - **Customization**: Adjust section height (Small, Medium, Large, Full Screen), text alignment (Left, Center, Right), and overlay opacity.
   - **Performance**: Optimized image loading with `srcset` and `lazy` loading.

2. **Testimonials Slider** (`testimonials-slider.liquid`)

   - **Dynamic Blocks**: Merchants add individual testimonials via "Add block" in the theme editor (up to 16).
   - **Rich Content**: Each block includes avatar image/initials, customer name, role/company, star rating, and review text.
   - **Interactive**: Horizontal scroll-snap slider with "Next" and "Previous" navigation buttons.
   - **Autoplay**: Optional autoplay functionality.
   - **Fallback**: Displays a placeholder testimonial if no blocks are added.

3. **FAQ Accordion** (`faq-accordion.liquid`)

   - **Dynamic Blocks**: Merchants add individual FAQ items via "Add block" in the theme editor (up to 20).
   - **Rich Text**: Answers support rich text formatting (links, bold, etc.).
   - **Usability**: Smooth expand/collapse transitions.
   - **Accessibility**: Full keyboard navigation support and ARIA attributes.
   - **Configuration**: Option to allow multiple items to be open simultaneously.

### Available Templates (Stubs)

The following blocks are available as starting points for further development:

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

- **Framework**: Shopify Theme App Extensions
- **Target**: `section` (compatible with all templates via `"templates": ["*"]`)
- **Dynamic Blocks**: Testimonials and FAQ use Shopify's blocks schema for unlimited merchant customization
- **Performance**:
  - Zero external dependencies (jQuery-free).
  - CSS variables for theming.
  - Native browser APIs (IntersectionObserver, ScrollSnap).
- **Typography**: Uses dynamic viewport units (`clamp()`) for fluid typography.
- **Accessibility**: WCAG 2.1 AA compliant contrast ratios and keyboard navigation.

## Project Structure

```
sections-app/
├── shopify.app.toml            # App configuration
├── package.json                # Scripts and dependencies
├── extensions/
│   └── theme-extension/
│       ├── sections/           # Theme sections (appear in "Add section")
│       │   ├── hero-banner.liquid
│       │   ├── testimonials-slider.liquid
│       │   └── faq-accordion.liquid
│       ├── blocks/             # Reserved for future app blocks
│       │   └── _templates/     # Stub templates for future sections
│       ├── snippets/           # Reusable Liquid snippets (stars, button)
│       ├── assets/             # CSS and JS files
│       └── locales/            # Translation files
└── README.md
```

## Development

### Prerequisites

- Node.js (Latest LTS)
- Shopify CLI (`npm install -g @shopify/cli`)
- A Shopify Partner account and development store

### Local Development

1. Install dependencies:

   ```
   npm install
   ```

2. Start the development server:

   ```
   npm run dev
   ```

   This will prompt you to log in to your Partner account and select your app/store.

### Deployment

To deploy your extensions to Shopify:

```
npm run deploy
```

## Design System Reference

- **Typography**:
  - H1: `clamp(1.5rem, 4vw, 3rem)`
  - Body: `16px`, `line-height: 1.6`
  - Font Stack: `system-ui, -apple-system, sans-serif`
- **Spacing**:
  - Section Padding: `clamp(2rem, 5vw, 4rem)`
  - Container Max-width: `1200px`
- **Breakpoints**:
  - Mobile: `<768px`
  - Tablet: `≥768px`
  - Desktop: `≥1024px`

## License

Proprietary - Free to use via Shopify App Store

For issues and feature requests, contact support through the Shopify App Store listing.
