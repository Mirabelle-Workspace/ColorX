import { Card } from "@/components/ui/card";

interface ColorPickerProps {
  value: string;
  onChange: (hex: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <Card className="flex-row items-center gap-3 px-4 py-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Color picker"
        className="h-12 w-12 cursor-pointer rounded-lg border-none bg-transparent"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => {
          const val = e.target.value.startsWith("#")
            ? e.target.value
            : "#" + e.target.value;
          if (val.length <= 7) onChange(val);
        }}
        aria-label="Hex color value"
        maxLength={7}
        spellCheck={false}
        className="w-28 border-none bg-transparent font-mono text-lg uppercase outline-none"
      />
    </Card>
  );
}
