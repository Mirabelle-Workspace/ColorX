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

// Color Vision Deficiency (CVD) -- the technical term for color blindness
export type CVDType =
  | "deuteranopia"
  | "protanopia"
  | "tritanopia"
  | "achromatopsia";

export type RGB = [number, number, number];
export type HSL = [number, number, number];

export type DarkVariantId = "standard" | "true-dark" | "dim";

export interface DarkVariant {
  id: DarkVariantId;
  name: string;
  description: string;
  colors: ThemeColors;
  contrast: Record<string, ContrastResult>;
}

export type ParseFormat = "json" | "js" | "ts" | "css";

export type ParseResult =
  | { ok: true; theme: ThemeColors }
  | { ok: false; missing: string[]; invalid: string[] };

export interface ExtractedToken {
  rawName: string;
  rawValue: string;
  hex: string | null;
}

export interface ExtractResult {
  tokens: ExtractedToken[];
  format: ParseFormat;
}

export type BuildRecommendation =
  | { kind: "alias"; userName: string; slot: keyof ThemeColors }
  | { kind: "heuristic"; userName: string; slot: keyof ThemeColors; reason: string }
  | { kind: "synthesized"; slot: keyof ThemeColors; from: string }
  | { kind: "unconverted"; userName: string; rawValue: string }
  | { kind: "unmapped"; userName: string; hex: string };

export type BuildResult =
  | {
      ok: true;
      theme: ThemeColors;
      recommendations: BuildRecommendation[];
      mapped: number;
      synthesized: number;
    }
  | { ok: false; reason: "no-colors-found" };
