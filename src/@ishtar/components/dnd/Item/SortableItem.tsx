import { memo } from "react";
import _ from "@lodash";
import { useSortable } from "@dnd-kit/sortable";
import Item, { SortableItemType } from "./Item";
import { SortableItemProps } from "./types";

const SortableItem = <T extends SortableItemType>({
  animateLayoutChanges,
  getNewIndex,
  ...props
}: SortableItemProps<T>): JSX.Element | null => {
  const sortable = useSortable({
    animateLayoutChanges,
    getNewIndex,
    id: props.item.id,
    disabled: props.disabled,
  });

  return (
    <Item
      data-index={props.index}
      data-id={props.item.id}
      ref={sortable.setNodeRef}
      handlerRef={sortable.setActivatorNodeRef}
      {..._.pick(sortable, ["isDragging", "isSorting", "listeners", "transform", "transition"])}
      {...props}
      dragOverlay={!props.dragOverlay && sortable.isDragging}
      {...sortable.attributes}
    />
  );
};

export default memo(SortableItem) as typeof SortableItem;
