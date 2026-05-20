// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sociofolio",
  description: "Discover top professionals, browse organic portfolios, and connect with creators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans bg-neutral-50 text-neutral-900">
        {children}
      </body>
    </html>
  );
}