import type { ExtractedToken, ExtractResult, ParseFormat } from "./types";
import { colorValueToHex } from "./parse-theme";

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
  if (/--[a-z][a-z0-9-]*\s*:/i.test(text)) return "css";
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

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

// Recursively walk a parsed JSON/JS object and collect every leaf string
// value, keeping the dot-path of nested keys so the user sees something
// like "colors.brand.500" rather than just "500".
function walkObject(
  value: unknown,
  path: string,
  out: ExtractedToken[]
): void {
  if (typeof value === "string") {
    const hex = colorValueToHex(value);
    out.push({ rawName: path, rawValue: value, hex });
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, idx) => walkObject(item, `${path}[${idx}]`, out));
    return;
  }
  if (isPlainObject(value)) {
    // Style Dictionary shape: { value: "#xxx" } -- treat the parent path
    // as the token name and skip the "value" segment.
    if (typeof value.value === "string" && Object.keys(value).length <= 3) {
      const hex = colorValueToHex(value.value);
      out.push({ rawName: path, rawValue: value.value, hex });
      return;
    }
    for (const [key, child] of Object.entries(value)) {
      walkObject(child, path ? `${path}.${key}` : key, out);
    }
  }
}

function extractFromObject(raw: unknown): ExtractedToken[] {
  if (!isPlainObject(raw) && !Array.isArray(raw)) return [];
  const out: ExtractedToken[] = [];
  walkObject(raw, "", out);
  return out;
}

function extractFromCss(text: string): ExtractedToken[] {
  const out: ExtractedToken[] = [];
  const re = /--([a-z][a-z0-9-]*)\s*:\s*([^;{}]+?)\s*;/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    const rawName = match[1].toLowerCase();
    const rawValue = match[2].trim();
    const hex = colorValueToHex(rawValue);
    out.push({ rawName, rawValue, hex });
  }
  return out;
}

export function extractTokens(text: string, filename?: string): ExtractResult {
  const format = detectFormat(filename, text);
  if (format === "css") {
    return { tokens: extractFromCss(text), format };
  }

  let raw: unknown;
  try {
    if (format === "json") raw = JSON.parse(text);
    else {
      const literal = extractObjectLiteral(text);
      if (!literal) return { tokens: [], format };
      raw = JSON.parse(sanitizeObjectLiteralToJson(literal));
    }
  } catch {
    return { tokens: [], format };
  }

  return { tokens: extractFromObject(raw), format };
}
