import { memo, useEffect, useState } from "react";
import _ from "@lodash";
import { Avatar, createStyles, Stack, Text, Tooltip } from "@mantine/core";
import { ProjectType } from "app/types";
import { documentDir, join } from "@tauri-apps/api/path";
import { convertFileSrc } from "@tauri-apps/api/tauri";

type ProjectItemProps = {
  project: ProjectType;
  onZone: () => void;
};

const useStyles = createStyles((theme) => ({
  root: {
    cursor: "pointer",
  },
  avatar: {
    width: 80,
    height: 80,

    transition: "box-shadow 300ms ease",
    boxShadow: theme.shadows.xs,
    "&:hover": { boxShadow: theme.shadows.sm },
  },
}));

const ProjectIcon = ({ project, onZone }: ProjectItemProps) => {
  const { classes } = useStyles();

  const [cover, setCover] = useState<string>();
  useEffect(() => {
    const loadCover = async () => {
      const coverPath = project.cover;
      if (coverPath) {
        documentDir()
          .then((docDir) => join(docDir, coverPath))
          .then(convertFileSrc)
          .then((src) => {
            setCover(src);
          });
      }
    };
    loadCover();
  }, [project.cover]);

  return (
    <Stack align="center" spacing="xs" onClick={onZone} className={classes.root}>
      <Tooltip label={_.startCase(project.name)} openDelay={500} offset={16}>
        <Avatar
          variant="filled"
          src={cover}
          color={project.color || "primary"}
          className={classes.avatar}
        >
          {_.startCase(project.name)
            .split(/\s/, 2)
            .map((w) => w[0])
            .join("")}
        </Avatar>
      </Tooltip>
      <Text>{_.startCase(project.name)}</Text>
    </Stack>
  );
};

export default memo(ProjectIcon);
