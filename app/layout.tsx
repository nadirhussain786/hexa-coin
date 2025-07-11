import type React from "react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hex",
  description: "Hex chase game app",
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        /> */}
      </head>
      <body className="bg-cosmic-bg min-h-screen text-cosmic-text">
        {children}
      </body>
    </html>
  );
}
