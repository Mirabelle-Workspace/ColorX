# ColorX

Generate WCAG 2.1 and APCA-compliant light and dark themes from a single hex color. Built for design systems engineers who need accessible color tokens that work out of the box.

**[colorx.dev](https://colorx.dev)**

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
| Layout system | Custom primitives (Container, Stack, Grid, Flex) |
| Animation | Motion (formerly Framer Motion) |
| Icons | Lucide React, React Icons |
| Monorepo | pnpm workspaces |
| Testing | Vitest |
| Deployment | Vercel |

## Features

### Generator
- Pick a hex color via native color picker or text input
- Generates 15 design tokens for light and dark modes
- WCAG 2.1 contrast audit (AA, AAA, AA Large) for every color pair
- APCA Lc contrast values alongside WCAG ratios
- Color vision deficiency simulation (deuteranopia, protanopia, tritanopia, achromatopsia)
- Copy-paste CSS custom properties with `prefers-color-scheme` and `data-theme` support
- Click any swatch to copy its hex value

### Site-Wide Modes

Three toggles in the navbar, each with `aria-pressed` state:

**Dark Mode** -- toggles light/dark theme for the site itself (independent of generated themes). Respects `prefers-color-scheme` system preference on first visit.

**A11y Mode** -- an accessibility enhancement layer that goes beyond baseline WCAG compliance:

| Feature | How |
|---------|-----|
| Enhanced contrast | Overrides CSS custom properties to true black/white foregrounds |
| Larger text | Bumps root font-size to 112.5% (18px base) |
| No motion | CSS kills native transitions; Motion disabled via `MotionConfig reducedMotion="always"` |
| Stronger focus rings | 3px solid outline with 4px offset on `:focus-visible` |
| Visible links | Underlines all links so they are not identified by color alone |

**Low Carbon Mode** -- sustainability-focused mode that strips the page down to content only:

| Feature | How |
|---------|-----|
| No images | `LowCarbonImage` component renders dashed-border alt-text placeholder instead of loading images |
| System fonts | CSS override to `system-ui` stack, eliminating web font downloads |
| No motion | CSS kills transitions; Motion disabled via `MotionConfig reducedMotion="always"` |
| No decorative effects | CSS strips `box-shadow`, `text-shadow`, `backdrop-filter` |
| Simplified cards | Card backgrounds set to transparent with border-only styling |

Both modes can be active simultaneously. The CSS rules and React logic compose cleanly.

**How preferences work:**
- `useSyncExternalStore` hook manages state outside React so CSS classes apply before first paint
- Toggling flips `.dark`, `.a11y`, or `.low-carbon` class on `<html>`
- All preferences persist to `localStorage`
- Motion animations disabled at the app level via `MotionConfig` wrapper in `App.tsx`

### Animation

Motion (formerly Framer Motion) powers all animations, integrated with both Tailwind CSS and shadcn/ui (Radix):

- **Scroll-triggered entrance** -- sections fade and slide in with spring physics on viewport entry
- **Demo preview** -- color swatches spring-scale with stagger, background morphs between light/dark, all colors animate between palettes
- **Card hover** -- spring lift (`y: -4`) on feature and step cards
- **Swatch interaction** -- spring scale on hover/tap
- **Tab transitions** -- `AnimatePresence` with spring slide between light/dark theme panels
- **Step numbers** -- scale + rotate on hover
- **Tailwind spring easings** -- `ease-spring-snappy`, `ease-spring`, `ease-spring-soft` available as CSS utility classes via `@theme`

All animations respect user preferences: disabled when a11y mode, low carbon mode, or `prefers-reduced-motion: reduce` is active.

### Accessibility (Baseline)

Built into the site regardless of a11y mode:

- Skip-to-content link
- WAI-ARIA Tabs with keyboard navigation (arrow keys, Home, End)
- Screen reader announcements via `aria-live` regions for theme generation and clipboard events
- Focus management on route transitions
- `prefers-reduced-motion` media query support
- Semantic HTML: `<table>` with `<caption>`, `<fieldset>`/`<legend>`, `<nav>`, `<section>`, `<article>`, `<ol>`/`<ul>`
- All interactive swatches are `<button>` elements with descriptive `aria-label`

## Project Structure

```
colorx/
  packages/
    core/                # Standalone TS library (@colorx/core)
      src/
        types.ts         # ThemeColors, ContrastResult, ThemeOutput, APCAResult, CVDType
        color-math.ts    # Color conversion: hex, RGB, HSL
        contrast.ts      # WCAG 2.1 contrast ratio + enforcement
        apca.ts          # APCA Lc contrast algorithm (WCAG 3.0 draft)
        cvd.ts           # Color vision deficiency simulation (Brettel/Vienot matrices)
        theme.ts         # Light/dark theme generation + audit
        css.ts           # CSS custom properties output
        index.ts         # Barrel export
      tests/             # 42 tests across 5 suites
  apps/
    web/                 # React SPA (@colorx/web)
      src/
        components/
          ui/            # shadcn/ui (Button, Card, Badge, Tabs, Table, Separator)
          layout/        # RootLayout, Nav, Footer, SkipLink
            primitives/  # Container, Stack, Grid, Flex
          color-input/   # ColorPicker, ColorForm
          theme-display/ # ThemeTabs, SwatchGrid, Swatch, UIPreview
          contrast/      # ContrastAudit, ContrastBadge, APCABadge
          cvd/           # CVDSimulation, CVDPreview
          output/        # CSSOutput, CopyButton
          landing/       # Hero, DemoPreview, HowItWorks, Features, WCAGExplainer, TokenReference, CTABottom
          common/        # AnimateIn, LowCarbonImage, VisuallyHidden
        hooks/
          usePreferences.ts     # Dark/a11y/low-carbon state (useSyncExternalStore)
          useTheme.ts           # ThemeContext consumer
          useAPCA.ts            # APCA audit for theme pairs
          useCVD.ts             # CVD simulation for themes
          useCopyToClipboard.ts # Clipboard API + SR announcement
          useReducedMotion.ts   # prefers-reduced-motion
          useAnnounce.ts        # aria-live announcements
        context/
          ThemeContext.tsx       # Hex input + generated ThemeOutput
          AnnounceContext.tsx    # Screen reader announcement provider
        pages/
          LandingPage.tsx
          GeneratorPage.tsx
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

## Lighthouse Scores

| Page | Performance | Accessibility | Best Practices | SEO |
|------|-------------|---------------|----------------|-----|
| Landing | 98 | 96 | 100 | 100 |
| Generator | 98 | 95 | 100 | 100 |

## SEO

### Checklist

| Item | Status |
|------|--------|
| `<title>` with project name + author | Done |
| `<meta name="description">` unique per page, under 160 chars | Done |
| `<link rel="canonical">` | Done |
| `<meta name="robots" content="index, follow">` | Done |
| Open Graph tags (og:title, og:description, og:image, og:url) | Done |
| Twitter Card tags (twitter:card, twitter:title, twitter:description, twitter:image) | Done |
| OG image (1200x630) | Done |
| `<html lang="en">` | Done |
| Favicon (SVG) | Done |
| `robots.txt` with sitemap reference | Done |
| `sitemap.xml` with all public URLs and dates | Done |
| Structured data (JSON-LD `@type: WebApplication`) | Done |
| `<meta name="author">` | Done |
| Web manifest (`site.webmanifest`) | Done |
| Preloaded critical font | Done |
| Semantic HTML (`<main>`, `<nav>`, `<section>`, `<article>`, `<ol>`, `<ul>`) | Done |
| All images have alt text | Done (LowCarbonImage enforces alt) |
| Page loads under 3s on 3G | Done (Performance 98) |

### Files

- `apps/web/index.html` -- meta tags, Open Graph, Twitter Card, JSON-LD structured data, font preload
- `apps/web/public/robots.txt` -- crawl rules + sitemap reference
- `apps/web/public/sitemap.xml` -- all public URLs with lastmod dates
- `apps/web/public/site.webmanifest` -- PWA manifest
- `apps/web/public/favicon.svg` -- vector favicon
- `apps/web/src/hooks/useDocumentTitle.ts` -- per-page title updates

---

## Roadmap

### v1 -- React Web App (current)

- React 19 + TypeScript + Vite 6 + Tailwind CSS v4
- shadcn/ui component library + custom layout primitives
- Motion scroll and interaction animations with spring physics
- WCAG 2.1 AA/AAA contrast audit + APCA Lc values
- Color vision deficiency simulation (4 types)
- Dark mode, A11y mode, Low Carbon mode
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
