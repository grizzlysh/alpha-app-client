import { useContext } from "react";
import { ThemeContext, type Theme } from "@/configs/ThemeContext";

interface UseThemeReturn {
  theme: Theme;
  toggleTheme: () => void;
}

export function useTheme(): UseThemeReturn {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
