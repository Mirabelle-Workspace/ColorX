import type { ElementType, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type FlexProps<T extends ElementType = "div"> = {
  as?: T;
  gap?: "none" | "xs" | "sm" | "md" | "lg";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around";
  wrap?: boolean;
  direction?: "row" | "col";
} & ComponentPropsWithoutRef<T>;

const GAP_MAP = {
  none: "gap-0",
  xs: "gap-1.5",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
};

const ALIGN_MAP = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

const JUSTIFY_MAP = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
};

export function Flex<T extends ElementType = "div">({
  as,
  gap = "md",
  align = "start",
  justify = "start",
  wrap = false,
  direction = "row",
  className,
  ...props
}: FlexProps<T>) {
  const Tag = as || "div";
  return (
    <Tag
      className={cn(
        "flex",
        direction === "col" ? "flex-col" : "flex-row",
        GAP_MAP[gap],
        ALIGN_MAP[align],
        JUSTIFY_MAP[justify],
        wrap && "flex-wrap",
        className
      )}
      {...props}
    />
  );
}
