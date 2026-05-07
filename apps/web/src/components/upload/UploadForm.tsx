import { useId, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { Upload, FileText } from "lucide-react";
import {
  extractTokens,
  buildLightThemeFromTokens,
  type BuildRecommendation,
  type ThemeColors,
} from "@colorx/core";
import { Button } from "@/components/ui/button";
import { Stack } from "@/components/layout/primitives";
import { useAnnounce } from "@/hooks/useAnnounce";

export interface UploadResult {
  theme: ThemeColors;
  recommendations: BuildRecommendation[];
  mapped: number;
  synthesized: number;
  totalExtracted: number;
  fileName: string;
}

interface UploadFormProps {
  onParsed: (result: UploadResult) => void;
}

const ACCEPTED_EXT = [".json", ".js", ".mjs", ".cjs", ".ts", ".tsx", ".css"];
const ACCEPT_ATTR = ACCEPTED_EXT.join(",");

interface UploadError {
  fileName: string;
  message: string;
}

export function UploadForm({ onParsed }: UploadFormProps) {
  const inputId = useId();
  const helpId = useId();
  const errorId = useId();
  const announce = useAnnounce();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<UploadError | null>(null);
  const [parsedFileName, setParsedFileName] = useState<string | null>(null);

  async function readFile(file: File): Promise<void> {
    setError(null);
    const text = await file.text();
    const extracted = extractTokens(text, file.name);

    if (extracted.tokens.length === 0) {
      setError({
        fileName: file.name,
        message:
          "We could not find any color tokens in this file. Make sure your file contains hex, rgb, hsl, or shadcn-style HSL color values.",
      });
      setParsedFileName(null);
      announce(`No color tokens found in ${file.name}.`);
      return;
    }

    const built = buildLightThemeFromTokens(extracted.tokens);
    if (!built.ok) {
      setError({
        fileName: file.name,
        message:
          "We extracted tokens, but none of the values could be converted to a usable color. Supported formats: hex, rgb(), rgba(), hsl(), hsla(), and shadcn-style space-separated HSL.",
      });
      setParsedFileName(null);
      announce(`Could not convert any colors in ${file.name}.`);
      return;
    }

    setParsedFileName(file.name);
    announce(
      `Parsed ${file.name}. ${built.mapped} colors mapped, ${built.synthesized} synthesized. Three dark theme options generated.`
    );
    onParsed({
      theme: built.theme,
      recommendations: built.recommendations,
      mapped: built.mapped,
      synthesized: built.synthesized,
      totalExtracted: extracted.tokens.length,
      fileName: file.name,
    });
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
    <Stack as="section" gap="md" aria-labelledby={`${inputId}-label`}>
      <h2 id={`${inputId}-label`} className="text-xl font-semibold">
        Upload a light theme
      </h2>
      <p id={helpId} className="text-sm text-muted-foreground">
        Drop any JSON, JS, TS, or CSS file with color tokens. We will extract
        what we can recognize, fill in any gaps from your primary color, and
        generate three dark theme options. Files are parsed locally and never
        uploaded to a server.
      </p>

      <div
        role="region"
        aria-label="File drop zone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-10 transition-colors ${dropClass}`}
      >
        <Upload className="size-8 text-muted-foreground" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">
          Drag and drop a theme file here, or
        </p>
        <Button type="button" onClick={openFilePicker} variant="secondary">
          Choose a file
        </Button>
        <label htmlFor={inputId} className="sr-only">
          Theme file
        </label>
        <input
          ref={fileInputRef}
          id={inputId}
          type="file"
          accept={ACCEPT_ATTR}
          onChange={handleFileChange}
          aria-describedby={`${helpId}${error ? ` ${errorId}` : ""}`}
          className="sr-only"
        />
        <p className="text-xs text-muted-foreground">
          Accepted: {ACCEPTED_EXT.join(", ")}
        </p>
      </div>

      {parsedFileName && !error && (
        <p className="flex items-center gap-2 text-sm text-foreground">
          <FileText className="size-4" aria-hidden="true" />
          <span>
            Parsed <strong>{parsedFileName}</strong>
          </span>
        </p>
      )}

      {error && (
        <div
          id={errorId}
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/5 p-4"
        >
          <p className="mb-1 text-sm font-semibold text-destructive">
            Could not parse {error.fileName}
          </p>
          <p className="text-sm text-destructive/80">{error.message}</p>
        </div>
      )}
    </Stack>
  );
}
