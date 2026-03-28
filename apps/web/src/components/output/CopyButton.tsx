import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

interface CopyButtonProps {
  text: string;
  label?: string;
}

export function CopyButton({ text, label = "CSS variables" }: CopyButtonProps) {
  const copy = useCopyToClipboard();
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    const success = await copy(text, label);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleClick}
      aria-label={`Copy ${label} to clipboard`}
    >
      {copied ? "Copied!" : "Copy"}
    </Button>
  );
}
