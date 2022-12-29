import { forwardRef, memo } from "react";
import { useAddGroup, useGroups } from "app/api";
import { Group, Select, SelectProps, Text, Tooltip } from "@mantine/core";
import { HiSquare2Stack } from "react-icons/hi2";
import { IconType } from "react-icons";

type GroupPickerProps = Omit<
  SelectProps,
  | "label"
  | "data"
  | "placeholder"
  | "itemComponent"
  | "searchable"
  | "creatable"
  | "getCreateLabel"
  | "onCreate"
>;

const GroupPicker = (props: GroupPickerProps) => {
  const { data: groups = [] } = useGroups();
  const addGroup = useAddGroup();

  return (
    <Select
      {...props}
      label="Group"
      data={groups.map((group) => ({
        label: group.name,
        value: group.name,
        icon: group.icon,
        description: group.description,
      }))}
      placeholder="Pick a group"
      itemComponent={SelectItem}
      searchable
      creatable
      getCreateLabel={(query) => `+ Create ${query}`}
      onCreate={(query) => {
        const item = { value: query, label: query };
        addGroup.mutate({ name: query, icon: HiSquare2Stack });
        return item;
      }}
    />
  );
};

export default memo(GroupPicker);

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  icon: IconType;
  label: string;
  description?: string;
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ icon: Icon, label, description, ...rest }: ItemProps, ref) => (
    <div ref={ref} {...rest}>
      <Tooltip label={description} hidden={!description}>
        <Group noWrap>
          <Icon />
          <Text size="sm">{label}</Text>
        </Group>
      </Tooltip>
    </div>
  )
);
