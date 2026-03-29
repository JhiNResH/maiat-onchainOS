"use client";

import { type ReactNode } from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { base, worldchain } from "viem/chains";

export function Web3Provider({ children }: { children: ReactNode }) {
  const appId = (process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? "").trim();

  if (!appId) {
    console.warn("Privy App ID is missing. Auth features will be disabled.");
    return <>{children}</>;
  }

  return (
    <PrivyProvider
      appId={appId}
      config={{
        appearance: {
          theme: "dark",
          accentColor: "#FFFFFF",
        },
        loginMethods: ["wallet"],
        embeddedWallets: {
          ethereum: {
            createOnLogin: "off",
          },
        },
        defaultChain: worldchain,
        supportedChains: [worldchain, base],
      }}
    >
      {children}
    </PrivyProvider>
  );
}
