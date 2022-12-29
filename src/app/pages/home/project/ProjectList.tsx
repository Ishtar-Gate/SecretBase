import { useState } from "react";
import { useGroups, useProjects } from "app/api";
import { Flex, ScrollArea, Stack, Title } from "@mantine/core";
import Project from "./Project";
import ProjectIcon from "./ProjectIcon";
import { ProjectType } from "app/types";

const Projects = () => {
  const { data: groups = [] } = useGroups();
  const { data: projects = [] } = useProjects();

  const [zoned, setZoned] = useState<ProjectType | null>(null);

  return (
    <ScrollArea sx={{ height: "100%" }}>
      {zoned ? (
        <Project project={zoned} />
      ) : (
        <Stack spacing={32}>
          {[{ name: undefined }, ...groups].map((group) => (
            <Flex key={`${group.name}`} align="center" wrap="wrap" gap={28} p="lg">
              {group.name && <Title>{group.name}</Title>}
              {projects
                .filter((project) => project.group === group.name)
                .map((project) => (
                  <ProjectIcon
                    key={project.name}
                    project={project}
                    onZone={() => setZoned(project)}
                  />
                ))}
            </Flex>
          ))}
        </Stack>
      )}
    </ScrollArea>
  );
};

export default Projects;
