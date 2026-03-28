import { describe, it, expect } from "vitest";
import { simulateCVD, simulateThemeCVD } from "../src/cvd";
import { generateLightTheme } from "../src/theme";

describe("simulateCVD", () => {
  it("achromatopsia converts to grayscale", () => {
    const result = simulateCVD("#ff0000", "achromatopsia");
    const r = parseInt(result.slice(1, 3), 16);
    const g = parseInt(result.slice(3, 5), 16);
    const b = parseInt(result.slice(5, 7), 16);
    // All channels should be equal (grayscale)
    expect(r).toBe(g);
    expect(g).toBe(b);
  });

  it("white stays white for all types", () => {
    expect(simulateCVD("#ffffff", "deuteranopia")).toBe("#ffffff");
    expect(simulateCVD("#ffffff", "protanopia")).toBe("#ffffff");
    expect(simulateCVD("#ffffff", "tritanopia")).toBe("#ffffff");
    expect(simulateCVD("#ffffff", "achromatopsia")).toBe("#ffffff");
  });

  it("black stays black for all types", () => {
    expect(simulateCVD("#000000", "deuteranopia")).toBe("#000000");
    expect(simulateCVD("#000000", "protanopia")).toBe("#000000");
    expect(simulateCVD("#000000", "tritanopia")).toBe("#000000");
    expect(simulateCVD("#000000", "achromatopsia")).toBe("#000000");
  });

  it("returns valid hex for all types", () => {
    const types = ["deuteranopia", "protanopia", "tritanopia", "achromatopsia"] as const;
    for (const type of types) {
      const result = simulateCVD("#6366f1", type);
      expect(result).toMatch(/^#[0-9a-f]{6}$/);
    }
  });
});

describe("simulateThemeCVD", () => {
  it("transforms all theme colors", () => {
    const theme = generateLightTheme("#6366f1");
    const simulated = simulateThemeCVD(theme, "deuteranopia");
    for (const key of Object.keys(theme)) {
      expect(simulated[key as keyof typeof simulated]).toMatch(/^#[0-9a-f]{6}$/);
    }
  });
});
