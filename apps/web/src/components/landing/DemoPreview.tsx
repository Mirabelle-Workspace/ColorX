import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { adjustLightness, mixColors } from "@colorx/core";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stack } from "@/components/layout/primitives";
import { usePreferences } from "@/hooks/usePreferences";

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

function SwatchRow({ colors, borderClass }: { colors: string[]; borderClass: string }) {
  return (
    <motion.div className="flex gap-2">
      {colors.map((c, i) => (
        <motion.span
          key={i}
          className={`h-10 w-10 rounded-lg border ${borderClass}`}
          style={{ backgroundColor: c }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.08, type: "spring", stiffness: 300, damping: 20 }}
        />
      ))}
    </motion.div>
  );
}

export function DemoPreview() {
  const [index, setIndex] = useState(0);
  const [showDark, setShowDark] = useState(false);
  const { lowCarbon, motionDisabled } = usePreferences();

  useEffect(() => {
    if (motionDisabled) return;
    const colorTimer = setInterval(() => {
      setIndex((i) => (i + 1) % DEMO_COLORS.length);
    }, 3000);
    return () => clearInterval(colorTimer);
  }, [motionDisabled]);

  useEffect(() => {
    if (motionDisabled) return;
    const modeTimer = setInterval(() => {
      setShowDark((d) => !d);
    }, 4500);
    return () => clearInterval(modeTimer);
  }, [motionDisabled]);

  if (lowCarbon) {
    return (
      <Card
        role="img"
        aria-label="Demo preview: generates light and dark color themes from a single hex input"
        className="flex min-h-[320px] items-center justify-center border-2 border-dashed p-8 text-center text-sm text-muted-foreground"
      >
        <Stack gap="sm" className="items-center">
          <p className="font-semibold">Theme Preview</p>
          <p>Generates light and dark color palettes from a single hex input with WCAG contrast enforcement.</p>
          <Badge variant="secondary">Low carbon mode -- visual demo disabled</Badge>
        </Stack>
      </Card>
    );
  }

  const hex = DEMO_COLORS[index];
  const primary = hex;
  const primaryDark = adjustLightness(hex, 0.6);
  const surface = adjustLightness(hex, 0.97);
  const surfaceD = mixColors(hex, "#1e1e1e", 0.1);
  const border = adjustLightness(hex, 0.78);
  const borderD = mixColors(hex, "#333333", 0.15);

  const lightSwatches = [primary, surface, adjustLightness(hex, 0.93), border];
  const darkSwatches = [primaryDark, surfaceD, mixColors(hex, "#242424", 0.12), borderD];

  return (
    <Card className="w-full overflow-hidden shadow-xl" aria-hidden="true">
      <header className="flex items-center gap-1.5 bg-muted px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ccc]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#ccc]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#ccc]" />
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${index}-${showDark}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.section
            className="flex flex-col gap-4 p-8"
            animate={{
              backgroundColor: showDark ? "#121212" : "#ffffff",
              color: showDark ? "#e8e8e8" : "#1a1a1a",
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <motion.span
              className="text-[0.65rem] font-bold uppercase tracking-[0.15em]"
              animate={{ opacity: 0.5 }}
            >
              {showDark ? "Dark" : "Light"} Theme
            </motion.span>

            <SwatchRow
              colors={showDark ? darkSwatches : lightSwatches}
              borderClass={showDark ? "border-white/[0.08]" : "border-black/[0.08]"}
            />

            <motion.span
              className="w-fit rounded-lg px-5 py-2.5 text-sm font-semibold"
              animate={{
                backgroundColor: showDark ? primaryDark : primary,
                color: showDark ? "#000" : "#fff",
              }}
              transition={{ duration: 0.8 }}
            >
              Button
            </motion.span>

            <motion.div
              className="rounded-lg border p-4"
              animate={{
                backgroundColor: showDark ? surfaceD : surface,
                borderColor: showDark ? borderD : border,
              }}
              transition={{ duration: 0.8 }}
            >
              <p className="mb-2 text-sm font-semibold">Card Component</p>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                AA 4.5:1
              </Badge>
            </motion.div>

            <motion.div
              className="flex items-center gap-3 text-xs"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <span className="font-mono opacity-60">{hex}</span>
              <Badge variant="outline" className="text-[0.65rem]">
                {showDark ? "Dark" : "Light"}
              </Badge>
            </motion.div>
          </motion.section>
        </motion.div>
      </AnimatePresence>
    </Card>
  );
}
