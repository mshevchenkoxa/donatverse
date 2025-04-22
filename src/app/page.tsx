import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen px-6 py-12 flex flex-col items-center justify-start gap-16 bg-gradient-to-b from-gray-100 to-white">      
      <section className="text-center max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800">
          Donatverse
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-600">
          A decentralized donation platform with full transparency and instant payouts via Solana.
          <br />
          No middlemen. No fees. Just support.
        </p>
        <Link href="#donate">
          <button className="mt-6 px-6 py-3 bg-black text-white rounded-xl text-lg hover:bg-gray-900 transition">
            Start Donating
          </button>
        </Link>
      </section>      
    </main>
  );
}
