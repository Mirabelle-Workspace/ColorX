import type { ThemeColors } from "@colorx/core";
import { Swatch } from "./Swatch";

interface SwatchGridProps {
  theme: ThemeColors;
}

export function SwatchGrid({ theme }: SwatchGridProps) {
  return (
    <section
      className="mb-5 grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-3"
      role="group"
      aria-label="Color swatches"
    >
      {Object.entries(theme).map(([name, color]) => (
        <Swatch key={name} name={name} color={color} />
      ))}
    </section>
  );
}
