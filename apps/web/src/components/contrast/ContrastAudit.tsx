import type { ContrastResult, ThemeColors } from "@colorx/core";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ContrastBadge } from "./ContrastBadge";
import { APCABadge } from "./APCABadge";
import { useAPCA } from "@/hooks/useAPCA";

interface ContrastAuditProps {
  contrast: Record<string, ContrastResult>;
  theme: ThemeColors;
  mode: "light" | "dark";
}

export function ContrastAudit({ contrast, theme, mode }: ContrastAuditProps) {
  const apcaResults = useAPCA(theme);

  return (
    <section className="mt-5 px-4">
      <h3
        className={`mb-3 text-xs font-semibold uppercase tracking-widest ${
          mode === "dark" ? "text-[#aaa]" : "text-muted-foreground"
        }`}
      >
        Contrast Audit
      </h3>
      <Table>
        <TableCaption className="sr-only">
          WCAG 2.1 and APCA contrast results for the {mode} theme
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Pair</TableHead>
            <TableHead>WCAG 2.1</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>APCA</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(contrast).map(([pair, result]) => {
            const apcaMatch = apcaResults.find((a) => a.pair === pair);
            return (
              <TableRow key={pair}>
                <TableCell className="font-mono text-xs">{pair}</TableCell>
                <TableCell className="text-xs">{result.ratio}:1</TableCell>
                <TableCell>
                  <ContrastBadge result={result} />
                </TableCell>
                <TableCell>
                  {apcaMatch && <APCABadge result={apcaMatch.result} />}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </section>
  );
}
