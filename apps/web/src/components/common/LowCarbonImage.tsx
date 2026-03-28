import type { ComponentPropsWithoutRef } from "react";
import { usePreferences } from "@/hooks/usePreferences";

type LowCarbonImageProps = ComponentPropsWithoutRef<"img">;

export function LowCarbonImage({ alt, className, ...props }: LowCarbonImageProps) {
  const { lowCarbon } = usePreferences();

  if (lowCarbon) {
    return (
      <span
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center border-2 border-dashed border-muted-foreground/30 bg-muted/50 p-4 text-center text-sm text-muted-foreground ${className ?? ""}`}
        style={{ aspectRatio: props.width && props.height ? `${props.width}/${props.height}` : undefined }}
      >
        {alt}
      </span>
    );
  }

  return <img alt={alt} className={className} {...props} />;
}
