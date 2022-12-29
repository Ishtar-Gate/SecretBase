import { useState, useEffect, useCallback, useMemo } from "react";
import { useHotkeys, useViewportSize } from "@mantine/hooks";
import { Menu, Modal, Stack, useMantineColorScheme } from "@mantine/core";
import {
  BsFullscreen,
  BsFullscreenExit,
  BsGearFill,
  BsInfoCircle,
  BsMoonStarsFill,
  BsSunFill,
  BsThreeDotsVertical,
} from "react-icons/bs";
import NavbarLink from "./components/NavbarLink";
import { HOTKEYS } from "app/constants/hotkeys";
import About from "../components/about";
// tauri api
import { appWindow } from "@tauri-apps/api/window";

const NavbarActions = () => {
  // darkmode
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  // fullscreen
  const [fullscreen, setFullscreen] = useState(false);
  useEffect(() => {
    appWindow.isFullscreen().then((isfull) => setFullscreen(isfull));
  }, []);
  const toggleFullscreen = useCallback(async () => {
    await appWindow.setFullscreen(!fullscreen).then(() => setFullscreen(!fullscreen));
  }, [fullscreen]);

  // about page
  const [aboutOpened, setAboutOpened] = useState(false);
  const handleClickInfo = () => setAboutOpened(true);

  const { height } = useViewportSize();

  const actions = useMemo(
    () => [
      {
        label: "Toggle dark scheme",
        icon: colorScheme === "dark" ? BsSunFill : BsMoonStarsFill,
        color: colorScheme === "dark" ? "yellow" : "blue",
        onClick: () => toggleColorScheme(),
      },
      {
        label: "Toggle fullscreen",
        icon: fullscreen ? BsFullscreenExit : BsFullscreen,
        onClick: () => toggleFullscreen(),
      },
      {
        label: "About",
        icon: BsInfoCircle,
        onClick: handleClickInfo,
      },
      {
        label: "Settings",
        icon: BsGearFill,
        onClick: () => console.log("config"),
      },
    ],
    [colorScheme, fullscreen, toggleColorScheme, toggleFullscreen]
  );

  useHotkeys([
    [HOTKEYS.toggleFullscreen, () => toggleFullscreen()],
    [HOTKEYS.toggleFullscreen, () => toggleColorScheme()],
  ]);

  return (
    <Stack justify="center" align="center" spacing={0}>
      {height < 450 ? (
        <Menu shadow="md" width={200} position="right-end" offset={4} withArrow>
          <Menu.Target>
            <NavbarLink icon={BsThreeDotsVertical} />
          </Menu.Target>

          <Menu.Dropdown>
            {actions.map(({ icon: Icon, label, ...action }, index) => (
              <Menu.Item key={index} icon={<Icon size={14} />} {...action}>
                {label}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
      ) : (
        <>
          {actions.map((action, index) => (
            <NavbarLink key={index} {...action} />
          ))}
        </>
      )}

      <Modal
        centered
        title="About Secret Base"
        opened={aboutOpened}
        onClose={() => setAboutOpened(false)}
        overlayOpacity={0.25}
        overlayBlur={3}
      >
        <About />
      </Modal>
    </Stack>
  );
};

export default NavbarActions;
