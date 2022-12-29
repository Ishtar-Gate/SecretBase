import { useSettingsStore } from "app/state";
import { AppShell, Aside, Footer, Text } from "@mantine/core";
import Navbar from "./Navbar";
import Projects from "./project/ProjectList";

const Home = () => {
  const { open } = useSettingsStore((state) => state.settings.sidebar);

  return (
    <AppShell
      style={{ minWidth: 450 }}
      navbar={<Navbar />}
      aside={
        <Aside p="md" hidden={!open} width={{ base: 250, md: 400 }}>
          <Text>Application sidebar</Text>
        </Aside>
      }
      footer={
        <Footer hidden={open} height={48} p="md">
          Application footer
        </Footer>
      }
      layout="alt"
    >
      <Projects />
    </AppShell>
  );
};

export default Home;
