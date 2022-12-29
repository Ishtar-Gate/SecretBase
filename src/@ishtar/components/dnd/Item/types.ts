import {
  DndContextProps,
  DropAnimation,
  KeyboardCoordinateGetter,
  PointerActivationConstraint,
} from "@dnd-kit/core";
import { arrayMove, SortingStrategy, UseSortableArguments } from "@dnd-kit/sortable";
import { GridProps } from "@mantine/core";
import { ItemProps, SortableItemType } from "./Item";

export type SortableItemProps<T extends SortableItemType> = Pick<
  UseSortableArguments,
  "animateLayoutChanges" | "getNewIndex"
> &
  Omit<
    ItemProps<T>,
    "isDragging" | "isSorting" | "listeners" | "transform" | "transition" | "handlerRef"
  >;

export type SortableProps<T extends SortableItemType> = Pick<
  DndContextProps,
  | "accessibility"
  | "autoScroll"
  | "cancelDrop"
  | "collisionDetection"
  | "measuring"
  | "modifiers"
  | "onDragMove"
  | "onDragOver"
  | "id"
> & {
  activationConstraint?: PointerActivationConstraint;
  coordinateGetter?: KeyboardCoordinateGetter;
  dropAnimation?: DropAnimation | null;
  adjustScale?: boolean;
  strategy?: SortingStrategy | null;
} & Omit<SortableItemProps<T>, "index" | "item"> &
  Pick<GridProps, "align" | "columns" | "grow" | "gutter" | "justify"> & {
    items: Array<T>;
    getIndex?: (item: T) => number;
    reorderItems?: typeof arrayMove;
  } & (
    | { reorderItems: typeof arrayMove; onChange: (items: T[]) => unknown }
    | { reorderItems?: undefined; onChange: (origin: number, target: number) => unknown }
  );
