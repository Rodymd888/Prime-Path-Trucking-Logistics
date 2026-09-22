import type { Metadata } from "next";
import "@fontsource-variable/manrope";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prime Path Trucking & Logistics | Connecting Texas. City to City",
  description:
    "Day cabs, box trucks, and cargo vans for Texas freight. Prime Path Trucking & Logistics connects Dallas–Fort Worth, Houston, Austin, San Antonio, and regional markets.",
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
