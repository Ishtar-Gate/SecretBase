import React, { useCallback, useEffect } from "react";
import { readOrCreateText } from "app/utils/file";
import { useSettingsStore } from "./settings.slice";
import { ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
// constants
import { DEFAULT_SETTINGS } from "../constants";
import { ROOT, SETTINGS_FILENAME } from "../constants/paths";
// tauri apis
import { BaseDirectory, createDir } from "@tauri-apps/api/fs";
import { join } from "@tauri-apps/api/path";

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { settings, setSettings } = useSettingsStore();

  const loadSettings = useCallback(async () => {
    createDir(ROOT, { dir: BaseDirectory.Document, recursive: true })
      // load settings
      .then(() => join(ROOT, SETTINGS_FILENAME))
      .then((settingsPath) => readOrCreateText(settingsPath, DEFAULT_SETTINGS))
      .then((result) => setSettings(result));
  }, [setSettings]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return (
    <ColorSchemeProvider
      colorScheme={settings.darkmode ? "dark" : "light"}
      toggleColorScheme={() => setSettings({ darkmode: !settings.darkmode })}
    >
      <MantineProvider
        theme={{ colorScheme: settings.darkmode ? "dark" : "light" }}
        withGlobalStyles
        withNormalizeCSS
      >
        <NotificationsProvider>{children}</NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};
