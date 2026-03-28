import { motion } from "motion/react";
import { relativeLuminance, hexToRgb } from "@colorx/core";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

interface SwatchProps {
  name: string;
  color: string;
}

function textColorFor(bg: string): string {
  return relativeLuminance(hexToRgb(bg)) > 0.179 ? "#000000" : "#ffffff";
}

export function Swatch({ name, color }: SwatchProps) {
  const copy = useCopyToClipboard();
  const textColor = textColorFor(color);
  const label = name.replace(/([A-Z])/g, " $1").trim();

  return (
    <motion.button
      type="button"
      onClick={() => copy(color, color)}
      className="flex min-h-[72px] cursor-pointer flex-col items-start justify-end rounded-lg border border-black/[0.08] p-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      style={{ backgroundColor: color, color: textColor }}
      aria-label={`${label}: ${color}. Click to copy.`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <span className="text-[0.7rem] font-semibold uppercase tracking-wide">
        {label}
      </span>
      <span className="font-mono text-xs opacity-80">{color}</span>
    </motion.button>
  );
}
