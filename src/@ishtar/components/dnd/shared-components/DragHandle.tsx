import { forwardRef, memo } from "react";
import { ActionIcon, ActionIconProps } from "@mantine/core";
import { MdOutlineDragIndicator } from "react-icons/md";
import { IconType } from "react-icons";

export type HandleProps = ActionIconProps & {
  icon?: IconType;
  cursor?: React.CSSProperties["cursor"];
};

const DragHandle = forwardRef<HTMLButtonElement, HandleProps>(
  (
    { icon: Icon = MdOutlineDragIndicator, cursor = "grab", color = "dark", style, ...props },
    ref
  ) => {
    return (
      <ActionIcon ref={ref} {...props} color={color} style={{ cursor, ...style }}>
        <Icon />
      </ActionIcon>
    );
  }
);

export default memo(DragHandle);
