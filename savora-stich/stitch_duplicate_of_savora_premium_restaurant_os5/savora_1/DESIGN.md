---
name: Savora
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
  secondary: '#5a605b'
  on-secondary: '#ffffff'
  secondary-container: '#dee4de'
  on-secondary-container: '#606661'
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
  secondary-fixed: '#dee4de'
  secondary-fixed-dim: '#c2c8c2'
  on-secondary-fixed: '#171d19'
  on-secondary-fixed-variant: '#424844'
  tertiary-fixed: '#ffd9dc'
  tertiary-fixed-dim: '#fbb4bb'
  on-tertiary-fixed: '#360d15'
  on-tertiary-fixed-variant: '#6b383e'
  background: '#f9faf5'
  on-background: '#1a1c1a'
  surface-variant: '#e2e3df'
typography:
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  h1:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  h1-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  h2:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  h3:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
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
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  gutter: 16px
  margin: 24px
---

## Brand & Style
The design system is engineered for high-utility SaaS environments where precision and clarity are paramount. The brand personality is professional, calm, and sophisticated, drawing inspiration from the technical rigor of Vercel and the polished elegance of Stripe. 

The aesthetic is rooted in **Modern Minimalism** with a focus on tactile refinement. It leverages a muted, organic color palette to provide a "nature-meets-tech" atmosphere, ensuring the interface remains approachable during long working sessions. Visual hierarchy is established through meticulous typography and subtle elevation rather than decorative elements.

## Colors
The palette is anchored by "Forest Green" (#5F8D6E), used intentionally for primary actions and success states. The neutral system moves away from sterile grays toward a "Linear-inspired" warm-neutral scale, using #F8F7F4 as the primary canvas to reduce eye strain.

The sidebar utilizes #EEF2EC to create a distinct functional zone without relying on harsh borders. Text contrast is strictly managed, with primary content using the 900-neutral and secondary metadata utilizing the 500-700 range.

## Typography
This design system employs **Inter** exclusively to maintain a systematic, utilitarian feel. The scale is high-contrast, ensuring clear distinction between navigational elements and long-form data. 

- **Headlines:** Use SemiBold (600) for structural clarity and Medium (500) for sub-headers. 
- **Body:** The default interface size is 14px for density, while 16px is reserved for editorial or documentation-heavy views.
- **Micro-copy:** Captions use 12px Medium to maintain legibility at small scales while creating a distinct visual tier for metadata.

## Layout & Spacing
The layout adheres to a strict **8px grid system**. All padding, margins, and component heights must be multiples of 8 (or 4 for micro-adjustments). 

- **Grid:** A 12-column fluid grid is used for main content areas, with 16px gutters.
- **Sidebar:** Fixed width (typically 240px or 280px) to provide a stable anchor for navigation.
- **Density:** High-utility views should favor 8px and 16px spacing increments, while marketing or landing pages should utilize 48px+ increments to emphasize whitespace.

## Elevation & Depth
Depth is communicated through **multi-layered soft shadows** rather than solid borders. Shadows use a very low-opacity neutral tint to blend seamlessly with the warm background.

- **Level 1 (Cards/Buttons):** 0px 1px 2px rgba(0,0,0,0.05).
- **Level 2 (Popovers/Dropdowns):** 0px 4px 6px -1px rgba(0,0,0,0.1), 0px 2px 4px -1px rgba(0,0,0,0.06).
- **Level 3 (Modals):** 0px 20px 25px -5px rgba(0,0,0,0.1), 0px 10px 10px -5px rgba(0,0,0,0.04).

Interactive elements utilize a 1px internal stroke (border-inset) in a slightly darker neutral shade to maintain crispness on high-resolution displays.

## Shapes
The shape language is unified yet hierarchical. A **12px radius** is reserved for large containers and cards to give the UI a soft, modern container feel. Smaller interactive components—such as buttons, inputs, and chips—utilize an **8px radius** to feel more precise and technical. 

Circular radii are used only for avatars or status indicators.

## Components
- **Buttons:** Primary buttons use the Forest Green background with white text. Ghost buttons use a subtle neutral hover state (#F1F1EF). All buttons feature the 8px radius.
- **Input Fields:** Use a 1px border (#D6D6D1) and a white background. On focus, the border transitions to Forest Green with a 2px soft outer glow.
- **Cards:** Utilize the 12px radius and Level 1 shadow. Backgrounds are strictly white (#FFFFFF) to pop against the #F8F7F4 page background.
- **Navigation:** Sidebar links use a 4px left-accent bar in Forest Green to indicate the active state, paired with a subtle background shift to #EEF2EC.
- **Lists:** Rows should be separated by a light 1px border (#F1F1EF) or simple 8px vertical spacing depending on data density.
- **Chips/Badges:** Small 12px text with 4px horizontal padding and an 8px radius. Use low-saturation background tints of the primary color for "active" tags.