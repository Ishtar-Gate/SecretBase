import create from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import _ from "@lodash";
import { saveSettingsFile } from "app/utils/file";
import { DEFAULT_SETTINGS } from "app/constants";
import { SettingsType } from "app/types";

type SettingsState = {
  settings: SettingsType;
  setSettings(data: Partial<SettingsType>): void;
  reset(): void;
};

export const useSettingsStore = create<SettingsState>()(
  immer(
    devtools(
      (set) => ({
        settings: { ...DEFAULT_SETTINGS },
        setSettings: (data: Partial<SettingsType>) =>
          set(
            async (state) => {
              const newSettings = _.merge({}, state.settings, data);
              state.settings = newSettings;
              await saveSettingsFile(newSettings);
            },
            false,
            { type: "settings/set", data }
          ),
        reset: () =>
          set(
            async (state) => {
              state.settings = { ...DEFAULT_SETTINGS };
              await saveSettingsFile(DEFAULT_SETTINGS);
            },
            false,
            { type: "settings/reset" }
          ),
      }),
      { name: "ishtar settings", enabled: process.env.NODE_ENV !== "production" }
    )
  )
);
