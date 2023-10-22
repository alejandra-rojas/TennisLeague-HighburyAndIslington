import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";
import "./globals.scss";
import ClientNavbar from "./components/ClientNavbar";
import LoginNavbar from "./components/LoginNavbar";

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
        {children}
        <Analytics />
      </body>
    </html>
  );
}
