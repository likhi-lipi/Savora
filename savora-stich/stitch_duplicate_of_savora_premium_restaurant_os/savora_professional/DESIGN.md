---
name: Savora Professional
colors:
  surface: '#fbf8ff'
  surface-dim: '#dad9e3'
  surface-bright: '#fbf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f2fd'
  surface-container: '#eeedf7'
  surface-container-high: '#e8e7f1'
  surface-container-highest: '#e3e1ec'
  on-surface: '#1a1b22'
  on-surface-variant: '#414942'
  inverse-surface: '#2f3038'
  inverse-on-surface: '#f1effa'
  outline: '#717972'
  outline-variant: '#c1c9c0'
  surface-tint: '#3b684b'
  primary: '#386549'
  on-primary: '#ffffff'
  primary-container: '#517e60'
  on-primary-container: '#f6fff5'
  inverse-primary: '#a1d2af'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e2dfde'
  on-secondary-container: '#636262'
  tertiary: '#5a5c5d'
  on-tertiary: '#ffffff'
  tertiary-container: '#737576'
  on-tertiary-container: '#fcfcfd'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#bceeca'
  primary-fixed-dim: '#a1d2af'
  on-primary-fixed: '#00210f'
  on-primary-fixed-variant: '#224f35'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#e2e2e3'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1d'
  on-tertiary-fixed-variant: '#454748'
  background: '#fbf8ff'
  on-background: '#1a1b22'
  surface-variant: '#e3e1ec'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  display-md:
    fontFamily: Geist
    fontSize: 36px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  label-md:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.02em
  code:
    fontFamily: Geist Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 40px
  stack-xs: 4px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
  stack-xl: 48px
  section-gap: 80px
---

## Brand & Style

This design system translates the brand into a high-performance desktop SaaS environment. The aesthetic is rooted in **Modern Minimalism** with a focus on precision, clarity, and intentional whitespace. 

The target audience consists of professional operators who value efficiency and a clutter-free workspace. The UI should evoke a sense of **calm authority** and **technical sophistication**, drawing inspiration from industry leaders like Stripe and Vercel. Expect sharp execution, subtle tonal shifts instead of heavy borders, and a systematic approach to density that prioritizes readability over decoration.

## Colors

The palette is centered around the signature **Savora Green**, used sparingly as a primary action color to maintain a premium feel. 

- **Light Mode:** Uses a "paper-white" foundation (#FFFFFF) with cool gray scales for secondary information and deep charcoal for high-contrast typography.
- **Dark Mode:** Transitions to a "deep-space" aesthetic using #0A0A0A as the base. The primary green is slightly desaturated and brightened (#71A682) to ensure AAA accessibility and reduce eye strain on dark backgrounds.
- **Functional Colors:** Error, warning, and success states follow standard semantic patterns but are adjusted in saturation to match the sophisticated brand tone. Use subtle background tints for alerts rather than solid high-saturation blocks.

## Typography

This design system utilizes **Geist** exclusively to achieve a technical, Swiss-inspired typographic rhythm. 

- **Weight Strategy:** Use `SemiBold (600)` for primary headings to create a clear visual anchor. `Medium (500)` is reserved for UI labels and buttons.
- **Spacing:** Negative letter-spacing is applied to larger display sizes to maintain a "tight" professional look. 
- **Hierarchy:** Contrast is achieved through size and color (e.g., using `neutral-500` for secondary body text) rather than excessive weight changes.
- **Monospace:** For technical data or ID strings, use the Geist Mono variant to reinforce the SaaS utility.

## Layout & Spacing

The layout philosophy follows a **strict 4px baseline grid** to ensure mathematical harmony across all components.

- **Grid System:** Use a 12-column fluid grid for main content areas with a maximum container width of 1280px. This prevents line lengths from becoming unreadable on ultra-wide monitors.
- **Whitespace:** Embrace generous "Section Gaps" (80px+) to separate distinct workflows. This "Stripe-like" breathing room reduces cognitive load.
- **Symmetry:** Sidebar-driven layouts should use a fixed width (240px or 280px) while the main content area remains fluid.
- **Padding:** Internal component padding should favor horizontal breathing room (e.g., a button with 12px vertical and 20px horizontal padding).

## Elevation & Depth

This design system avoids heavy shadows in favor of **Tonal Layering** and **Micro-borders**.

- **Surfaces:** Use three primary tiers:
  1. **Level 0 (Background):** Pure white or pure black.
  2. **Level 1 (Cards/Sidebar):** Subtle gray offset (#F9F9FB / #121212) or a 1px border.
  3. **Level 2 (Popovers/Modals):** Raised with a "Soft Ambient" shadow (0px 10px 30px rgba(0,0,0,0.04)).
- **Borders:** Instead of shadows, use 1px borders in `neutral-200` (light) or `neutral-800` (dark) to define interactive boundaries.
- **Interactions:** On hover, elements should not move "up" via shadows; instead, shift the background color or border intensity slightly.

## Shapes

The shape language is **Soft and Precise**. 

- **Radius:** A standard radius of `0.25rem (4px)` is used for small components like checkboxes and input fields. Larger components like cards and modals use `0.5rem (8px)`.
- **Consistency:** Avoid pill-shaped buttons unless used for secondary "tags" or "chips." The square-but-soft corners reinforce the professional SaaS aesthetic.
- **Outer vs Inner:** When nesting elements (like a button inside a card), ensure the inner border radius is mathematically smaller than the outer radius to maintain visual alignment.

## Components

- **Buttons:** Primary buttons use a solid Savora Green background with white text. Secondary buttons use a ghost style (border only) or a subtle gray fill. No gradients.
- **Inputs:** Focus states are indicated by a 1px Savora Green border and a subtle 2px outer glow (alpha 10%). Labels are always positioned above the input in `label-md`.
- **Cards:** Flat design with a 1px border. No shadows unless the card is draggable or floating. Card headers should have a distinct 48px height with a bottom divider.
- **Chips:** Used for status indicators (e.g., "Active", "Pending"). These use low-contrast background tints with a high-contrast dot icon on the left.
- **Lists:** Data tables and lists should use "Geist Mono" for numeric values. Row height should be a generous 56px to ensure touch-friendly targets and readability.
- **Navigation:** Top-tier navigation uses high-contrast text; secondary navigation (sidebar) uses a slightly smaller font size and a "muted-to-active" color transition.