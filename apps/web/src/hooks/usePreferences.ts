import { useSyncExternalStore } from "react";

interface Preferences {
  dark: boolean;
  a11y: boolean;
  lowCarbon: boolean;
}

const STORAGE_KEY = "colorx-preferences";

const DEFAULT: Preferences = {
  dark: false,
  a11y: false,
  lowCarbon: false,
};

let state: Preferences = DEFAULT;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((fn) => fn());
}

function applyClasses(prefs: Preferences) {
  const root = document.documentElement;
  root.classList.toggle("dark", prefs.dark);
  root.classList.toggle("a11y", prefs.a11y);
  root.classList.toggle("low-carbon", prefs.lowCarbon);
}

function persist(prefs: Preferences) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // localStorage unavailable
  }
}

function load(): Preferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT, ...parsed };
    }
  } catch {
    // localStorage unavailable
  }

  // Respect system dark mode preference
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return { ...DEFAULT, dark: true };
  }

  return DEFAULT;
}

// Initialize immediately so classes apply before first paint
if (typeof window !== "undefined") {
  state = load();
  applyClasses(state);
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot(): Preferences {
  return state;
}

function getServerSnapshot(): Preferences {
  return DEFAULT;
}

function toggle(key: keyof Preferences) {
  state = { ...state, [key]: !state[key] };
  applyClasses(state);
  persist(state);
  emit();
}

export function usePreferences() {
  const prefs = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return {
    ...prefs,
    toggleDark: () => toggle("dark"),
    toggleA11y: () => toggle("a11y"),
    toggleLowCarbon: () => toggle("lowCarbon"),
    motionDisabled: prefs.a11y || prefs.lowCarbon,
  };
}
