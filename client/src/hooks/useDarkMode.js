import { useEffect, useState } from "react";

const THEME_KEY = "restaurant_theme";

const getInitialTheme = () => {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored) {
    return stored;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const useDarkMode = () => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return { theme, toggleTheme };
};
