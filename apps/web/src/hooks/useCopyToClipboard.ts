import { useCallback } from "react";
import { useAnnounce } from "./useAnnounce";

export function useCopyToClipboard() {
  const announce = useAnnounce();

  return useCallback(
    async (text: string, label?: string) => {
      try {
        await navigator.clipboard.writeText(text);
        announce(label ? `Copied ${label}` : `Copied ${text}`);
        return true;
      } catch {
        announce("Failed to copy to clipboard");
        return false;
      }
    },
    [announce]
  );
}
