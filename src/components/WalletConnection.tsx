"use client";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import styles from './WalletConnection.module.css';

export default function WalletConnection() {
  return (
    <div className={styles.walletContainer}>
      <WalletMultiButton className={styles.walletButton} />
    </div>
  );
}
