const THEME_KEY = "tat-portfolio-theme";

type Theme = "light" | "dark";

function getPreferredTheme(): Theme {
  const stored = window.localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

// Apply theme by toggling `.light` / `.dark` classes on the root element.
function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
  window.localStorage.setItem(THEME_KEY, theme);
}

function toggleTheme(): void {
  const root = document.documentElement;
  const current =
    (root.classList.contains("light") ? "light" : root.classList.contains("dark") ? "dark" : null) ??
    getPreferredTheme();
  const next: Theme = current === "light" ? "dark" : "light";
  applyTheme(next);
}

function initThemeToggle(): void {
  const initial = getPreferredTheme();
  applyTheme(initial);

  const toggleButton = document.getElementById("theme-toggle");
  if (toggleButton) {
    toggleButton.addEventListener("click", () => toggleTheme());
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
});
