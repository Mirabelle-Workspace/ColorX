import { relativeLuminance, hexToRgb } from "@colorx/core";
import { Button } from "@/components/ui/button";
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
    <Button
      variant="ghost"
      onClick={() => copy(color, color)}
      className="flex h-auto min-h-[72px] flex-col items-start justify-end rounded-lg border border-black/[0.08] p-3 hover:scale-[1.03]"
      style={{ backgroundColor: color, color: textColor }}
      aria-label={`${label}: ${color}. Click to copy.`}
    >
      <span className="text-[0.7rem] font-semibold uppercase tracking-wide">
        {label}
      </span>
      <span className="font-mono text-xs opacity-80">{color}</span>
    </Button>
  );
}
