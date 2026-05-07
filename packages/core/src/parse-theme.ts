import type { ThemeColors, ParseResult, ParseFormat, RGB } from "./types";
import { hslToRgb, rgbToHex } from "./color-math";

const REQUIRED_KEYS: ReadonlyArray<keyof ThemeColors> = [
  "background",
  "surface",
  "surfaceAlt",
  "primary",
  "primaryHover",
  "primaryText",
  "text",
  "textSecondary",
  "textMuted",
  "border",
  "borderLight",
  "success",
  "warning",
  "error",
  "info",
];

const HEX_FULL = /^#?[0-9a-fA-F]{3}([0-9a-fA-F]{3})?([0-9a-fA-F]{2})?$/;

function normalizeHex(value: string): string | null {
  const trimmed = value.trim();
  if (!HEX_FULL.test(trimmed)) return null;
  let clean = trimmed.replace(/^#/, "").toLowerCase();
  if (clean.length === 8) clean = clean.slice(0, 6);
  if (clean.length === 3) {
    clean = clean
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (clean.length !== 6) return null;
  return `#${clean}`;
}

function clampByte(n: number): number {
  return Math.max(0, Math.min(255, Math.round(n)));
}

function rgbTripleToHex(r: number, g: number, b: number): string {
  const rgb: RGB = [clampByte(r), clampByte(g), clampByte(b)];
  return rgbToHex(rgb);
}

function hslTripleToHex(h: number, s: number, l: number): string {
  const sNorm = Math.max(0, Math.min(1, s / 100));
  const lNorm = Math.max(0, Math.min(1, l / 100));
  return rgbToHex(hslToRgb([h, sNorm, lNorm]));
}

function parseNumberList(inside: string): number[] | null {
  const parts = inside
    .replace(/,/g, " ")
    .replace(/\//g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length < 3) return null;
  const nums = parts.slice(0, 3).map((p) => {
    if (p.endsWith("%")) return parseFloat(p.slice(0, -1));
    return parseFloat(p);
  });
  if (nums.some((n) => Number.isNaN(n))) return null;
  return nums;
}

// Accept hex, rgb()/rgba(), hsl()/hsla(), and shadcn-style "H S% L%" bare HSL
// (when used as a CSS variable value). oklch/lab/lch are not supported and
// will return null so the caller can flag the key as invalid.
export function colorValueToHex(value: string): string | null {
  const trimmed = value.trim().replace(/;$/, "").trim();
  const hex = normalizeHex(trimmed);
  if (hex) return hex;

  const fnMatch = trimmed.match(/^(rgba?|hsla?)\s*\(([^)]*)\)$/i);
  if (fnMatch) {
    const fn = fnMatch[1].toLowerCase();
    const nums = parseNumberList(fnMatch[2]);
    if (!nums) return null;
    if (fn.startsWith("rgb")) return rgbTripleToHex(nums[0], nums[1], nums[2]);
    return hslTripleToHex(nums[0], nums[1], nums[2]);
  }

  // shadcn pattern: bare "H S% L%" used as a value for a CSS variable
  if (/^\d+(\.\d+)?\s+\d+(\.\d+)?%\s+\d+(\.\d+)?%$/.test(trimmed)) {
    const nums = parseNumberList(trimmed);
    if (nums) return hslTripleToHex(nums[0], nums[1], nums[2]);
  }

  return null;
}

function detectFormat(filename: string | undefined, text: string): ParseFormat {
  if (filename) {
    const ext = filename.toLowerCase().split(".").pop();
    if (ext === "json") return "json";
    if (ext === "js" || ext === "mjs" || ext === "cjs") return "js";
    if (ext === "ts" || ext === "tsx") return "ts";
    if (ext === "css") return "css";
  }
  const head = text.trimStart().slice(0, 1);
  if (head === "{" || head === "[") return "json";
  if (/--color-[a-z-]+\s*:/i.test(text)) return "css";
  if (/export\s+default|module\.exports|=\s*{/.test(text)) return "js";
  return "json";
}

function stripComments(src: string): string {
  return src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:"'])\/\/.*$/gm, "$1");
}

function extractObjectLiteral(src: string): string | null {
  const stripped = stripComments(src);
  const start = stripped.indexOf("{");
  if (start < 0) return null;
  let depth = 0;
  let inString: '"' | "'" | "`" | null = null;
  let escape = false;
  for (let i = start; i < stripped.length; i++) {
    const ch = stripped[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (inString) {
      if (ch === "\\") escape = true;
      else if (ch === inString) inString = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      inString = ch as '"' | "'" | "`";
      continue;
    }
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return stripped.slice(start, i + 1);
    }
  }
  return null;
}

function sanitizeObjectLiteralToJson(literal: string): string {
  let out = literal;
  out = out.replace(/\bas\s+const\b/g, "");
  out = out.replace(/\bas\s+[A-Za-z_$][\w$]*(\s*<[^>]*>)?/g, "");
  out = out.replace(/'((?:[^'\\]|\\.)*)'/g, (_m, inner: string) => {
    const safe = inner.replace(/\\'/g, "'").replace(/"/g, '\\"');
    return `"${safe}"`;
  });
  out = out.replace(/([{,]\s*)([A-Za-z_$][\w$]*)(\s*):/g, '$1"$2"$3:');
  out = out.replace(/,(\s*[}\]])/g, "$1");
  return out;
}

