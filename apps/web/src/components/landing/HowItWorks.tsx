import { motion } from "motion/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Container, Grid, Stack } from "@/components/layout/primitives";
import { AnimateIn } from "@/components/common/AnimateIn";

const STEPS = [
  {
    number: 1,
    title: "Choose a source color",
    description:
      "Start with a hex color that represents your brand, product, or visual direction.",
  },
  {
    number: 2,
    title: "Generate theme tokens",
    description:
      "ColorX derives a structured set of light and dark theme tokens for common UI roles.",
  },
  {
    number: 3,
    title: "Validate accessibility",
    description:
      "The generated theme is checked against WCAG 2.1 and APCA, and failing values are adjusted to meet the target contrast thresholds.",
  },
];

export function HowItWorks() {
  return (
    <Container as="section" size="lg" className="py-20">
      <AnimateIn>
        <Stack gap="lg" className="mb-12 items-center text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">
            How It Works
          </h2>
          <p className="max-w-xl text-muted-foreground">
            A simple workflow for building accessible color themes.
          </p>
        </Stack>
      </AnimateIn>
      <Grid as="ol" cols={3} gap="lg">
        {STEPS.map((step, i) => (
          <AnimateIn as="li" key={step.number} delay={i * 0.1}>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <Card>
                <CardHeader className="flex flex-col items-center text-center">
                  <motion.span
                    className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    {step.number}
                  </motion.span>
                  <CardTitle>{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-left text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </AnimateIn>
        ))}
      </Grid>
    </Container>
  );
}