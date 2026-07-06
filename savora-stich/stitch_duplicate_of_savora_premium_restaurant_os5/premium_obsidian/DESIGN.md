---
name: Premium Obsidian
colors:
  surface: '#0b141d'
  surface-dim: '#0b141d'
  surface-bright: '#313a44'
  surface-container-lowest: '#060f17'
  surface-container-low: '#141c25'
  surface-container: '#182029'
  surface-container-high: '#222b34'
  surface-container-highest: '#2d363f'
  on-surface: '#dae3f0'
  on-surface-variant: '#c0c9be'
  inverse-surface: '#dae3f0'
  inverse-on-surface: '#28313b'
  outline: '#8a9389'
  outline-variant: '#404940'
  surface-tint: '#95d5a0'
  primary: '#95d5a0'
  on-primary: '#003918'
  primary-container: '#6fae7c'
  on-primary-container: '#00401c'
  inverse-primary: '#2d6a3f'
  secondary: '#afd192'
  on-secondary: '#1d3708'
  secondary-container: '#334e1d'
  on-secondary-container: '#9ebf82'
  tertiary: '#a4c9ff'
  on-tertiary: '#00315d'
  tertiary-container: '#5ea3f8'
  on-tertiary-container: '#003868'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#b0f2bb'
  primary-fixed-dim: '#95d5a0'
  on-primary-fixed: '#00210b'
  on-primary-fixed-variant: '#105229'
  secondary-fixed: '#cbedac'
  secondary-fixed-dim: '#afd192'
  on-secondary-fixed: '#0c2000'
  on-secondary-fixed-variant: '#334e1d'
  tertiary-fixed: '#d4e3ff'
  tertiary-fixed-dim: '#a4c9ff'
  on-tertiary-fixed: '#001c39'
  on-tertiary-fixed-variant: '#004883'
  background: '#0b141d'
  on-background: '#dae3f0'
  surface-variant: '#2d363f'
typography:
  display:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: '0'
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: '0'
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: '0'
  body-sm:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: '0'
  label-md:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  code:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  container-max: 1440px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style
The design system embodies a "Luxury SaaS" aesthetic, prioritizing technical precision with a sophisticated, calm demeanor. It targets high-end enterprise users and developers who value focus and clarity. The visual language is inspired by high-performance tools, utilizing a deep, desaturated palette to reduce eye strain while maintaining a sense of premium quality.

The style is **Corporate Modern with subtle Glassmorphism**. It avoids pure blacks to maintain depth and uses soft contrast to create a hierarchy that feels organic rather than jarring. The emotional response is one of reliability, elite performance, and quiet authority.

## Colors
The palette is rooted in a deep navy-charcoal foundation, ensuring that the Forest Green primary color acts as a natural, calming focal point. 

- **Primary Interaction**: Use Forest Green (#6FAE7C) for main actions. Hover states should transition to a brighter, more luminous Mint (#84BE91).
- **Surface Hierarchy**: Leveling is achieved through color steps rather than just shadows. Background (#0F1720) transitions to Cards (#1A2433) and then to Elevated Cards (#223047) for modals or popovers.
- **Accents**: Use the secondary Accent Green (#A8C98B) sparingly for data highlights or subtle active indicators to maintain the monochromatic luxury feel.
- **Data Visualization**: Use the defined chart palette. Ensure charts against dark backgrounds utilize a slightly higher saturation to maintain legibility.

## Typography
This design system uses **Geist** exclusively to maintain a technical, developer-centric aesthetic. The typeface's geometric precision complements the dark, structured layout.

- **Headlines**: Use SemiBold (600) for Display and Large headlines to create a strong visual anchor. Apply negative letter spacing to larger sizes for a tighter, more editorial look.
- **Body**: Medium (400) weight is the standard for readability. Use Text Secondary (#B7C0CC) for long-form content to reduce "vibrating" white text on dark backgrounds.
- **Labels**: Small labels and overlines should use Medium (500) weight with a slight tracking increase (0.05em) and uppercase transformation for clear categorization.

## Layout & Spacing
The layout follows a strict **12-column fluid grid** for desktop and a **4-column grid** for mobile. 

- **Grid System**: Use a 24px gutter for desktop and 16px for mobile. Containers should be capped at 1440px to maintain line-length readability.
- **Rhythm**: All spacing (padding, margins) must be increments of 8px (the 4px base unit is reserved for tight component internals like icon-to-text spacing).
- **Sidebar**: The sidebar is fixed at 280px. It uses a slightly darker tone (#111827) than the main cards to recede into the background.
- **Safe Areas**: Use 32px page margins for desktop and 16px for mobile to ensure content doesn't feel cramped against the screen edges.

## Elevation & Depth
Depth is conveyed through a combination of **Tonal Layering** and **Subtle Outlines**. 

- **Tiers**: Objects closer to the user are lighter in color. The base is #0F1720, cards are #1A2433, and active/elevated states are #223047.
- **Borders**: Every card and container must have a 1px solid border (#2D3748). This "ghost border" provides structure without the weight of heavy shadows.
- **Shadows**: Use a single, very soft ambient shadow for elevated cards: `0px 10px 30px rgba(0, 0, 0, 0.4)`. Do not use tinted shadows.
- **Dividers**: Use the Divider color (#253040) for internal card separations, keeping them more subtle than the main container borders.

## Shapes
The shape language is consistently **Rounded**, reflecting a modern and approachable software feel while maintaining professional structure.

- **Standard Radius**: 16px (1rem) is the default for all cards, modals, and large containers.
- **Component Radius**: Buttons and input fields should utilize 8px (0.5rem) to appear more precise and "clickable."
- **Small Elements**: Chips, tags, and small badges may use a fully rounded (pill) style to distinguish them from interactive buttons.

## Components
- **Buttons**: 
    - *Primary*: Forest Green (#6FAE7C) background with Text Primary (#F3F4F6). No border.
    - *Secondary*: Transparent background with Border (#2D3748). 
    - *Hover*: Shift background to #84BE91 for primary.
- **Input Fields**: Background should be #151E2D with a 1px border (#2D3748). On focus, the border changes to Primary (#6FAE7C) with a subtle 2px outer glow.
- **Cards**: Background #1A2433, 16px corner radius, 1px border (#2D3748). Header areas within cards should be separated by a 1px divider (#253040).
- **Chips/Tags**: Low-contrast backgrounds (e.g., #223047) with Text Secondary labels. For status tags (Success/Warning), use a desaturated version of the color as a background and the full-saturation color for the text.
- **Lists**: Items should have a subtle hover state using Background #151E2D. Use the Divider color for separating list items only when text density is high.
- **Navigation**: The Top Nav (#111827) should feature a subtle 1px bottom border to separate it from the main content flow.