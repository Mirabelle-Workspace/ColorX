import type { ThemeColors, ThemeOutput } from "./types";
import { generateLightTheme, generateDarkTheme, auditTheme } from "./theme";
import { hexToRgb } from "./color-math";

function themeToCssVars(theme: ThemeColors, prefix: string): string {
  return Object.entries(theme)
    .map(([key, value]) => {
      const varName = key.replace(/([A-Z])/g, "-$1").toLowerCase();
      return `  --${prefix}-${varName}: ${value};`;
    })
    .join("\n");
}

export function generateTheme(hex: string): ThemeOutput {
  const clean = hex.startsWith("#") ? hex : `#${hex}`;
  hexToRgb(clean); // validate

  const light = generateLightTheme(clean);
  const dark = generateDarkTheme(clean);

  const css = `:root {
${themeToCssVars(light, "color")}
}

@media (prefers-color-scheme: dark) {
  :root {
${themeToCssVars(dark, "color")}
  }
}

[data-theme="light"] {
${themeToCssVars(light, "color")}
}

[data-theme="dark"] {
${themeToCssVars(dark, "color")}
}`;

  return {
    input: clean,
    light,
    dark,
    contrast: {
      light: auditTheme(light),
      dark: auditTheme(dark),
    },
    css,
  };
}

export { themeToCssVars };
