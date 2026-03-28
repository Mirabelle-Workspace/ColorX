import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { ThemeColors, ContrastResult } from "@colorx/core";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [activeTab, setActiveTab] = useState("light");

  const theme = activeTab === "light" ? light : dark;
  const audit = activeTab === "light" ? contrast.light : contrast.dark;
  const mode = activeTab === "light" ? "light" : "dark";

  return (
    <section aria-label="Theme preview" className="mb-10">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="light">Light</TabsTrigger>
          <TabsTrigger value="dark">Dark</TabsTrigger>
        </TabsList>
      </Tabs>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <Card className={mode === "dark" ? "border-white/10 bg-[#1e1e1e] p-6 text-[#e0e0e0]" : "p-6"}>
            <h2 className="mb-4 px-4 text-lg font-bold">{activeTab === "light" ? "Light" : "Dark"} Theme</h2>
            <ThemePreview theme={theme} contrast={audit} mode={mode} />
          </Card>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
