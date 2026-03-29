import type { ContrastResult } from "@colorx/core";
import { Badge } from "@/components/ui/badge";

interface ContrastBadgeProps {
  result: ContrastResult;
}

export function ContrastBadge({ result }: ContrastBadgeProps) {
  if (result.aaa) {
    return (
      <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" aria-label="Passes WCAG AAA">
        AAA
      </Badge>
    );
  }
  if (result.aa) {
    return (
      <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" aria-label="Passes WCAG AA">
        AA
      </Badge>
    );
  }
  if (result.aaLarge) {
    return (
      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" aria-label="Passes WCAG AA for large text only">
        AA Large
      </Badge>
    );
  }
  return (
    <Badge variant="destructive" aria-label="Fails WCAG contrast requirements">
      Fail
    </Badge>
  );
}
