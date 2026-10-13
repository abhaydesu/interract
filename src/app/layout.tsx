import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/providers";
import { GeistPixelSquare } from "geist/font/pixel";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Cherry_Bomb_One } from "next/font/google";
import { siteConfig } from "@/lib/site";
import "./globals.css";

// Bubble letters for the Bubbly icon set label. Declared here so its rules live in the
// global stylesheet; not preloaded, so the file only downloads where it's used.
const bubble = Cherry_Bomb_One({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-cherry-bomb",
});

export const metadata: Metadata = {
  title: {
    default: "Interract | Interactive Component Library",
    template: "%s · Interract",
  },
  description: siteConfig.description,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${GeistPixelSquare.variable} ${GeistSans.variable} ${GeistMono.variable} ${bubble.variable} font-sans antialiased min-h-screen`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
