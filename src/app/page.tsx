import Link from "next/link";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <section className={styles.headerSection}>
        <h1 className={styles.title}>Donatverse</h1>
        <p className={styles.subtitle}>
          A decentralized donation platform with full transparency and instant payouts via Solana.
        </p>
        <p className={styles.note}>
          No middlemen. No hidden fees. Just support.
        </p>        
      </section>
      
    </main>
  );
}
