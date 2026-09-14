export const THEME_IDS = ["light", "dark", "gold", "ocean", "classic"] as const;

export type ThemeId = (typeof THEME_IDS)[number];

export type ThemeMeta = {
  id: ThemeId;
  label: string;
  description: string;
  /** Themes that need the light wordmark / Tailwind `dark:` utilities. */
  isDark: boolean;
  /** Swatch colors shown in the theme picker. */
  swatch: [string, string, string];
};

export const THEMES: ThemeMeta[] = [
  {
    id: "light",
    label: "Light",
    description: "Clean daylight default",
    isDark: false,
    swatch: ["#fafaf9", "#12162c", "#c8912f"],
  },
  {
    id: "dark",
    label: "Night",
    description: "Deep navy",
    isDark: true,
    swatch: ["#0b0e1f", "#eef0f6", "#e3ac4c"],
  },
  {
    id: "gold",
    label: "Prestige",
    description: "Warm gold on charcoal",
    isDark: true,
    swatch: ["#14110e", "#f3ebe0", "#d4a54a"],
  },
  {
    id: "ocean",
    label: "Ocean",
    description: "Cool blue-teal trust",
    isDark: true,
    swatch: ["#07151c", "#e6f2f4", "#3ea8a0"],
  },
  {
    id: "classic",
    label: "Classic",
    description: "Crisp editorial paper",
    isDark: false,
    swatch: ["#f5f7fa", "#12162c", "#b8892e"],
  },
];

export const THEME_STORAGE_KEY = "aurix-theme";

export function isThemeId(value: string | null | undefined): value is ThemeId {
  return THEME_IDS.includes(value as ThemeId);
}

export function resolveTheme(value: string | null | undefined): ThemeId {
  if (isThemeId(value)) return value;
  return "light";
}

export function getThemeMeta(id: ThemeId): ThemeMeta {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}

/** Apply theme to <html>: data-theme, .dark flag, and localStorage. */
export function applyTheme(theme: ThemeId) {
  const meta = getThemeMeta(theme);
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.classList.toggle("dark", meta.isDark);
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
}
