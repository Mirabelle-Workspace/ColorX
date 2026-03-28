import type { ThemeColors, ContrastResult } from "@colorx/core";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ThemePreview } from "./ThemePreview";

interface ThemeTabsProps {
  light: ThemeColors;
  dark: ThemeColors;
  contrast: {
    light: Record<string, ContrastResult>;
    dark: Record<string, ContrastResult>;
  };
}

export function ThemeTabs({ light, dark, contrast }: ThemeTabsProps) {
  return (
    <section aria-label="Theme preview" className="mb-10">
      <Tabs defaultValue="light">
        <TabsList className="mb-6">
          <TabsTrigger value="light">Light</TabsTrigger>
          <TabsTrigger value="dark">Dark</TabsTrigger>
        </TabsList>

        <TabsContent value="light">
          <Card className="p-6">
            <h2 className="mb-4 px-4 text-lg font-bold">Light Theme</h2>
            <ThemePreview theme={light} contrast={contrast.light} mode="light" />
          </Card>
        </TabsContent>

        <TabsContent value="dark">
          <Card className="border-white/10 bg-[#1e1e1e] p-6 text-[#e0e0e0]">
            <h2 className="mb-4 px-4 text-lg font-bold">Dark Theme</h2>
            <ThemePreview theme={dark} contrast={contrast.dark} mode="dark" />
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}
