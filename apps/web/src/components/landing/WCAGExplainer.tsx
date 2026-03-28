import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Container, Grid, Stack } from "@/components/layout/primitives";

const LEVELS = [
  {
    level: "AA Large",
    ratio: "3 : 1",
    description:
      "Minimum for large text (18px bold / 24px regular). Acceptable for UI components and graphical elements.",
  },
  {
    level: "AA",
    ratio: "4.5 : 1",
    description:
      "Minimum for normal-sized body text. The standard most organizations target. This is what the generator enforces by default.",
  },
  {
    level: "AAA",
    ratio: "7 : 1",
    description:
      "Enhanced contrast for maximum readability. Recommended for long-form content and critical UI text.",
  },
];

export function WCAGExplainer() {
  return (
    <Container as="section" size="lg" className="py-20">
      <Stack gap="lg" className="mb-8 items-center text-center">
        <h2 className="text-3xl font-extrabold tracking-tight">
          WCAG Contrast Levels Explained
        </h2>
        <p className="max-w-2xl text-muted-foreground">
          The Web Content Accessibility Guidelines define minimum contrast ratios
          to ensure text is readable by people with low vision.
        </p>
      </Stack>
      <Grid as="ul" cols={3} gap="md">
        {LEVELS.map((item) => (
          <li key={item.level}>
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-2xl">{item.level}</CardTitle>
                <CardDescription className="font-mono">{item.ratio}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          </li>
        ))}
      </Grid>
    </Container>
  );
}
