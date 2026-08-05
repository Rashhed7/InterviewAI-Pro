import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "dark" | "warm" | "light" | "system";
export type EffectiveTheme = "dark" | "warm" | "light";

interface ThemeContextType {
  theme: Theme;
  effectiveTheme: EffectiveTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("appTheme") as Theme;
      if (saved && ["dark", "warm", "light", "system"].includes(saved)) {
        return saved;
      }
    }
    return "dark";
  });

  const getSystemTheme = (): EffectiveTheme => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: light)").matches) {
      return "light";
    }
    return "dark";
  };

  const effectiveTheme: EffectiveTheme = theme === "system" ? getSystemTheme() : theme;

  const applyTheme = (mode: EffectiveTheme) => {
    const root = document.documentElement;
    root.classList.remove("light", "dark", "warm");
    root.classList.add(mode);
    root.setAttribute("data-theme", mode);
    root.style.colorScheme = mode === "light" || mode === "warm" ? "light" : "dark";
  };

  useEffect(() => {
    applyTheme(effectiveTheme);
    localStorage.setItem("appTheme", theme);
  }, [theme, effectiveTheme]);

  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      applyTheme(mediaQuery.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => {
      if (prev === "dark") return "warm";
      if (prev === "warm") return "light";
      return "dark";
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, effectiveTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

