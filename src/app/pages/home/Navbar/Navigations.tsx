import { useGroups } from "app/api";
import { MdApps } from "react-icons/md";
import NavbarLink from "./components/NavbarLink";
import ProjectAdd from "./ProjectAdd";

type NavigationsProps = {
  active: string;
  onClickLink: (name: string) => void;
};

const Navigations = ({ active, onClickLink }: NavigationsProps) => {
  const { data: groups = [] } = useGroups();

  return (
    <>
      <ProjectAdd />
      <NavbarLink icon={MdApps} size={26} onClick={console.log} />
      {groups.map(({ name, icon, color }) => (
        <NavbarLink
          key={name}
          label={name}
          icon={icon}
          color={color}
          active={name === active}
          onClick={() => onClickLink(name)}
        />
      ))}
    </>
  );
};

export default Navigations;
