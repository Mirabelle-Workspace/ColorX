import { ColorForm } from "@/components/color-input/ColorForm";
import { ThemeTabs } from "@/components/theme-display/ThemeTabs";
import { CVDSimulation } from "@/components/cvd/CVDSimulation";
import { CSSOutput } from "@/components/output/CSSOutput";
import { Container, Stack } from "@/components/layout/primitives";
import { useThemeContext } from "@/hooks/useTheme";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function GeneratorPage() {
  useDocumentTitle("Generator -- ColorX");
  const { theme } = useThemeContext();

  return (
    <Container as="article" className="pb-12">
      <Stack as="header" gap="xs" className="mb-8 items-center text-center">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Generate Your Theme
        </h1>
        <p className="text-muted-foreground">
          Pick a color. Get WCAG and APCA-compliant light and dark themes instantly.
        </p>
      </Stack>

      <ColorForm />

      {theme && (
        <Stack gap="lg">
          <ThemeTabs light={theme.light} dark={theme.dark} contrast={theme.contrast} />
          <CVDSimulation light={theme.light} dark={theme.dark} />
          <CSSOutput css={theme.css} />
        </Stack>
      )}
    </Container>
  );
}
