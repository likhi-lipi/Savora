---
name: Savora Marketing & Automation
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daea'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eefe'
  surface-container-high: '#e2e8f8'
  surface-container-highest: '#dce2f3'
  on-surface: '#151c27'
  on-surface-variant: '#414942'
  inverse-surface: '#2a313d'
  inverse-on-surface: '#ebf1ff'
  outline: '#717972'
  outline-variant: '#c1c9c0'
  surface-tint: '#3b684b'
  primary: '#386549'
  on-primary: '#ffffff'
  primary-container: '#517e60'
  on-primary-container: '#f6fff5'
  inverse-primary: '#a1d2af'
  secondary: '#546256'
  on-secondary: '#ffffff'
  secondary-container: '#d5e4d5'
  on-secondary-container: '#58665b'
  tertiary: '#555f53'
  on-tertiary: '#ffffff'
  tertiary-container: '#6e776b'
  on-tertiary-container: '#f7fff1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#bceeca'
  primary-fixed-dim: '#a1d2af'
  on-primary-fixed: '#00210f'
  on-primary-fixed-variant: '#224f35'
  secondary-fixed: '#d7e6d8'
  secondary-fixed-dim: '#bbcabc'
  on-secondary-fixed: '#121e15'
  on-secondary-fixed-variant: '#3d4a3f'
  tertiary-fixed: '#dbe5d6'
  tertiary-fixed-dim: '#bfc9bb'
  on-tertiary-fixed: '#151e14'
  on-tertiary-fixed-variant: '#40493e'
  background: '#f9f9ff'
  on-background: '#151c27'
  surface-variant: '#dce2f3'
typography:
  display:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
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
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  mono-label:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-padding: 32px
  element-gap: 12px
  message-inset: 16px
  sidebar-width: 280px
---

## Brand & Style
This design system embodies a **Premium Minimalist** aesthetic, merging the engineering precision of high-end developer tools with the organic warmth of a lifestyle brand. The target audience consists of sophisticated marketers and business owners who value efficiency and visual clarity.

The interface leverages a "Soft-Functional" style: high-density information layouts characteristic of SaaS (like Linear) are softened by a naturalistic color palette and generous whitespace. The emotional response is one of **calm control**—reducing the anxiety often associated with complex automation workflows through clear hierarchies and subtle tactile cues.

## Colors
The palette is anchored by a desaturated Sage Green (`#5F8D6E`), providing a grounded, professional primary action color. Surfaces are strictly white to maintain a "paper-like" quality against the off-white, slightly warm background (`#F9FAF5`). 

For marketing automation, we utilize a specialized status palette. These colors are used for campaign indicators and flow states. They should be applied with low-chroma backgrounds and high-contrast text for maximum readability. Message bubbles use a specific tonal variation: Outbound messages use the Primary Sage, while Inbound messages use a light Neutral-50 to differentiate participants without breaking the minimalist harmony.

## Typography
Inter is used exclusively to maintain a systematic, utilitarian feel. The hierarchy relies on tight line-heights and slight negative letter-spacing for larger headlines to mimic premium editorial layouts. 

For the SMS module, the `body-md` size is the standard for message previews and composition. The `mono-label` is reserved for metadata—such as timestamping messages or displaying audience segment counts—to provide a distinct visual "layer" from the content itself.

## Layout & Spacing
This design system follows a strict 4px grid. Layouts for the marketing module utilize a **fixed-sidebar, fluid-content** model. 

- **Automation Canvas:** Uses an infinite-scroll style grid with 24px gutters.
- **SMS Threading:** Messages are grouped with 4px vertical spacing between bubbles from the same sender, and 12px spacing between different senders.
- **Audience Tables:** High-density rows (40px height) with 16px horizontal cell padding.

Responsive transitions occur at 768px (Tablet) and 1024px (Desktop). On mobile, sidebars collapse into bottom-sheet navigation to prioritize the message composition area.

## Elevation & Depth
Depth is created through **Low-contrast outlines** and subtle tonal layering rather than heavy shadows. 

- **Level 0 (Background):** `#F9FAF5` – The canvas.
- **Level 1 (Cards/Surfaces):** `#FFFFFF` with a 1px solid border in `#E5E7EB`. No shadow.
- **Level 2 (Active Modals/Popovers):** `#FFFFFF` with a 1px border and a very soft, diffused shadow (`0 10px 15px -3px rgba(0,0,0,0.05)`).
- **Automation Nodes:** Elements in a flow use a 1px border. The "Active" node is highlighted by a 2px stroke of the Primary color rather than increased elevation.

## Shapes
We employ a **Soft** shape language to balance the technical nature of automation. 
- **Buttons & Inputs:** 4px (0.25rem) corner radius.
- **Message Bubbles:** 12px corner radius on three corners, with the fourth corner (the "tail" side) remaining at 4px for a modern, asymmetrical look.
- **Audience Badges:** Fully rounded (pill-shaped) to distinguish them from interactive buttons.
- **Automation Connectors:** Lines between nodes should have a 8px corner radius on all turns to maintain the organic flow.

## Components
- **Campaign Status Indicators:** A small 8px solid circle followed by `mono-label` text. The color of the circle follows the `status_tokens`.
- **SMS Message Bubbles:**
    - *Outgoing:* Primary color background, white text. Aligned right.
    - *Incoming:* Neutral-100 background, Secondary color text. Aligned left.
- **Audience Segment Badges:** Small, pill-shaped components with a light Primary background (`#F0F4F1`) and Primary color text. They include a "count" in a semi-bold weight.
- **Input Fields:** Minimalist styling with a 1px border that shifts from Grey-200 to Primary on focus. No inner shadows.
- **Automation Nodes:** Rectangular cards with a clear icon slot on the left, a headline-sm for the action name, and a label-sm for the condition description.
- **Action Buttons:** Primary buttons are solid Sage (`#5F8D6E`). Secondary buttons are outlined with a 1px border and no background.