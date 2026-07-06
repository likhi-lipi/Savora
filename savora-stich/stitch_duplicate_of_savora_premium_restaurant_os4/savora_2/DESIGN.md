---
name: Savora
colors:
  surface: '#f8f9ff'
  surface-dim: '#d0dbed'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dee9fc'
  surface-container-highest: '#d9e3f6'
  on-surface: '#121c2a'
  on-surface-variant: '#414942'
  inverse-surface: '#27313f'
  inverse-on-surface: '#eaf1ff'
  outline: '#717972'
  outline-variant: '#c1c9c0'
  surface-tint: '#3b684b'
  primary: '#386549'
  on-primary: '#ffffff'
  primary-container: '#517e60'
  on-primary-container: '#f6fff5'
  inverse-primary: '#a1d2af'
  secondary: '#4f652d'
  on-secondary: '#ffffff'
  secondary-container: '#cee9a2'
  on-secondary-container: '#536a30'
  tertiary: '#834c53'
  on-tertiary: '#ffffff'
  tertiary-container: '#a0646b'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#bceeca'
  primary-fixed-dim: '#a1d2af'
  on-primary-fixed: '#00210f'
  on-primary-fixed-variant: '#224f35'
  secondary-fixed: '#d1eca5'
  secondary-fixed-dim: '#b5d08b'
  on-secondary-fixed: '#121f00'
  on-secondary-fixed-variant: '#384d17'
  tertiary-fixed: '#ffd9dc'
  tertiary-fixed-dim: '#fbb4bb'
  on-tertiary-fixed: '#360d15'
  on-tertiary-fixed-variant: '#6b383e'
  background: '#F8F7F4'
  on-background: '#121c2a'
  surface-variant: '#d9e3f6'
  surface-card: '#FFFFFF'
  surface-sidebar: '#EEF2EC'
  text-muted: '#6B7280'
  stripe-accent: '#635BFF'
  vercel-blue: '#0070F3'
typography:
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-mono:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style

The design system is engineered for a premium, high-performance restaurant management environment. It targets hospitality professionals who require the reliability of enterprise software with the refined aesthetics of a luxury lifestyle brand. 

The visual direction is **Minimalist and Corporate/Modern**, heavily influenced by the high-utility, low-friction interfaces of top-tier developer tools. It emphasizes "invisible" design—where the interface recedes to let operational data and culinary imagery take center stage. The emotional response is one of calm, organized control, characterized by expansive whitespace, a soft organic palette, and rigorous alignment.

## Colors

The color strategy uses "Savora Green" (#5F8D6E) as the foundational brand anchor, evoking freshness and organic quality. This is supported by a lighter, sap-green accent for success states or highlighting growth metrics. 

The background is a warm, off-white "linen" (#F8F7F4) rather than a sterile pure white, reducing eye strain during long shifts. Neutral tones are derived from a deep slate for maximum legibility, while the sidebar utilizes a subtle green-tinted neutral to create clear structural grouping without harsh borders.

## Typography

This design system utilizes **Inter** for all primary UI and editorial elements, providing a clean, humanist-neutral tone that remains legible under varying lighting conditions found in restaurant environments. 

For technical data, POS receipts, and inventory tracking, **Geist** (monospace) is employed. This creates a clear visual distinction between "instructional/narrative" text and "data/input" text. Headlines should use tighter letter-spacing for a sophisticated, editorial look, while mono labels use slightly increased tracking for clarity at small sizes.

## Layout & Spacing

The layout is built on a strict **8px grid system**. It follows a **Fixed Grid** philosophy for dashboard views to maintain data density and information hierarchy, while transitioning to a fluid model for mobile POS views.

- **Desktop:** 12-column grid, 1200px max-width container, 24px gutters.
- **Tablet:** 8-column grid, 16px gutters, flexible margins.
- **Mobile:** 4-column grid, 16px margins, single-column reflow for data tables.

Standardize vertical rhythm using multiples of 8px. Use 24px (md) for standard component gaps and 40px (lg) for section separation to maintain the signature "airy" feel of the system.

## Elevation & Depth

Hierarchy is conveyed through **Tonal Layering** and **Soft Shadows**. 

The base layer is the linen background. Cards and primary interaction areas sit on the next level with a pure white surface and a very soft, diffused shadow (0px 4px 20px rgba(0,0,0,0.04)). This creates a sense of "physicality" without the heaviness of traditional shadows. 

Avoid high-contrast borders; instead, use 1px subtle strokes (#E5E7EB) to define boundaries between white-on-white elements. Overlays and modals utilize a soft backdrop blur (8px) to maintain context while focusing the user's attention.

## Shapes

The shape language is refined and approachable. A standard radius of **16px (1rem)** is applied to all primary cards and containers, creating the "soft-modern" look characteristic of premium SaaS. 

Buttons and input fields use a smaller **8px (0.5rem)** radius to maintain a professional, precise feel. Iconic elements or "status pills" should use a fully rounded/pill shape to distinguish them from actionable components.

## Components

- **Buttons:** Primary buttons use the Savora Green (#5F8D6E) with white text. Ghost buttons use a 1px border of the primary color. All buttons feature a subtle 200ms transition on hover with a slight lift.
- **Cards:** White background, 16px corner radius, soft 4% opacity shadow. Padding is consistently 24px (md).
- **Data Tables:** High-density but clean. No vertical lines; use horizontal dividers only (#F3F4F6). Header rows use `label-caps` in `text-muted`. Row hover states utilize the Sidebar color (#EEF2EC).
- **Input Fields:** 8px radius, white background with a light gray stroke. On focus, the stroke changes to Savora Green with a 3px soft focus ring.
- **Chips/Badges:** Use Geist for the font. Backgrounds should be low-saturation versions of the status color (e.g., light sage for success) with a darker text color.
- **Sidebar:** Fixed width (280px), using the #EEF2EC surface. Navigation items feature a vertical 4px "pill" indicator on the left side of the active item.