import { GitHubProvider } from "@/context/GitHubContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GitHubProvider>
      <main className={inter.className}>
        <Component {...pageProps} />
      </main>{" "}
    </GitHubProvider>
  );
}
