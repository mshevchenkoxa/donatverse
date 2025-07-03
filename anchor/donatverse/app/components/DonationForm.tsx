'use client';

import { FC, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection, useAnchorProgram } from '@solana/wallet-adapter-react';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';

interface DonationFormProps {
  recipientAddress: string;
}

export const DonationForm: FC<DonationFormProps> = ({ recipientAddress }) => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleDonate = async () => {
    if (!publicKey) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Convert SOL to lamports
      const lamports = parseFloat(amount) * LAMPORTS_PER_SOL;
      
      // Validate recipient address
      let recipientPubkey;
      try {
        recipientPubkey = new PublicKey(recipientAddress);
      } catch (e) {
        setError('Invalid recipient address');
        return;
      }

      // Get program ID from your deployed program
      const programId = new PublicKey('BJeRvtGt4WrWAu8GGz3FKJd7jbY4gnyqHwLRGxJQjw5J');

      // Create the instruction
      const [donationPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('donation'),
          publicKey.toBuffer(),
          recipientPubkey.toBuffer(),
          Buffer.from(new Date().getTime().toString()),
        ],
        programId
      );

      const [authorityPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('authority')],
        programId
      );

      // Create the transaction
      const transaction = await program.methods
        .initializeDonation(new BN(lamports))
        .accounts({
          donation: donationPda,
          donor: publicKey,
          recipient: recipientPubkey,
          programAuthority: authorityPda,
          systemProgram: SystemProgram.programId,
        })
        .transaction();

      // Add recent blockhash and fee payer
      transaction.recentBlockhash = (
        await connection.getLatestBlockhash()
      ).blockhash;
      transaction.feePayer = publicKey;

      // Sign and send transaction
      const signature = await sendTransaction(transaction, connection);
      
      // Wait for confirmation
      await connection.confirmTransaction(signature, 'confirmed');

      setAmount('');
      alert('Donation initialized successfully!');
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Make a Donation</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Amount (SOL)
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter amount in SOL"
          min="0"
          step="0.1"
        />
      </div>

      {error && (
        <div className="mb-4 text-red-500 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleDonate}
        disabled={loading || !publicKey}
        className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
          loading || !publicKey ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Processing...' : 'Donate'}
      </button>

      {!publicKey && (
        <p className="mt-4 text-sm text-gray-600">
          Please connect your wallet to make a donation
        </p>
      )}
    </div>
  );
}; 