'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './DonatePage.module.css';

export default function DonatePage() {
  const searchParams = useSearchParams();
  const initialRecipient = searchParams.get('wallet') || '';
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const [recipientAddress, setRecipientAddress] = useState(initialRecipient);
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (initialRecipient) {
      setRecipientAddress(initialRecipient);
    }
  }, [initialRecipient]);

  const handleSend = async () => {
    setStatus('');
    if (!publicKey || !recipientAddress) {
      setStatus('❌ Підключіть гаманець або вкажіть адресу отримувача.');
      return;
    }

    try {
      const recipientPubkey = new PublicKey(recipientAddress);
      const lamports = parseFloat(amount) * LAMPORTS_PER_SOL;

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubkey,
          lamports,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      setStatus(`✅ Транзакція надіслана! Signature: ${signature}`);
    } catch (error: any) {
      console.error(error);
      setStatus(`❌ Помилка: ${error?.message || 'невідома'}`);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Support user</h1>

      <label className={styles.label}>Address recipient :</label>
      <input
        className={styles.addressInput}
        type="text"
        placeholder="Enter Solana Address"
        value={recipientAddress}
        onChange={(e) => setRecipientAddress(e.target.value)}
      />

      <label className={styles.label}>Сума в SOL:</label>
      <input
        className={styles.input}
        type="number"
        placeholder="For example: 0.1"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button
        className={styles.button}
        onClick={handleSend}
        disabled={!recipientAddress || !amount}
      >
        Donation
      </button>

      {status && <p className={styles.status}>{status}</p>}
    </div>
  );
}
