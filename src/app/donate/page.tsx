'use client';

import { useConnection, useWallet, WalletContextState } from '@solana/wallet-adapter-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  Transaction,
  SendTransactionError,
} from '@solana/web3.js';
import { BN, AnchorProvider, Program, web3, Wallet } from '@coral-xyz/anchor';
import idl from '@/idl/idl.json';
import styles from './DonatePage.module.css';



const PROGRAM_ID = new PublicKey('BJeRvtGt4WrWAu8GGz3FKJd7jbY4gnyqHwLRGxJQjw5J');

export default function DonatePage() {
  const searchParams = useSearchParams();
  const initialRecipient = searchParams.get('wallet') || '';
  const { connection } = useConnection();
  const { publicKey, sendTransaction, signTransaction, signAllTransactions } = useWallet();
  const [recipientAddress, setRecipientAddress] = useState(initialRecipient);
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (initialRecipient) setRecipientAddress(initialRecipient);
  }, [initialRecipient]);

  const handleSend = async () => {
    setStatus('');
    if (!recipientAddress || !amount) {
      setStatus('❌ Перевірте адресу та суму.');
      return;
    }

    if (!publicKey || !signTransaction || !signAllTransactions) {
      setStatus('❌ Підключіть повноцінний гаманець, який підтримує підпис транзакцій');
      return;
    }

    const wallet = {
      publicKey,
      signTransaction,
      signAllTransactions
    };
    try {
      const donor = publicKey;
      const donationId = Math.floor(Math.random() * 1_000_000_000);
      const donationIdBN = new BN(donationId);
      const recipient = new PublicKey(recipientAddress);
      const lamports = parseFloat(amount) * web3.LAMPORTS_PER_SOL;
      const amountBn = new BN(lamports);
      const provider = new AnchorProvider(connection, wallet, {});

      const program = new Program(idl as any, PROGRAM_ID, provider);

      const donationIdBytes = new Uint8Array(8);
      new DataView(donationIdBytes.buffer).setBigUint64(0, BigInt(donationId), true);
      
      const [donationPda, bump] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("donation"),
          recipient.toBuffer(),
          donationIdBN.toArray('le', 8), 
        ],
        PROGRAM_ID
      );
      console.log("Bump used:", bump); 

      const [programAuthority] = PublicKey.findProgramAddressSync(
        [Buffer.from('authority')],
        PROGRAM_ID
      );

      console.log("Donation PDA:", donationPda.toBase58());
      console.log("Recipient from input:", recipientAddress);
      console.log("Recipient in seeds:", recipient.toBase58());
      console.log("Donation ID:", donationIdBN.toString());
      console.log("Program ID:", PROGRAM_ID.toBase58());

      const tx = await program.methods
        .initializeDonation(amountBn, donationIdBN)
        .accounts({
          donation: donationPda,
          donor: donor,
          recipient: recipient,
          programAuthority,
          systemProgram: SystemProgram.programId,
        })
        .rpc();


      setStatus(`✅ Донат створено! Транзакція: ${tx}`);
    } catch (error: any) {
      console.error("Full error:", error);
      setStatus(`❌ Помилка: ${error?.message || 'невідома'}`);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Поддержать пользователя</h1>

      <label className={styles.label} htmlFor="recipient">Адрес получателя</label>
      <input
        id="recipient"
        className={styles.addressInput}
        type="text"
        autoComplete="off"
        placeholder="Solana адрес, например: 7G..."
        value={recipientAddress}
        onChange={(e) => setRecipientAddress(e.target.value)}
      />

      <label className={styles.label} htmlFor="amount">Сумма в SOL</label>
      <input
        id="amount"
        className={styles.input}
        type="number"
        min="0.001"
        step="0.001"
        placeholder="Например: 0.1"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button
        className={styles.button}
        onClick={handleSend}
        disabled={!recipientAddress || !amount}
      >
        Отправить донат
      </button>

      {status && <p className={styles.status}>{status}</p>}
    </div>
  );
}

