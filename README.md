# ColorX

Generate WCAG-compliant light and dark themes from a single hex color.

**[colorx.dev](https://colorx.dev)**

## What it does

Feed ColorX one hex color and it produces a complete light and dark theme with:

- Primary, surface, text, border, and semantic colors (success, warning, error, info)
- Automatic contrast adjustment to meet WCAG 2.1 AA/AAA standards
- Ready-to-use CSS custom properties with `prefers-color-scheme` and `data-theme` support
- A full contrast audit for every color pair

## Stack

- TypeScript (core library)
- Vanilla HTML/CSS/JS (web UI)
- Zero runtime dependencies

## Usage

### Web

Open `generator.html` in a browser. Pick a color, get your theme and CSS variables instantly.

### CLI

```bash
npm install
npm run demo -- "#6366f1"
```

### As a library

```typescript
import { generateTheme } from "colorx";

const theme = generateTheme("#6366f1");

console.log(theme.light);   // light theme colors
console.log(theme.dark);    // dark theme colors
console.log(theme.css);     // CSS custom properties
console.log(theme.contrast); // WCAG contrast audit
```

### Build

```bash
npm run build
```

Outputs compiled JS and type declarations to `dist/`.

## How it works

1. Converts the input hex to HSL
2. Derives all theme colors by adjusting hue, saturation, and lightness
3. Iteratively adjusts each color until it meets the target WCAG contrast ratio against its background
4. Generates semantic colors (success, warning, error, info) with guaranteed contrast
5. Outputs everything as CSS custom properties

## Author

Mirabelle Doiron

- [Portfolio](https://www.mirabelledoiron.com/)
- [GitHub](https://github.com/mirabelledoiron)
- [LinkedIn](https://www.linkedin.com/in/mirabelledoiron)

## License

All rights reserved. This project is not licensed for reuse, modification, or distribution.
