import type { ElementType, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type ContainerProps<T extends ElementType = "div"> = {
  as?: T;
  size?: "sm" | "md" | "lg" | "xl";
} & ComponentPropsWithoutRef<T>;

const SIZE_MAP = {
  sm: "max-w-3xl",
  md: "max-w-4xl",
  lg: "max-w-5xl",
  xl: "max-w-6xl",
};

export function Container<T extends ElementType = "div">({
  as,
  size = "xl",
  className,
  ...props
}: ContainerProps<T>) {
  const Tag = as || "div";
  return (
    <Tag
      className={cn("mx-auto px-6", SIZE_MAP[size], className)}
      {...props}
    />
  );
}
