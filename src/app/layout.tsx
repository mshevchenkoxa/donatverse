import type { Metadata } from "next";
import { WalletContextProvider } from "../context/WalletContext";

export const metadata:Metadata = {
  title: "Donatverse",
  description: "A decentralized donation system with full transparency and instant crypto payouts",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body>
        <WalletContextProvider>{children}</WalletContextProvider>
      </body>
    </html>
  );
}
