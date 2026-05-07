import type {
  ThemeColors,
  ExtractedToken,
  BuildResult,
  BuildRecommendation,
} from "./types";
import { generateLightTheme } from "./theme";
import { hexToRgb, rgbToHsl } from "./color-math";
import { relativeLuminance } from "./contrast";

const REQUIRED_KEYS: ReadonlyArray<keyof ThemeColors> = [
  "background",
  "surface",
  "surfaceAlt",
  "primary",
  "primaryHover",
  "primaryText",
  "text",
  "textSecondary",
  "textMuted",
  "border",
  "borderLight",
  "success",
  "warning",
  "error",
  "info",
];

// Map flexible token names to canonical ColorX slots.
// Each entry lists name patterns (lowercased, with -/_/. removed) that
// should map to that slot. First match wins, so order matters.
const NAME_RULES: ReadonlyArray<{ slot: keyof ThemeColors; patterns: string[] }> = [
  { slot: "background", patterns: ["colorbackground", "background", "bg", "base", "canvas", "page", "body"] },
  { slot: "surface", patterns: ["colorsurface", "surface", "card", "panel", "muted", "surface1"] },
  { slot: "surfaceAlt", patterns: ["colorsurfacealt", "surfacealt", "surfacealternate", "surface2", "subtle"] },
  { slot: "primaryHover", patterns: ["colorprimaryhover", "primaryhover", "primaryactive", "brandhover", "accenthover"] },
  { slot: "primaryText", patterns: ["colorprimarytext", "primarytext", "onprimary", "primaryforeground"] },
  { slot: "primary", patterns: ["colorprimary", "primary", "brand", "accent", "main", "theme"] },
  { slot: "textSecondary", patterns: ["colortextsecondary", "textsecondary", "secondarytext", "subtext"] },
  { slot: "textMuted", patterns: ["colortextmuted", "textmuted", "mutedtext", "textsubtle"] },
  { slot: "text", patterns: ["colortext", "text", "fg", "foreground", "onbackground", "ink"] },
  { slot: "borderLight", patterns: ["colorborderlight", "borderlight", "bordersubtle", "border2"] },
  { slot: "border", patterns: ["colorborder", "border", "divider", "ring", "outline"] },
  { slot: "success", patterns: ["colorsuccess", "success", "positive", "ok", "good"] },
  { slot: "warning", patterns: ["colorwarning", "warning", "caution", "alert"] },
  { slot: "error", patterns: ["colorerror", "error", "danger", "negative", "destructive"] },
  { slot: "info", patterns: ["colorinfo", "info", "information", "neutral"] },
];

function normalizeName(name: string): string {
  // Strip everything that isn't a-z0-9 so "color-primary", "color.primary",
  // "colorPrimary", and "primary_color" all collapse to the same shape.
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function nameToSlot(rawName: string): keyof ThemeColors | null {
  const normalized = normalizeName(rawName);
  if (!normalized) return null;
  for (const rule of NAME_RULES) {
    if (rule.patterns.some((p) => normalized === p)) return rule.slot;
  }
  return null;
}

type UsableToken = ExtractedToken & { hex: string };

function pickPrimaryHeuristic(usable: UsableToken[]): UsableToken | null {
  let best: { token: UsableToken; score: number } | null = null;
  for (const token of usable) {
    const [, sat, light] = rgbToHsl(hexToRgb(token.hex));
    // Prefer saturated mid-lightness colors. Penalize near-white and
    // near-black so we don't accidentally pick a background as primary.
    const lightnessScore = 1 - Math.abs(light - 0.5) * 2;
    const score = sat * lightnessScore;
    if (!best || score > best.score) best = { token, score };
  }
  return best?.token ?? null;
}

function pickByLuminance(
  usable: UsableToken[],
  taken: Set<string>,
  predicate: (lum: number) => boolean
): UsableToken | null {
  for (const token of usable) {
    if (taken.has(token.rawName)) continue;
    const lum = relativeLuminance(hexToRgb(token.hex));
    if (predicate(lum)) return token;
  }
  return null;
}

export function buildLightThemeFromTokens(
  tokens: ExtractedToken[]
): BuildResult {
  const recommendations: BuildRecommendation[] = [];

  for (const token of tokens) {
    if (token.hex === null) {
      recommendations.push({
        kind: "unconverted",
        userName: token.rawName,
        rawValue: token.rawValue,
      });
    }
  }

  const usable = tokens.filter((t): t is UsableToken => t.hex !== null);
  if (usable.length === 0) {
    return { ok: false, reason: "no-colors-found" };
  }

  const slots: Partial<Record<keyof ThemeColors, string>> = {};
  const matched = new Set<string>();

  // Pass 1 -- direct/aliased name matches.
  for (const token of usable) {
    const slot = nameToSlot(token.rawName);
    if (!slot || slots[slot]) continue;
    slots[slot] = token.hex;
    matched.add(token.rawName);
    recommendations.push({
      kind: "alias",
      userName: token.rawName,
      slot,
    });
  }

  // Pass 2 -- heuristics for the most important slots when name match failed.
  if (!slots.primary) {
    const guess = pickPrimaryHeuristic(usable.filter((t) => !matched.has(t.rawName)));
    if (guess) {
      slots.primary = guess.hex;
      matched.add(guess.rawName);
      recommendations.push({
        kind: "heuristic",
        userName: guess.rawName,
        slot: "primary",
        reason: "most saturated mid-lightness color",
      });
    }
  }

  if (!slots.background) {
    const guess = pickByLuminance(usable, matched, (lum) => lum > 0.85);
    if (guess) {
      slots.background = guess.hex;
      matched.add(guess.rawName);
      recommendations.push({
        kind: "heuristic",
        userName: guess.rawName,
        slot: "background",
        reason: "lightest color",
      });
    }
  }

  if (!slots.text) {
    const guess = pickByLuminance(usable, matched, (lum) => lum < 0.15);
    if (guess) {
      slots.text = guess.hex;
      matched.add(guess.rawName);
      recommendations.push({
        kind: "heuristic",
        userName: guess.rawName,
        slot: "text",
        reason: "darkest color",
      });
    }
  }

  // Final fallback for primary -- if all extracted colors are lightish or
  // darkish, just use the first one and let synthesis handle the rest.
  const seedPrimary = slots.primary ?? usable[0].hex;
  if (!slots.primary) {
    slots.primary = seedPrimary;
    recommendations.push({
      kind: "heuristic",
      userName: usable[0].rawName,
      slot: "primary",
      reason: "first usable color (no obvious primary detected)",
    });
  }

  // Synthesize a complete theme from the (chosen) primary, then layer the
  // user's actual mapped values on top so we keep their brand intent.
  const synth = generateLightTheme(seedPrimary);
  const theme: ThemeColors = { ...synth };
  for (const slot of REQUIRED_KEYS) {
    if (slots[slot]) {
      theme[slot] = slots[slot] as string;
    } else {
      recommendations.push({
        kind: "synthesized",
        slot,
        from: seedPrimary,
      });
    }
  }

  for (const token of usable) {
    if (!matched.has(token.rawName)) {
      recommendations.push({
        kind: "unmapped",
        userName: token.rawName,
        hex: token.hex,
      });
    }
  }

  const mappedCount = Object.keys(slots).length;
  const synthesizedCount = REQUIRED_KEYS.length - mappedCount;

  return {
    ok: true,
    theme,
    recommendations,
    mapped: mappedCount,
    synthesized: synthesizedCount,
  };
}
