import { describe, it, expect } from "vitest";
import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb, adjustLightness, mixColors } from "../src/color-math";

describe("hexToRgb", () => {
  it("converts 6-digit hex", () => {
    expect(hexToRgb("#ff0000")).toEqual([255, 0, 0]);
    expect(hexToRgb("#00ff00")).toEqual([0, 255, 0]);
    expect(hexToRgb("#0000ff")).toEqual([0, 0, 255]);
    expect(hexToRgb("#ffffff")).toEqual([255, 255, 255]);
    expect(hexToRgb("#000000")).toEqual([0, 0, 0]);
  });

  it("converts 3-digit hex", () => {
    expect(hexToRgb("#f00")).toEqual([255, 0, 0]);
    expect(hexToRgb("#fff")).toEqual([255, 255, 255]);
  });

  it("handles without hash", () => {
    expect(hexToRgb("6366f1")).toEqual([99, 102, 241]);
  });

  it("throws on invalid hex", () => {
    expect(() => hexToRgb("#xyz")).toThrow("Invalid hex color");
    expect(() => hexToRgb("#12")).toThrow("Invalid hex color");
  });
});

describe("rgbToHex", () => {
  it("converts RGB to hex", () => {
    expect(rgbToHex([255, 0, 0])).toBe("#ff0000");
    expect(rgbToHex([0, 0, 0])).toBe("#000000");
    expect(rgbToHex([255, 255, 255])).toBe("#ffffff");
  });

  it("clamps values", () => {
    expect(rgbToHex([300, -10, 128])).toBe("#ff0080");
  });
});

describe("rgbToHsl / hslToRgb roundtrip", () => {
  it("roundtrips primary colors", () => {
    const colors: [number, number, number][] = [
      [255, 0, 0],
      [0, 255, 0],
      [0, 0, 255],
      [128, 128, 128],
    ];
    for (const rgb of colors) {
      const hsl = rgbToHsl(rgb);
      const back = hslToRgb(hsl);
      expect(back[0]).toBeCloseTo(rgb[0], 0);
      expect(back[1]).toBeCloseTo(rgb[1], 0);
      expect(back[2]).toBeCloseTo(rgb[2], 0);
    }
  });

  it("handles achromatic colors", () => {
    const [h, s, l] = rgbToHsl([128, 128, 128]);
    expect(s).toBe(0);
    expect(l).toBeCloseTo(0.502, 1);
  });
});

describe("adjustLightness", () => {
  it("adjusts lightness of a color", () => {
    const result = adjustLightness("#6366f1", 0.9);
    const hsl = rgbToHsl(hexToRgb(result));
    expect(hsl[2]).toBeCloseTo(0.9, 1);
  });
});

describe("mixColors", () => {
  it("mixes two colors equally", () => {
    const result = mixColors("#ff0000", "#0000ff", 0.5);
    const rgb = hexToRgb(result);
    expect(rgb[0]).toBeCloseTo(128, 0);
    expect(rgb[2]).toBeCloseTo(128, 0);
  });

  it("weight 1 returns first color", () => {
    expect(mixColors("#ff0000", "#0000ff", 1)).toBe("#ff0000");
  });

  it("weight 0 returns second color", () => {
    expect(mixColors("#ff0000", "#0000ff", 0)).toBe("#0000ff");
  });
});
