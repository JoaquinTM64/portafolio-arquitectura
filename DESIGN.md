---
name: Academic Excellence
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
  on-surface-variant: '#414755'
  inverse-surface: '#27313f'
  inverse-on-surface: '#eaf1ff'
  outline: '#717786'
  outline-variant: '#c1c6d7'
  surface-tint: '#005bc1'
  primary: '#0058bc'
  on-primary: '#ffffff'
  primary-container: '#0070eb'
  on-primary-container: '#fefcff'
  inverse-primary: '#adc6ff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#9e3d00'
  on-tertiary: '#ffffff'
  tertiary-container: '#c64f00'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a41'
  on-primary-fixed-variant: '#004493'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#ffdbcc'
  tertiary-fixed-dim: '#ffb595'
  on-tertiary-fixed: '#351000'
  on-tertiary-fixed-variant: '#7c2e00'
  background: '#f8f9ff'
  on-background: '#121c2a'
  surface-variant: '#d9e3f6'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  title-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
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
  xl: 40px
  xxl: 80px
  container-max: 1120px
  gutter: 24px
---

## Brand & Style

This design system is built for the modern scholar, emphasizing clarity, authority, and intellectual rigor. The personality is "Quietly Confident"—it does not shout for attention but earns it through meticulous organization and high-end aesthetic refinement.

The visual style leverages **Minimalism** and **Glassmorphism**. By prioritizing expansive white space and a restricted color palette, the system ensures that research, publications, and academic achievements remain the focal point. The influence of high-end SaaS and Apple-inspired interfaces is evident in the precise alignment, subtle depth, and intentional use of transparency to create a layered, sophisticated information architecture.

## Colors

The palette is anchored by a sterile, professional background to ensure maximum legibility for dense academic text. 

- **Primary (#007AFF):** An "Electric Blue" used sparingly for high-priority actions, links, and active states. It signals modern technology and progress.
- **Slate Text (#1F2937):** A deep grey-blue that provides high contrast for body copy while feeling softer and more "ink-like" than pure black.
- **Muted Slate (#64748B):** Used for secondary metadata, such as publication dates or citation counts.
- **Background (#F9FAFB):** A very light cool grey that provides a subtle distinction from pure white paper-like cards and modals.

## Typography

The typography utilizes **Inter** to achieve a systematic and utilitarian feel that mirrors the precision of academic research. 

- **Headlines:** Use tighter letter spacing and heavier weights to create a strong visual anchor for section titles.
- **Body Text:** Set with a generous line height (1.6) to accommodate long-form reading, such as abstracts or project descriptions.
- **Labels:** Small caps are used for metadata categories (e.g., "PUBLISHED IN") to provide a clear structural hierarchy without competing with main titles.

## Layout & Spacing

The design system employs a **Fixed Grid** model for desktop to maintain a classic, editorial feel. Content is centered within a 1120px container, utilizing a 12-column grid.

- **Rhythm:** An 8px linear scale drives all padding and margins, ensuring vertical rhythm.
- **Margins:** Use `xl` (40px) or `xxl` (80px) spacing between major sections to emphasize the minimalist "Apple-style" luxury of empty space.
- **Information Density:** For list-heavy sections (like CVs or bibliographies), use `md` (16px) spacing to keep related information tight and scanable.

## Elevation & Depth

This design system uses a "Layered Surface" approach to create depth without visual clutter.

- **Shadows:** Use extremely soft, highly diffused shadows. A typical shadow should have a 20px-30px blur with a very low opacity (3-5%) to make cards feel like they are naturally lifting off the #F9FAFB background.
- **Glassmorphism:** Navigation bars and floating headers should use a `blur(20px)` effect with a `white / 80%` opacity background. This maintains a sense of place as the user scrolls through long academic papers.
- **Dividers:** Use 1px borders in a very light grey (#E5E7EB) instead of shadows for secondary level separation, keeping the interface flat and clean.

## Shapes

The shape language is consistently **Rounded**, balancing the "seriousness" of academia with a modern, approachable softness.

- **Standard Elements:** Buttons, input fields, and tags use an 8px (`0.5rem`) radius.
- **Large Containers:** Content cards and image containers use a 16px (`1rem`) radius to create a distinct "Apple-style" container feel.
- **Interactive States:** On hover, shapes should not change their radius, but rather their background tint or shadow depth.

## Components

- **Buttons:** Primary buttons feature a solid #007AFF background with white text. Secondary buttons use a ghost style (border only) or a light grey fill to remain subordinate.
- **Cards:** The "Research Card" is the core component. It features a white background, a 1px soft border, and the standard 16px corner radius. On hover, the shadow should slightly deepen to indicate interactivity.
- **Chips/Tags:** Used for "Research Interests" or "Keywords." These should have a subtle grey background (#F3F4F6) and 8px rounding, using `label-caps` typography.
- **Inputs:** Clean, 1px bordered boxes that highlight the border in #007AFF when focused.
- **Academic Timeline:** A vertical line component with small circular nodes to visualize career progression or educational history.
- **Publication List:** A clean, left-aligned list item with the title in `title-sm` and authors/source in `body-sm` muted text.