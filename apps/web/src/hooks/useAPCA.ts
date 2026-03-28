import { useMemo } from "react";
import { checkAPCA, type ThemeColors, type APCAResult } from "@colorx/core";

interface APCAAuditPair {
  pair: string;
  fg: string;
  bg: string;
  result: APCAResult;
}

export function useAPCA(theme: ThemeColors | null): APCAAuditPair[] {
  return useMemo(() => {
    if (!theme) return [];

    const pairs: [string, string, string][] = [
      ["text / background", theme.text, theme.background],
      ["textSecondary / background", theme.textSecondary, theme.background],
      ["textMuted / background", theme.textMuted, theme.background],
      ["primary / background", theme.primary, theme.background],
      ["primaryText / primary", theme.primaryText, theme.primary],
      ["text / surface", theme.text, theme.surface],
      ["text / surfaceAlt", theme.text, theme.surfaceAlt],
      ["success / background", theme.success, theme.background],
      ["warning / background", theme.warning, theme.background],
      ["error / background", theme.error, theme.background],
      ["info / background", theme.info, theme.background],
    ];

    return pairs.map(([pair, fg, bg]) => ({
      pair,
      fg,
      bg,
      result: checkAPCA(fg, bg),
    }));
  }, [theme]);
}
