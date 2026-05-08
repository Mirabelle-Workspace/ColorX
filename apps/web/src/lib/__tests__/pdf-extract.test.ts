import { describe, it, expect } from "vitest";
import { kMeans, samplePixels, type RGB } from "../pdf-extract";

describe("kMeans", () => {
  it("returns empty when given no points", () => {
    expect(kMeans([], { k: 3 })).toEqual([]);
  });

  it("clusters obvious 3-color groups into 3 centroids", () => {
    const points: RGB[] = [];
    // 30 points near red
    for (let i = 0; i < 30; i++) points.push([220 + (i % 5), 30, 30]);
    // 30 points near green
    for (let i = 0; i < 30; i++) points.push([30, 200 + (i % 5), 30]);
    // 30 points near blue
    for (let i = 0; i < 30; i++) points.push([30, 30, 240 + (i % 5)]);

    const clusters = kMeans(points, { k: 3, seed: 1 });
    expect(clusters).toHaveLength(3);

    const centroids = clusters.map((c) => c.centroid);
    const dominantChannel = (c: RGB) => {
      const [r, g, b] = c;
      if (r > g && r > b) return "r";
      if (g > r && g > b) return "g";
      return "b";
    };
    const channels = new Set(centroids.map(dominantChannel));
    expect(channels.size).toBe(3);
  });

  it("returns clusters sorted by size descending", () => {
    const points: RGB[] = [];
    for (let i = 0; i < 100; i++) points.push([200, 30, 30]); // big red
    for (let i = 0; i < 5; i++) points.push([30, 200, 30]); // tiny green
    const clusters = kMeans(points, { k: 2, seed: 7 });
    expect(clusters[0].size).toBeGreaterThanOrEqual(clusters[1].size);
  });

  it("does not return more clusters than unique-ish points", () => {
    const points: RGB[] = [
      [0, 0, 0],
      [255, 255, 255],
    ];
    const clusters = kMeans(points, { k: 5, seed: 3 });
    expect(clusters.length).toBeLessThanOrEqual(2);
  });
});

describe("samplePixels", () => {
  function makePage(colors: RGB[]): {
    width: number;
    height: number;
    data: Uint8ClampedArray;
  } {
    const data = new Uint8ClampedArray(colors.length * 4);
    for (let i = 0; i < colors.length; i++) {
      data[i * 4] = colors[i][0];
      data[i * 4 + 1] = colors[i][1];
      data[i * 4 + 2] = colors[i][2];
      data[i * 4 + 3] = 255;
    }
    return { width: colors.length, height: 1, data };
  }

  it("filters out near-white and near-black pixels", () => {
    const page = makePage([
      [255, 255, 255],
      [0, 0, 0],
      [200, 30, 30],
    ]);
    const pixels = samplePixels([page], { step: 1 });
    expect(pixels).toHaveLength(1);
    expect(pixels[0]).toEqual([200, 30, 30]);
  });

  it("filters out near-grayscale pixels", () => {
    const page = makePage([
      [128, 128, 130],
      [50, 50, 200],
    ]);
    const pixels = samplePixels([page], { step: 1 });
    expect(pixels).toEqual([[50, 50, 200]]);
  });

  it("respects step size", () => {
    const page = makePage([
      [200, 30, 30],
      [30, 200, 30],
      [30, 30, 200],
      [220, 30, 30],
    ]);
    const pixels = samplePixels([page], { step: 2 });
    expect(pixels).toHaveLength(2);
  });
});
