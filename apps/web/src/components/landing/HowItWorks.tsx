import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Container, Grid, Stack } from "@/components/layout/primitives";

const STEPS = [
  {
    number: 1,
    title: "Pick a Color",
    description:
      "Use the color picker or type any hex code. This becomes your brand's primary color -- the foundation of both themes.",
  },
  {
    number: 2,
    title: "Themes Are Generated",
    description:
      "The engine converts your color to HSL, then derives 15 design tokens for light and dark modes: backgrounds, surfaces, text hierarchy, borders, and semantic colors.",
  },
  {
    number: 3,
    title: "Contrast Is Enforced",
    description:
      "Every text/background pair is checked against WCAG 2.1 and APCA. Colors that fail are automatically adjusted along their lightness axis until they pass.",
  },
];

export function HowItWorks() {
  return (
    <Container as="section" size="lg" className="py-20">
      <Stack gap="lg" className="mb-12 items-center text-center">
        <h2 className="text-3xl font-extrabold tracking-tight">
          How It Works
        </h2>
        <p className="max-w-xl text-muted-foreground">
          Three steps. No design degree required.
        </p>
      </Stack>
      <Grid as="ol" cols={3} gap="lg">
        {STEPS.map((step) => (
          <li key={step.number}>
            <Card className="text-center">
              <CardHeader className="items-center">
                <span className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  {step.number}
                </span>
                <CardTitle>{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          </li>
        ))}
      </Grid>
    </Container>
  );
}
