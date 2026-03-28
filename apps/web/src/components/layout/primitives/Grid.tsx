import type { ElementType, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type GridProps<T extends ElementType = "div"> = {
  as?: T;
  cols?: 1 | 2 | 3 | 4;
  gap?: "sm" | "md" | "lg" | "xl";
} & ComponentPropsWithoutRef<T>;

const COLS_MAP = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
};

const GAP_MAP = {
  sm: "gap-4",
  md: "gap-6",
  lg: "gap-8",
  xl: "gap-10",
};

export function Grid<T extends ElementType = "div">({
  as,
  cols = 2,
  gap = "md",
  className,
  ...props
}: GridProps<T>) {
  const Tag = as || "div";
  return (
    <Tag
      className={cn("grid", COLS_MAP[cols], GAP_MAP[gap], className)}
      {...props}
    />
  );
}
