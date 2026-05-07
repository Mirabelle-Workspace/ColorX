import { describe, it, expect } from "vitest";
import { generateLightTheme } from "../src/theme";
import { generateDarkVariants, variantToCss } from "../src/dark-variants";
import type { DarkVariantId } from "../src/types";

const SEED_COLORS = [
  "#6366f1", // indigo
  "#e61938", // red
  "#22c55e", // green
  "#f59e0b", // amber
  "#0ea5e9", // sky
  "#a855f7", // purple
  "#111827", // near-black
  "#fde68a", // pale yellow
  "#1f2937", // slate
  "#ec4899", // pink
];

const EXPECTED_IDS: ReadonlyArray<DarkVariantId> = ["standard", "true-dark", "dim"];

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

describe("generateDarkVariants — shape", () => {
  it("returns exactly 3 variants", () => {
    const variants = generateDarkVariants(generateLightTheme("#6366f1"));
    expect(variants).toHaveLength(3);
  });

  it("returns variants with stable ids in stable order", () => {
    const variants = generateDarkVariants(generateLightTheme("#6366f1"));
    expect(variants.map((v) => v.id)).toEqual([...EXPECTED_IDS]);
  });

  it("each variant produces 15 hex tokens", () => {
    const variants = generateDarkVariants(generateLightTheme("#6366f1"));
    for (const variant of variants) {
      expect(Object.keys(variant.colors)).toHaveLength(15);
      for (const value of Object.values(variant.colors)) {
        expect(value).toMatch(HEX_RE);
      }
    }
  });

  it("each variant has a non-empty name and description", () => {
    const variants = generateDarkVariants(generateLightTheme("#6366f1"));
    for (const variant of variants) {
      expect(variant.name.length).toBeGreaterThan(0);
      expect(variant.description.length).toBeGreaterThan(0);
    }
  });
});

describe("generateDarkVariants — backgrounds", () => {
  it("standard uses #121212", () => {
    const [standard] = generateDarkVariants(generateLightTheme("#6366f1"));
    expect(standard.colors.background).toBe("#121212");
  });

  it("true-dark uses #000000", () => {
    const [, trueDark] = generateDarkVariants(generateLightTheme("#6366f1"));
    expect(trueDark.colors.background).toBe("#000000");
  });

  it("dim uses lifted background", () => {
    const [, , dim] = generateDarkVariants(generateLightTheme("#6366f1"));
    expect(dim.colors.background).toBe("#1a1a22");
  });
});

describe("generateDarkVariants — accessibility (the always-passing guarantee)", () => {
  for (const seed of SEED_COLORS) {
    describe(`seed ${seed}`, () => {
      const variants = generateDarkVariants(generateLightTheme(seed));

      for (const variant of variants) {
        for (const pair of AA_PAIRS) {
          it(`${variant.id}: ${pair} passes WCAG AA (>=4.5)`, () => {
            const result = variant.contrast[pair];
            expect(result, `missing audit pair ${pair}`).toBeDefined();
            expect(
              result.aa,
              `${variant.id} ${pair} ratio ${result.ratio} below 4.5`
            ).toBe(true);
          });
        }

        for (const pair of AA_LARGE_PAIRS) {
          it(`${variant.id}: ${pair} passes WCAG AA Large (>=3)`, () => {
            const result = variant.contrast[pair];
            expect(result, `missing audit pair ${pair}`).toBeDefined();
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

describe("variantToCss", () => {
  it("emits a scoped block keyed by variant id", () => {
    const [standard] = generateDarkVariants(generateLightTheme("#6366f1"));
    const css = variantToCss(standard);
    expect(css).toContain('[data-theme="dark"][data-variant="standard"]');
    expect(css).toContain("--color-background: #121212;");
    expect(css).toContain("--color-primary-hover");
  });

  it("emits all 15 tokens", () => {
    const [, trueDark] = generateDarkVariants(generateLightTheme("#6366f1"));
    const css = variantToCss(trueDark);
    const matches = css.match(/--color-/g) ?? [];
    expect(matches.length).toBe(15);
  });
});
