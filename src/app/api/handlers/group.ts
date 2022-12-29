import { nanoid } from "nanoid";
import { readOrCreateText, saveGroupFile } from "app/utils/file";
import { DATA_ROOT, GROUP_FILENAME } from "app/constants/paths";
import { PartialExcept } from "types";
import { GroupType } from "app/types";
// tauri apis
import { join } from "@tauri-apps/api/path";

export const fetchGroups = async () =>
  join(DATA_ROOT, GROUP_FILENAME).then((filepath) =>
    readOrCreateText<Array<GroupType>>(filepath, [])
  );

export const addGroup = async (group: Omit<GroupType, "id">) => {
  const groups = await fetchGroups();
  saveGroupFile([{ ...group, id: nanoid(6) }, ...groups]);
};

export const updateGroup = async (group: PartialExcept<GroupType, "id">) => {
  const groups = await fetchGroups();
  const index = groups.findIndex((g) => g.id === group.id);
  if (index >= 0) {
    saveGroupFile([
      ...groups.slice(0, index),
      { ...groups[index], ...group },
      ...groups.slice(index + 1),
    ]);
  }
};
export const deleteGroup = async (id: GroupType["id"]) => {
  const groups = await fetchGroups();
  const index = groups.findIndex((g) => g.id === id);
  if (index >= 0) {
    saveGroupFile([...groups.slice(0, index), ...groups.slice(index + 1)]);
  }
};
