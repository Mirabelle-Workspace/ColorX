import type { ExtractedToken } from "./types";

export type FigmaImportResult =
  | { ok: true; tokens: ExtractedToken[]; fileKey: string }
  | { ok: false; error: string };

interface FigmaStyleSummary {
  key: string;
  node_id: string;
  name: string;
  style_type: string;
}

interface FigmaSolidPaint {
  type: "SOLID";
  visible?: boolean;
  opacity?: number;
  color: { r: number; g: number; b: number; a?: number };
}

type FigmaPaint = FigmaSolidPaint | { type: string };

interface FigmaNodeDoc {
  fills?: FigmaPaint[];
}

interface FigmaStylesResponse {
  meta: { styles: FigmaStyleSummary[] };
}

interface FigmaNodesResponse {
  nodes: Record<string, { document: FigmaNodeDoc } | null>;
}

const FIGMA_API = "https://api.figma.com/v1";

export function extractFigmaFileKey(url: string): string | null {
  const match = url.match(/figma\.com\/(?:file|design|board|proto)\/([a-zA-Z0-9]{10,})/);
  return match ? match[1] : null;
}

function paintToHex(paint: FigmaPaint): string | null {
  if (paint.type !== "SOLID") return null;
  const solid = paint as FigmaSolidPaint;
  if (solid.visible === false) return null;
  const { r, g, b } = solid.color;
  const hex = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n * 255)))
      .toString(16)
      .padStart(2, "0");
  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

interface FetchOptions {
  fetchImpl?: typeof fetch;
}

async function figmaFetch<T>(
  path: string,
  token: string,
  options: FetchOptions
): Promise<T> {
  const fetchFn = options.fetchImpl ?? fetch;
  const res = await fetchFn(`${FIGMA_API}${path}`, {
    headers: { "X-Figma-Token": token },
  });
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      throw new Error(
        "Invalid or unauthorized Figma token. Check your personal access token."
      );
    }
    if (res.status === 404) {
      throw new Error(
        "Figma file not found. Confirm the URL and that your token can access it."
      );
    }
    throw new Error(`Figma API returned ${res.status}`);
  }
  return (await res.json()) as T;
}

export async function extractTokensFromFigma(
  url: string,
  token: string,
  options: FetchOptions = {}
): Promise<FigmaImportResult> {
  const fileKey = extractFigmaFileKey(url);
  if (!fileKey) {
    return {
      ok: false,
      error:
        "Could not parse a Figma file key from that URL. Expected something like https://www.figma.com/design/<key>/...",
    };
  }
  if (!token || token.trim().length < 10) {
    return { ok: false, error: "Personal access token is missing or too short." };
  }

  let stylesResp: FigmaStylesResponse;
  try {
    stylesResp = await figmaFetch<FigmaStylesResponse>(
      `/files/${fileKey}/styles`,
      token,
      options
    );
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Network error" };
  }

  const fillStyles = stylesResp.meta.styles.filter(
    (s) => s.style_type === "FILL"
  );
  if (fillStyles.length === 0) {
    return {
      ok: false,
      error:
        "This Figma file has no FILL color styles. Save your colors as Color Styles in Figma, then try again.",
    };
  }

  const ids = fillStyles.map((s) => s.node_id).join(",");
  let nodesResp: FigmaNodesResponse;
  try {
    nodesResp = await figmaFetch<FigmaNodesResponse>(
      `/files/${fileKey}/nodes?ids=${encodeURIComponent(ids)}`,
      token,
      options
    );
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Network error" };
  }

  const tokens: ExtractedToken[] = [];
  for (const style of fillStyles) {
    const nodeRef = nodesResp.nodes[style.node_id];
    if (!nodeRef) continue;
    const fills = nodeRef.document.fills ?? [];
    const solid = fills.find((p): p is FigmaSolidPaint => p.type === "SOLID");
    if (!solid) continue;
    const hex = paintToHex(solid);
    if (!hex) continue;
    tokens.push({
      rawName: style.name.toLowerCase(),
      rawValue: `figma:${style.name}`,
      hex,
    });
  }

  if (tokens.length === 0) {
    return {
      ok: false,
      error:
        "Found Figma color styles but none had a usable solid fill. Gradient and image fills are not supported yet.",
    };
  }

  return { ok: true, tokens, fileKey };
}
