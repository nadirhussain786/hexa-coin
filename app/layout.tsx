import type React from "react";
import type { Metadata } from "next";
import Script from "next/script";
import TonConnectProvider from "@/components/TonConnectProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hexa Coin",
  description: "Play Hex Chase, earn HXCO and TON rewards on Telegram",
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
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="bg-cosmic-bg min-h-screen text-cosmic-text">
        <TonConnectProvider>
          {children}
        </TonConnectProvider>
      </body>
    </html>
  );
}
