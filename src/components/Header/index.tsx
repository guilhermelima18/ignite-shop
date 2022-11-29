import { Header } from "./styles";

const logoIcon = "/logo.svg";

export const HeaderComponent = () => {
  return (
    <Header>
      <img src={logoIcon} alt="Logo Ignite Shop" />
    </Header>
  );
};
