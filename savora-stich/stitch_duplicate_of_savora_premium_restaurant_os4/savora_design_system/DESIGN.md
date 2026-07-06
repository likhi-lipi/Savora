---
name: Savora Design System
colors:
  surface: '#f9faf5'
  surface-dim: '#d9dad6'
  surface-bright: '#f9faf5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f0'
  surface-container: '#edeeea'
  surface-container-high: '#e7e9e4'
  surface-container-highest: '#e2e3df'
  on-surface: '#1a1c1a'
  on-surface-variant: '#414942'
  inverse-surface: '#2e312e'
  inverse-on-surface: '#f0f1ed'
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
  background: '#f9faf5'
  on-background: '#1a1c1a'
  surface-variant: '#e2e3df'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  headline-xl-mobile:
    fontFamily: Geist
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
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  container-margin: 24px
  gutter: 16px
---

## Brand & Style

The design system is engineered for a premium SaaS environment, blending high-utility restaurant operations with an elegant, hospitality-focused aesthetic. The brand personality is **sophisticated, efficient, and reliable**, aiming to reduce the cognitive load of busy restaurant staff while maintaining a high-end feel for management.

The visual style is **Premium Minimalism with Glassmorphic accents**. It leverages a "Quiet Luxury" approach—using generous whitespace, a nature-inspired palette, and subtle depth to create a focused atmosphere. While the core is functional, translucent layers and soft shadows introduce a sense of physical layering, mimicking the organized stacks of a professional kitchen or well-curated dining room.

## Colors

This design system utilizes an organic, "Farm-to-Table" inspired palette. The **Primary Green (#5F8D6E)** serves as the anchor, representing stability and growth, while the **Accent Green (#A4BE7B)** provides a fresh, energetic highlight for secondary actions and progress indicators.

The background uses a warm neutral **(#F8F7F4)** rather than pure white to reduce eye strain during long shifts. Surface layers (like sidebars and navigation containers) use a subtle sage-tinted neutral **(#EEF2EC)** to create a soft distinction from the pure white **(#FFFFFF)** of actionable cards. Semantic colors for Success, Warning, and Error follow industry standards but are calibrated to maintain legibility against the light, organic background.

## Typography

The typography system pairs **Geist** for headlines and UI labels with **Inter** for body content. Geist’s technical precision and modern geometric forms provide a "pro-tool" feel, while Inter’s humanist qualities ensure maximum legibility for dense data like order lists and inventory reports.

A strict hierarchy is maintained: **Geist Bold/SemiBold** is reserved for structural headings and primary data points (e.g., total revenue), while **Inter Regular** handles the bulk of the descriptive text. For mobile devices, larger headlines scale down slightly to maintain clear sightlines on smaller POS terminals.

## Layout & Spacing

The design system is built on a rigid **8px grid system**, ensuring consistent alignment across all components. It uses a **fluid grid** approach for desktop and tablet, while transitioning to a stacked, single-column layout for mobile.

- **Desktop:** 12-column grid, 24px margins, 16px gutters.
- **Tablet:** 8-column grid, 16px margins, 16px gutters.
- **Mobile:** 4-column grid, 16px margins, 12px gutters.

Spacing emphasizes "Airiness." Use large `xl` (32px) padding for primary container cards to evoke a premium, uncluttered feel. Interactive elements like table rows or menu items use `md` (16px) vertical spacing to optimize for touch targets on POS tablets.

## Elevation & Depth

Visual hierarchy is established through a combination of **Tonal Layering** and **Soft Ambient Shadows**. 

1.  **Level 0 (Background):** The `#F8F7F4` base layer.
2.  **Level 1 (Surfaces):** Sidebars and utility panels use `#EEF2EC` with no shadow, but a 1px border of `#E5E7EB`.
3.  **Level 2 (Cards):** Main content areas are pure white cards with a very soft, diffused shadow (Offset: 0px 4px, Blur: 20px, Color: `rgba(0, 0, 0, 0.04)`).
4.  **Level 3 (Interactive):** Hover states and active selections utilize **Glassmorphism**. Modals and dropdowns feature a `backdrop-filter: blur(12px)` with a semi-transparent white fill and a more pronounced shadow to create immediate focus.

Avoid heavy black shadows; instead, use tinted shadows that incorporate a hint of the primary green to maintain the organic aesthetic.

## Shapes

The shape language is defined by **significant roundedness**, conveying a friendly and modern brand image. 

- **Primary Cards & Modals:** 16px (`rounded-lg`).
- **Buttons & Input Fields:** 12px (`rounded-md`).
- **Chips & Status Badges:** Full pill-shape (`rounded-full`) for high distinctiveness.
- **Icon Containers:** 8px (`rounded-sm`).

This consistent curvature softens the technical nature of a POS system, making the interface feel more approachable and less like a legacy database.

## Components

### Buttons
Primary buttons use the Primary Green (#5F8D6E) with white text. Secondary buttons use a transparent background with a 1px border of the Border color. Action icons should always be outlined (Lucide style) and positioned to the left of the text.

### Input Fields
Fields feature a subtle `#F9FAFB` fill, a 1px border of `#E5E7EB`, and 12px rounded corners. On focus, the border transitions to the Primary Green with a soft outer glow.

### Cards
Cards are the core of the UI. They must have 16px rounded corners, 24px internal padding, and a white background. Use "Glass" headers for cards that require secondary navigation (e.g., tabs within a report card).

### Chips & Badges
Used for order statuses (e.g., "Preparing," "Served"). These use low-saturation versions of the semantic colors for the background and high-saturation versions for the text to ensure accessibility without breaking the minimalist aesthetic.

### Lists & Tables
Tables should avoid heavy vertical lines. Use subtle horizontal dividers (#E5E7EB) and alternate row shading (Level 1 surface color) only when data density is extremely high. Use 16px of vertical padding per row for touch-friendly POS interaction.