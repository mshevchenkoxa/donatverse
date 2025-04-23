import Link from "next/link";
import WalletConnection from "../components/WalletConnection";

export default function Home() {
  return (
    <main className="min-h-screen px-6 py-16 flex flex-col items-center justify-start gap-20 bg-gradient-to-b from-white to-gray-100">
      <section className="text-center max-w-3xl">
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight">
          Donatverse
        </h1>
        <p className="mt-6 text-xl md:text-2xl text-gray-700">
          A decentralized donation platform with full transparency and instant payouts via Solana.
        </p>
        <p className="mt-2 text-lg text-gray-500">
          No middlemen. No hidden fees. Just support.
        </p>        
      </section>

      <section
        id="donate"
        className="w-full max-w-xl p-6 bg-white rounded-2xl shadow-lg flex flex-col items-center gap-6"
      >
        <h2 className="text-2xl font-semibold text-gray-800">Connect Your Wallet</h2>
        <WalletConnection />
      </section>
    </main>
  );
}
