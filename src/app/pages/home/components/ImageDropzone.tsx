import { memo } from "react";
import { Box, createStyles, Group, useMantineTheme } from "@mantine/core";
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { MdUpload, MdClose, MdPhoto } from "react-icons/md";

type ImageDropzoneProps = Omit<DropzoneProps, "children" | "onDrop"> & {
  image?: string;
  onImageChange: (image: { ext: string; file: File; url: string }) => void;
};

const useStyles = createStyles((theme) => ({
  wrapper: { position: "relative" },
  preview: {
    position: "absolute",
    top: 4,
    right: 4,
    bottom: 4,
    left: 4,
    transition: "all 300ms ease",
  },
  root: {
    width: 250,
    height: 250,
    padding: 0,
    transition: "all 300ms ease",

    backgroundColor: "transparent",

    "&:hover": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[0],
    },
    "&.preview:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.fn.rgba(theme.colors.dark[5], 0.75)
          : theme.fn.rgba(theme.colors.gray[0], 0.75),
    },

    "&[data-loading]": {
      "&:hover": {
        backgroundColor: "transparent",
      },
    },

    "&[data-accept]": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.fn.darken(theme.colors[theme.primaryColor][4], 0.6)
          : theme.colors[theme.primaryColor][0],
      borderColor:
        theme.colorScheme === "dark"
          ? theme.fn.darken(theme.colors[theme.primaryColor][8], 0.6)
          : theme.colors[theme.primaryColor][4],

      "&:hover": {
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.fn.darken(theme.colors[theme.primaryColor][4], 0.6)
            : theme.colors[theme.primaryColor][0],
      },
    },

    "&[data-reject]": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.fn.darken(theme.colors.red[4], 0.5)
          : theme.colors.red[0],
      borderColor:
        theme.colorScheme === "dark"
          ? theme.fn.darken(theme.colors.red[8], 0.5)
          : theme.colors.red[4],

      "&:hover": {
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.fn.darken(theme.colors.red[4], 0.5)
            : theme.colors.red[0],
      },
    },
  },
  inner: {
    width: "100%",
    height: "100%",
    transition: "none",

    ".preview &, .preview[data-loading]:hover &": {
      opacity: 0,
    },
    ".preview:hover &, [data-accept] &, [data-reject] &": {
      opacity: 1,
      transition: "opacity 100ms ease-in",
    },
  },
}));

const ImageDropzone = ({
  image,
  onImageChange,
  classNames,
  styles,
  ...props
}: ImageDropzoneProps) => {
  const { classes, cx } = useStyles(undefined, { name: "image-drop", classNames, styles });

  const theme = useMantineTheme();

  return (
    <div className={classes.wrapper}>
      <Box
        sx={{
          background: image ? `url(${image})` : undefined,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
        className={classes.preview}
      ></Box>
      <Dropzone
        {...props}
        onDrop={(files) => {
          if (files.length > 0) {
            if (image) {
              URL.revokeObjectURL(image);
            }
            const file = files[0];
            onImageChange({
              url: URL.createObjectURL(files[0]),
              ext: file.name.slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2) || "png",
              file,
            });
          }
        }}
        onReject={(files) => console.log("rejected files", files)}
        maxSize={3 * 1024 ** 2}
        multiple={false}
        accept={IMAGE_MIME_TYPE}
        classNames={{ inner: classes.inner, root: cx(classes.root, { preview: !!image }) }}
      >
        <Group
          position="center"
          spacing="xl"
          sx={{ width: "100%", height: "100%", pointerEvents: "none" }}
        >
          <Dropzone.Accept>
            <MdUpload
              size={50}
              color={theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 6]}
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <MdClose size={50} color={theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]} />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <MdPhoto size={50} />
          </Dropzone.Idle>
        </Group>
      </Dropzone>
    </div>
  );
};

export default memo(ImageDropzone);
