import { styled } from "../styles";

const Button = styled("button", {
  backgroundColor: "$rocketseat",
  border: 0,
  color: "white",
});

export default function Home() {
  return <Button>Enviar</Button>;
}
