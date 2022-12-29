import React, { useState } from "react";
import { useTimeout } from "@ishtar/hooks";
import { Loader, createStyles } from "@mantine/core";

export interface LoadingProps {
  delay?: number | false;
}

const useStyles = createStyles((theme) => ({
  root: {
    flex: "1 1 0%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2.4rem",

    "&.hidden": { display: "none" },
  },
  text: {
    fontSize: "1.3rem",
    [theme.fn.largerThan("sm")]: { fontSize: "2rem" },
    marginBottom: "1.6rem",
    // color: theme.other.palette.text.secondary,
  },
}));

const Loading: React.FC<LoadingProps> = ({ delay = false }) => {
  const { classes, cx } = useStyles();

  const [showLoading, setShowLoading] = useState(!delay);
  useTimeout(() => {
    setShowLoading(true);
  }, delay);

  return showLoading ? (
    <div className={cx(classes.root, { hidden: !showLoading })}>
      {/* <Text className={classes.text}>Loading...</Text> */}
      <Loader variant="dots" />
    </div>
  ) : null;
};

export default Loading;
