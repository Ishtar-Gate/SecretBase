import { forwardRef, memo } from "react";
import { createStyles, Tooltip, UnstyledButton } from "@mantine/core";
import { IconType } from "react-icons";

type NavbarLinkStyleParams = {
  color?: string;
};

const useStyles = createStyles((theme, { color }: NavbarLinkStyleParams) => {
  const isdark = theme.colorScheme === "dark";
  return {
    link: {
      width: 50,
      height: 50,
      borderRadius: theme.radius.md,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: color
        ? theme.colors[color] || color
        : isdark
        ? theme.colors.dark[0]
        : theme.colors.gray[7],

      "&:hover": {
        backgroundColor: isdark ? theme.colors.dark[5] : theme.colors.gray[0],
      },
    },

    active: {
      "&, &:hover": {
        backgroundColor: theme.fn.variant({ variant: "light", color: theme.primaryColor })
          .background,
        color: theme.fn.variant({ variant: "light", color: theme.primaryColor }).color,
      },
    },
  };
});

interface NavbarLinkProps {
  icon: IconType;
  label?: string;
  active?: boolean;
  onClick?(): void;
  color?: string;
  size?: string | number;
}

const NavbarLink = forwardRef<HTMLButtonElement, NavbarLinkProps>(
  ({ icon: Icon, label, active, onClick, color, size = 20 }, ref) => {
    const { classes, cx } = useStyles({ color });

    return (
      <Tooltip
        label={label}
        hidden={!label}
        position="right"
        transitionDuration={200}
        openDelay={300}
      >
        <UnstyledButton
          onClick={onClick}
          className={cx(classes.link, { [classes.active]: active })}
          ref={ref}
        >
          <Icon stroke="1.5" size={size} />
        </UnstyledButton>
      </Tooltip>
    );
  }
);

export default memo(NavbarLink);
