import type { ThemeColors, ContrastResult } from "./types";
import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb, adjustLightness, mixColors } from "./color-math";
import { relativeLuminance, contrastRatio, checkContrast, ensureContrast } from "./contrast";

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

export function generateLightTheme(hex: string): ThemeColors {
  const background = "#ffffff";
  const surface = adjustLightness(hex, 0.97);
  const surfaceAlt = adjustLightness(hex, 0.93);

  let primary = hex;
  const primaryContrast = contrastRatio(primary, background);
  if (primaryContrast < 4.5) {
    primary = ensureContrast(primary, background, 4.5, "darken");
  }

  const primaryHsl = rgbToHsl(hexToRgb(primary));
  const primaryHover = rgbToHex(
    hslToRgb([primaryHsl[0], primaryHsl[1], Math.max(0, primaryHsl[2] - 0.08)])
  );

  const primaryLum = relativeLuminance(hexToRgb(primary));
  let primaryText = primaryLum > 0.179 ? "#000000" : "#ffffff";
  primaryText = ensureContrast(
    primaryText,
    primary,
    4.5,
    primaryLum > 0.179 ? "darken" : "lighten"
  );

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

  const border = adjustLightness(hex, 0.78);
  const borderLight = adjustLightness(hex, 0.88);

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

export function generateDarkTheme(hex: string): ThemeColors {
  const background = "#121212";
  const surface = mixColors(hex, "#1a1a1a", 0.08);
  const surfaceAlt = mixColors(hex, "#242424", 0.12);

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

  const border = mixColors(hex, "#333333", 0.15);
  const borderLight = mixColors(hex, "#222222", 0.1);

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

export function auditTheme(
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
