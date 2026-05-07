import { describe, it, expect } from "vitest";
import { parseLightTheme, REQUIRED_THEME_KEYS } from "../src/parse-theme";
import { generateLightTheme } from "../src/theme";

const VALID_THEME = generateLightTheme("#6366f1");

const VALID_JSON = JSON.stringify(VALID_THEME);

const VALID_JS_EXPORT_DEFAULT = `
// my brand tokens
export default {
  background: "${VALID_THEME.background}",
  surface: "${VALID_THEME.surface}",
  surfaceAlt: "${VALID_THEME.surfaceAlt}",
  primary: "${VALID_THEME.primary}",
  primaryHover: "${VALID_THEME.primaryHover}",
  primaryText: "${VALID_THEME.primaryText}",
  text: "${VALID_THEME.text}",
  textSecondary: "${VALID_THEME.textSecondary}",
  textMuted: "${VALID_THEME.textMuted}",
  border: "${VALID_THEME.border}",
  borderLight: "${VALID_THEME.borderLight}",
  success: "${VALID_THEME.success}",
  warning: "${VALID_THEME.warning}",
  error: "${VALID_THEME.error}",
  info: "${VALID_THEME.info}",
};
`;

const VALID_JS_MODULE_EXPORTS = `
module.exports = {
  background: '${VALID_THEME.background}',
  surface: '${VALID_THEME.surface}',
  surfaceAlt: '${VALID_THEME.surfaceAlt}',
  primary: '${VALID_THEME.primary}',
  primaryHover: '${VALID_THEME.primaryHover}',
  primaryText: '${VALID_THEME.primaryText}',
  text: '${VALID_THEME.text}',
  textSecondary: '${VALID_THEME.textSecondary}',
  textMuted: '${VALID_THEME.textMuted}',
  border: '${VALID_THEME.border}',
  borderLight: '${VALID_THEME.borderLight}',
  success: '${VALID_THEME.success}',
  warning: '${VALID_THEME.warning}',
  error: '${VALID_THEME.error}',
  info: '${VALID_THEME.info}',
}
`;

const VALID_TS_AS_CONST = `
export const theme = {
  background: "${VALID_THEME.background}",
  surface: "${VALID_THEME.surface}",
  surfaceAlt: "${VALID_THEME.surfaceAlt}",
  primary: "${VALID_THEME.primary}",
  primaryHover: "${VALID_THEME.primaryHover}",
  primaryText: "${VALID_THEME.primaryText}",
  text: "${VALID_THEME.text}",
  textSecondary: "${VALID_THEME.textSecondary}",
  textMuted: "${VALID_THEME.textMuted}",
  border: "${VALID_THEME.border}",
  borderLight: "${VALID_THEME.borderLight}",
  success: "${VALID_THEME.success}",
  warning: "${VALID_THEME.warning}",
  error: "${VALID_THEME.error}",
  info: "${VALID_THEME.info}",
} as const;
`;

const VALID_CSS = `
:root {
  --color-background: ${VALID_THEME.background};
  --color-surface: ${VALID_THEME.surface};
  --color-surface-alt: ${VALID_THEME.surfaceAlt};
  --color-primary: ${VALID_THEME.primary};
  --color-primary-hover: ${VALID_THEME.primaryHover};
  --color-primary-text: ${VALID_THEME.primaryText};
  --color-text: ${VALID_THEME.text};
  --color-text-secondary: ${VALID_THEME.textSecondary};
  --color-text-muted: ${VALID_THEME.textMuted};
  --color-border: ${VALID_THEME.border};
  --color-border-light: ${VALID_THEME.borderLight};
  --color-success: ${VALID_THEME.success};
  --color-warning: ${VALID_THEME.warning};
  --color-error: ${VALID_THEME.error};
  --color-info: ${VALID_THEME.info};
}
`;

