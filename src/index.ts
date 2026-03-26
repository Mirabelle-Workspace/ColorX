// ============================================================
// Theme Generator
// Generate WCAG-compliant light & dark themes from a single hex color
// ============================================================

// --- Types ---

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceAlt: string;
  primary: string;
  primaryHover: string;
  primaryText: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderLight: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface ContrastResult {
  ratio: number;
  aa: boolean;
  aaLarge: boolean;
  aaa: boolean;
  aaaLarge: boolean;
}

export interface ThemeOutput {
  input: string;
  light: ThemeColors;
  dark: ThemeColors;
  contrast: {
    light: Record<string, ContrastResult>;
    dark: Record<string, ContrastResult>;
  };
  css: string;
}

// --- Color Math ---

type RGB = [number, number, number];
type HSL = [number, number, number];

function hexToRgb(hex: string): RGB {
  const clean = hex.replace(/^#/, "");
  if (clean.length !== 6 && clean.length !== 3) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

function rgbToHex([r, g, b]: RGB): string {
  return (
    "#" +
    [r, g, b]
      .map((v) => {
        const clamped = Math.max(0, Math.min(255, Math.round(v)));
        return clamped.toString(16).padStart(2, "0");
      })
      .join("")
  );
}

function rgbToHsl([r, g, b]: RGB): HSL {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
  else if (max === gn) h = ((bn - rn) / d + 2) / 6;
  else h = ((rn - gn) / d + 4) / 6;
  return [h * 360, s, l];
}

function hslToRgb([h, s, l]: HSL): RGB {
  const hNorm = ((h % 360) + 360) % 360;
  if (s === 0) {
    const v = Math.round(l * 255);
    return [v, v, v];
  }
  const hue2rgb = (p: number, q: number, t: number) => {
    let tn = t;
    if (tn < 0) tn += 1;
    if (tn > 1) tn -= 1;
    if (tn < 1 / 6) return p + (q - p) * 6 * tn;
    if (tn < 1 / 2) return q;
    if (tn < 2 / 3) return p + (q - p) * (2 / 3 - tn) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hN = hNorm / 360;
  return [
    Math.round(hue2rgb(p, q, hN + 1 / 3) * 255),
    Math.round(hue2rgb(p, q, hN) * 255),
    Math.round(hue2rgb(p, q, hN - 1 / 3) * 255),
  ];
}

// --- WCAG Contrast ---

function relativeLuminance([r, g, b]: RGB): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const srgb = c / 255;
    return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(color1: string, color2: string): number {
  const l1 = relativeLuminance(hexToRgb(color1));
  const l2 = relativeLuminance(hexToRgb(color2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function checkContrast(foreground: string, background: string): ContrastResult {
  const ratio = contrastRatio(foreground, background);
  return {
    ratio: Math.round(ratio * 100) / 100,
    aa: ratio >= 4.5,
    aaLarge: ratio >= 3,
    aaa: ratio >= 7,
    aaaLarge: ratio >= 4.5,
  };
}

// --- Color Manipulation ---

function adjustLightness(hex: string, targetL: number): string {
  const hsl = rgbToHsl(hexToRgb(hex));
  return rgbToHex(hslToRgb([hsl[0], hsl[1], Math.max(0, Math.min(1, targetL))]));
}

function mixColors(hex1: string, hex2: string, weight: number): string {
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);
  const w = Math.max(0, Math.min(1, weight));
  return rgbToHex([
    r1 * w + r2 * (1 - w),
    g1 * w + g2 * (1 - w),
    b1 * w + b2 * (1 - w),
  ]);
}

function ensureContrast(
  fg: string,
  bg: string,
  minRatio: number,
  mode: "lighten" | "darken"
): string {
  let current = fg;
  const hsl = rgbToHsl(hexToRgb(current));
  let l = hsl[1] === 0 ? hsl[2] : hsl[2];
  const step = mode === "lighten" ? 0.02 : -0.02;

  for (let i = 0; i < 60; i++) {
    if (contrastRatio(current, bg) >= minRatio) return current;
    l = Math.max(0, Math.min(1, l + step));
    current = rgbToHex(hslToRgb([hsl[0], hsl[1], l]));
  }
  return current;
}

// --- Semantic Color Generation ---

function generateSemanticColor(
  hue: number,
  saturation: number,
  lightness: number,
  bg: string,
  mode: "light" | "dark"
): string {
  const base = rgbToHex(hslToRgb([hue, saturation, lightness]));
  return ensureContrast(base, bg, 3, mode === "light" ? "darken" : "lighten");
}

// --- Theme Generation ---

function generateLightTheme(hex: string): ThemeColors {
  const [h, s] = rgbToHsl(hexToRgb(hex));

  const background = "#ffffff";
  const surface = adjustLightness(hex, 0.97);
  const surfaceAlt = adjustLightness(hex, 0.93);

  // Primary: ensure it passes AA against white background
  let primary = hex;
  const primaryContrast = contrastRatio(primary, background);
  if (primaryContrast < 4.5) {
    primary = ensureContrast(primary, background, 4.5, "darken");
  }

  const primaryHsl = rgbToHsl(hexToRgb(primary));
  const primaryHover = rgbToHex(
    hslToRgb([primaryHsl[0], primaryHsl[1], Math.max(0, primaryHsl[2] - 0.08)])
  );

  // Text on primary button
  const primaryLum = relativeLuminance(hexToRgb(primary));
  let primaryText = primaryLum > 0.179 ? "#000000" : "#ffffff";
  primaryText = ensureContrast(
    primaryText,
    primary,
    4.5,
    primaryLum > 0.179 ? "darken" : "lighten"
  );

  // Text colors
  const text = ensureContrast("#1a1a1a", background, 7, "darken");
  const textSecondary = ensureContrast(
    mixColors(hex, "#333333", 0.2),
    background,
    4.5,
    "darken"
  );
  const textMuted = ensureContrast(
    adjustLightness(hex, 0.4),
    background,
    3,
    "darken"
  );

  // Borders
  const border = adjustLightness(hex, 0.78);
  const borderLight = adjustLightness(hex, 0.88);

  // Semantic colors -- contrast-safe
  const success = generateSemanticColor(145, 0.65, 0.35, background, "light");
  const warning = generateSemanticColor(38, 0.85, 0.45, background, "light");
  const error = generateSemanticColor(0, 0.7, 0.45, background, "light");
  const info = generateSemanticColor(210, 0.7, 0.45, background, "light");

  return {
    background,
    surface,
    surfaceAlt,
    primary,
    primaryHover,
    primaryText,
    text,
    textSecondary,
    textMuted,
    border,
    borderLight,
    success,
    warning,
    error,
    info,
  };
}

function generateDarkTheme(hex: string): ThemeColors {
  const [h, s] = rgbToHsl(hexToRgb(hex));

  const background = "#121212";
  const surface = mixColors(hex, "#1a1a1a", 0.08);
  const surfaceAlt = mixColors(hex, "#242424", 0.12);

  // Primary: lighten for dark backgrounds, must pass AA
  let primary = adjustLightness(hex, 0.6);
  if (contrastRatio(primary, background) < 4.5) {
    primary = ensureContrast(primary, background, 4.5, "lighten");
  }

  const primaryHsl = rgbToHsl(hexToRgb(primary));
  const primaryHover = rgbToHex(
    hslToRgb([primaryHsl[0], primaryHsl[1], Math.min(1, primaryHsl[2] + 0.08)])
  );

  const primaryLum = relativeLuminance(hexToRgb(primary));
  let primaryText = primaryLum > 0.179 ? "#000000" : "#ffffff";
  primaryText = ensureContrast(
    primaryText,
    primary,
    4.5,
    primaryLum > 0.179 ? "darken" : "lighten"
  );

  // Text colors
  const text = ensureContrast("#e8e8e8", background, 7, "lighten");
  const textSecondary = ensureContrast(
    mixColors(hex, "#bbbbbb", 0.2),
    background,
    4.5,
    "lighten"
  );
  const textMuted = ensureContrast(
    adjustLightness(hex, 0.55),
    background,
    3,
    "lighten"
  );

  // Borders
  const border = mixColors(hex, "#333333", 0.15);
  const borderLight = mixColors(hex, "#222222", 0.1);

  // Semantic colors
  const success = generateSemanticColor(145, 0.55, 0.55, background, "dark");
  const warning = generateSemanticColor(38, 0.75, 0.6, background, "dark");
  const error = generateSemanticColor(0, 0.6, 0.6, background, "dark");
  const info = generateSemanticColor(210, 0.6, 0.6, background, "dark");

  return {
    background,
    surface,
    surfaceAlt,
    primary,
    primaryHover,
    primaryText,
    text,
    textSecondary,
    textMuted,
    border,
    borderLight,
    success,
    warning,
    error,
    info,
  };
}

// --- Contrast Audit ---

function auditTheme(
  theme: ThemeColors
): Record<string, ContrastResult> {
  return {
    "text / background": checkContrast(theme.text, theme.background),
    "textSecondary / background": checkContrast(theme.textSecondary, theme.background),
    "textMuted / background": checkContrast(theme.textMuted, theme.background),
    "primary / background": checkContrast(theme.primary, theme.background),
    "primaryText / primary": checkContrast(theme.primaryText, theme.primary),
    "text / surface": checkContrast(theme.text, theme.surface),
    "text / surfaceAlt": checkContrast(theme.text, theme.surfaceAlt),
    "success / background": checkContrast(theme.success, theme.background),
    "warning / background": checkContrast(theme.warning, theme.background),
    "error / background": checkContrast(theme.error, theme.background),
    "info / background": checkContrast(theme.info, theme.background),
  };
}

// --- CSS Output ---

function themeToCssVars(theme: ThemeColors, prefix: string): string {
  return Object.entries(theme)
    .map(([key, value]) => {
      const varName = key.replace(/([A-Z])/g, "-$1").toLowerCase();
      return `  --${prefix}-${varName}: ${value};`;
    })
    .join("\n");
}

// --- Main Export ---

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

// Utility exports
export { hexToRgb, rgbToHex, rgbToHsl, hslToRgb };
export { contrastRatio, checkContrast };
export { adjustLightness, mixColors, ensureContrast };
