import { describe, it, expect } from "vitest";
import { generateDarkTheme } from "../src/theme";
import { generateLightVariants, lightVariantToCss } from "../src/light-variants";
import type { LightVariantId } from "../src/types";

const SEED_COLORS = [
  "#6366f1",
  "#e61938",
  "#22c55e",
  "#f59e0b",
  "#0ea5e9",
  "#a855f7",
  "#111827",
  "#fde68a",
  "#1f2937",
  "#ec4899",
];

const EXPECTED_IDS: ReadonlyArray<LightVariantId> = ["standard", "soft", "warm"];

const HEX_RE = /^#[0-9a-f]{6}$/;

const AA_PAIRS = [
  "text / background",
  "textSecondary / background",
  "primary / background",
  "primaryText / primary",
  "text / surface",
  "text / surfaceAlt",
] as const;

const AA_LARGE_PAIRS = [
  "textMuted / background",
  "success / background",
  "warning / background",
  "error / background",
  "info / background",
] as const;

describe("generateLightVariants — shape", () => {
  it("returns exactly 3 variants", () => {
    const variants = generateLightVariants(generateDarkTheme("#6366f1"));
    expect(variants).toHaveLength(3);
  });

  it("returns variants with stable ids in stable order", () => {
    const variants = generateLightVariants(generateDarkTheme("#6366f1"));
    expect(variants.map((v) => v.id)).toEqual([...EXPECTED_IDS]);
  });

  it("each variant produces 15 hex tokens", () => {
    const variants = generateLightVariants(generateDarkTheme("#6366f1"));
    for (const variant of variants) {
      expect(Object.keys(variant.colors)).toHaveLength(15);
      for (const value of Object.values(variant.colors)) {
        expect(value).toMatch(HEX_RE);
      }
    }
  });
});

describe("generateLightVariants — backgrounds", () => {
  it("standard uses #ffffff", () => {
    const [standard] = generateLightVariants(generateDarkTheme("#6366f1"));
    expect(standard.colors.background).toBe("#ffffff");
  });

  it("soft uses an off-white background", () => {
    const [, soft] = generateLightVariants(generateDarkTheme("#6366f1"));
    expect(soft.colors.background).toBe("#fafafa");
  });

  it("warm uses a cream background", () => {
    const [, , warm] = generateLightVariants(generateDarkTheme("#6366f1"));
    expect(warm.colors.background).toBe("#faf8f5");
  });
});

describe("generateLightVariants — accessibility", () => {
  for (const seed of SEED_COLORS) {
    describe(`seed ${seed}`, () => {
      const variants = generateLightVariants(generateDarkTheme(seed));

      for (const variant of variants) {
        for (const pair of AA_PAIRS) {
          it(`${variant.id}: ${pair} passes WCAG AA`, () => {
            const result = variant.contrast[pair];
            expect(result).toBeDefined();
            expect(
              result.aa,
              `${variant.id} ${pair} ratio ${result.ratio} below 4.5`
            ).toBe(true);
          });
        }

        for (const pair of AA_LARGE_PAIRS) {
          it(`${variant.id}: ${pair} passes WCAG AA Large`, () => {
            const result = variant.contrast[pair];
            expect(result).toBeDefined();
            expect(
              result.aaLarge,
              `${variant.id} ${pair} ratio ${result.ratio} below 3`
            ).toBe(true);
          });
        }
      }
    });
  }
});

describe("lightVariantToCss", () => {
  it("emits a scoped block keyed by variant id", () => {
    const [standard] = generateLightVariants(generateDarkTheme("#6366f1"));
    const css = lightVariantToCss(standard);
    expect(css).toContain('[data-theme="light"][data-variant="standard"]');
    expect(css).toContain("--color-background: #ffffff;");
  });

  it("emits all 15 tokens", () => {
    const [, soft] = generateLightVariants(generateDarkTheme("#6366f1"));
    const css = lightVariantToCss(soft);
    const matches = css.match(/--color-/g) ?? [];
    expect(matches.length).toBe(15);
  });
});
