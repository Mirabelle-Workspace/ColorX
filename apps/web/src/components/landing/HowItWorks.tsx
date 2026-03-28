import { motion } from "motion/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Container, Grid, Stack } from "@/components/layout/primitives";
import { AnimateIn } from "@/components/common/AnimateIn";

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
      <AnimateIn>
        <Stack gap="lg" className="mb-12 items-center text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">
            How It Works
          </h2>
          <p className="max-w-xl text-muted-foreground">
            Three steps. No design degree required.
          </p>
        </Stack>
      </AnimateIn>
      <Grid as="ol" cols={3} gap="lg">
        {STEPS.map((step, i) => (
          <AnimateIn key={step.number} delay={i * 0.1}>
            <motion.li
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
            </motion.li>
          </AnimateIn>
        ))}
      </Grid>
    </Container>
  );
}
