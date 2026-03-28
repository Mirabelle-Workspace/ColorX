import type { CVDType, ThemeColors, RGB } from "./types";
import { hexToRgb, rgbToHex } from "./color-math";

// Color Vision Deficiency simulation matrices
// Based on Brettel, Vienot & Mollon (1997) and Machado, Oliveira & Fernandes (2009)
// Applied in linearized sRGB space

type Matrix3x3 = [
  [number, number, number],
  [number, number, number],
  [number, number, number],
];

// Protanopia: L-cone deficiency (red-blind, ~2% of males)
const PROTANOPIA: Matrix3x3 = [
  [0.152286, 1.052583, -0.204868],
  [0.114503, 0.786281, 0.099216],
  [-0.003882, -0.048116, 1.051998],
];

// Deuteranopia: M-cone deficiency (green-blind, ~6% of males)
const DEUTERANOPIA: Matrix3x3 = [
  [0.367322, 0.860646, -0.227968],
  [0.280085, 0.672501, 0.047413],
  [-0.011820, 0.042940, 0.968881],
];

// Tritanopia: S-cone deficiency (blue-blind, ~0.01% of population)
const TRITANOPIA: Matrix3x3 = [
  [1.255528, -0.076749, -0.178779],
  [-0.078411, 0.930809, 0.147602],
  [0.004733, 0.691367, 0.303900],
];

function linearize(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function delinearize(c: number): number {
  const clamped = Math.max(0, Math.min(1, c));
  return clamped <= 0.0031308
    ? Math.round(clamped * 12.92 * 255)
    : Math.round((1.055 * clamped ** (1 / 2.4) - 0.055) * 255);
}

function applyMatrix(rgb: RGB, matrix: Matrix3x3): RGB {
  const [r, g, b] = [linearize(rgb[0]), linearize(rgb[1]), linearize(rgb[2])];
  return [
    delinearize(matrix[0][0] * r + matrix[0][1] * g + matrix[0][2] * b),
    delinearize(matrix[1][0] * r + matrix[1][1] * g + matrix[1][2] * b),
    delinearize(matrix[2][0] * r + matrix[2][1] * g + matrix[2][2] * b),
  ];
}

function toGrayscale(rgb: RGB): RGB {
  const [r, g, b] = [linearize(rgb[0]), linearize(rgb[1]), linearize(rgb[2])];
  const y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const v = delinearize(y);
  return [v, v, v];
}

const MATRICES: Record<Exclude<CVDType, "achromatopsia">, Matrix3x3> = {
  protanopia: PROTANOPIA,
  deuteranopia: DEUTERANOPIA,
  tritanopia: TRITANOPIA,
};

/**
 * Simulate how a single hex color appears to someone with a
 * specific color vision deficiency.
 */
export function simulateCVD(hex: string, type: CVDType): string {
  const rgb = hexToRgb(hex);
  if (type === "achromatopsia") {
    return rgbToHex(toGrayscale(rgb));
  }
  return rgbToHex(applyMatrix(rgb, MATRICES[type]));
}

/**
 * Simulate an entire theme through a CVD filter.
 * Returns a new ThemeColors with every color transformed.
 */
export function simulateThemeCVD(
  theme: ThemeColors,
  type: CVDType
): ThemeColors {
  const result = {} as ThemeColors;
  for (const [key, value] of Object.entries(theme)) {
    result[key as keyof ThemeColors] = simulateCVD(value, type);
  }
  return result;
}
