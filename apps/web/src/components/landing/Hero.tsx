import { useNavigate } from "react-router";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Flex, Grid, Stack } from "@/components/layout/primitives";
import { AnimateIn } from "@/components/common/AnimateIn";
import { DemoPreview } from "./DemoPreview";

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-br from-[#f8f9ff] via-[#eef1ff] to-[#f5f0ff] px-6 pb-16 pt-20 dark:from-background dark:via-background dark:to-background">
      <Grid as="article" cols={2} gap="xl" className="mx-auto max-w-6xl items-center">
        <AnimateIn direction="left">
          <Stack as="header" gap="lg">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
              Stop Guessing Colors.{" "}
              <br />
              Start Shipping Accessible Themes.
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              Pick one color. Get a complete light and dark theme with every contrast
              ratio checked against WCAG 2.1 and APCA standards. Ready-to-use CSS
              variables in seconds.
            </p>
            <Flex gap="sm" wrap>
              <Button size="lg" onClick={() => navigate("/generator")}>
                Launch the Generator
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/upload")}
              >
                <Upload className="mr-2 size-4" aria-hidden="true" />
                Convert a Theme
              </Button>
            </Flex>
          </Stack>
        </AnimateIn>
        <AnimateIn direction="right" delay={0.2}>
          <DemoPreview />
        </AnimateIn>
      </Grid>
    </section>
  );
}
