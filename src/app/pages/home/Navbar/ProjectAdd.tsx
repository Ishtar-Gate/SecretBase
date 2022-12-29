import { memo, useEffect, useState } from "react";
// state
import { useAddProject, useProjects } from "app/api";
// functions
import { usePrevious } from "@mantine/hooks";
import { useMediaquery } from "@ishtar/hooks";
import { useForm } from "@mantine/form";
import _ from "@lodash";
// components
import {
  Box,
  Button,
  ColorSwatch,
  Flex,
  Group,
  LoadingOverlay,
  Modal,
  Stack,
  Textarea,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { BsPlusSquareDotted } from "react-icons/bs";
import { MdCheck } from "react-icons/md";
import ImageDropzone from "../components/ImageDropzone";
import GroupPicker from "../components/GroupPicker";
import NavbarLink from "./components/NavbarLink";
// constants
import { ROOT } from "app/constants/paths";
// types
import { ProjectType } from "app/types";
// tauri apis
import { BaseDirectory, createDir, exists, renameFile, writeBinaryFile } from "@tauri-apps/api/fs";

const ProjectAdd = () => {
  const { data: projects = [] } = useProjects();
  const addProject = useAddProject();

  const [opened, setOpened] = useState(false);
  const [adding, setAdding] = useState(false);

  const form = useForm({
    initialValues: {
      name: `Project ${projects.length + 1}`,
      description: "",
      color: "dark",
      group: undefined,
    },
    validate: {
      name: (value) =>
        value.length < 2
          ? "Project name must have at least 2 letters"
          : projects.findIndex((p) => p.name === value) >= 0
          ? "A project with this name already exists"
          : null,
    },
  });

  const [cover, setCover] = useState<{ ext: string; file: File; url: string }>();

  const lastOpened = usePrevious(opened);
  const closeModal = () => setOpened(false);
  useEffect(() => {
    if (lastOpened && !opened) {
      setCover(undefined);
      form.reset();
      setAdding(false);
    }
  }, [form, lastOpened, opened]);

  const handleSubmit = async (values: typeof form.values) => {
    setAdding(true);

    const project: Omit<ProjectType, "id"> = { ...values };

    const coverFolder = `${ROOT}/projects/${_.camelCase(values.name)}/covers`;
    // create project folder
    await createDir(coverFolder, { dir: BaseDirectory.Document, recursive: true });

    let coverPath = "";
    if (cover) {
      // save cover to local
      coverPath = `${coverFolder}/${_.snakeCase(values.name)}.${cover.ext}`;
      await exists(coverPath, { dir: BaseDirectory.Document })
        .then((isExists) => {
          if (isExists) {
            return renameFile(
              coverPath,
              `${coverFolder}/${_.snakeCase(values.name)}_${Math.floor(Date.now() / 1000)}.${
                cover.ext
              }`,
              { dir: BaseDirectory.Document }
            );
          }
          return;
        })
        .then(() => cover.file.arrayBuffer())
        .then((buffer) =>
          writeBinaryFile(coverPath, new Uint8Array(buffer), {
            dir: BaseDirectory.Document,
          })
        )
        .then(() => {
          project.cover = coverPath;
        })
        .catch(console.log);
    }

    closeModal();
    addProject.mutate(project);
  };

  const smallScreen = useMediaquery("xs");
  const theme = useMantineTheme();

  return (
    <>
      <NavbarLink icon={BsPlusSquareDotted} size={30} onClick={() => setOpened(true)} />
      <Modal
        centered
        title="Add project"
        opened={opened}
        onClose={closeModal}
        overlayOpacity={0.25}
        overlayBlur={1.5}
        size="auto"
        fullScreen={smallScreen}
        closeOnClickOutside={!adding}
        closeOnEscape={!adding}
      >
        <LoadingOverlay visible={adding} overlayBlur={1} />
        <Box
          component="form"
          mx="auto"
          onSubmit={form.onSubmit(handleSubmit)}
          sx={{ minWidth: 300 }}
        >
          <Stack>
            <Flex gap="xs" justify="center" align="center" direction="row" wrap="wrap">
              <ImageDropzone image={cover?.url} onImageChange={setCover} />
              <div>
                {/* name */}
                <TextInput
                  size="xs"
                  withAsterisk
                  label="Project name"
                  autoFocus
                  {...form.getInputProps("name")}
                />

                {/* description */}
                <Textarea size="xs" label="Description" {...form.getInputProps("description")} />

                {/* group */}
                <GroupPicker size="xs" {...form.getInputProps("group")} />

                {/* project color */}
                <Group maw={250} spacing="xs" p="md">
                  {Object.keys(theme.colors).map((color) => (
                    <ColorSwatch
                      key={color}
                      color={theme.colors[color][6]}
                      onClick={() => form.setFieldValue("color", color)}
                      sx={{ color: "#fff", cursor: "pointer", border: "2px solid #fff" }}
                    >
                      {form.values.color === color && <MdCheck />}
                    </ColorSwatch>
                  ))}
                </Group>
              </div>
            </Flex>
            <Group position="right" mt="md">
              <Button size="xs" variant="outline" color="dark" onClick={closeModal}>
                Cancel
              </Button>
              <Button size="xs" type="submit">
                Submit
              </Button>
            </Group>
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export default memo(ProjectAdd);
