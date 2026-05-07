import { useId } from "react";
import { CheckCircle2, Sparkles, AlertTriangle, Lightbulb } from "lucide-react";
import type { BuildRecommendation, ThemeColors } from "@colorx/core";
import { Card } from "@/components/ui/card";
import { Stack } from "@/components/layout/primitives";

interface RecommendationsProps {
  recommendations: BuildRecommendation[];
  mapped: number;
  synthesized: number;
  totalExtracted: number;
}

interface Group {
  alias: Array<Extract<BuildRecommendation, { kind: "alias" }>>;
  heuristic: Array<Extract<BuildRecommendation, { kind: "heuristic" }>>;
  synthesized: Array<Extract<BuildRecommendation, { kind: "synthesized" }>>;
  unconverted: Array<Extract<BuildRecommendation, { kind: "unconverted" }>>;
  unmapped: Array<Extract<BuildRecommendation, { kind: "unmapped" }>>;
}

function group(recs: BuildRecommendation[]): Group {
  const out: Group = {
    alias: [],
    heuristic: [],
    synthesized: [],
    unconverted: [],
    unmapped: [],
  };
  for (const rec of recs) {
    if (rec.kind === "alias") out.alias.push(rec);
    else if (rec.kind === "heuristic") out.heuristic.push(rec);
    else if (rec.kind === "synthesized") out.synthesized.push(rec);
    else if (rec.kind === "unconverted") out.unconverted.push(rec);
    else if (rec.kind === "unmapped") out.unmapped.push(rec);
  }
  return out;
}

export function Recommendations({
  recommendations,
  mapped,
  synthesized,
  totalExtracted,
}: RecommendationsProps) {
  const headingId = useId();
  const g = group(recommendations);

  return (
    <Stack as="section" gap="md" aria-labelledby={headingId}>
      <h2 id={headingId} className="text-xl font-semibold">
        How we used your tokens
      </h2>

      <Card className="p-6">
        <Stack gap="md">
          <p className="text-sm text-foreground">
            Found <strong>{totalExtracted}</strong> tokens.{" "}
            <strong>{mapped}</strong> mapped to ColorX slots,{" "}
            <strong>{synthesized}</strong> synthesized to complete the palette.
          </p>

          {g.alias.length > 0 && (
            <RecGroup
              icon={<CheckCircle2 className="size-4 text-green-600" aria-hidden="true" />}
              title="Mapped from your tokens"
              items={g.alias.map((r) => ({
                label: r.userName,
                detail: `→ ${r.slot}`,
              }))}
            />
          )}

          {g.heuristic.length > 0 && (
            <RecGroup
              icon={<Lightbulb className="size-4 text-amber-600" aria-hidden="true" />}
              title="Detected by heuristic"
              items={g.heuristic.map((r) => ({
                label: r.userName,
                detail: `→ ${r.slot} (${r.reason})`,
              }))}
            />
          )}

          {g.synthesized.length > 0 && (
            <RecGroup
              icon={<Sparkles className="size-4 text-blue-600" aria-hidden="true" />}
              title="Synthesized from your primary color"
              hint={
                <>
                  Add tokens with these names to your design system to keep
                  full control: {g.synthesized.map((r) => slotLabel(r.slot)).join(", ")}
                </>
              }
              items={g.synthesized.map((r) => ({
                label: slotLabel(r.slot),
                detail: "auto-generated",
              }))}
            />
          )}

          {g.unmapped.length > 0 && (
            <RecGroup
              icon={<Lightbulb className="size-4 text-muted-foreground" aria-hidden="true" />}
              title="Extra colors we did not use"
              hint="These colors are in your file but did not match any ColorX slot. Rename them or use the Generator with one of these as the seed."
              items={g.unmapped.map((r) => ({
                label: r.userName,
                detail: r.hex,
              }))}
            />
          )}

          {g.unconverted.length > 0 && (
            <RecGroup
              icon={<AlertTriangle className="size-4 text-amber-600" aria-hidden="true" />}
              title="Values we could not convert"
              hint="Supported formats: hex, rgb(), rgba(), hsl(), hsla(), shadcn-style HSL. oklch and named colors are not yet supported."
              items={g.unconverted.map((r) => ({
                label: r.userName,
                detail: r.rawValue,
              }))}
            />
          )}
        </Stack>
      </Card>
    </Stack>
  );
}

function slotLabel(slot: keyof ThemeColors): string {
  return slot;
}

interface RecGroupProps {
  icon: React.ReactNode;
  title: string;
  hint?: React.ReactNode;
  items: Array<{ label: string; detail: string }>;
}

function RecGroup({ icon, title, hint, items }: RecGroupProps) {
  const titleId = useId();
  return (
    <div>
      <p
        id={titleId}
        className="mb-1 flex items-center gap-2 text-sm font-semibold"
      >
        {icon}
        <span>{title}</span>
        <span className="text-xs font-normal text-muted-foreground">
          ({items.length})
        </span>
      </p>
      {hint && (
        <p className="mb-2 text-xs text-muted-foreground">{hint}</p>
      )}
      <ul aria-labelledby={titleId} className="flex flex-wrap gap-1">
        {items.map((item, idx) => (
          <li
            key={`${item.label}-${idx}`}
            className="rounded bg-muted px-2 py-0.5 text-xs"
          >
            <span className="font-mono">{item.label}</span>
            <span className="text-muted-foreground"> {item.detail}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
