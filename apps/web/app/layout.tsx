import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NBA Scoreboard - Live Game Scores & Schedules",
  description: "View NBA game scores and schedules for any date. Built with Next.js 16, React 19, and TypeScript. Modern, responsive, and accessible design.",
  keywords: ["NBA", "basketball", "scores", "schedule", "games", "live scores"],
  authors: [{ name: "NBA Scoreboard" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#041E42",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
