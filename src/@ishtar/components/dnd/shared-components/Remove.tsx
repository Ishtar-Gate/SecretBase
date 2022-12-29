import { forwardRef, memo } from "react";
import { ActionIcon, ActionIconProps } from "@mantine/core";
import { MdDelete } from "react-icons/md";
import { IconType } from "react-icons";

export type HandleProps = ActionIconProps & {
  icon?: IconType;
};

const Remove = forwardRef<HTMLButtonElement, HandleProps>(
  ({ icon: Icon = MdDelete, color = "dark", ...props }, ref) => {
    return (
      <ActionIcon ref={ref} {...props} color={color}>
        <Icon />
      </ActionIcon>
    );
  }
);

export default memo(Remove);
