import type { ReactNode } from "react";
import { motion } from "motion/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Container, Flex, Grid, Stack } from "@/components/layout/primitives";
import { AnimateIn } from "@/components/common/AnimateIn";
import { ScanEye, Code, Palette, Eye } from "lucide-react";

interface Feature {
  icon: ReactNode;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: <ScanEye className="h-5 w-5" />,
    title: "WCAG + APCA Contrast Audit",
    description:
      "Every foreground/background pair is tested against WCAG 2.1 AA/AAA and APCA Lc thresholds. See exact ratios and pass/fail status for each.",
  },
  {
    icon: <Code className="h-5 w-5" />,
    title: "Copy-Paste CSS Variables",
    description:
      "Get a complete CSS block with custom properties that support both prefers-color-scheme media queries and data-theme attribute toggling.",
  },
  {
    icon: <Palette className="h-5 w-5" />,
    title: "Design Tokens",
    description:
      "Background, surface, primary, text hierarchy, borders, and semantic colors. Everything you need for a production-ready color system.",
  },
  {
    icon: <Eye className="h-5 w-5" />,
    title: "Color Vision Simulation",
    description:
      "Preview how your themes appear to people with deuteranopia, protanopia, tritanopia, and achromatopsia before shipping.",
  },
];

export function Features() {
  return (
    <section className="bg-muted/50 py-16">
      <Container size="lg">
        <AnimateIn>
          <Stack gap="lg" className="mb-12 items-center text-center">
            <h2 className="text-3xl font-extrabold tracking-tight">
              What You Get
            </h2>
            <p className="text-muted-foreground">
              Everything you need to go from a single hex code to a production-ready color system.
            </p>
          </Stack>
        </AnimateIn>
        <Grid as="ul" cols={2} gap="md">
          {FEATURES.map((feature, i) => (
            <AnimateIn as="li" key={feature.title} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <Card>
                  <CardHeader>
                    <Flex align="center" gap="sm">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        {feature.icon}
                      </span>
                      <CardTitle>{feature.title}</CardTitle>
                    </Flex>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimateIn>
          ))}
        </Grid>
      </Container>
    </section>
  );
}
