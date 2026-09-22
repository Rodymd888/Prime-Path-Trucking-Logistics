import type { Metadata } from "next";
import "@fontsource-variable/manrope";
import "@fontsource/barlow-condensed/600.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prime Path Trucking & Logistics | Connecting Texas. City to City",
  description:
    "Texas freight, with a clear path forward. Dedicated trucking, regional truckload, and power-only programs built around your lanes.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Prime Path Trucking & Logistics",
    description:
      "Connecting Texas. City to City. Freight solutions built around your business.",
    type: "website",
    locale: "en_US",
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
