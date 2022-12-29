import { ProjectType } from "app/types";
import { memo } from "react";

type ProjectProps = {
  project: ProjectType;
};

const Project = ({ project }: ProjectProps) => {
  return <h1>{project.name}</h1>;
};

export default memo(Project);
