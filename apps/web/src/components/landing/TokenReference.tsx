import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Container, Stack } from "@/components/layout/primitives";

const TOKENS = [
  ["background", "Page-level background. White in light mode, near-black in dark mode."],
  ["surface", "Cards, modals, dropdowns -- anything that sits above the background."],
  ["surfaceAlt", "Alternate surface for visual separation (table rows, sidebars)."],
  ["primary", "Your brand color, adjusted for contrast. Buttons, links, active states."],
  ["primaryHover", "Slightly darker (light) or lighter (dark) variant for hover/focus states."],
  ["primaryText", "Text color that sits on top of the primary color (e.g., button labels)."],
  ["text", "Primary body text. Meets AAA (7:1) against the background."],
  ["textSecondary", "Descriptions, subtitles. Meets AA (4.5:1)."],
  ["textMuted", "Timestamps, captions, placeholders. Meets AA Large (3:1)."],
  ["border", "Default border for inputs, dividers, and outlines."],
  ["borderLight", "Subtle border for cards and low-emphasis separators."],
  ["success", "Positive states: confirmations, completed actions, valid inputs."],
  ["warning", "Caution states: alerts, approaching limits, non-blocking issues."],
  ["error", "Destructive/error states: validation errors, failed actions."],
  ["info", "Informational: tips, links, neutral highlights."],
] as const;

export function TokenReference() {
  return (
    <section className="bg-muted/50 py-16">
      <Container size="lg">
        <Stack gap="lg" className="mb-8 items-center text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Token Reference
          </h2>
          <p className="max-w-xl text-muted-foreground">
            Here's what each generated token is designed for.
          </p>
        </Stack>
        <Card className="mx-auto max-w-3xl">
          <CardHeader className="sr-only">
            <CardTitle>Design tokens</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Token</TableHead>
                  <TableHead>Purpose</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {TOKENS.map(([name, desc]) => (
                  <TableRow key={name}>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono">
                        {name}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{desc}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Container>
    </section>
  );
}
