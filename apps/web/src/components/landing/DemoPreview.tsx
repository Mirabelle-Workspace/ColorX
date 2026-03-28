import { useState, useEffect } from "react";
import { adjustLightness, mixColors } from "@colorx/core";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flex, Stack, Grid } from "@/components/layout/primitives";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const DEMO_COLORS = [
  "#6366f1",
  "#ec4899",
  "#14b8a6",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#06b6d4",
  "#84cc16",
];

export function DemoPreview() {
  const [index, setIndex] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % DEMO_COLORS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [reducedMotion]);

  const hex = DEMO_COLORS[index];
  const primary = hex;
  const primaryDark = adjustLightness(hex, 0.6);
  const surface = adjustLightness(hex, 0.97);
  const surfaceD = mixColors(hex, "#1e1e1e", 0.1);
  const border = adjustLightness(hex, 0.78);
  const borderD = mixColors(hex, "#333333", 0.15);

  const swatches = [primary, surface, adjustLightness(hex, 0.93), border];
  const swatchesDark = [primaryDark, surfaceD, mixColors(hex, "#242424", 0.12), borderD];

  return (
    <Card className="w-full overflow-hidden shadow-xl" aria-hidden="true">
      <Flex as="header" gap="xs" align="center" className="bg-muted px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ccc]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#ccc]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#ccc]" />
      </Flex>
      <CardContent className="p-0">
        <Grid cols={2} gap="sm" className="gap-0 grid-cols-1 min-[500px]:grid-cols-2">
          <Stack as="section" gap="sm" className="bg-white p-6">
            <span className="text-[0.7rem] font-bold uppercase tracking-widest opacity-50">
              Light
            </span>
            <Flex gap="xs">
              {swatches.map((c, i) => (
                <span
                  key={i}
                  className="h-9 w-9 rounded-lg border border-black/[0.08]"
                  style={{ backgroundColor: c }}
                />
              ))}
            </Flex>
            <Button
              size="sm"
              className="w-fit"
              style={{ backgroundColor: primary, color: "#fff" }}
            >
              Button
            </Button>
            <Card
              className="border p-3"
              style={{ backgroundColor: surface, borderColor: border }}
            >
              <span className="text-xs font-semibold">Card Component</span>
              <Badge variant="secondary" className="mt-1.5 bg-green-100 text-green-800">
                AA 4.5:1
              </Badge>
            </Card>
          </Stack>
          <Stack as="section" gap="sm" className="bg-[#121212] p-6 text-[#e8e8e8]">
            <span className="text-[0.7rem] font-bold uppercase tracking-widest opacity-50">
              Dark
            </span>
            <Flex gap="xs">
              {swatchesDark.map((c, i) => (
                <span
                  key={i}
                  className="h-9 w-9 rounded-lg border border-white/[0.08]"
                  style={{ backgroundColor: c }}
                />
              ))}
            </Flex>
            <Button
              size="sm"
              className="w-fit"
              style={{ backgroundColor: primaryDark, color: "#000" }}
            >
              Button
            </Button>
            <Card
              className="border p-3"
              style={{ backgroundColor: surfaceD, borderColor: borderD }}
            >
              <span className="text-xs font-semibold text-[#e8e8e8]">Card Component</span>
              <Badge variant="secondary" className="mt-1.5 bg-green-100 text-green-800">
                AA 4.5:1
              </Badge>
            </Card>
          </Stack>
        </Grid>
      </CardContent>
    </Card>
  );
}
