import { describe, it, expect } from "vitest";
import { extractTokens } from "../src/token-extract";

describe("extractTokens — CSS", () => {
  it("extracts every --var, regardless of naming or prefix", () => {
    const css = `:root {
      --background: #ffffff;
      --color-primary: #6366f1;
      --brand-500: #4f46e5;
      --my-weird-token: #abc;
    }`;
    const result = extractTokens(css, "tokens.css");
    expect(result.tokens).toHaveLength(4);
    expect(result.tokens.map((t) => t.rawName)).toEqual([
      "background",
      "color-primary",
      "brand-500",
      "my-weird-token",
    ]);
    expect(result.tokens.every((t) => t.hex !== null)).toBe(true);
  });

  it("preserves rawValue and reports null hex for unsupported formats", () => {
    const css = `:root {
      --primary: oklch(0.65 0.2 270);
    }`;
    const result = extractTokens(css, "tokens.css");
    expect(result.tokens).toHaveLength(1);
    expect(result.tokens[0].rawValue).toBe("oklch(0.65 0.2 270)");
    expect(result.tokens[0].hex).toBeNull();
  });

  it("handles space-separated HSL", () => {
    const css = `:root { --bg: 0 0% 100%; }`;
    const result = extractTokens(css, "tokens.css");
    expect(result.tokens[0].hex).toBe("#ffffff");
  });
});

describe("extractTokens — JSON", () => {
  it("walks nested objects and emits dotted paths", () => {
    const json = JSON.stringify({
      colors: {
        brand: { 500: "#6366f1", 600: "#4f46e5" },
        background: "#ffffff",
      },
    });
    const result = extractTokens(json, "tokens.json");
    const names = result.tokens.map((t) => t.rawName).sort();
    expect(names).toContain("colors.brand.500");
    expect(names).toContain("colors.brand.600");
    expect(names).toContain("colors.background");
  });

  it("recognizes Style Dictionary { value: ... } shape", () => {
    const json = JSON.stringify({
      color: {
        primary: { value: "#6366f1", type: "color" },
      },
    });
    const result = extractTokens(json, "tokens.json");
    expect(result.tokens).toHaveLength(1);
    expect(result.tokens[0].rawName).toBe("color.primary");
    expect(result.tokens[0].hex).toBe("#6366f1");
  });

  it("returns an empty token list for malformed input", () => {
    const result = extractTokens("{ not json", "tokens.json");
    expect(result.tokens).toEqual([]);
  });
});

describe("extractTokens — JS / TS", () => {
  it("parses export default object literal", () => {
    const src = `
      export default {
        primary: "#6366f1",
        background: "#ffffff",
      };
    `;
    const result = extractTokens(src, "tokens.js");
    expect(result.tokens).toHaveLength(2);
    expect(result.tokens.find((t) => t.rawName === "primary")?.hex).toBe(
      "#6366f1"
    );
  });
});

describe("extractTokens — format detection", () => {
  it("detects css when content has --vars", () => {
    const result = extractTokens("--bg: #fff;");
    expect(result.format).toBe("css");
  });

  it("detects json when content starts with brace", () => {
    const result = extractTokens('{"primary":"#6366f1"}');
    expect(result.format).toBe("json");
  });
});
