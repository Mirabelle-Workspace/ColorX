import { describe, it, expect } from "vitest";
import { generateTheme } from "../src/css";
import { generateLightTheme, generateDarkTheme, auditTheme } from "../src/theme";

describe("generateLightTheme", () => {
  it("produces 15 color tokens", () => {
    const theme = generateLightTheme("#6366f1");
    expect(Object.keys(theme)).toHaveLength(15);
  });

  it("all values are valid hex colors", () => {
    const theme = generateLightTheme("#6366f1");
    for (const value of Object.values(theme)) {
      expect(value).toMatch(/^#[0-9a-f]{6}$/);
    }
  });

  it("uses white background", () => {
    expect(generateLightTheme("#6366f1").background).toBe("#ffffff");
  });
});

describe("generateDarkTheme", () => {
  it("produces 15 color tokens", () => {
    const theme = generateDarkTheme("#6366f1");
    expect(Object.keys(theme)).toHaveLength(15);
  });

  it("uses dark background", () => {
    expect(generateDarkTheme("#6366f1").background).toBe("#121212");
  });
});

describe("auditTheme", () => {
  it("audits 11 color pairs", () => {
    const theme = generateLightTheme("#6366f1");
    const audit = auditTheme(theme);
    expect(Object.keys(audit)).toHaveLength(11);
  });

  it("text on background passes AA", () => {
    const theme = generateLightTheme("#6366f1");
    const audit = auditTheme(theme);
    expect(audit["text / background"].aa).toBe(true);
  });
});

describe("generateTheme", () => {
  it("returns complete theme output", () => {
    const output = generateTheme("#6366f1");
    expect(output.input).toBe("#6366f1");
    expect(output.light).toBeDefined();
    expect(output.dark).toBeDefined();
    expect(output.contrast.light).toBeDefined();
    expect(output.contrast.dark).toBeDefined();
    expect(output.css).toContain(":root");
    expect(output.css).toContain("prefers-color-scheme: dark");
  });

  it("handles hex without hash", () => {
    const output = generateTheme("6366f1");
    expect(output.input).toBe("#6366f1");
  });

  it("throws on invalid input", () => {
    expect(() => generateTheme("xyz")).toThrow();
  });
});
