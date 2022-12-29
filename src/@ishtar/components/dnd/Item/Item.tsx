import React, { forwardRef, memo, Ref, useMemo } from "react";
import {
  Box,
  ColProps,
  DefaultProps,
  Grid,
  MantineShadow,
  Paper,
  Selectors,
  useMantineTheme,
} from "@mantine/core";
import useStyles from "./Item.styles";
import { DraggableSyntheticListeners, UniqueIdentifier } from "@dnd-kit/core";
import { Transform } from "@dnd-kit/utilities";

export type SortableItemType = { id: UniqueIdentifier; [key: string]: unknown };

export type HandlerProps = {
  handlerRef?: (element: HTMLElement | null) => void;
  listeners?: DraggableSyntheticListeners;
  className?: string;
};
export type ItemRenderer<T extends SortableItemType> = (
  args: Omit<ItemContentProps<T>, "renderItem">
) => JSX.Element;
export type ItemContentProps<T extends SortableItemType> = Pick<
  ItemProps<T>,
  | "index"
  | "item"
  | "disabled"
  | "handlerRef"
  | "isDragging"
  | "isSorting"
  | "dragOverlay"
  | "transform"
  | "transition"
  | "listeners"
  | "enableHoverStyle"
  | "withHandler"
  | "renderItem"
>;

export type ItemProps<T extends SortableItemType> = Pick<
  ColProps,
  "xs" | "sm" | "md" | "lg" | "xl"
> & {
  index?: number;
  item: T;
  disabled?: boolean;
  handlerRef?: (element: HTMLElement | null) => void; //
  isDragging?: boolean; //
  isSorting?: boolean; //
  dragOverlay?: boolean;
  transform?: Transform | null; //
  transition?: string | null; //
  listeners?: DraggableSyntheticListeners; //
  shadow?: MantineShadow;
  pickupShadow?: MantineShadow;
  pickupScale?: number;
  enableHoverStyle?: boolean;
  enablePickupStyle?: boolean;
  withHandler?: boolean;
  renderItem?: ItemRenderer<T>;
  ItemContent?: React.ComponentType<ItemContentProps<T>>;
} & DefaultProps<Selectors<typeof useStyles>>;

const Item = forwardRef(
  <T extends SortableItemType>(props: ItemProps<T>, ref: Ref<HTMLDivElement>): JSX.Element => {
    const {
      index,
      item,
      renderItem,
      ItemContent,
      disabled,
      handlerRef,
      withHandler,
      isDragging,
      isSorting,
      dragOverlay,
      transform,
      transition,
      listeners,
      shadow = "xs",
      pickupShadow = "sm",
      pickupScale = 1.05,
      enableHoverStyle = true,
      enablePickupStyle = true,
      styles,
      className,
      classNames,
      xs,
      sm,
      md,
      lg,
      xl,
      ...rest
    } = props;

    const theme = useMantineTheme();
    const { classes, cx } = useStyles(
      { transform },
      { name: "sortable--item", classNames, styles }
    );

    const renderedItem = useMemo(
      () =>
        ItemContent ? (
          <ItemContent
            index={index}
            item={item}
            disabled={disabled}
            handlerRef={handlerRef}
            isDragging={isDragging}
            isSorting={isSorting}
            dragOverlay={dragOverlay}
            transform={transform}
            transition={transition}
            listeners={listeners}
            enableHoverStyle={enableHoverStyle}
            withHandler={withHandler}
            renderItem={renderItem}
          />
        ) : (
          renderItem?.({
            index,
            item,
            disabled,
            handlerRef,
            isDragging,
            isSorting,
            dragOverlay,
            transform,
            transition,
            listeners,
            enableHoverStyle,
            withHandler,
          })
        ),
      [
        ItemContent,
        disabled,
        dragOverlay,
        enableHoverStyle,
        handlerRef,
        index,
        isDragging,
        isSorting,
        item,
        listeners,
        renderItem,
        transform,
        transition,
        withHandler,
      ]
    );

    return (
      <Grid.Col
        ref={ref}
        lg={lg}
        md={md}
        sm={sm}
        xl={xl}
        xs={xs}
        className={cx({ dragOverlay }, classes.root, !!isSorting && classes.sorting, className)}
        style={
          {
            "--index": index,
            transition,
            "--pickup-bgcolor":
              theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[0],
            "--scale": pickupScale,
          } as React.CSSProperties
        }
      >
        <Paper
          shadow={dragOverlay ? pickupShadow : shadow}
          {...(!withHandler ? listeners : undefined)}
          {...rest}
          className={cx(
            {
              dragOverlay,
              withHandler,
              hoverStyle: enableHoverStyle,
              pickupStyle: enablePickupStyle,
            },
            classes.wrapper,
            !!isDragging && classes.dragging,
            !!disabled && classes.disabled
          )}
        >
          <Box className={classes.content}>{renderedItem}</Box>
        </Paper>
      </Grid.Col>
    );
  }
);

export default memo(Item) as <T extends SortableItemType>(
  props: ItemProps<T> & { ref?: Ref<HTMLDivElement> }
) => JSX.Element;
