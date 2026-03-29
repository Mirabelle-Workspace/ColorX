import { motion } from "motion/react";
import type { ReactNode, ElementType } from "react";

interface AnimateInProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
}

const OFFSETS = {
  up: { opacity: 0, y: 32 },
  down: { opacity: 0, y: -32 },
  left: { opacity: 0, x: -32 },
  right: { opacity: 0, x: 32 },
  none: { opacity: 0 },
} as const;

export function AnimateIn({
  children,
  as = "div",
  className,
  delay = 0,
  direction = "up",
}: AnimateInProps) {
  const Tag = motion.create(as);

  return (
    <Tag
      initial={OFFSETS[direction]}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay,
      }}
      className={className}
    >
      {children}
    </Tag>
  );
}
