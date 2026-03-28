import { useMemo } from "react";
import { simulateThemeCVD, type ThemeColors, type CVDType } from "@colorx/core";

export function useCVD(
  theme: ThemeColors | null,
  type: CVDType
): ThemeColors | null {
  return useMemo(() => {
    if (!theme) return null;
    return simulateThemeCVD(theme, type);
  }, [theme, type]);
}
