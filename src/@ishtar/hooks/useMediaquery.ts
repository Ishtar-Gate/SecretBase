import { MantineNumberSize, MantineSize, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

const useMediaquery = (width: MantineNumberSize, mode: "down" | "up" = "down") => {
  const theme = useMantineTheme();
  return useMediaQuery(
    `(${mode === "down" ? "max" : "min"}-width: ${
      Number.isFinite(width) ? width : theme.breakpoints[width as MantineSize]
    }px)`
  );
};

export default useMediaquery;
