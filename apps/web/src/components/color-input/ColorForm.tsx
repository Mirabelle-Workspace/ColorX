import { useState, type FormEvent } from "react";
import { ColorPicker } from "./ColorPicker";
import { Button } from "@/components/ui/button";
import { useThemeContext } from "@/hooks/useTheme";
import { useAnnounce } from "@/hooks/useAnnounce";

export function ColorForm() {
  const { hex, setHex } = useThemeContext();
  const announce = useAnnounce();
  const [localHex, setLocalHex] = useState(hex);

  const isValid =
    /^#[0-9a-fA-F]{6}$/.test(localHex) ||
    /^#[0-9a-fA-F]{3}$/.test(localHex);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    setHex(localHex);
    announce(`Theme generated for ${localHex}`);
  }

  function handlePickerChange(value: string) {
    setLocalHex(value);
    if (/^#[0-9a-fA-F]{6}$/.test(value)) {
      setHex(value);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-10 flex flex-wrap items-center justify-center gap-4"
    >
      <fieldset className="contents">
        <legend className="sr-only">Pick a color</legend>
        <ColorPicker value={localHex} onChange={handlePickerChange} />
        <Button type="submit" size="lg" disabled={!isValid}>
          Generate Theme
        </Button>
      </fieldset>
    </form>
  );
}
