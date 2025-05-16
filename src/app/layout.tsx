import type { Metadata } from "next";
import { WalletContextProvider } from "../context/WalletContext";
import "./globals.css"
import SidebarNav from "@/components/SidebarNav/SidebarNav";

export const metadata: Metadata = {
  title: "Donatverse",
  description: "A decentralized donation system with full transparency and instant crypto payouts",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className="h-full">
      <body className="min-h-screen bg-background antialiased">
        <WalletContextProvider>
          <div className="flex min-h-screen">
            <SidebarNav />
            <main className="flex-1 p-6 md:p-8">
              <div className="mx-auto max-w-7xl">
                {children}
              </div>
            </main>
          </div>
        </WalletContextProvider>
      </body>
    </html>
  );
}
