# ColorX

Generate WCAG 2.1 and APCA-compliant light and dark themes from a single hex color. Built for design systems engineers who need accessible color tokens that work out of the box.

## What It Does

Pick one color. ColorX derives 15 design tokens for both light and dark modes -- backgrounds, surfaces, primary, text hierarchy, borders, and semantic colors -- then checks every foreground/background pair against:

- **WCAG 2.1** contrast ratios (AA, AAA, AA Large)
- **APCA** (Accessible Perceptual Contrast Algorithm) Lc values, the emerging standard in the WCAG 3.0 draft

Colors that fail are automatically adjusted along their lightness axis until they pass.

### Color Vision Deficiency Simulation

Preview how your generated themes appear to people with:
- **Deuteranopia** -- red-green (M-cone), ~6% of males
- **Protanopia** -- red-green (L-cone), ~2% of males
- **Tritanopia** -- blue-yellow (S-cone), rare
- **Achromatopsia** -- total color blindness

Side-by-side comparison of original vs simulated themes for each deficiency type.

## Stack

| Layer | Technology |
|-------|------------|
| Core engine | TypeScript, zero dependencies |
| Web app | React 19, Vite 6, Tailwind CSS v4 |
| UI components | shadcn/ui (Radix primitives) |
| Animation | Motion (formerly Framer Motion) |
| Icons | Lucide React, React Icons |
| Monorepo | pnpm workspaces |
| Testing | Vitest |
| Deployment | Vercel |

## Project Structure

```
colorx/
  packages/
    core/          # Standalone TS library (@colorx/core)
      src/
        types.ts         # ThemeColors, ContrastResult, ThemeOutput, APCAResult, CVDType
        color-math.ts    # Color conversion: hex, RGB, HSL
        contrast.ts      # WCAG 2.1 contrast ratio + enforcement
        apca.ts          # APCA Lc contrast algorithm
        cvd.ts           # Color vision deficiency simulation
        theme.ts         # Light/dark theme generation + audit
        css.ts           # CSS custom properties output
        index.ts         # Barrel export
      tests/
  apps/
    web/           # React SPA (@colorx/web)
      src/
        components/
          layout/        # RootLayout, Nav, Footer, SkipLink
          color-input/   # ColorPicker, ColorForm
          theme-display/ # ThemeTabs, SwatchGrid, UIPreview
          contrast/      # ContrastAudit (WCAG + APCA)
          cvd/           # CVDSimulation, CVDPreview
          output/        # CSSOutput, CopyButton
          landing/       # Hero, HowItWorks, Features
        hooks/           # useTheme, useAPCA, useCVD, useCopyToClipboard, useReducedMotion
        context/         # ThemeContext, AnnounceContext
        pages/           # LandingPage, GeneratorPage
```

## Getting Started

```bash
# Install dependencies
pnpm install

# Run the dev server
pnpm dev
# -> http://localhost:5173

# Run core library tests
pnpm --filter @colorx/core test

# Build everything
pnpm build
```

## Using @colorx/core Standalone

The core engine has zero dependencies and can be used independently:

```typescript
import { generateTheme, checkAPCA, simulateThemeCVD } from "@colorx/core";

// Generate full light + dark theme from a hex color
const output = generateTheme("#6366f1");

console.log(output.light.primary);   // Contrast-safe primary for light mode
console.log(output.dark.primary);    // Contrast-safe primary for dark mode
console.log(output.css);             // Ready-to-use CSS custom properties

// Check APCA contrast for a specific pair
const apca = checkAPCA("#1a1a1a", "#ffffff");
console.log(apca.Lc);     // ~107 (high contrast)
console.log(apca.level);  // "body" (passes for body text)

// Simulate color vision deficiency
const simulated = simulateThemeCVD(output.light, "deuteranopia");
```

## Generated Tokens

| Token | Purpose |
|-------|---------|
| `background` | Page-level background |
| `surface` | Cards, modals, dropdowns |
| `surfaceAlt` | Alternate surface for visual separation |
| `primary` | Brand color, contrast-adjusted |
| `primaryHover` | Hover/focus state variant |
| `primaryText` | Text on primary background |
| `text` | Body text (AAA, 7:1) |
| `textSecondary` | Descriptions (AA, 4.5:1) |
| `textMuted` | Timestamps, captions (AA Large, 3:1) |
| `border` | Default borders and dividers |
| `borderLight` | Subtle borders |
| `success` | Positive/confirmation states |
| `warning` | Caution/alert states |
| `error` | Destructive/error states |
| `info` | Informational highlights |

## Accessibility

The tool itself is built with accessibility as a first-class concern:

- **Skip link** to jump past navigation
- **WAI-ARIA Tabs** with keyboard navigation (arrow keys, Home, End) for theme modes and CVD types
- **Screen reader announcements** via `aria-live` regions for theme generation and clipboard events
- **Focus management** on route transitions
- **Reduced motion** support via `prefers-reduced-motion` media query
- **Semantic HTML** throughout: `<table>` with `<caption>` for audit data, `<fieldset>`/`<legend>` for forms
- All interactive swatches are `<button>` elements with descriptive `aria-label`

---

## Roadmap

### v1 -- React Web App (current)

- React + TypeScript + Vite + Tailwind CSS v4
- WCAG 2.1 AA/AAA contrast audit
- APCA (WCAG 3.0 draft) contrast alongside WCAG 2.1
- Color vision deficiency simulation (4 types)
- Fully accessible: keyboard navigation, screen reader support, reduced motion
- 15 design tokens per theme, ready-to-use CSS variables

### v2 -- Figma Plugin

Turn ColorX into a Figma plugin so designers can generate and audit themes without leaving their design tool.

**Steps:**
1. Scaffold Figma plugin project with the Plugin API and a React-based UI
2. Embed `@colorx/core` as the generation engine
3. Generate themes and inject them directly into Figma as local styles or variables
4. Add a contrast audit panel that flags failing color pairs in the current Figma file
5. Support syncing generated tokens as Figma variables (color, number) for design token workflows
6. Publish to the Figma Community

### v3 -- GitHub Action

A CI/CD step that validates design tokens against contrast thresholds on every pull request.

**Steps:**
1. Create a GitHub Action that accepts a JSON or CSS file of design token color pairs
2. Validate each pair against configurable WCAG 2.1 and APCA thresholds
3. Fail the CI check if any pair drops below the configured minimums
4. Output a contrast report as a PR comment with pass/fail badges for each pair
5. Support configuration via a `.colorxrc.json` file in the repository root
6. Publish to the GitHub Actions Marketplace

---

## Author

**Mirabelle Doiron**
[Portfolio](https://www.mirabelledoiron.com/) | [GitHub](https://github.com/mirabelledoiron) | [LinkedIn](https://www.linkedin.com/in/mirabelledoiron)

## License

All rights reserved.
