import type { APCAResult } from "@colorx/core";
import { Badge } from "@/components/ui/badge";

interface APCABadgeProps {
  result: APCAResult;
}

const LEVEL_STYLES = {
  body: "bg-green-100 text-green-800",
  heading: "bg-green-100 text-green-800",
  "non-text": "bg-yellow-100 text-yellow-800",
  fail: "bg-red-100 text-red-800",
};

const LEVEL_LABELS = {
  body: "Body text",
  heading: "Headings",
  "non-text": "Non-text",
  fail: "Fail",
};

export function APCABadge({ result }: APCABadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={LEVEL_STYLES[result.level]}
      aria-label={`APCA Lc ${Math.abs(result.Lc).toFixed(1)}, ${LEVEL_LABELS[result.level]}`}
    >
      Lc {Math.abs(result.Lc).toFixed(1)}
    </Badge>
  );
}
