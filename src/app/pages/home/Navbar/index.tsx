import { Avatar, Center, Divider, Navbar as MantineNavbar, ScrollArea, Stack } from "@mantine/core";
import NavbarActions from "./NavbarActions";
import Navigations from "./Navigations";
import icon from "assets/icon.ico";

const Navbar = () => {
  return (
    <MantineNavbar py="md" px="sm" width={{ base: 80 }}>
      <Center>
        <Avatar src={icon} alt="Secret Base" />
      </Center>

      <Divider my="xs" />

      <MantineNavbar.Section grow component={ScrollArea} mt="sm">
        <Stack align="center" spacing={0}>
          <Navigations active="" onClickLink={console.log} />
        </Stack>
      </MantineNavbar.Section>

      <Divider my="xs" />

      <MantineNavbar.Section>
        <NavbarActions />
      </MantineNavbar.Section>
    </MantineNavbar>
  );
};

export default Navbar;
