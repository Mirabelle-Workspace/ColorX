import { useId, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { FileText, Upload } from "lucide-react";
import { extractTokensFromPdf } from "@/lib/pdf-extract";
import { Button } from "@/components/ui/button";
import { Stack } from "@/components/layout/primitives";
import { useAnnounce } from "@/hooks/useAnnounce";
import type { UploadResult } from "./UploadForm";

interface PdfFormProps {
  onParsed: (result: UploadResult) => void;
}

export function PdfForm({ onParsed }: PdfFormProps) {
  const inputId = useId();
  const helpId = useId();
  const errorId = useId();
  const announce = useAnnounce();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedFileName, setParsedFileName] = useState<string | null>(null);

  async function readFile(file: File): Promise<void> {
    setError(null);
    setLoading(true);
    setParsedFileName(null);

    const result = await extractTokensFromPdf(file);
    setLoading(false);

    if (!result.ok) {
      setError(result.error);
      announce(`PDF import failed: ${result.error}`);
      return;
    }

    setParsedFileName(file.name);
    announce(
      `Extracted ${result.tokens.length} dominant colors from ${result.pages} page${
        result.pages === 1 ? "" : "s"
      } of ${file.name}.`
    );
    onParsed({ tokens: result.tokens, fileName: file.name });
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>): void {
    const file = e.target.files?.[0];
    if (!file) return;
    void readFile(file);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>): void {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    void readFile(file);
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>): void {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(): void {
    setIsDragging(false);
  }

  function openFilePicker(): void {
    fileInputRef.current?.click();
  }

  const dropClass = isDragging
    ? "border-primary bg-primary/5"
    : "border-border bg-background";

  return (
    <Stack gap="md">
      <p id={helpId} className="text-sm text-muted-foreground">
        Drop a PDF (brand book, color chart, screenshot export). We render
        up to the first three pages, extract the dominant non-grayscale
        colors, then build a theme from them. Best for files that already
        show your brand palette as solid color blocks or filled UI.
      </p>

      <div
        role="region"
        aria-label="PDF drop zone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-10 transition-colors ${dropClass}`}
      >
        <Upload className="size-8 text-muted-foreground" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">
          Drag and drop a PDF here, or
        </p>
        <Button
          type="button"
          onClick={openFilePicker}
          variant="secondary"
          disabled={loading}
        >
          {loading ? "Reading PDF..." : "Choose a PDF"}
        </Button>
        <label htmlFor={inputId} className="sr-only">
          PDF file
        </label>
        <input
          ref={fileInputRef}
          id={inputId}
          type="file"
          accept="application/pdf,.pdf"
          onChange={handleFileChange}
          aria-describedby={`${helpId}${error ? ` ${errorId}` : ""}`}
          className="sr-only"
        />
      </div>

      {parsedFileName && !error && !loading && (
        <p className="flex items-center gap-2 text-sm text-foreground">
          <FileText className="size-4" aria-hidden="true" />
          <span>
            Extracted from <strong>{parsedFileName}</strong>
          </span>
        </p>
      )}

      {error && (
        <div
          id={errorId}
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
        >
          {error}
        </div>
      )}
    </Stack>
  );
}
