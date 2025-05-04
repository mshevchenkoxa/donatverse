'use client';
import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import styles from './DonationsList.module.css';

type Donation = {
  sender: string;
  amount: number;
  confirmed: boolean;
  signature: string;
};

const DonationsList: React.FC = () => {
  const { publicKey } = useWallet();
  const [donations, setDonations] = useState<Donation[]>([]);

  useEffect(() => {
    if (publicKey) {
      
      fetchDonationsFromProgram(publicKey.toBase58());
    }
  }, [publicKey]);

  const fetchDonationsFromProgram = async (walletAddress: string) => {
    
    const mockData: Donation[] = [
      { sender: 'Sender1', amount: 0.2, confirmed: false, signature: 'abc123' },
      { sender: 'Sender2', amount: 0.5, confirmed: true, signature: 'xyz789' },
      { sender: 'Sender3', amount: 0.1, confirmed: false, signature: 'def456' },
    ];
    setDonations(mockData);
  };

  const handleMintNft = async (signature: string) => {
    
    console.log(`Мінтимо NFT для транзакції: ${signature}`);
    
    setDonations((prev) =>
      prev.map((d) => (d.signature === signature ? { ...d, confirmed: true } : d))
    );
  };

  return (
    <div className={styles.container}>
      <h2>Мої донати</h2>
      {donations.length === 0 && <p>Немає донатів</p>}
      <ul className={styles.donationList}>
        {donations.map((donation, index) => (
          <li key={index} className={styles.donationItem}>
            <div>
              <strong>Від:</strong> <span className={styles.textLight}>{donation.sender}</span><br />
              <strong>Сума:</strong> <span className={styles.textLight}>{donation.amount} SOL</span>
            </div>
            {!donation.confirmed ? (
              <button className={styles.mintButton} onClick={() => handleMintNft(donation.signature)}>
                Мінтити NFT
              </button>
            ) : (
              <span className={styles.confirmed}>✅ Підтверджено</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DonationsList;