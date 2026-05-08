import { useEffect, useId, useState, type FormEvent } from "react";
import { ExternalLink, KeyRound } from "lucide-react";
import { extractTokensFromFigma } from "@colorx/core";
import { Button } from "@/components/ui/button";
import { Stack } from "@/components/layout/primitives";
import { useAnnounce } from "@/hooks/useAnnounce";
import type { UploadResult } from "./UploadForm";

interface FigmaFormProps {
  onParsed: (result: UploadResult) => void;
}

const TOKEN_KEY = "colorx.figma_token";

export function FigmaForm({ onParsed }: FigmaFormProps) {
  const urlId = useId();
  const tokenId = useId();
  const errorId = useId();
  const announce = useAnnounce();

  const [url, setUrl] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(TOKEN_KEY);
      if (stored) setToken(stored);
    } catch {
      // sessionStorage unavailable -- fine, just don't persist
    }
  }, []);

  function persistToken(value: string): void {
    try {
      if (value) sessionStorage.setItem(TOKEN_KEY, value);
      else sessionStorage.removeItem(TOKEN_KEY);
    } catch {
      // ignore
    }
  }

  async function handleSubmit(e: FormEvent): Promise<void> {
    e.preventDefault();
    setError(null);
    setLoading(true);
    persistToken(token);

    const result = await extractTokensFromFigma(url, token);
    setLoading(false);

    if (!result.ok) {
      setError(result.error);
      announce(`Figma import failed: ${result.error}`);
      return;
    }

    announce(
      `Imported ${result.tokens.length} colors from Figma file ${result.fileKey}.`
    );
    onParsed({
      tokens: result.tokens,
      fileName: `figma-${result.fileKey}`,
    });
  }

  return (
    <Stack as="form" onSubmit={handleSubmit} gap="md">
      <Stack gap="xs">
        <label htmlFor={urlId} className="text-sm font-medium">
          Figma file URL
        </label>
        <input
          id={urlId}
          type="url"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.figma.com/design/..."
          className="rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </Stack>

      <Stack gap="xs">
        <label htmlFor={tokenId} className="text-sm font-medium">
          Personal access token
        </label>
        <input
          id={tokenId}
          type="password"
          required
          autoComplete="off"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="figd_..."
          aria-describedby={`${tokenId}-help${error ? ` ${errorId}` : ""}`}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <p
          id={`${tokenId}-help`}
          className="flex items-center gap-1 text-xs text-muted-foreground"
        >
          <KeyRound className="size-3" aria-hidden="true" />
          <span>
            Stays in this browser tab only. Never sent to any ColorX server.
          </span>
          <a
            href="https://www.figma.com/developers/api#access-tokens"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 inline-flex items-center gap-1 text-foreground underline"
          >
            How to create one
            <ExternalLink className="size-3" aria-hidden="true" />
          </a>
        </p>
      </Stack>

      <Button type="submit" disabled={loading} className="w-fit">
        {loading ? "Importing..." : "Import from Figma"}
      </Button>

      {error && (
        <div
          id={errorId}
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Best results when your Figma file uses named Color Styles (e.g.
        Brand/Primary, Surface/Background). Style names map directly to
        ColorX slots.
      </p>
    </Stack>
  );
}
