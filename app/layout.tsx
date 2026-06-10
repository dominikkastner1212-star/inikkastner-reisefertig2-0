import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { PwaRegister } from "@/components/pwa-register";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Reisefertig2.0",
  description: "Deine Reise. Perfekt organisiert.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/icon.svg"
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Reisefertig2.0"
  }
};

export const viewport: Viewport = {
  themeColor: "#2f513b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="de">
      <body className={inter.variable}>
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
