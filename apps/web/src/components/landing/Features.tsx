import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Container, Grid, Stack } from "@/components/layout/primitives";

const FEATURES = [
  {
    icon: "Aa",
    title: "WCAG + APCA Contrast Audit",
    description:
      "Every foreground/background pair is tested against WCAG 2.1 AA/AAA and APCA Lc thresholds. See exact ratios and pass/fail status for each.",
  },
  {
    icon: "</>",
    title: "Copy-Paste CSS Variables",
    description:
      "Get a complete CSS block with custom properties that support both prefers-color-scheme media queries and data-theme attribute toggling.",
  },
  {
    icon: "15",
    title: "15 Design Tokens",
    description:
      "Background, surface, primary, text hierarchy, borders, and semantic colors. Everything you need for a production-ready color system.",
  },
  {
    icon: "CVD",
    title: "Color Vision Simulation",
    description:
      "Preview how your themes appear to people with deuteranopia, protanopia, tritanopia, and achromatopsia before shipping.",
  },
];

export function Features() {
  return (
    <section className="bg-muted/50 py-16">
      <Container size="lg">
        <Stack gap="lg" className="mb-12 items-center text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">
            What You Get
          </h2>
          <p className="max-w-xl text-muted-foreground">
            Everything you need to go from a single hex code to a production-ready
            color system.
          </p>
        </Stack>
        <Grid as="ul" cols={2} gap="md">
          {FEATURES.map((feature) => (
            <li key={feature.title}>
              <Card>
                <CardHeader>
                  <Badge variant="secondary" className="mb-1 w-fit text-sm font-bold">
                    {feature.icon}
                  </Badge>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </li>
          ))}
        </Grid>
      </Container>
    </section>
  );
}
