import { useState } from "react";
import { FileCode, Layers, FileText } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Stack } from "@/components/layout/primitives";
import { UploadForm, type UploadResult } from "./UploadForm";
import { FigmaForm } from "./FigmaForm";
import { PdfForm } from "./PdfForm";

interface SourceTabsProps {
  onParsed: (result: UploadResult) => void;
}

type SourceId = "file" | "figma" | "pdf";

export function SourceTabs({ onParsed }: SourceTabsProps) {
  const [active, setActive] = useState<SourceId>("file");

  return (
    <Stack gap="md">
      <Tabs
        value={active}
        onValueChange={(value) => {
          if (typeof value === "string") setActive(value as SourceId);
        }}
      >
        <TabsList aria-label="Theme source">
          <TabsTrigger value="file">
            <FileCode aria-hidden="true" />
            File
          </TabsTrigger>
          <TabsTrigger value="figma">
            <Layers aria-hidden="true" />
            Figma
          </TabsTrigger>
          <TabsTrigger value="pdf">
            <FileText aria-hidden="true" />
            PDF
          </TabsTrigger>
        </TabsList>
        <TabsContent value="file">
          <UploadForm onParsed={onParsed} />
        </TabsContent>
        <TabsContent value="figma">
          <Stack gap="md">
            <h2 className="text-xl font-semibold">Import from Figma</h2>
            <FigmaForm onParsed={onParsed} />
          </Stack>
        </TabsContent>
        <TabsContent value="pdf">
          <Stack gap="md">
            <h2 className="text-xl font-semibold">Extract from PDF</h2>
            <PdfForm onParsed={onParsed} />
          </Stack>
        </TabsContent>
      </Tabs>
    </Stack>
  );
}