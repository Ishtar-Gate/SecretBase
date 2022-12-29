import { nanoid } from "nanoid";
import { readOrCreateText, saveProjectFile } from "app/utils/file";
import { DATA_ROOT, PROJECT_FILENAME } from "app/constants/paths";
import { PartialExcept } from "types";
import { ProjectType } from "app/types";
// tauri apis
import { join } from "@tauri-apps/api/path";

export const fetchProjects = async () =>
  join(DATA_ROOT, PROJECT_FILENAME).then((filepath) =>
    readOrCreateText<Array<ProjectType>>(filepath, [])
  );

export const addProject = async (project: Omit<ProjectType, "id">) => {
  const projects = await fetchProjects();
  saveProjectFile([{ ...project, id: nanoid(8) }, ...projects]);
};

export const updateProject = async (project: PartialExcept<ProjectType, "id">) => {
  const projects = await fetchProjects();
  const index = projects.findIndex((g) => g.id === project.id);
  if (index >= 0) {
    saveProjectFile([
      ...projects.slice(0, index),
      { ...projects[index], ...project },
      ...projects.slice(index + 1),
    ]);
  }
};
export const deleteProject = async (id: ProjectType["id"]) => {
  const projects = await fetchProjects();
  const index = projects.findIndex((g) => g.id === id);
  if (index >= 0) {
    saveProjectFile([...projects.slice(0, index), ...projects.slice(index + 1)]);
  }
};
