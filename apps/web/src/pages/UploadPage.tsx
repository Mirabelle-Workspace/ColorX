import { useMemo, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import {
  buildThemeFromTokens,
  generateDarkVariants,
  generateLightVariants,
  type ThemeMode,
} from "@colorx/core";
import { SourceTabs } from "@/components/upload/SourceTabs";
import { type UploadResult } from "@/components/upload/UploadForm";
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

  const lightVariants = useMemo(() => {
    if (!built || !built.ok) return null;
    return generateLightVariants(built.theme);
  }, [built]);

  const darkVariants = useMemo(() => {
    if (!built || !built.ok) return null;
    return generateDarkVariants(built.theme);
  }, [built]);

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
          Import Theme
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Import tokens from supported sources and convert them into accessible theme variants.
        </p>
        <p className="max-w-2xl text-muted-foreground">
          Review how ColorX mapped imported values and generated accessible light and dark options.
        </p>
      </Stack>

      <Stack gap="lg">
        <SourceTabs onParsed={handleParsed} />

        {built && built.ok && lightVariants && darkVariants && (
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
                  -- showing both light and dark variants
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
              variants={lightVariants}
              mode="light"
              sourceName={uploaded!.fileName}
              heading="Light theme options"
            />

            <VariantsTabs
              variants={darkVariants}
              mode="dark"
              sourceName={uploaded!.fileName}
              heading="Dark theme options"
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