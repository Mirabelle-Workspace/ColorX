import { useMemo, useState } from "react";
import { generateDarkVariants, type DarkVariant } from "@colorx/core";
import { UploadForm, type UploadResult } from "@/components/upload/UploadForm";
import { DarkVariantsTabs } from "@/components/upload/DarkVariantsTabs";
import { Recommendations } from "@/components/upload/Recommendations";
import { Container, Stack } from "@/components/layout/primitives";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function UploadPage() {
  useDocumentTitle("Convert Light to Dark -- ColorX");
  const [uploaded, setUploaded] = useState<UploadResult | null>(null);

  const variants: DarkVariant[] | null = useMemo(() => {
    if (!uploaded) return null;
    return generateDarkVariants(uploaded.theme);
  }, [uploaded]);

  return (
    <Container as="article" className="pb-12">
      <Stack as="header" gap="xs" className="mb-8 items-center text-center">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Convert Light to Dark
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Upload your existing light theme.
        </p>
        <p className="max-w-2xl text-muted-foreground">
          Get three accessible dark theme options, each WCAG AA verified.
        </p>
      </Stack>

      <Stack gap="lg">
        <UploadForm onParsed={setUploaded} />

        {variants && uploaded && (
          <DarkVariantsTabs variants={variants} sourceName={uploaded.fileName} />
        )}

        {uploaded && uploaded.recommendations.length > 0 && (
          <Recommendations
            recommendations={uploaded.recommendations}
            mapped={uploaded.mapped}
            synthesized={uploaded.synthesized}
            totalExtracted={uploaded.totalExtracted}
          />
        )}
      </Stack>
    </Container>
  );
}
