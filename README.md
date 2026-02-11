# sections-app

A library of production-ready Shopify theme sections built entirely with Theme App Extensions. No backend required.

## Overview

This app delivers high-quality, accessible theme sections to merchants using Shopify 2.0 Theme App Extensions. It is designed to be lightweight, performant, and easy to integrate with any Shopify theme.

Recently, the app was refactored to use **App Blocks** exclusively, enabling a "lego-like" experience where individual items (like a single Testimonial or FAQ) can be added anywhere in a section. We developed a proprietary "Auto-Grouping" system that automatically collects these individual blocks and renders them as cohesive, functional components (e.g., a Slider or an Accordion) without requiring complex configuration.

## Features

### 1. Testimonials Slider (App Block)
**Refactored for Dynamic Grouping**

Instead of a rigid section, the Testimonials Slider is now a single "Testimonial Slide" App Block.
- **Auto-Grouping**: When you add multiple "Testimonial Slide" blocks to a section, they automatically group together to form a fully functional slider.
- **One-Click Setup**: Just add the blocks. The first block's settings (Heading, Autoplay) control the entire slider container.
- **Responsive**: The slider adapts to 1 slide on mobile, 2 on tablet, and 3 on desktop.
- **Infinite Loop**: Features separate Next/Prev buttons and DOTS pagination that handles infinite scrolling seamlessly.
- **Smart Loading**: Uses `MutationObserver` to detect when blocks are added or removed in the Theme Editor and instantly updates the slider layout.

**Usage:**
1. Go to Theme Editor -> Add Section -> Apps -> Testimonial Slide.
2. Add multiple "Testimonial Slide" blocks to the same section.
3. They will automatically render as a carousel.

### 2. FAQ Accordion (App Block)
**Refactored for Dynamic Grouping**

Similar to testimonials, the FAQ is now a single "FAQ Item" App Block.
- **Auto-Grouping**: Multiple "FAQ Item" blocks added to a section will automatically group into a shared Accordion container.
- **Smart Interactions**: Supports "Allow Multiple Open" (configurable via the first block).
- **Event Delegation**: Uses advanced event delegation to ensure click handlers work perfectly even for dynamically added items.
- **Smooth Animations**: CSS-grid based transitions for opening/closing answers.
- **Accessibility**: Full ARIA support (aria-expanded, aria-controls) and keyboard navigation (Enter/Space to toggle, Arrow keys to navigate).

**Usage:**
1. Go to Theme Editor -> Add Section -> Apps -> FAQ Item.
2. Add multiple "FAQ Item" blocks.
3. They will stack and function as a single Accordion.

### 3. Hero Banner (App Block)
- **Media Support**: Background image with responsive sizing or MP4 video background.
- **Content**: Customizable heading, subheading, and CTA button.
- **Customization**: Adjust section height (Small, Medium, Large, Full Screen), text alignment (Left, Center, Right), and overlay opacity.

## Technical Implementation

### Auto-Grouping Architecture
To overcome the limitation of App Blocks not supporting nested blocks, we implemented a client-side grouping strategy:
1. **Liquid**: Renders the block content hidden initially or in a raw state.
2. **JavaScript**:
   - Detects the block's presence.
   - Finds or Creates a shared "Container" (Slider or Accordion) within the parent section.
   - Moves the block content into this container.
   - Initializes the interactive logic (Slider script or Accordion script) once the DOM is stable.
   - Listens for `shopify:section:load` and `shopify:block:select` events to ensure the editor experience is smooth.

### Performance & Best Practices
- **Zero Dependencies**: Pure Vanilla JS and CSS. No jQuery or external libraries.
- **CSS Variables**: Used for theming and easy customization.
- **Robust Error Handling**: Scripts include checks for race conditions, DOM availability, and timeouts to ensure stability in the Theme Editor.
- **Modern CSS**: Uses `scroll-snap` for sliders and `grid-template-rows` for accordion animations.

## Project Structure

```
sections-app/
├── shopify.app.toml            # App configuration
├── package.json                # Scripts and dependencies
├── extensions/
│   └── theme-extension/
│       ├── blocks/             # App Blocks (Primary components)
│       │   ├── hero-banner.liquid
│       │   ├── testimonials-slider.liquid  # Auto-groups into Slider
│       │   └── faq-accordion.liquid        # Auto-groups into Accordion
│       ├── snippets/           # Reusable Liquid snippets
│       ├── assets/             # CSS and JS files (Logic for grouping & interaction)
│       └── locales/            # Translation files
└── README.md
```

## Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Locally**:
   ```bash
   npm run dev
   ```

3. **Deploy**:
   ```bash
   npm run deploy
   ```

## License

Proprietary - Free to use via Shopify App Store.