function parseJsonLike(text: string): unknown {
  return JSON.parse(text);
}

function parseJsObject(text: string): unknown {
  const literal = extractObjectLiteral(text);
  if (!literal) throw new Error("No object literal found");
  return JSON.parse(sanitizeObjectLiteralToJson(literal));
}

function kebabToCamel(input: string): string {
  return input.replace(/-([a-z])/g, (_m, c: string) => c.toUpperCase());
}

const NAME_ALIASES: Record<string, keyof ThemeColors> = {
  bg: "background",
  background: "background",
  foreground: "text",
  fg: "text",
  surface1: "surface",
  surface2: "surfaceAlt",
  brand: "primary",
  accent: "primary",
};

function canonicalKey(rawName: string): string {
  const camel = kebabToCamel(rawName);
  if (camel in NAME_ALIASES) return NAME_ALIASES[camel];
  return camel;
}

function parseCss(text: string): Record<string, string> {
  // Collect every matching declaration. Prefer a hex-convertible value
  // over an unparseable one for the same canonical key, so e.g. a later
  // `--color-primary: #6366f1;` will replace an earlier `--primary: oklch(...)`.
  const all: Array<{ key: string; value: string; isHex: boolean }> = [];
  const re = /--(?:color-)?([a-z][a-z0-9-]*)\s*:\s*([^;{}]+?)\s*;/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    const key = canonicalKey(match[1].toLowerCase());
    const raw = match[2].trim();
    const hex = colorValueToHex(raw);
    all.push({ key, value: hex ?? raw, isHex: hex !== null });
  }

  const out: Record<string, string> = {};
  for (const entry of all) {
    if (out[entry.key] && !entry.isHex) continue;
    if (entry.isHex || !out[entry.key]) out[entry.key] = entry.value;
  }
  return out;
}

function isStringRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validate(raw: Record<string, unknown>): ParseResult {
  const missing: string[] = [];
  const invalid: string[] = [];
  const result: Partial<ThemeColors> = {};

  for (const key of REQUIRED_KEYS) {
    const value = raw[key];
    if (value === undefined) {
      missing.push(key);
      continue;
    }
    if (typeof value !== "string") {
      invalid.push(key);
      continue;
    }
    const normalized = normalizeHex(value);
    if (!normalized) {
      invalid.push(key);
      continue;
    }
    result[key] = normalized;
  }

  if (missing.length || invalid.length) {
    return { ok: false, missing, invalid };
  }
  return { ok: true, theme: result as ThemeColors };
}

export function parseLightTheme(
  text: string,
  filename?: string
): ParseResult {
  const format = detectFormat(filename, text);
  let raw: unknown;
  try {
    if (format === "json") raw = parseJsonLike(text);
    else if (format === "css") raw = parseCss(text);
    else raw = parseJsObject(text);
  } catch {
    return {
      ok: false,
      missing: [...REQUIRED_KEYS],
      invalid: [],
    };
  }
  if (!isStringRecord(raw)) {
    return { ok: false, missing: [...REQUIRED_KEYS], invalid: [] };
  }
  return validate(raw);
}

export { REQUIRED_KEYS as REQUIRED_THEME_KEYS };
