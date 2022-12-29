import { useQuery } from "@tanstack/react-query";
import { useInvalidateMutation } from "./base.api";
import { addGroup, deleteGroup, fetchGroups, updateGroup } from "./handlers/group";
import { addProject, deleteProject, fetchProjects, updateProject } from "./handlers/project";

export const useGroups = () => useQuery(["groups"], fetchGroups);
export const useAddGroup = () => useInvalidateMutation(["groups"], addGroup);
export const useUpdatateGroup = () => useInvalidateMutation(["groups"], updateGroup);
export const useDeleteGroup = () => useInvalidateMutation(["groups"], deleteGroup);

export const useProjects = () => useQuery(["projects"], fetchProjects);
export const useAddProject = () => useInvalidateMutation(["projects"], addProject);
export const useUpdatateProject = () => useInvalidateMutation(["projects"], updateProject);
export const useDeleteProject = () => useInvalidateMutation(["projects"], deleteProject);
