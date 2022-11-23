import type { AppProps } from "next/app";
import { HeaderComponent } from "../components/Header";
import { globalStyles } from "../styles/global";
import { Container } from "../styles/app";

globalStyles();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Container>
      <HeaderComponent />
      <Component {...pageProps} />
    </Container>
  );
}
