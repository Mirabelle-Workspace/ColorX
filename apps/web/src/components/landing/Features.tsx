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
      "Check foreground and background pairs against WCAG 2.1 and APCA thresholds, with clear pass/fail reporting.",
  },
  {
    icon: <Code className="h-5 w-5" />,
    title: "CSS Custom Properties Export",
    description:
      "Export a token set as CSS variables for use in applications that support light and dark themes.",
  },
  {
    icon: <Palette className="h-5 w-5" />,
    title: "Design Token Generation",
    description:
      "Generate tokens for backgrounds, surfaces, text, borders, and semantic UI states from a single source color.",
  },
  {
    icon: <Eye className="h-5 w-5" />,
    title: "Color Vision Simulation",
    description:
      "Preview how generated themes appear across common color vision deficiency modes.",
  },
];

export function Features() {
  return (
    <section className="bg-muted/50 py-16">
      <Container size="lg">
        <AnimateIn>
          <Stack gap="lg" className="mb-12 items-center text-center">
            <h2 className="text-3xl font-extrabold tracking-tight">
              Features
            </h2>
            <p className="text-muted-foreground">
              A focused workflow for generating, validating, and exporting accessible color themes.
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