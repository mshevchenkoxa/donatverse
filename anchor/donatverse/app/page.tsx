'use client';

import { WalletProvider } from './providers/WalletProvider';
import { DonationForm } from './components/DonationForm';

export default function Home() {
  // В реальном приложении recipientAddress может приходить из props или URL
  const recipientAddress = 'YOUR_RECIPIENT_ADDRESS';

  return (
    <WalletProvider>
      <main className="min-h-screen bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8">
            DonatVerse
          </h1>
          <DonationForm recipientAddress={recipientAddress} />
        </div>
      </main>
    </WalletProvider>
  );
} 