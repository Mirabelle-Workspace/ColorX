import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export function useThemeContext() {
  return useContext(ThemeContext);
}
