import type { ExtractedToken } from "@colorx/core";

export type PdfImportResult =
  | { ok: true; tokens: ExtractedToken[]; pages: number }
  | { ok: false; error: string };

type RGB = [number, number, number];

interface KMeansOptions {
  k: number;
  maxIterations?: number;
  seed?: number;
}

// Deterministic LCG so callers can pin behavior in tests.
function makeRng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function distSq(a: RGB, b: RGB): number {
  const dr = a[0] - b[0];
  const dg = a[1] - b[1];
  const db = a[2] - b[2];
  return dr * dr + dg * dg + db * db;
}

export interface ClusterResult {
  centroid: RGB;
  size: number;
}

export function kMeans(
  points: RGB[],
  options: KMeansOptions
): ClusterResult[] {
  const { k, maxIterations = 20, seed = 42 } = options;
  if (points.length === 0) return [];
  const effectiveK = Math.min(k, points.length);
  const rng = makeRng(seed);

  // Initialize centroids by k-means++ with the seeded RNG.
  const centroids: RGB[] = [points[Math.floor(rng() * points.length)]];
  while (centroids.length < effectiveK) {
    const distances = points.map((p) => {
      let nearest = Infinity;
      for (const c of centroids) {
        const d = distSq(p, c);
        if (d < nearest) nearest = d;
      }
      return nearest;
    });
    const total = distances.reduce((s, d) => s + d, 0);
    if (total === 0) break;
    let target = rng() * total;
    let chosen = 0;
    for (let i = 0; i < distances.length; i++) {
      target -= distances[i];
      if (target <= 0) {
        chosen = i;
        break;
      }
    }
    centroids.push(points[chosen]);
  }

  let clusters: RGB[][] = Array.from({ length: centroids.length }, () => []);
  for (let iter = 0; iter < maxIterations; iter++) {
    clusters = Array.from({ length: centroids.length }, () => []);
    for (const p of points) {
      let best = 0;
      let bestD = Infinity;
      for (let i = 0; i < centroids.length; i++) {
        const d = distSq(p, centroids[i]);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      }
      clusters[best].push(p);
    }

    let moved = false;
    for (let i = 0; i < centroids.length; i++) {
      if (clusters[i].length === 0) continue;
      let r = 0;
      let g = 0;
      let b = 0;
      for (const p of clusters[i]) {
        r += p[0];
        g += p[1];
        b += p[2];
      }
      const next: RGB = [
        r / clusters[i].length,
        g / clusters[i].length,
        b / clusters[i].length,
      ];
      if (
        Math.abs(next[0] - centroids[i][0]) > 1 ||
        Math.abs(next[1] - centroids[i][1]) > 1 ||
        Math.abs(next[2] - centroids[i][2]) > 1
      ) {
        moved = true;
      }
      centroids[i] = next;
    }
    if (!moved) break;
  }

  return centroids
    .map((centroid, i) => ({ centroid, size: clusters[i].length }))
    .filter((c) => c.size > 0)
    .sort((a, b) => b.size - a.size);
}

function rgbToHex([r, g, b]: RGB): string {
  return (
    "#" +
    [r, g, b]
      .map((v) =>
        Math.max(0, Math.min(255, Math.round(v)))
          .toString(16)
          .padStart(2, "0")
      )
      .join("")
  );
}

interface PageImage {
  width: number;
  height: number;
  data: Uint8ClampedArray;
}

async function renderPdfPages(
  file: File,
  maxPages: number
): Promise<PageImage[]> {
  // Lazy-load pdf.js so it stays out of the initial bundle.
  const pdfjs = await import("pdfjs-dist");
  // Vite-friendly worker URL
  const workerUrl = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url"))
    .default as string;
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

  const buffer = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: buffer }).promise;
  const pages: PageImage[] = [];
  const pagesToRender = Math.min(doc.numPages, maxPages);
  for (let i = 1; i <= pagesToRender; i++) {
    const page = await doc.getPage(i);
    const viewport = page.getViewport({ scale: 0.5 });
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const ctx = canvas.getContext("2d");
    if (!ctx) continue;
    await page.render({ canvasContext: ctx, viewport, canvas }).promise;
    const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
    pages.push({
      width: canvas.width,
      height: canvas.height,
      data: image.data,
    });
  }
  return pages;
}

interface SampleOptions {
  step: number;
  minChroma: number;
  minLum: number;
  maxLum: number;
}

const DEFAULT_SAMPLE_OPTIONS: SampleOptions = {
  step: 10,
  minChroma: 15,
  minLum: 0.05,
  maxLum: 0.95,
};

export function samplePixels(
  pages: PageImage[],
  options: Partial<SampleOptions> = {}
): RGB[] {
  const opts = { ...DEFAULT_SAMPLE_OPTIONS, ...options };
  const out: RGB[] = [];
  for (const page of pages) {
    const data = page.data;
    for (let i = 0; i < data.length; i += 4 * opts.step) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      if (a < 128) continue;
      const lum =
        0.2126 * (r / 255) + 0.7152 * (g / 255) + 0.0722 * (b / 255);
      if (lum < opts.minLum || lum > opts.maxLum) continue;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      if (max - min < opts.minChroma) continue;
      out.push([r, g, b]);
    }
  }
  return out;
}

export async function extractTokensFromPdf(
  file: File,
  { maxPages = 3, k = 10 }: { maxPages?: number; k?: number } = {}
): Promise<PdfImportResult> {
  let pages: PageImage[];
  try {
    pages = await renderPdfPages(file, maxPages);
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Failed to read the PDF",
    };
  }
  if (pages.length === 0) {
    return { ok: false, error: "Could not render any pages from this PDF." };
  }

  const pixels = samplePixels(pages);
  if (pixels.length < 50) {
    return {
      ok: false,
      error:
        "This PDF did not contain enough non-grayscale color to extract a palette. Try a brand book or a screenshot-style PDF instead.",
    };
  }

  const clusters = kMeans(pixels, { k, seed: 42 });

  const tokens: ExtractedToken[] = clusters.map((cluster, idx) => {
    const hex = rgbToHex(cluster.centroid);
    return {
      rawName: `pdf-color-${idx + 1}`,
      rawValue: hex,
      hex,
    };
  });

  return { ok: true, tokens, pages: pages.length };
}

export type { RGB };
