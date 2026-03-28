import { describe, it, expect } from "vitest";
import { calcAPCA, checkAPCA } from "../src/apca";

describe("calcAPCA", () => {
  it("returns high positive Lc for black on white", () => {
    const lc = calcAPCA("#000000", "#ffffff");
    expect(lc).toBeGreaterThan(100);
  });

  it("returns negative Lc for white on black", () => {
    const lc = calcAPCA("#ffffff", "#000000");
    expect(lc).toBeLessThan(-100);
  });

  it("returns 0 for same color", () => {
    expect(calcAPCA("#888888", "#888888")).toBe(0);
  });

  it("returns non-zero for contrasting pair", () => {
    const lc = calcAPCA("#6366f1", "#ffffff");
    expect(Math.abs(lc)).toBeGreaterThan(0);
  });
});

describe("checkAPCA", () => {
  it("black on white passes body level", () => {
    const result = checkAPCA("#000000", "#ffffff");
    expect(result.level).toBe("body");
    expect(result.passes).toBe(true);
    expect(Math.abs(result.Lc)).toBeGreaterThanOrEqual(60);
  });

  it("low contrast pair fails", () => {
    const result = checkAPCA("#cccccc", "#dddddd");
    expect(result.level).toBe("fail");
    expect(result.passes).toBe(false);
  });
});
