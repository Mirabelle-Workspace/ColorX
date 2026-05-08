import type {
  ThemeColors,
  ContrastResult,
  LightVariant,
  LightVariantId,
  HSL,
} from "./types";
import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  mixColors,
} from "./color-math";
import {
  contrastRatio,
  ensureContrast,
  relativeLuminance,
  checkContrast,
} from "./contrast";

interface VariantSpec {
  id: LightVariantId;
  name: string;
  description: string;
  background: string;
  surfaceMix: { other: string; weight: number };
  surfaceAltMix: { other: string; weight: number };
  primaryTargetL: number;
  primarySatFactor: number;
  textSeed: string;
  semanticTargetL: number;
  semanticSatFactor: number;
}

const SPECS: ReadonlyArray<VariantSpec> = [
  {
    id: "standard",
    name: "Standard",
    description:
      "Pure white canvas with soft surfaces tinted by your primary. Default app look.",
    background: "#ffffff",
    surfaceMix: { other: "#f5f5f7", weight: 0.06 },
    surfaceAltMix: { other: "#ebebef", weight: 0.1 },
    primaryTargetL: 0.45,
    primarySatFactor: 1,
    textSeed: "#1a1a1a",
    semanticTargetL: 0.4,
    semanticSatFactor: 0.95,
  },
  {
    id: "soft",
    name: "Soft",
    description:
      "Slightly off-white background with calmer surfaces. Easier on the eyes than pure white.",
    background: "#fafafa",
    surfaceMix: { other: "#f0f0f2", weight: 0.06 },
    surfaceAltMix: { other: "#e6e6ea", weight: 0.1 },
    primaryTargetL: 0.42,
    primarySatFactor: 0.9,
    textSeed: "#222222",
    semanticTargetL: 0.4,
    semanticSatFactor: 0.85,
  },
  {
    id: "warm",
    name: "Warm",
    description:
      "Cream background with warm-tinted surfaces. Friendlier feel for content-heavy UIs.",
    background: "#faf8f5",
    surfaceMix: { other: "#f3f0ea", weight: 0.06 },
    surfaceAltMix: { other: "#ebe7df", weight: 0.1 },
    primaryTargetL: 0.45,
    primarySatFactor: 1,
    textSeed: "#1f1c18",
    semanticTargetL: 0.4,
    semanticSatFactor: 0.9,
  },
];

function shiftToTargetLightness(
  hex: string,
  targetL: number,
  satFactor: number
): string {
  const [h, s, _l] = rgbToHsl(hexToRgb(hex));
  const newSat = Math.max(0, Math.min(1, s * satFactor));
  const hsl: HSL = [h, newSat, Math.max(0, Math.min(1, targetL))];
  return rgbToHex(hslToRgb(hsl));
}

function deriveVariant(dark: ThemeColors, spec: VariantSpec): ThemeColors {
  const background = spec.background;
  const surface = mixColors(dark.primary, spec.surfaceMix.other, spec.surfaceMix.weight);
  const surfaceAlt = mixColors(
    dark.primary,
    spec.surfaceAltMix.other,
    spec.surfaceAltMix.weight
  );

  let primary = shiftToTargetLightness(
    dark.primary,
    spec.primaryTargetL,
    spec.primarySatFactor
  );
  if (contrastRatio(primary, background) < 4.5) {
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

  const text = ensureContrast(spec.textSeed, background, 7, "darken");
  const textSecondary = ensureContrast(
    mixColors(dark.primary, "#333333", 0.2),
    background,
    4.5,
    "darken"
  );
  const textMutedSeed = shiftToTargetLightness(dark.primary, 0.45, 1);
  const textMuted = ensureContrast(textMutedSeed, background, 3, "darken");

  const border = mixColors(dark.primary, "#cccccc", 0.15);
  const borderLight = mixColors(dark.primary, "#e4e4e7", 0.1);

  const success = ensureContrast(
    shiftToTargetLightness(dark.success, spec.semanticTargetL, spec.semanticSatFactor),
    background,
    3,
    "darken"
  );
  const warning = ensureContrast(
    shiftToTargetLightness(dark.warning, spec.semanticTargetL, spec.semanticSatFactor),
    background,
    3,
    "darken"
  );
  const error = ensureContrast(
    shiftToTargetLightness(dark.error, spec.semanticTargetL, spec.semanticSatFactor),
    background,
    3,
    "darken"
  );
  const info = ensureContrast(
    shiftToTargetLightness(dark.info, spec.semanticTargetL, spec.semanticSatFactor),
    background,
    3,
    "darken"
  );

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

function auditVariant(theme: ThemeColors): Record<string, ContrastResult> {
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

export function generateLightVariants(dark: ThemeColors): LightVariant[] {
  return SPECS.map((spec) => {
    const colors = deriveVariant(dark, spec);
    return {
      id: spec.id,
      name: spec.name,
      description: spec.description,
      colors,
      contrast: auditVariant(colors),
    };
  });
}

export function lightVariantToCss(variant: LightVariant): string {
  const entries = Object.entries(variant.colors)
    .map(([key, value]) => {
      const varName = key.replace(/([A-Z])/g, "-$1").toLowerCase();
      return `  --color-${varName}: ${value};`;
    })
    .join("\n");
  return `[data-theme="light"][data-variant="${variant.id}"] {\n${entries}\n}`;
}
