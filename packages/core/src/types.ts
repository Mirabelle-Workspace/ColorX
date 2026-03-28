export interface ThemeColors {
  background: string;
  surface: string;
  surfaceAlt: string;
  primary: string;
  primaryHover: string;
  primaryText: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderLight: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface ContrastResult {
  ratio: number;
  aa: boolean;
  aaLarge: boolean;
  aaa: boolean;
  aaaLarge: boolean;
}

export interface ThemeOutput {
  input: string;
  light: ThemeColors;
  dark: ThemeColors;
  contrast: {
    light: Record<string, ContrastResult>;
    dark: Record<string, ContrastResult>;
  };
  css: string;
}

export interface APCAResult {
  Lc: number;
  passes: boolean;
  level: "body" | "heading" | "non-text" | "fail";
}

export type CVDType =
  | "deuteranopia"
  | "protanopia"
  | "tritanopia"
  | "achromatopsia";

export type RGB = [number, number, number];
export type HSL = [number, number, number];
