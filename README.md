# ColorX

Generate WCAG 2.1 and APCA-compliant light and dark themes from a single hex color.

**[colorx.dev](https://colorx.dev)**

## What It Does

Pick one color. Get 15 design tokens for light and dark modes with every contrast ratio checked against WCAG 2.1 and APCA. Colors that fail are automatically adjusted until they pass. Includes color vision deficiency simulation for deuteranopia, protanopia, tritanopia, and achromatopsia.

## Stack

| Layer | Technology |
|-------|------------|
| Core engine | TypeScript, zero dependencies |
| Web app | React 19, Vite 6, Tailwind CSS v4 |
| UI components | shadcn/ui (Base UI primitives) |
| Layout | Custom primitives (Container, Stack, Grid, Flex) |
| Animation | Motion (formerly Framer Motion) |
| Monorepo | pnpm workspaces |
| Testing | Vitest (42 tests) |
| Deployment | Vercel |

## Getting Started

```bash
pnpm install
pnpm dev          # http://localhost:5173
pnpm build        # Production build
pnpm --filter @colorx/core test
```

## Architecture

```
packages/core/     # Standalone TS library (@colorx/core)
apps/web/          # React SPA (@colorx/web)
```

The core engine is consumed by the web app via pnpm workspaces and can be used independently:

```typescript
import { generateTheme, checkAPCA, simulateThemeCVD } from "@colorx/core";

const theme = generateTheme("#6366f1");
```

## Lighthouse

| Page | Performance | Accessibility | Best Practices | SEO |
|------|-------------|---------------|----------------|-----|
| Landing | 98 | 96 | 100 | 100 |
| Generator | 98 | 95 | 100 | 100 |

## Roadmap

- **v1** -- React web app (current)
- **v2** -- Figma plugin: generate themes and sync tokens as Figma variables
- **v3** -- GitHub Action: validate design tokens against contrast thresholds in CI

## Author

**Mirabelle Doiron**
[Portfolio](https://www.mirabelledoiron.com/) | [GitHub](https://github.com/mirabelledoiron) | [LinkedIn](https://www.linkedin.com/in/mirabelledoiron)

## License

All rights reserved.
