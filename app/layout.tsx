import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Civ V Great People Atlas",
  description: "An interactive atlas of the historical figures behind Civilization V's Great People — grouped by era, civilization, and discipline, with the places they were born, worked, and died.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
