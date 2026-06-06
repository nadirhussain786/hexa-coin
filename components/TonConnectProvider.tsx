"use client";

import { TonConnectUIProvider } from "@tonconnect/ui-react";

const manifestUrl =
  (process.env.NEXT_PUBLIC_APP_URL ?? "https://hexacoin.app") +
  "/tonconnect-manifest.json";

export default function TonConnectProvider({ children }: { children: React.ReactNode }) {
  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      {children}
    </TonConnectUIProvider>
  );
}