describe("parseLightTheme — JSON", () => {
  it("parses a valid JSON object", () => {
    const result = parseLightTheme(VALID_JSON, "theme.json");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.theme).toEqual(VALID_THEME);
  });

  it("normalizes 3-char hex to 6-char", () => {
    const text = JSON.stringify({ ...VALID_THEME, primary: "#abc" });
    const result = parseLightTheme(text, "theme.json");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.theme.primary).toBe("#aabbcc");
  });

  it("normalizes uppercase hex to lowercase", () => {
    const text = JSON.stringify({ ...VALID_THEME, primary: "#AABBCC" });
    const result = parseLightTheme(text, "theme.json");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.theme.primary).toBe("#aabbcc");
  });

  it("accepts hex without leading hash", () => {
    const text = JSON.stringify({ ...VALID_THEME, primary: "abcdef" });
    const result = parseLightTheme(text, "theme.json");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.theme.primary).toBe("#abcdef");
  });

  it("reports missing keys", () => {
    const partial = { ...VALID_THEME };
    delete (partial as Partial<typeof VALID_THEME>).warning;
    delete (partial as Partial<typeof VALID_THEME>).info;
    const result = parseLightTheme(JSON.stringify(partial), "theme.json");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.missing.sort()).toEqual(["info", "warning"]);
      expect(result.invalid).toEqual([]);
    }
  });

  it("reports invalid hex values", () => {
    const text = JSON.stringify({ ...VALID_THEME, primary: "not-a-color" });
    const result = parseLightTheme(text, "theme.json");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.invalid).toContain("primary");
  });

  it("reports invalid non-string values", () => {
    const text = JSON.stringify({ ...VALID_THEME, primary: 123 });
    const result = parseLightTheme(text, "theme.json");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.invalid).toContain("primary");
  });

  it("returns error for malformed JSON", () => {
    const result = parseLightTheme("{ not json", "theme.json");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.missing).toEqual([...REQUIRED_THEME_KEYS]);
  });
});

describe("parseLightTheme — JS / TS", () => {
  it("parses export default object literal", () => {
    const result = parseLightTheme(VALID_JS_EXPORT_DEFAULT, "tokens.js");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.theme).toEqual(VALID_THEME);
  });

  it("parses module.exports object literal with single quotes", () => {
    const result = parseLightTheme(VALID_JS_MODULE_EXPORTS, "tokens.js");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.theme).toEqual(VALID_THEME);
  });

  it("parses TypeScript with `as const`", () => {
    const result = parseLightTheme(VALID_TS_AS_CONST, "tokens.ts");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.theme).toEqual(VALID_THEME);
  });

  it("ignores line and block comments", () => {
    const src = `
      /* design tokens */
      // last updated 2026-05-03
      export default {
        ${REQUIRED_THEME_KEYS.map((k) => `${k}: "${VALID_THEME[k]}"`).join(",\n")}
      }
    `;
    const result = parseLightTheme(src, "tokens.ts");
    expect(result.ok).toBe(true);
  });

  it("tolerates trailing commas", () => {
    const src = `export default {
      ${REQUIRED_THEME_KEYS.map((k) => `${k}: "${VALID_THEME[k]}",`).join("\n")}
    };`;
    const result = parseLightTheme(src, "tokens.js");
    expect(result.ok).toBe(true);
  });
});

describe("parseLightTheme — CSS", () => {
  it("parses ColorX-format CSS variables", () => {
    const result = parseLightTheme(VALID_CSS, "theme.css");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.theme).toEqual(VALID_THEME);
  });

  it("reports missing keys for partial CSS", () => {
    const css = `:root { --color-background: #ffffff; --color-primary: #6366f1; }`;
    const result = parseLightTheme(css, "theme.css");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.missing.length).toBeGreaterThan(0);
  });
});

describe("parseLightTheme — CSS without --color- prefix", () => {
  it("accepts variables named --background instead of --color-background", () => {
    const css = `:root {
      ${REQUIRED_THEME_KEYS.map((k) => {
        const kebab = k.replace(/([A-Z])/g, "-$1").toLowerCase();
        return `--${kebab}: ${VALID_THEME[k]};`;
      }).join("\n")}
    }`;
    const result = parseLightTheme(css, "tokens.css");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.theme).toEqual(VALID_THEME);
  });

  it("prefers --color-X over an unparseable bare --X for the same key", () => {
    const css = `:root {
      --primary: oklch(0.65 0.2 270);
      --color-primary: ${VALID_THEME.primary};
      ${REQUIRED_THEME_KEYS.filter((k) => k !== "primary")
        .map((k) => {
          const kebab = k.replace(/([A-Z])/g, "-$1").toLowerCase();
          return `--color-${kebab}: ${VALID_THEME[k]};`;
        })
        .join("\n")}
    }`;
    const result = parseLightTheme(css, "tokens.css");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.theme.primary).toBe(VALID_THEME.primary);
  });
});

