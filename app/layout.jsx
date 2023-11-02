import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";
import "./globals.scss";
import TanstackProvider from "./components/providers/Tanstackprovider";

export const dynamic = "force-dynamic";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Highbury Fields Tennis Leagues",
  description: "Competitive Tennis Leagues at Highbury Fields Tennis Club ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TanstackProvider>{children}</TanstackProvider>
        <Analytics />
      </body>
    </html>
  );
}
