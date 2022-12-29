import { BaseDirectory, exists, readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import _ from "@lodash";
import { join } from "@tauri-apps/api/path";
import { GROUP_FILENAME, PROJECT_FILENAME, ROOT, SETTINGS_FILENAME } from "app/constants/paths";
import { GroupType, ProjectType, SettingsType } from "app/types";

export const saveTextFile = _.throttle(
  async (path: string, data: string, dir: BaseDirectory = BaseDirectory.Document) =>
    writeTextFile(path, data, { dir })
);

export async function readOrCreateText<T>(
  path: string,
  defaultData: T,
  dir: BaseDirectory = BaseDirectory.Document
) {
  const fileExists = await exists(path, { dir });

  if (fileExists) {
    const content = await readTextFile(path, { dir });
    return JSON.parse(content) as T;
  } else {
    await saveTextFile(path, JSON.stringify(defaultData, null, 2), dir);
    return defaultData;
  }
}

// save data files
export const saveSettingsFile = async (settings: SettingsType) =>
  join(ROOT, SETTINGS_FILENAME).then((filepath) =>
    saveTextFile(filepath, JSON.stringify(settings, null, 2))
  );

export const saveGroupFile = async (groups: Array<GroupType>) =>
  join(ROOT, GROUP_FILENAME).then((filepath) =>
    saveTextFile(filepath, JSON.stringify(groups, null, 2))
  );

export const saveProjectFile = async (projects: Array<ProjectType>) =>
  join(ROOT, PROJECT_FILENAME).then((filepath) =>
    saveTextFile(filepath, JSON.stringify(projects, null, 2))
  );
