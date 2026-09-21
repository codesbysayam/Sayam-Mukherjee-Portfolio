# Design System & Aesthetic Standards — Sayam Mukherjee Portfolio

## 1. Aesthetic Direction: Premium Engineering Editorial
The design language combines the precision of high-end developer platforms (Linear, Vercel) with the restrained elegance of Apple product typography and modern editorial publications.

### Anti-Patterns Strictly Forbidden ("Anti-Slop")
1. **No Sci-Fi / Cyberpunk Tropes**: No neon glow effects, fake telemetry statistics ("SYSTEM ACTIVE // 99.4%"), arbitrary HUD borders, or glowing scan lines.
2. **No Purple-Blue Gradients**: Never use saturated purple-to-blue linear gradients on text or large container backgrounds.
3. **No Nested Cards**: Do not nest cards inside cards inside cards. Use whitespace, subtle dividers, and typography for hierarchy.
4. **No Low-Contrast Text**: No faint gray text on black, nor dark gray on medium gray surfaces.

---

## 2. Color System & Semantic Tokens

### Dark Theme (`:root` / default)
```css
:root {
  --bg: #09090b;              /* Deep warm-black slate */
  --surface: #121215;         /* Primary container surface */
  --surface-elevated: #18181c;/* Hover/elevated surface */
  --text-primary: #f5f5f7;    /* High-contrast off-white (WCAG AAA) */
  --text-secondary: #a1a1aa;  /* Readable muted zinc */
  --text-muted: #71717a;      /* Metadata & captions */
  --border: rgba(255, 255, 255, 0.08); /* 1px subtle divider */
  --border-strong: rgba(255, 255, 255, 0.16);
  --accent: #8b5cf6;          /* Restrained violet accent */
  --accent-hover: #7c3aed;
  --accent-surface: rgba(139, 92, 246, 0.1);
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
}
```

### Light Theme (`[data-theme="light"]`)
```css
[data-theme="light"] {
  --bg: #f8f9fa;              /* Off-white canvas */
  --surface: #ffffff;         /* Crisp white container */
  --surface-elevated: #f1f3f5;/* Elevated subtle contrast */
  --text-primary: #111827;    /* Deep near-black slate */
  --text-secondary: #4b5563;  /* High readability gray */
  --text-muted: #6b7280;      /* Captions & helper text */
  --border: rgba(0, 0, 0, 0.08);
  --border-strong: rgba(0, 0, 0, 0.16);
  --accent: #6d28d9;          /* Deep violet accent */
  --accent-hover: #5b21b6;
  --accent-surface: rgba(109, 40, 217, 0.08);
  --success: #059669;
  --warning: #d97706;
  --error: #dc2626;
}
```

---

## 3. Typography & Mathematical Hierarchy
- **Primary Body Font**: System UI stack (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, sans-serif`).
- **Monospace Font**: JetBrains Mono, Fira Code, Menlo, monospace for code snippets and verified data.
- **Reading Measure**: Constrain reading text (paragraphs, articles, legal clauses) to `65ch`–`78ch` to ensure optimal human reading comprehension.
- **Line Heights**: `1.6`–`1.75` for body text; `1.15`–`1.25` for display headings.

---

## 4. Layout Math & Fluid Containers
- **Main Viewport Container**:
  ```css
  .container {
    width: min(100% - 2rem, 1440px);
    margin-inline: auto;
  }
  ```
- **Fluid Padding**:
  - Desktop Section Padding: `clamp(4rem, 6vw, 7rem)`
  - Mobile Section Padding: `clamp(2rem, 4vw, 3.5rem)`
- **Border Radii Math**:
  - Outer Cards: `12px` to `16px`
  - Inner Elements: `Inner Radius = Outer Radius - Padding` (prevents awkward concentric distortion)
  - Badges / Action Pills: `9999px`

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
