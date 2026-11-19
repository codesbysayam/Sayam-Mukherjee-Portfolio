# Design System & Aesthetic Standards | Sayam Mukherjee Portfolio

## 1. Aesthetic Direction: Premium Engineering Editorial
The design language combines the precision of high-end developer platforms (Linear, Vercel) with the restrained elegance of Apple product typography and modern editorial publications.

### Anti-Patterns Strictly Forbidden ("Anti-Slop")
1. **No Sci-Fi / Cyberpunk Tropes**: No neon glow effects, fake telemetry statistics ("SYSTEM ACTIVE // 99.4%"), arbitrary HUD borders, or glowing scan lines.
2. **No Purple-Blue Gradients**: Never use saturated purple-to-blue linear gradients on text or large container backgrounds.
3. **No Nested Cards**: Do not nest cards inside cards inside cards. Use whitespace, subtle dividers, and typography for hierarchy.
4. **No Low-Contrast Text**: No faint gray text on black, nor dark gray on medium gray surfaces.

---

## 2. Color System & Semantic Tokens

### Light Theme (`:root`, `html.light`, `html[data-theme="light"]` — Default)
```css
:root {
  --bg: #F4F4ED;              /* Warm Chalk paper canvas */
  --surface: #EAEAE1;         /* Primary muted container surface */
  --surface-2: #FFFFFF;       /* Crisp elevated surface */
  --surface-3: #E3E3D9;       /* Inset surface */
  --text: #20231D;            /* Deep Olive Charcoal ink (high contrast) */
  --text-secondary: #30332D;  /* Readable body copy */
  --text-muted: #585B52;      /* Metadata & captions */
  --text-faint: #777A70;      /* Subtle auxiliary labels */
  --border: #D6D7CC;          /* 1px crisp structural border */
  --border-strong: #BFC1B3;   /* Emphasized interactive border */
  --accent: #69734A;          /* Olive Moss editorial accent */
  --accent-signal: #C7E34A;   /* Volt Signal Lime highlight */
  --accent-2: #4E5834;
  --success: #3F6212;
  --warning: #A16207;
  --danger: #B91C1C;
}
```

### Dark Theme (`html.dark`, `html[data-theme="dark"]`)
```css
html.dark {
  --bg: #20231D;              /* Deep Olive Charcoal canvas */
  --surface: #151713;         /* Obsidian charcoal surface */
  --surface-2: #262922;       /* Elevated card surface */
  --surface-3: #2E3229;       /* Inset container surface */
  --text: #F4F4ED;            /* Warm Chalk ink */
  --text-secondary: #D4D6CA;  /* Readable body copy */
  --text-muted: #B5B8AA;      /* Metadata & captions */
  --text-faint: #8C8F82;      /* Subtle auxiliary labels */
  --border: #41443A;          /* 1px olive charcoal border */
  --border-strong: #565A4E;
  --accent: #C7E34A;          /* Volt Signal Lime primary highlight */
  --accent-signal: #C7E34A;
  --accent-2: #A9C52F;
  --success: #A3E635;
  --warning: #FBBF24;
  --danger: #F87171;
}
```

---

## 3. Typography & Mathematical Hierarchy
- **Primary Sans & Display Font**: `"Manrope"` (`ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`).
- **Editorial Serif Accent Font**: `"DM Serif Display"` (`Georgia, Cambria, "Times New Roman", serif`).
- **Monospace Telemetry Font**: `"IBM Plex Mono"` (`ui-monospace, SFMono-Regular, Menlo, monospace`) for structured metadata, tabular figures, and verified data.
- **Reading Measure**: Constrain reading text (paragraphs, articles, legal clauses) to `--reading-max: 760px` (`65ch`–`78ch`).
- **Line Heights**: `1.6`–`1.75` for body text; `1.15`–`1.25` for display headings.

---

## 4. Layout Math & Fluid Containers
- **Main Viewport Container**:
  ```css
  .container {
    width: min(100% - var(--page-gutter), 1440px);
    margin-inline: auto;
  }
  ```
- **Fluid Spacing**:
  - Page Gutter: `--page-gutter: clamp(16px, 4vw, 72px)`
  - Section Rhythm: `--section-space: clamp(3.5rem, 6vw, 6.5rem)`
- **Editorial Border Radii Discipline (Sharp Geometry)**:
  - Outer Cards & Containers: `--radius-lg: 10px`
  - Inputs & Buttons: `--radius-md: 6px`
  - Badges & Tags: `--radius-sm: 4px` (avoid bubbly rounded-full pill inflation)

---

## 5. Global Call-to-Action (CTA) Hierarchy
To eliminate conflicting button styles and maintain one clear conversion funnel:
1. **Primary Global CTA**:
   - Label: `"Let's Work Together"`
   - Target: `/contact`
   - Appearance: Filled high-contrast background, subtle hover lift, prominent position in Navbar, Hero, and Page Endings.
2. **Secondary Actions**:
   - Labels: `"View Projects"`, `"Download Resume"`, `"GitHub"`
   - Appearance: Muted border outline, transparent background, subtle hover highlight.
3. **Tertiary Actions**:
   - Text links with directional arrow (`→`) and underline-on-hover.

---

## 6. Editorial Legal Document Experience (`/privacy`, `/terms`)
- **Structure**: Single or clean dual-column layout with left sticky/stationary TOC.
- **Tone**: Formal, clear, highly scannable plain-English legal document.
- **Quietness**: Zero background particles, zero telemetry badges, no animated gradients.
- **Interaction**: Table of Contents links smoothly navigate to target section IDs without page jumping.
