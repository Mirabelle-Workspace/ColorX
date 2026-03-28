import type { APCAResult } from "./types";
import { hexToRgb } from "./color-math";

// APCA-W3 (Accessible Perceptual Contrast Algorithm)
// Based on the APCA specification for WCAG 3.0 draft
// Reference: https://github.com/Myndex/SAPC-APCA

const SA98G = {
  mainTRC: 2.4,
  sRco: 0.2126729,
  sGco: 0.7151522,
  sBco: 0.0721750,
  normBG: 0.56,
  normTXT: 0.57,
  revBG: 0.65,
  revTXT: 0.62,
  blkThrs: 0.022,
  blkClmp: 1.414,
  scaleBoW: 1.14,
  scaleWoB: 1.14,
  loBoWOffset: 0.027,
  loWoBOffset: 0.027,
  loClip: 0.1,
  deltaYmin: 0.0005,
};

function sRGBtoLinear(channel: number): number {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** SA98G.mainTRC;
}

function luminanceAPCA(r: number, g: number, b: number): number {
  return (
    SA98G.sRco * sRGBtoLinear(r) +
    SA98G.sGco * sRGBtoLinear(g) +
    SA98G.sBco * sRGBtoLinear(b)
  );
}

function softClamp(Y: number): number {
  if (Y < 0) return 0;
  if (Y < SA98G.blkThrs) {
    return Y + (SA98G.blkThrs - Y) ** SA98G.blkClmp;
  }
  return Y;
}

/**
 * Calculate APCA Lc (Lightness Contrast) value.
 * Positive Lc = dark text on light background (normal polarity).
 * Negative Lc = light text on dark background (reverse polarity).
 * Returns absolute Lc value for simplified threshold comparison.
 */
export function calcAPCA(fgHex: string, bgHex: string): number {
  const [fgR, fgG, fgB] = hexToRgb(fgHex);
  const [bgR, bgG, bgB] = hexToRgb(bgHex);

  const Yfg = softClamp(luminanceAPCA(fgR, fgG, fgB));
  const Ybg = softClamp(luminanceAPCA(bgR, bgG, bgB));

  if (Math.abs(Ybg - Yfg) < SA98G.deltaYmin) return 0;

  let SAPC: number;

  // Normal polarity: dark text on light background
  // SAPC produces values in 0-1.x range; multiply by 100 to get Lc percentage
  if (Ybg > Yfg) {
    SAPC = (Ybg ** SA98G.normBG - Yfg ** SA98G.normTXT) * SA98G.scaleBoW;
    const Lc = SAPC * 100;
    return Math.abs(Lc) < SA98G.loClip * 100
      ? 0
      : Math.round((Lc - SA98G.loBoWOffset * 100) * 100) / 100;
  }

  // Reverse polarity: light text on dark background
  SAPC = (Ybg ** SA98G.revBG - Yfg ** SA98G.revTXT) * SA98G.scaleWoB;
  const Lc = SAPC * 100;
  return Math.abs(Lc) < SA98G.loClip * 100
    ? 0
    : Math.round((Lc + SA98G.loWoBOffset * 100) * 100) / 100;
}

/**
 * Check APCA contrast and return a result with pass/fail level.
 *
 * Thresholds (per APCA guidance):
 * - Body text (16px normal): |Lc| >= 60
 * - Heading text (24px / 18px bold): |Lc| >= 45
 * - Non-text / large UI elements: |Lc| >= 30
 */
export function checkAPCA(
  fgHex: string,
  bgHex: string
): APCAResult {
  const Lc = calcAPCA(fgHex, bgHex);
  const absLc = Math.abs(Lc);

  let level: APCAResult["level"];
  if (absLc >= 60) level = "body";
  else if (absLc >= 45) level = "heading";
  else if (absLc >= 30) level = "non-text";
  else level = "fail";

  return {
    Lc,
    passes: absLc >= 30,
    level,
  };
}
