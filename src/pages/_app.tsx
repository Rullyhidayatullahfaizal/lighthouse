import { GitHubProvider } from "@/context/GitHubContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GitHubProvider>
      <Component {...pageProps} />
    </GitHubProvider>
  )
}
