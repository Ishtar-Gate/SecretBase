import { MantineColor } from "@mantine/core";
import { IconType } from "react-icons";

export type SettingsType = {
  user: { name: string };
  fullscreen: boolean;
  darkmode: boolean;
  sidebar: {
    open: boolean;
  };
};

export type GroupType = {
  id: string;
  name: string;
  description?: string;
  icon: IconType;
  color?: string;
};

export type ProjectType = {
  id: string;
  name: string;
  description?: string;
  group?: GroupType["name"];
  cover?: string;
  color?: MantineColor;
};
