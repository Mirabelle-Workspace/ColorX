import { describe, it, expect } from "vitest";
import { extractTokens } from "../src/token-extract";
import {
  buildLightThemeFromTokens,
  buildThemeFromTokens,
} from "../src/theme-build";
import { auditTheme } from "../src/theme";
import { generateDarkVariants } from "../src/dark-variants";
import { generateLightVariants } from "../src/light-variants";

const HEX_RE = /^#[0-9a-f]{6}$/;

describe("buildLightThemeFromTokens", () => {
  it("returns no-colors-found when input has zero usable colors", () => {
    const result = buildLightThemeFromTokens([]);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("no-colors-found");
  });

  it("returns no-colors-found when every value is unconvertible", () => {
    const result = buildLightThemeFromTokens([
      { rawName: "primary", rawValue: "oklch(0.65 0.2 270)", hex: null },
    ]);
    expect(result.ok).toBe(false);
  });

  it("produces a complete 15-token theme from a single primary color", () => {
    const result = buildLightThemeFromTokens([
      { rawName: "primary", rawValue: "#6366f1", hex: "#6366f1" },
    ]);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(Object.keys(result.theme)).toHaveLength(15);
      for (const value of Object.values(result.theme)) {
        expect(value).toMatch(HEX_RE);
      }
      expect(result.theme.primary).toBe("#6366f1");
    }
  });

  it("uses heuristic detection for primary when no name match", () => {
    const result = buildLightThemeFromTokens([
      { rawName: "weird-name", rawValue: "#6366f1", hex: "#6366f1" },
    ]);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.theme.primary).toBe("#6366f1");
      const hasHeuristic = result.recommendations.some(
        (r) => r.kind === "heuristic" && r.slot === "primary"
      );
      expect(hasHeuristic).toBe(true);
    }
  });

  it("maps aliases (brand, accent, bg, fg) to ColorX slots", () => {
    const result = buildLightThemeFromTokens([
      { rawName: "brand", rawValue: "#6366f1", hex: "#6366f1" },
      { rawName: "bg", rawValue: "#ffffff", hex: "#ffffff" },
      { rawName: "fg", rawValue: "#1a1a1a", hex: "#1a1a1a" },
    ]);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.theme.primary).toBe("#6366f1");
      expect(result.theme.background).toBe("#ffffff");
      expect(result.theme.text).toBe("#1a1a1a");
      const aliasRecs = result.recommendations.filter((r) => r.kind === "alias");
      expect(aliasRecs.length).toBe(3);
    }
  });

  it("synthesizes missing slots and reports them as recommendations", () => {
    const result = buildLightThemeFromTokens([
      { rawName: "primary", rawValue: "#6366f1", hex: "#6366f1" },
    ]);
    expect(result.ok).toBe(true);
    if (result.ok) {
      const synth = result.recommendations.filter((r) => r.kind === "synthesized");
      // Everything except primary should be synthesized.
      expect(synth.length).toBe(14);
      expect(result.synthesized).toBe(14);
      expect(result.mapped).toBe(1);
    }
  });

  it("flags unconvertible values in recommendations without failing", () => {
    const result = buildLightThemeFromTokens([
      { rawName: "primary", rawValue: "#6366f1", hex: "#6366f1" },
      { rawName: "exotic", rawValue: "oklch(0.5 0.2 200)", hex: null },
    ]);
    expect(result.ok).toBe(true);
    if (result.ok) {
      const unconverted = result.recommendations.filter(
        (r) => r.kind === "unconverted"
      );
      expect(unconverted).toHaveLength(1);
      if (unconverted[0].kind === "unconverted") {
        expect(unconverted[0].userName).toBe("exotic");
      }
    }
  });

  it("lists colors that didn't map to any slot as 'unmapped'", () => {
    const result = buildLightThemeFromTokens([
      { rawName: "primary", rawValue: "#6366f1", hex: "#6366f1" },
      { rawName: "weird-extra", rawValue: "#ff00ff", hex: "#ff00ff" },
    ]);
    expect(result.ok).toBe(true);
    if (result.ok) {
      const unmapped = result.recommendations.filter((r) => r.kind === "unmapped");
      // weird-extra is not in our ruleset and primary is taken
      expect(unmapped.some((r) => r.kind === "unmapped" && r.userName === "weird-extra")).toBe(
        true
      );
    }
  });

  it("works end-to-end with extractTokens for a sparse CSS file", () => {
    const css = `:root {
      --brand: #6366f1;
      --background: #ffffff;
    }`;
    const extracted = extractTokens(css, "tokens.css");
    const built = buildLightThemeFromTokens(extracted.tokens);
    expect(built.ok).toBe(true);
    if (built.ok) {
      expect(built.theme.primary).toBe("#6366f1");
      expect(built.theme.background).toBe("#ffffff");
      // The full theme audits cleanly through the existing pipeline.
      const audit = auditTheme(built.theme);
      expect(audit["text / background"].aa).toBe(true);
    }
  });

  it("integrates cleanly with generateDarkVariants", () => {
    const built = buildLightThemeFromTokens([
      { rawName: "primary", rawValue: "#6366f1", hex: "#6366f1" },
    ]);
    expect(built.ok).toBe(true);
    if (built.ok) {
      const variants = generateDarkVariants(built.theme);
      expect(variants).toHaveLength(3);
      for (const variant of variants) {
        // Same AA guarantee should hold.
        expect(variant.contrast["text / background"].aa).toBe(true);
        expect(variant.contrast["primary / background"].aa).toBe(true);
      }
    }
  });
});

describe("buildThemeFromTokens — direction detection", () => {
  it("detects a light theme when the background is light", () => {
    const result = buildThemeFromTokens([
      { rawName: "background", rawValue: "#ffffff", hex: "#ffffff" },
      { rawName: "primary", rawValue: "#6366f1", hex: "#6366f1" },
      { rawName: "text", rawValue: "#1a1a1a", hex: "#1a1a1a" },
    ]);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.detectedMode).toBe("light");
  });

  it("detects a dark theme when the background is dark", () => {
    const result = buildThemeFromTokens([
      { rawName: "background", rawValue: "#121212", hex: "#121212" },
      { rawName: "primary", rawValue: "#a78bfa", hex: "#a78bfa" },
      { rawName: "text", rawValue: "#e8e8e8", hex: "#e8e8e8" },
    ]);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.detectedMode).toBe("dark");
  });

  it("respects forceMode override", () => {
    const result = buildThemeFromTokens(
      [
        { rawName: "background", rawValue: "#ffffff", hex: "#ffffff" },
        { rawName: "primary", rawValue: "#6366f1", hex: "#6366f1" },
      ],
      { forceMode: "dark" }
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.detectedMode).toBe("dark");
      // The synthesized theme should be dark-flavored: text light, bg dark.
      // Background is taken from input ("background" alias) so it stays
      // light. But synthesized slots come from generateDarkTheme output.
      // We assert the mode flag, not the layered values.
    }
  });

  it("a dark theme upload produces light variants via generateLightVariants", () => {
    const built = buildThemeFromTokens([
      { rawName: "background", rawValue: "#121212", hex: "#121212" },
      { rawName: "primary", rawValue: "#a78bfa", hex: "#a78bfa" },
    ]);
    expect(built.ok).toBe(true);
    if (built.ok) {
      expect(built.detectedMode).toBe("dark");
      const variants = generateLightVariants(built.theme);
      expect(variants).toHaveLength(3);
      for (const v of variants) {
        expect(v.contrast["text / background"].aa).toBe(true);
        expect(v.contrast["primary / background"].aa).toBe(true);
      }
    }
  });
});
