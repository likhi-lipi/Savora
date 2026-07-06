---
name: Savora Pro
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
  secondary: '#38684a'
  on-secondary: '#ffffff'
  secondary-container: '#b9efc8'
  on-secondary-container: '#3e6e4f'
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
  secondary-fixed: '#b9efc8'
  secondary-fixed-dim: '#9ed3ad'
  on-secondary-fixed: '#00210f'
  on-secondary-fixed-variant: '#1f5033'
  tertiary-fixed: '#ffd9dc'
  tertiary-fixed-dim: '#fbb4bb'
  on-tertiary-fixed: '#360d15'
  on-tertiary-fixed-variant: '#6b383e'
  background: '#f8f9ff'
  on-background: '#121c2a'
  surface-variant: '#d9e3f6'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
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
The design system is built for a premium Restaurant POS SaaS, prioritizing operational efficiency, reliability, and high-end hospitality aesthetics. The brand personality is **sophisticated, technical, and unobtrusive**, ensuring the software fades into the background of a busy kitchen or dining room while providing clarity at a glance.

The visual style draws heavily from **Modern Minimalism** and **Corporate/Modern** movements (Stripe, Vercel). Key attributes include:
- **Breathable Density:** High-information layouts (like order queues) are balanced with generous whitespace to prevent cognitive overload.
- **Precision Engineering:** Sharp focus states, subtle micro-interactions, and a strict adherence to a 4px/8px grid.
- **Contextual Elevation:** Depth is used sparingly to signify interactivity and priority, utilizing soft ambient shadows and tonal layering.
- **Adaptive Sophistication:** A seamless transition between light and dark modes, maintaining identical contrast ratios for accessibility.

## Colors
The color palette is anchored by "Savora Green," a muted, organic emerald that evokes freshness and calm. 

- **Primary & Secondary:** Used for key actions and brand presence. The primary #5F8D6E provides a distinct but professional identity.
- **Neutrals:** A scale of cool grays (from #F8F7F4 to #111827) provides the structural foundation. Backgrounds utilize slight tints to differentiate between navigation and content areas.
- **Semantic Colors:** Strict adherence to industry-standard status colors for kitchen management (e.g., Danger for overdue tickets, Warning for low stock).

In **Dark Mode**, surfaces shift to deep obsidian (#0F172A), while primary colors maintain their chroma but increase in luminance slightly to ensure legibility against dark backgrounds.

## Typography
The system uses **Geist** for its technical precision and modern feel, paired with **Inter** for smaller labels and utility text due to its exceptional legibility at small scales.

- **Scale:** All font sizes follow a modular scale. For mobile devices, `display-lg` and `headline-lg` scale down by 20% to prevent overflow.
- **Weight:** Use Semibold (600) for interactive elements and Regular (400) for data values. Bold (700) is reserved for primary headers.
- **Vertical Rhythm:** Line heights are optimized for a 4px grid, ensuring that multi-line text blocks align perfectly with adjacent components.

## Layout & Spacing
The layout uses a **12-column fluid grid** for the main dashboard content, with a fixed sidebar (240px).

- **Grid:** 16px gutters and 24px margins. Elements typically span 3, 4, 6, or 12 columns.
- **Rhythm:** All internal component padding (buttons, inputs) must be multiples of 4px.
- **Responsive Behavior:** 
  - **Desktop (1280px+):** Fixed sidebar, 12-column grid.
  - **Tablet (768px - 1279px):** Collapsed sidebar (icon only), 8-column grid.
  - **Mobile (<767px):** Bottom navigation bar, 4-column grid, margin reduced to 16px.

## Elevation & Depth
Depth is created through a mix of **Tonal Layering** and **Ambient Shadows**.

- **Level 0 (Base):** Background color. Flat.
- **Level 1 (Cards):** Surface color with a subtle 1px border (#E5E7EB in light, #1E293B in dark). No shadow.
- **Level 2 (Hover/Active):** Low-opacity ambient shadow (0px 4px 12px rgba(0,0,0,0.05)).
- **Level 3 (Modals/Dropdowns):** Elevated surface with a 1px border and a pronounced diffused shadow (0px 12px 32px rgba(0,0,0,0.12)).
- **Backdrop:** Modals use a 4px backdrop-blur with a 40% opacity neutral tint to maintain context while focusing the user.

## Shapes
The system utilizes a dual-radius strategy to balance friendliness with professional structure:

- **Large Components (Cards, Modals, Sections):** 16px (1rem) corner radius.
- **Medium Components (Inputs, Buttons, Tabs):** 8px (0.5rem) corner radius.
- **Small Components (Chips, Tooltips, Checkboxes):** 4px (0.25rem) corner radius.
- **Interactive States:** On press, buttons and interactive cards do not change radius, but may exhibit a subtle scale-down (0.98x) to simulate physical feedback.

## Components

### Buttons
- **Primary:** Savora Green background, white text. Subtle gradient (top-to-bottom 5%) for a tactile feel.
- **Secondary:** Transparent background, primary color border and text.
- **Ghost:** No border or background; text turns to Primary Dark on hover.
- **Loading:** Button maintains dimensions; text fades to 0% opacity while a 16px spinner rotates in the center.

### Inputs & Selects
- **States:** Default (1px gray border), Focus (2px primary border + 3px soft primary glow), Error (1px red border).
- **Search:** Includes a 16px magnifying glass icon with a "Command+K" badge for power users.

### Tables
- **Style:** Borderless rows with 1px bottom separators. 
- **Density:** 12px vertical padding for standard, 8px for high-density kitchen views. 
- **Hover:** Entire row highlights with a subtle gray tint.

### Data Visualization (Charts)
- **Palette:** Savora Green (Primary), Accent Green, Slate, and muted Amber.
- **Style:** Clean lines (2px stroke), no grid lines (except X/Y axes), and interactive tooltips using the Level 3 elevation style.

### Status Chips
- **Design:** Soft background (10% opacity of status color) with high-contrast text and a 4px status dot.

### Feedback (Toasts/Modals)
- **Toasts:** Bottom-right placement, Geist Mono for timestamps, Level 3 shadow.
- **Modals:** Center-aligned, max-width 560px for standard dialogs, full-height drawer for mobile.