import type { ElementType, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type StackProps<T extends ElementType = "div"> = {
  as?: T;
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
} & ComponentPropsWithoutRef<T>;

const GAP_MAP = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
};

export function Stack<T extends ElementType = "div">({
  as,
  gap = "md",
  className,
  ...props
}: StackProps<T>) {
  const Tag = as || "div";
  return (
    <Tag
      className={cn("flex flex-col", GAP_MAP[gap], className)}
      {...props}
    />
  );
}
