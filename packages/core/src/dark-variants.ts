import type {
  ThemeColors,
  ContrastResult,
  DarkVariant,
  DarkVariantId,
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
  id: DarkVariantId;
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
      "Soft dark surfaces on a near-black canvas. Conservative, app-friendly.",
    background: "#121212",
    surfaceMix: { other: "#1a1a1a", weight: 0.08 },
    surfaceAltMix: { other: "#242424", weight: 0.12 },
    primaryTargetL: 0.62,
    primarySatFactor: 1,
    textSeed: "#e8e8e8",
    semanticTargetL: 0.6,
    semanticSatFactor: 0.85,
  },
  {
    id: "true-dark",
    name: "True Dark",
    description:
      "Pure black background. Maximum contrast and OLED energy savings.",
    background: "#000000",
    surfaceMix: { other: "#0a0a0a", weight: 0.05 },
    surfaceAltMix: { other: "#161616", weight: 0.1 },
    primaryTargetL: 0.7,
    primarySatFactor: 1,
    textSeed: "#f0f0f0",
    semanticTargetL: 0.65,
    semanticSatFactor: 0.9,
  },
  {
    id: "dim",
    name: "Dim",
    description:
      "Slightly lifted, muted background. Easier on the eyes for long sessions.",
    background: "#1a1a22",
    surfaceMix: { other: "#232330", weight: 0.08 },
    surfaceAltMix: { other: "#2a2a38", weight: 0.12 },
    primaryTargetL: 0.6,
    primarySatFactor: 0.85,
    textSeed: "#dcdcdc",
    semanticTargetL: 0.6,
    semanticSatFactor: 0.75,
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

function deriveVariant(light: ThemeColors, spec: VariantSpec): ThemeColors {
  const background = spec.background;
  const surface = mixColors(light.primary, spec.surfaceMix.other, spec.surfaceMix.weight);
  const surfaceAlt = mixColors(
    light.primary,
    spec.surfaceAltMix.other,
    spec.surfaceAltMix.weight
  );

  let primary = shiftToTargetLightness(
    light.primary,
    spec.primaryTargetL,
    spec.primarySatFactor
  );
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

  const text = ensureContrast(spec.textSeed, background, 7, "lighten");
  const textSecondary = ensureContrast(
    mixColors(light.primary, "#bbbbbb", 0.2),
    background,
    4.5,
    "lighten"
  );
  const textMutedSeed = shiftToTargetLightness(light.primary, 0.55, 1);
  const textMuted = ensureContrast(textMutedSeed, background, 3, "lighten");

  const border = mixColors(light.primary, "#333333", 0.15);
  const borderLight = mixColors(light.primary, "#222222", 0.1);

  const success = ensureContrast(
    shiftToTargetLightness(light.success, spec.semanticTargetL, spec.semanticSatFactor),
    background,
    3,
    "lighten"
  );
  const warning = ensureContrast(
    shiftToTargetLightness(light.warning, spec.semanticTargetL, spec.semanticSatFactor),
    background,
    3,
    "lighten"
  );
  const error = ensureContrast(
    shiftToTargetLightness(light.error, spec.semanticTargetL, spec.semanticSatFactor),
    background,
    3,
    "lighten"
  );
  const info = ensureContrast(
    shiftToTargetLightness(light.info, spec.semanticTargetL, spec.semanticSatFactor),
    background,
    3,
    "lighten"
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

export function generateDarkVariants(light: ThemeColors): DarkVariant[] {
  return SPECS.map((spec) => {
    const colors = deriveVariant(light, spec);
    return {
      id: spec.id,
      name: spec.name,
      description: spec.description,
      colors,
      contrast: auditVariant(colors),
    };
  });
}

export function variantToCss(variant: DarkVariant): string {
  const entries = Object.entries(variant.colors)
    .map(([key, value]) => {
      const varName = key.replace(/([A-Z])/g, "-$1").toLowerCase();
      return `  --color-${varName}: ${value};`;
    })
    .join("\n");
  return `[data-theme="dark"][data-variant="${variant.id}"] {\n${entries}\n}`;
}
