import { SettingsType } from "app/types";

export const DEFAULT_SETTINGS: SettingsType = {
  user: {
    name: "Anonymous",
  },
  fullscreen: false,
  darkmode: true,
  sidebar: {
    open: true,
  },
} as const;
