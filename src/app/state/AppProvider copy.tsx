import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { BaseDirectory, createDir, exists, readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import { join } from "@tauri-apps/api/path";
import _ from "@lodash";
import { ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { DEFAULT_SETTINGS } from "../constants";
import { DATA_FILENAME, ROOT, SETTINGS_FILENAME } from "../constants/paths";
import { PartialExcept } from "types";
import { SettingsType, ProjectType, GroupType } from "app/types";

type AppContextType = {
  settings: SettingsType;
  updateSettings: (data: Partial<SettingsType>) => void;
  projects: Array<ProjectType>;
  updateProjects: (data: Array<ProjectType>) => void;
  addProject: (project: ProjectType) => void;
  updateProject: (project: PartialExcept<ProjectType, "name">) => void;
  deleteProject: (name: ProjectType["name"]) => void;
  groups: Array<GroupType>;
  updateGroups: (data: Array<GroupType>) => void;
  addGroup: (group: GroupType) => void;
  updateGroup: (group: PartialExcept<GroupType, "name">) => void;
  deleteGroup: (name: GroupType["name"]) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

// const updateSettingsFile = _.throttle(
//   async (data: SettingsType) =>
//     join(ROOT, SETTINGS_FILENAME).then((settingsPath) =>
//       writeTextFile(settingsPath, JSON.stringify(data, null, 2), { dir: BaseDirectory.Document })
//     ),
//   200
// );
// const updateDataFile = _.throttle(
//   async (data: { groups: Array<GroupType>; projects: Array<ProjectType> }) =>
//     join(ROOT, DATA_FILENAME).then((dataPath) =>
//       writeTextFile(dataPath, JSON.stringify(data, null, 2), { dir: BaseDirectory.Document })
//     )
// );

const saveFile = _.throttle(async (filename: string, data: unknown) =>
  join(ROOT, filename).then((dataPath) =>
    writeTextFile(dataPath, JSON.stringify(data, null, 2), { dir: BaseDirectory.Document })
  )
);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<AppContextType["settings"]>({ ...DEFAULT_SETTINGS });
  const [projects, setProjects] = useState<AppContextType["projects"]>([]);
  const [groups, setGroups] = useState<AppContextType["groups"]>([]);

  const loadSettings = useCallback(async () => {
    createDir(ROOT, { dir: BaseDirectory.Document, recursive: true })
      .then(() => join(ROOT, SETTINGS_FILENAME))
      .then((settingsPath) =>
        // check for local user settings file
        exists(settingsPath, { dir: BaseDirectory.Document }).then((isExists) => {
          if (isExists) {
            // if exists, load
            readTextFile(settingsPath, { dir: BaseDirectory.Document }).then((raw) => {
              setSettings(JSON.parse(raw));
            });
          } else {
            // else, create file with default settings
            // updateSettingsFile(DEFAULT_SETTINGS);
            saveFile(SETTINGS_FILENAME, DEFAULT_SETTINGS);
          }
        })
      )
      .then(() => join(ROOT, DATA_FILENAME))
      .then((dataPath) =>
        // check for projects data
        exists(dataPath, { dir: BaseDirectory.Document }).then((isExists) => {
          if (isExists) {
            // if exists, load
            readTextFile(dataPath, { dir: BaseDirectory.Document }).then((raw) => {
              const data = JSON.parse(raw) as {
                groups: Array<GroupType>;
                projects: Array<ProjectType>;
              };
              setProjects(data.projects);
              setGroups(data.groups);
            });
          } else {
            // else, create file with blank values
            // updateDataFile({ groups: [], projects: [] });
            saveFile(DATA_FILENAME, { groups: [], projects: [] });
          }
        })
      );
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // handlers
  const updateSettings: AppContextType["updateSettings"] = (data) => {
    const newSettings = _.merge({}, settings, data);
    setSettings(newSettings);
    // updateSettingsFile(newSettings);
    saveFile(SETTINGS_FILENAME, newSettings);
  };
  const updateProjects: AppContextType["updateProjects"] = (data) => {
    setProjects(data);
    // updateDataFile({ groups, projects: data });
    saveFile(DATA_FILENAME, { groups, projects: data });
  };
  const updateGroups: AppContextType["updateGroups"] = (data) => {
    setGroups(data);
    // updateDataFile({ groups: data, projects });
    saveFile(DATA_FILENAME, { groups: data, projects });
  };

  const addProject = (project: ProjectType) => {
    if (projects.findIndex((p) => p.name === project.name) < 0) {
      updateProjects([project, ...projects]);
    }
  };
  const updateProject = (project: PartialExcept<ProjectType, "name">) => {
    const index = projects.findIndex((p) => p.name === project.name);
    if (index >= 0) {
      updateProjects([
        ...projects.slice(0, index),
        { ...projects[index], ...project },
        ...projects.slice(index + 1),
      ]);
    }
  };
  const deleteProject = (name: ProjectType["name"]) => {
    const index = projects.findIndex((p) => p.name === name);
    if (index >= 0) {
      updateProjects([...projects.slice(0, index), ...projects.slice(index + 1)]);
    }
  };

  const addGroup = (group: GroupType) => {
    if (groups.findIndex((g) => g.name === group.name) < 0) {
      updateGroups([group, ...groups]);
    }
  };
  const updateGroup = (group: PartialExcept<GroupType, "name">) => {
    const index = groups.findIndex((g) => g.name === group.name);
    if (index >= 0) {
      updateGroups([
        ...groups.slice(0, index),
        { ...groups[index], ...group },
        ...groups.slice(index + 1),
      ]);
    }
  };
  const deleteGroup = (name: GroupType["name"]) => {
    const index = groups.findIndex((g) => g.name === name);
    if (index >= 0) {
      updateGroups([...groups.slice(0, index), ...groups.slice(index + 1)]);
    }
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        updateSettings,
        projects,
        updateProjects,
        addProject,
        updateProject,
        deleteProject,
        groups,
        updateGroups,
        addGroup,
        updateGroup,
        deleteGroup,
      }}
    >
      <ColorSchemeProvider
        colorScheme={settings.darkmode ? "dark" : "light"}
        toggleColorScheme={() => updateSettings({ darkmode: !settings.darkmode })}
      >
        <MantineProvider
          theme={{ colorScheme: settings.darkmode ? "dark" : "light" }}
          withGlobalStyles
          withNormalizeCSS
        >
          {children}
        </MantineProvider>
      </ColorSchemeProvider>
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw Error(
      "Context value must be used inside of a Context, otherwise it will not function correctly."
    );
  }

  return context;
};
