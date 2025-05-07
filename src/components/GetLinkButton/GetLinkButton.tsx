import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import styles from './GetLinkButton.module.css'; 

const GetLinkButton: React.FC = () => {
  const { publicKey } = useWallet();
  const [donationLink, setDonationLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (publicKey) {
      const walletAddress = publicKey.toBase58();
      setDonationLink(`http://localhost:3000/donate?wallet=${walletAddress}`);
    } else {
      setDonationLink(null);
    }
  }, [publicKey]);

  const handleCopyClick = () => {
    if (donationLink) {
      navigator.clipboard.writeText(donationLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Your personal donation link:</h2>
      {donationLink ? (
        <>
          <div className={styles.linkBox}>
            <p className={styles.link}>{donationLink}</p>
            <button className={styles.copyButton} onClick={handleCopyClick}>
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </>
      ) : (
        <p className={styles.warning}>Please connect your wallet.</p>
      )}
    </div>
  );
};

export default GetLinkButton;