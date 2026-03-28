import { useState } from "react";
import type { ThemeColors, CVDType } from "@colorx/core";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Flex, Stack } from "@/components/layout/primitives";
import { CVDPreview } from "./CVDPreview";
import { useAnnounce } from "@/hooks/useAnnounce";

interface CVDSimulationProps {
  light: ThemeColors;
  dark: ThemeColors;
}

const CVD_TYPES: { id: CVDType; label: string; description: string }[] = [
  { id: "deuteranopia", label: "Deuteranopia", description: "Red-green (M-cone), ~6% of males" },
  { id: "protanopia", label: "Protanopia", description: "Red-green (L-cone), ~2% of males" },
  { id: "tritanopia", label: "Tritanopia", description: "Blue-yellow (S-cone), rare" },
  { id: "achromatopsia", label: "Achromatopsia", description: "Total color blindness, very rare" },
];

export function CVDSimulation({ light, dark }: CVDSimulationProps) {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const announce = useAnnounce();

  const theme = mode === "light" ? light : dark;

  return (
    <Stack as="section" gap="md" aria-label="Color vision deficiency simulation" className="mt-10">
      <header>
        <h2 className="mb-1 text-xl font-bold">Color Vision Simulation</h2>
        <p className="text-sm text-muted-foreground">
          See how your generated themes appear to people with different types of color vision deficiency.
        </p>
      </header>

      <Tabs
        defaultValue="deuteranopia"
        onValueChange={(val) => {
          const info = CVD_TYPES.find((t) => t.id === val);
          if (info) announce(`Showing ${info.label} simulation`);
        }}
      >
        <Flex as="nav" gap="md" align="center" className="mb-4">
          <TabsList>
            {CVD_TYPES.map((type) => (
              <TabsTrigger key={type.id} value={type.id}>
                {type.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setMode(mode === "light" ? "dark" : "light")}
            aria-label={`Switch to ${mode === "light" ? "dark" : "light"} theme preview`}
          >
            {mode === "light" ? "Dark" : "Light"}
          </Button>
        </Flex>

        {CVD_TYPES.map((type) => (
          <TabsContent key={type.id} value={type.id}>
            <p className="mb-4 text-xs text-muted-foreground">
              {type.label}: {type.description}
            </p>
            <CVDPreview theme={theme} type={type.id} mode={mode} />
          </TabsContent>
        ))}
      </Tabs>
    </Stack>
  );
}
