import type { Metadata } from "next";
import AppShell from "../components/layout/AppShell";
import "./globals.css";
import "./sky.css";

export const metadata: Metadata = {
  title: "Fabled Compass",
  description: "Navigate careers through jobs, workplace adventures, and demonstrated skills."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
