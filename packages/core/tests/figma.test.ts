import { describe, it, expect, vi } from "vitest";
import {
  extractFigmaFileKey,
  extractTokensFromFigma,
} from "../src/figma";

describe("extractFigmaFileKey", () => {
  it("parses a /file/<key> URL", () => {
    expect(
      extractFigmaFileKey("https://www.figma.com/file/aBcDeFgHiJ12/My-File")
    ).toBe("aBcDeFgHiJ12");
  });

  it("parses a /design/<key> URL", () => {
    expect(
      extractFigmaFileKey("https://www.figma.com/design/Xy12345abcde/Design-System")
    ).toBe("Xy12345abcde");
  });

  it("parses a /board/<key> URL", () => {
    expect(
      extractFigmaFileKey("https://www.figma.com/board/zZ9876aaaaaa/Whiteboard")
    ).toBe("zZ9876aaaaaa");
  });

  it("returns null for URLs that are not Figma", () => {
    expect(extractFigmaFileKey("https://example.com/abc")).toBeNull();
  });

  it("returns null when no key is present", () => {
    expect(extractFigmaFileKey("https://www.figma.com/")).toBeNull();
  });
});

interface MockResponseInit {
  ok: boolean;
  status: number;
  body: unknown;
}

function makeResponse({ ok, status, body }: MockResponseInit): Response {
  return {
    ok,
    status,
    json: async () => body,
  } as Response;
}

function mockFetchSequence(responses: MockResponseInit[]): typeof fetch {
  const queue = [...responses];
  return (async () => {
    const next = queue.shift();
    if (!next) throw new Error("Unexpected fetch call");
    return makeResponse(next);
  }) as unknown as typeof fetch;
}

describe("extractTokensFromFigma — happy path", () => {
  it("returns tokens for SOLID fill color styles", async () => {
    const stylesBody = {
      meta: {
        styles: [
          { key: "k1", node_id: "1:2", name: "Brand/Primary", style_type: "FILL" },
          { key: "k2", node_id: "1:3", name: "Surface/Background", style_type: "FILL" },
          { key: "k3", node_id: "1:4", name: "Heading/H1", style_type: "TEXT" },
        ],
      },
    };
    const nodesBody = {
      nodes: {
        "1:2": {
          document: {
            fills: [{ type: "SOLID", color: { r: 0.388, g: 0.4, b: 0.945 } }],
          },
        },
        "1:3": {
          document: {
            fills: [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }],
          },
        },
      },
    };
    const fetchImpl = mockFetchSequence([
      { ok: true, status: 200, body: stylesBody },
      { ok: true, status: 200, body: nodesBody },
    ]);

    const result = await extractTokensFromFigma(
      "https://www.figma.com/design/aBcDeFgHiJ12/Test",
      "fig_PAT_123456789",
      { fetchImpl }
    );

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.tokens).toHaveLength(2);
      const primary = result.tokens.find((t) => t.rawName === "brand/primary");
      expect(primary?.hex).toBe("#6366f1");
      const surface = result.tokens.find((t) => t.rawName === "surface/background");
      expect(surface?.hex).toBe("#ffffff");
    }
  });

  it("skips invisible fills", async () => {
    const stylesBody = {
      meta: {
        styles: [
          { key: "k1", node_id: "1:2", name: "Hidden", style_type: "FILL" },
        ],
      },
    };
    const nodesBody = {
      nodes: {
        "1:2": {
          document: {
            fills: [{ type: "SOLID", visible: false, color: { r: 1, g: 0, b: 0 } }],
          },
        },
      },
    };
    const fetchImpl = mockFetchSequence([
      { ok: true, status: 200, body: stylesBody },
      { ok: true, status: 200, body: nodesBody },
    ]);

    const result = await extractTokensFromFigma(
      "https://www.figma.com/file/aBcDeFgHiJ12/X",
      "fig_PAT_123456789",
      { fetchImpl }
    );
    expect(result.ok).toBe(false);
  });
});

describe("extractTokensFromFigma — error paths", () => {
  it("rejects invalid URLs", async () => {
    const result = await extractTokensFromFigma(
      "https://example.com/not-figma",
      "fig_PAT_123456789"
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/Could not parse/i);
  });

  it("rejects empty tokens", async () => {
    const result = await extractTokensFromFigma(
      "https://www.figma.com/design/aBcDeFgHiJ12/X",
      ""
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/token/i);
  });

  it("surfaces 401/403 as auth error", async () => {
    const fetchImpl = mockFetchSequence([
      { ok: false, status: 403, body: {} },
    ]);
    const result = await extractTokensFromFigma(
      "https://www.figma.com/design/aBcDeFgHiJ12/X",
      "fig_PAT_123456789",
      { fetchImpl }
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/unauthorized|invalid/i);
  });

  it("surfaces 404 as file-not-found", async () => {
    const fetchImpl = mockFetchSequence([
      { ok: false, status: 404, body: {} },
    ]);
    const result = await extractTokensFromFigma(
      "https://www.figma.com/design/aBcDeFgHiJ12/X",
      "fig_PAT_123456789",
      { fetchImpl }
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/not found/i);
  });

  it("returns ok:false when the file has no FILL styles", async () => {
    const fetchImpl = mockFetchSequence([
      { ok: true, status: 200, body: { meta: { styles: [] } } },
    ]);
    const result = await extractTokensFromFigma(
      "https://www.figma.com/design/aBcDeFgHiJ12/X",
      "fig_PAT_123456789",
      { fetchImpl }
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/Color Styles/i);
  });
});
