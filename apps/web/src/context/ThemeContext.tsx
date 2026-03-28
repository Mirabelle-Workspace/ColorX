import { createContext, useMemo, useState, type ReactNode } from "react";
import { generateTheme, type ThemeOutput } from "@colorx/core";

interface ThemeContextValue {
  hex: string;
  setHex: (hex: string) => void;
  theme: ThemeOutput | null;
  isValid: boolean;
}

export const ThemeContext = createContext<ThemeContextValue>({
  hex: "#6366f1",
  setHex: () => {},
  theme: null,
  isValid: true,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [hex, setHex] = useState("#6366f1");

  const isValid = /^#[0-9a-fA-F]{6}$/.test(hex) || /^#[0-9a-fA-F]{3}$/.test(hex);

  const theme = useMemo(() => {
    if (!isValid) return null;
    try {
      return generateTheme(hex);
    } catch {
      return null;
    }
  }, [hex, isValid]);

  return (
    <ThemeContext value={{ hex, setHex, theme, isValid }}>
      {children}
    </ThemeContext>
  );
}
