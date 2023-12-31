import "./globals.css";
import "react-toastify/dist/ReactToastify.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";

import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Analytics Dashboard",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <ToastContainer />
      </body>
    </html>
  );
}
