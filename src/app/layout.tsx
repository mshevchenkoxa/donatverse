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
          <div style={{ display: 'flex', minHeight: '100vh' }}>
            <SidebarNav />
            <main
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                padding: '2rem',
              }}
            >
              <div style={{ width: '100%', maxWidth: 700 }}>{children}</div>
            </main>
          </div>
        </WalletContextProvider>
      </body>
    </html>
  );
}

