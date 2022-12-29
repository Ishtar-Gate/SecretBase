import { keyframes } from "@emotion/react";
import { Transform } from "@dnd-kit/utilities";
import { createStyles } from "@mantine/core";

const pop = keyframes`
0% {
  transform: scale(1);
}
100% {
  transform: scale(var(--scale, 1));
}
`;
export default createStyles(
  (theme, { transform }: { transform: Transform | null | undefined }) => ({
    root: {
      transform: transform
        ? `translate3d(${transform.x}px, ${transform.y}px, 0) scaleX(${transform.scaleX}) scaleY(${transform.scaleY})`
        : "translate3d(0,0,0) scaleX(1) scaleY(1)",
      transformOrigin: "0 0",
      touchAction: "manipulation",
      padding: 0,

      "&.dragOverlay": { zIndex: 999 },
    },
    wrapper: {
      position: "relative",
      transformOrigin: "50% 50%",
      transform: "scale(1)",
      // transition: `transform, ${theme.other.transitions.duration.shorter} cubic-bezier(0.18, 0.67, 0.6, 1.22), background-color, ${theme.other.transitions.duration.shorter}`,

      flex: "1 1 0%",
      minWidth: 128,
      minHeight: 16,
      overflow: "hidden",
      borderRadius: 0.5,
      padding: ".4rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      // cursor: "unset",

      // backgroundColor: theme.other.palette.background.paper,

      "&:not(.withHandler)": { touchAction: "manipulation", cursor: "grab" },

      "&.hoverStyle:hover": { backgroundColor: "var(--pickup-bgcolor)" },

      "&.dragOverlay": {
        "&.pickupStyle": { backgroundColor: "var(--pickup-bgcolor)" },
        cursor: "grabbing",
        transform: "scale(var(--scale, 1))",
        opacity: 1,
        animation: `${pop} 200ms cubic-bezier(0.18, 0.67, 0.6, 1.22)`,
      },
    },
    disabled: { cursor: "not-allowed" },
    dragging: { "&:not(.dragOverlay)": { opacity: 0.5, zIndex: 0 } },
    sorting: {},
    content: { flex: "1 1 0%", padding: ".6rem .8rem" },
  })
);
