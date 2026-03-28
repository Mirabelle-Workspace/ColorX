import type { ThemeColors, CVDType } from "@colorx/core";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Grid } from "@/components/layout/primitives";
import { useCVD } from "@/hooks/useCVD";
import { SwatchGrid } from "../theme-display/SwatchGrid";

interface CVDPreviewProps {
  theme: ThemeColors;
  type: CVDType;
  mode: "light" | "dark";
}

export function CVDPreview({ theme, type, mode }: CVDPreviewProps) {
  const simulated = useCVD(theme, type);

  if (!simulated) return null;

  const isDark = mode === "dark";

  return (
    <Grid as="ul" cols={2} gap="md">
      <li>
        <Card className={isDark ? "border-white/10 bg-[#1e1e1e]" : ""}>
          <CardHeader>
            <CardTitle className={`text-xs font-semibold uppercase tracking-widest ${isDark ? "text-[#888]" : "text-muted-foreground"}`}>
              Original
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SwatchGrid theme={theme} />
          </CardContent>
        </Card>
      </li>
      <li>
        <Card className={isDark ? "border-white/10 bg-[#1e1e1e]" : ""}>
          <CardHeader>
            <CardTitle className={`text-xs font-semibold uppercase tracking-widest ${isDark ? "text-[#888]" : "text-muted-foreground"}`}>
              Simulated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SwatchGrid theme={simulated} />
          </CardContent>
        </Card>
      </li>
    </Grid>
  );
}
