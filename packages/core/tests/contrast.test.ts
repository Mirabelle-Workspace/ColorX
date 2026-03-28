import { describe, it, expect } from "vitest";
import { relativeLuminance, contrastRatio, checkContrast, ensureContrast } from "../src/contrast";

describe("relativeLuminance", () => {
  it("returns 0 for black", () => {
    expect(relativeLuminance([0, 0, 0])).toBe(0);
  });

  it("returns 1 for white", () => {
    expect(relativeLuminance([255, 255, 255])).toBeCloseTo(1, 2);
  });
});

describe("contrastRatio", () => {
  it("returns 21:1 for black on white", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 0);
  });

  it("returns 1:1 for same color", () => {
    expect(contrastRatio("#6366f1", "#6366f1")).toBeCloseTo(1, 1);
  });

  it("is symmetric", () => {
    const r1 = contrastRatio("#6366f1", "#ffffff");
    const r2 = contrastRatio("#ffffff", "#6366f1");
    expect(r1).toBeCloseTo(r2, 5);
  });
});

describe("checkContrast", () => {
  it("black on white passes all levels", () => {
    const result = checkContrast("#000000", "#ffffff");
    expect(result.aa).toBe(true);
    expect(result.aaa).toBe(true);
    expect(result.aaLarge).toBe(true);
    expect(result.aaaLarge).toBe(true);
    expect(result.ratio).toBeGreaterThanOrEqual(21);
  });

  it("low contrast pair fails AA", () => {
    const result = checkContrast("#cccccc", "#ffffff");
    expect(result.aa).toBe(false);
  });
});

describe("ensureContrast", () => {
  it("darkens a color to meet contrast", () => {
    const result = ensureContrast("#aaaaaa", "#ffffff", 4.5, "darken");
    const ratio = contrastRatio(result, "#ffffff");
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it("lightens a color to meet contrast", () => {
    const result = ensureContrast("#555555", "#000000", 4.5, "lighten");
    const ratio = contrastRatio(result, "#000000");
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });
});