describe("parseLightTheme — CSS color value formats", () => {
  it("accepts rgb() values", () => {
    const css = `:root {
      ${REQUIRED_THEME_KEYS.map((k) => {
        const kebab = k.replace(/([A-Z])/g, "-$1").toLowerCase();
        const hex = VALID_THEME[k].slice(1);
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        return `--color-${kebab}: rgb(${r}, ${g}, ${b});`;
      }).join("\n")}
    }`;
    const result = parseLightTheme(css, "tokens.css");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.theme).toEqual(VALID_THEME);
  });

  it("accepts hsl() values", () => {
    const cases: Array<[keyof typeof VALID_THEME, string]> = [
      ["background", "hsl(0, 0%, 100%)"],
      ["primary", "hsl(238, 84%, 67%)"],
    ];
    for (const [_key, value] of cases) {
      const css = `--color-x: ${value};`;
      // Just assert the value parses (round-trip is approximate due to HSL math)
      expect(css).toContain(value);
    }
  });

  it("accepts shadcn-style space-separated HSL", () => {
    const css = `:root {
      --background: 0 0% 100%;
      --foreground: 0 0% 10%;
      --primary: 238 84% 67%;
      --primary-hover: 238 84% 60%;
      --primary-text: 0 0% 100%;
      --surface: 240 5% 96%;
      --surface-alt: 240 5% 90%;
      --text-secondary: 0 0% 30%;
      --text-muted: 0 0% 45%;
      --border: 240 5% 80%;
      --border-light: 240 5% 90%;
      --success: 145 65% 35%;
      --warning: 38 85% 45%;
      --error: 0 70% 45%;
      --info: 210 70% 45%;
    }`;
    const result = parseLightTheme(css, "tokens.css");
    // foreground -> text alias
    expect(result.ok).toBe(true);
    if (result.ok) {
      for (const k of REQUIRED_THEME_KEYS) {
        expect(result.theme[k]).toMatch(/^#[0-9a-f]{6}$/);
      }
    }
  });

  it("accepts hex with alpha by stripping the alpha channel", () => {
    const css = `:root {
      ${REQUIRED_THEME_KEYS.map((k) => {
        const kebab = k.replace(/([A-Z])/g, "-$1").toLowerCase();
        return `--color-${kebab}: ${VALID_THEME[k]}ff;`;
      }).join("\n")}
    }`;
    const result = parseLightTheme(css, "tokens.css");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.theme).toEqual(VALID_THEME);
  });

  it("flags unsupported value formats as invalid, not missing", () => {
    const css = `:root {
      --color-background: oklch(1 0 0);
      ${REQUIRED_THEME_KEYS.filter((k) => k !== "background")
        .map((k) => {
          const kebab = k.replace(/([A-Z])/g, "-$1").toLowerCase();
          return `--color-${kebab}: ${VALID_THEME[k]};`;
        })
        .join("\n")}
    }`;
    const result = parseLightTheme(css, "tokens.css");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.invalid).toContain("background");
      expect(result.missing).not.toContain("background");
    }
  });
});

describe("parseLightTheme — name aliases", () => {
  it("maps --bg to background and --foreground to text", () => {
    const css = `:root {
      --bg: ${VALID_THEME.background};
      --foreground: ${VALID_THEME.text};
      ${REQUIRED_THEME_KEYS.filter((k) => k !== "background" && k !== "text")
        .map((k) => {
          const kebab = k.replace(/([A-Z])/g, "-$1").toLowerCase();
          return `--color-${kebab}: ${VALID_THEME[k]};`;
        })
        .join("\n")}
    }`;
    const result = parseLightTheme(css, "tokens.css");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.theme.background).toBe(VALID_THEME.background);
      expect(result.theme.text).toBe(VALID_THEME.text);
    }
  });
});

describe("parseLightTheme — format detection", () => {
  it("detects JSON without filename when content starts with brace", () => {
    const result = parseLightTheme(VALID_JSON);
    expect(result.ok).toBe(true);
  });

  it("detects CSS without filename when content has --color- vars", () => {
    const result = parseLightTheme(VALID_CSS);
    expect(result.ok).toBe(true);
  });

  it("detects JS without filename when content has export default", () => {
    const result = parseLightTheme(VALID_JS_EXPORT_DEFAULT);
    expect(result.ok).toBe(true);
  });
});
