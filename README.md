# ColorX

ColorX generates accessible light and dark themes from a single hex color.

It produces a set of design tokens, checks contrast against WCAG 2.1 and APCA, and outputs ready-to-use CSS custom properties.

**Live site:** colorx.dev

## Why I Built This

I built ColorX to explore the intersection of accessibility, design systems, and frontend engineering.

A lot of theme generation tools stop at palette creation. I wanted to build a workflow that starts with a single brand color and produces a usable light and dark token set with contrast validation built in.

## What It Does

Given one hex color, ColorX:

- generates light and dark theme tokens
- checks contrast pairs against WCAG 2.1 and APCA
- adjusts failing values to meet target thresholds
- outputs CSS custom properties for implementation
- previews color vision deficiency scenarios
- supports importing theme sources from files, Figma-related input, and PDF extraction flows

## Stack

| Layer | Technology |
|-------|------------|
| Core engine | TypeScript |
| Web app | React 19, Vite 6 |
| Styling | Tailwind CSS v4 |
| UI components | shadcn/ui and Base UI primitives |
| Motion | Motion |
| Monorepo | pnpm workspaces |
| Testing | Vitest |
| Deployment | Vercel |

## Architecture

```text
packages/core/   # standalone TypeScript library
apps/web/        # React application
```

The theme generation logic lives in `packages/core` and is consumed by the React app in `apps/web`.

This separation makes it easier to test the core logic independently from the UI.

## Example

```ts
import { generateTheme, checkAPCA, simulateThemeCVD } from "@colorx/core";

const theme = generateTheme("#6366f1");
```

## Engineering Focus

This project gave me room to work through:

- token generation and theme structure
- accessibility constraints in UI systems
- TypeScript-first library design
- separation between product UI and core logic
- reusable layout and component patterns
- test coverage for contrast and theme behavior

## Current Features

- accessible light and dark theme generation
- WCAG 2.1 and APCA contrast checks
- CSS custom property export
- color vision deficiency simulation
- upload and conversion flows for existing theme inputs

## Accessibility Considerations

ColorX is built around contrast validation rather than palette generation alone. The goal is to help produce theme tokens that are easier to use in accessible interfaces across light and dark modes.

## Limitations

- Theme quality still depends on the input color and token coverage
- Some imported sources may require manual cleanup
- Contrast compliance does not replace full UI accessibility review

## Lighthouse

| Page | Performance | Accessibility | Best Practices | SEO |
|------|-------------|---------------|----------------|-----|
| Landing | 98 | 96 | 100 | 100 |
| Generator | 98 | 95 | 100 | 100 |

## Roadmap

- v1: React web app
- v2: Figma plugin for generating themes and syncing variables
- v3: GitHub Action for validating design tokens in CI

## Author

**Mirabelle Doiron**  
Portfolio: mirabelledoiron.com  
GitHub: mirabelledoiron  
LinkedIn: mirabelledoiron

## License

All rights reserved.