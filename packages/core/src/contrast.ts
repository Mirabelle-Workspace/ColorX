import type { RGB, ContrastResult } from "./types";
import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb } from "./color-math";

export function relativeLuminance([r, g, b]: RGB): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const srgb = c / 255;
    return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function contrastRatio(color1: string, color2: string): number {
  const l1 = relativeLuminance(hexToRgb(color1));
  const l2 = relativeLuminance(hexToRgb(color2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function checkContrast(
  foreground: string,
  background: string
): ContrastResult {
  const ratio = contrastRatio(foreground, background);
  return {
    ratio: Math.round(ratio * 100) / 100,
    aa: ratio >= 4.5,
    aaLarge: ratio >= 3,
    aaa: ratio >= 7,
    aaaLarge: ratio >= 4.5,
  };
}

export function ensureContrast(
  fg: string,
  bg: string,
  minRatio: number,
  mode: "lighten" | "darken"
): string {
  let current = fg;
  const hsl = rgbToHsl(hexToRgb(current));
  let l = hsl[2];
  const step = mode === "lighten" ? 0.02 : -0.02;

  for (let i = 0; i < 60; i++) {
    if (contrastRatio(current, bg) >= minRatio) return current;
    l = Math.max(0, Math.min(1, l + step));
    current = rgbToHex(hslToRgb([hsl[0], hsl[1], l]));
  }
  return current;
}
