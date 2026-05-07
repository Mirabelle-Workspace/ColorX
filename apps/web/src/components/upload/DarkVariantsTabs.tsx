import { useId, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Download } from "lucide-react";
import {
  type DarkVariant,
  type DarkVariantId,
  variantToCss,
} from "@colorx/core";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stack } from "@/components/layout/primitives";
import { ThemePreview } from "@/components/theme-display/ThemePreview";
import { CopyButton } from "@/components/output/CopyButton";
import { useAnnounce } from "@/hooks/useAnnounce";

interface DarkVariantsTabsProps {
  variants: DarkVariant[];
  sourceName: string;
}

export function DarkVariantsTabs({ variants, sourceName }: DarkVariantsTabsProps) {
  const headingId = useId();
  const announce = useAnnounce();
  const [activeId, setActiveId] = useState<DarkVariantId>(variants[0].id);
  const active = variants.find((v) => v.id === activeId) ?? variants[0];
  const css = variantToCss(active);

  function handleDownload(): void {
    const blob = new Blob([css], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const baseName = sourceName.replace(/\.[^.]+$/, "");
    link.href = url;
    link.download = `${baseName}-dark-${active.id}.css`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    announce(`Downloaded ${active.name} dark theme.`);
  }

  function handleTabChange(value: string | number | null): void {
    if (typeof value !== "string") return;
    const next = variants.find((v) => v.id === value);
    if (!next) return;
    setActiveId(next.id);
    announce(`${next.name} dark theme selected.`);
  }

  return (
    <Stack as="section" gap="md" aria-labelledby={headingId}>
      <h2 id={headingId} className="text-xl font-semibold">
        Dark theme options
      </h2>

      <Tabs value={activeId} onValueChange={handleTabChange}>
        <TabsList aria-label="Dark theme variants">
          {variants.map((v) => (
            <TabsTrigger key={v.id} value={v.id}>
              {v.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <p className="text-sm text-muted-foreground">{active.description}</p>

      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <Card className="border-white/10 bg-[#1e1e1e] p-6 text-[#e0e0e0]">
            <h3 className="mb-4 px-4 text-lg font-bold">{active.name}</h3>
            <ThemePreview
              theme={active.colors}
              contrast={active.contrast}
              mode="dark"
            />
          </Card>
        </motion.div>
      </AnimatePresence>

      <Stack gap="xs" aria-label={`${active.name} CSS output`}>
        <Card className="bg-[#1e1e1e] text-[#d4d4d4]">
          <div className="flex items-center justify-between border-b border-white/5 px-6 py-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#aaa]">
              CSS Variables
            </span>
            <div className="flex items-center gap-2">
              <CopyButton text={css} label={`${active.name} dark theme CSS`} />
              <Button
                variant="secondary"
                size="sm"
                onClick={handleDownload}
                aria-label={`Download ${active.name} dark theme CSS file`}
              >
                <Download className="mr-1 size-4" aria-hidden="true" />
                Download
              </Button>
            </div>
          </div>
          <pre className="overflow-x-auto p-6 text-[0.8rem] leading-relaxed">
            <code>{css}</code>
          </pre>
        </Card>
      </Stack>
    </Stack>
  );
}
