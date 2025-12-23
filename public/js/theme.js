"use strict";
const THEME_KEY = "tat-portfolio-theme";
function getPreferredTheme() {
    var _a;
    const stored = window.localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") {
        return stored;
    }
    const prefersDark = (_a = window.matchMedia) === null || _a === void 0 ? void 0 : _a.call(window, "(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
}
// Apply theme by toggling `.light` / `.dark` classes on the root element.
function applyTheme(theme) {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    window.localStorage.setItem(THEME_KEY, theme);
}
function toggleTheme() {
    var _a;
    const root = document.documentElement;
    const current = (_a = (root.classList.contains("light") ? "light" : root.classList.contains("dark") ? "dark" : null)) !== null && _a !== void 0 ? _a : getPreferredTheme();
    const next = current === "light" ? "dark" : "light";
    applyTheme(next);
}
function initThemeToggle() {
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
