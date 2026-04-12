import { render, type RenderOptions } from "@testing-library/react";
import { AnnounceProvider } from "@/context/AnnounceContext";
import { ThemeContext } from "@/context/ThemeContext";
import type { ThemeOutput } from "@colorx/core";
import type { ReactElement, ReactNode } from "react";

interface ThemeContextOverrides {
  hex?: string;
  setHex?: (hex: string) => void;
  theme?: ThemeOutput | null;
  isValid?: boolean;
}

function createWrapper(themeOverrides: ThemeContextOverrides = {}) {
  const value = {
    hex: themeOverrides.hex ?? "#6366f1",
    setHex: themeOverrides.setHex ?? (() => {}),
    theme: themeOverrides.theme ?? null,
    isValid: themeOverrides.isValid ?? true,
  };

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <ThemeContext value={value}>
        <AnnounceProvider>{children}</AnnounceProvider>
      </ThemeContext>
    );
  };
}

export function renderWithProviders(
  ui: ReactElement,
  {
    themeOverrides = {},
    ...options
  }: RenderOptions & { themeOverrides?: ThemeContextOverrides } = {}
) {
  return render(ui, { wrapper: createWrapper(themeOverrides), ...options });
}

export { render } from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
