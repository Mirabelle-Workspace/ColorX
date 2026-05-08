import { useMemo, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import {
  buildThemeFromTokens,
  generateDarkVariants,
  generateLightVariants,
  type ThemeMode,
} from "@colorx/core";
import { UploadForm, type UploadResult } from "@/components/upload/UploadForm";
import { VariantsTabs } from "@/components/upload/VariantsTabs";
import { Recommendations } from "@/components/upload/Recommendations";
import { Button } from "@/components/ui/button";
import { Container, Flex, Stack } from "@/components/layout/primitives";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function UploadPage() {
  useDocumentTitle("Convert Theme -- ColorX");
  const [uploaded, setUploaded] = useState<UploadResult | null>(null);
  const [forceMode, setForceMode] = useState<ThemeMode | undefined>(undefined);

  const built = useMemo(() => {
    if (!uploaded) return null;
    return buildThemeFromTokens(uploaded.tokens, { forceMode });
  }, [uploaded, forceMode]);

  // The variants we show are the OPPOSITE polarity of the uploaded theme.
  // If you uploaded a light theme, you get dark variants and vice versa.
  const targetMode: ThemeMode | null = useMemo(() => {
    if (!built || !built.ok) return null;
    return built.mode === "light" ? "dark" : "light";
  }, [built]);

  const variants = useMemo(() => {
    if (!built || !built.ok || !targetMode) return null;
    return targetMode === "dark"
      ? generateDarkVariants(built.theme)
      : generateLightVariants(built.theme);
  }, [built, targetMode]);

  function handleParsed(result: UploadResult): void {
    setUploaded(result);
    setForceMode(undefined);
  }

  function flipDirection(): void {
    if (!built || !built.ok) return;
    setForceMode(built.mode === "light" ? "dark" : "light");
  }

  return (
    <Container as="article" className="pb-12">
      <Stack as="header" gap="xs" className="mb-8 items-center text-center">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Convert Theme
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Upload a light theme or a dark theme.
        </p>
        <p className="max-w-2xl text-muted-foreground">
          Get three accessible variants of the opposite polarity, each WCAG AA verified.
        </p>
      </Stack>

      <Stack gap="lg">
        <UploadForm onParsed={handleParsed} />

        {built && built.ok && targetMode && variants && (
          <>
            <Flex
              align="center"
              justify="between"
              gap="md"
              wrap
              className="rounded-md border border-border bg-muted/40 px-4 py-3"
              aria-live="polite"
            >
              <p className="text-sm">
                <span className="font-medium">
                  {built.mode === "light" ? "Light theme" : "Dark theme"}
                </span>{" "}
                detected{" "}
                <span className="text-muted-foreground">
                  -- generating {targetMode} variants
                </span>
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={flipDirection}
                aria-label={`Treat upload as ${
                  built.mode === "light" ? "dark" : "light"
                } theme instead`}
              >
                <ArrowLeftRight className="mr-1.5 size-3.5" aria-hidden="true" />
                Detected wrong? Flip direction
              </Button>
            </Flex>

            <VariantsTabs
              variants={variants}
              mode={targetMode}
              sourceName={uploaded!.fileName}
              heading={
                targetMode === "dark"
                  ? "Dark theme options"
                  : "Light theme options"
              }
            />

            {built.recommendations.length > 0 && (
              <Recommendations
                recommendations={built.recommendations}
                mapped={built.mapped}
                synthesized={built.synthesized}
                totalExtracted={uploaded!.tokens.length}
              />
            )}
          </>
        )}
      </Stack>
    </Container>
  );
}
