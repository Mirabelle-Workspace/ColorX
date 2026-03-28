import type { ThemeColors, ContrastResult } from "@colorx/core";
import { SwatchGrid } from "./SwatchGrid";
import { UIPreview } from "./UIPreview";
import { ContrastAudit } from "../contrast/ContrastAudit";

interface ThemePreviewProps {
  theme: ThemeColors;
  contrast: Record<string, ContrastResult>;
  mode: "light" | "dark";
}

export function ThemePreview({ theme, contrast, mode }: ThemePreviewProps) {
  return (
    <article>
      <SwatchGrid theme={theme} />
      <UIPreview theme={theme} />
      <ContrastAudit contrast={contrast} theme={theme} mode={mode} />
    </article>
  );
}
