'use client';
import React from 'react';
import styles from './page.module.css';

const mockPopularAddresses = [
  {
    address: '7xQZ...3fGt',
    name: 'Crypto Charity Fund',
    totalDonations: 15.8,
    donors: 124,
    description: 'Supporting blockchain education and development',
    category: 'Education'
  },
  {
    address: '9pLm...2kRt',
    name: 'Web3 Research Lab',
    totalDonations: 12.3,
    donors: 89,
    description: 'Advancing blockchain research and innovation',
    category: 'Research'
  },
  {
    address: '4sDf...7hJk',
    name: 'NFT Artists Collective',
    totalDonations: 8.5,
    donors: 156,
    description: 'Supporting digital artists in the NFT space',
    category: 'Art'
  },
  {
    address: '1qWe...5tYu',
    name: 'DeFi Development Fund',
    totalDonations: 20.1,
    donors: 203,
    description: 'Building the future of decentralized finance',
    category: 'DeFi'
  },
  {
    address: '6yHg...9iOp',
    name: 'Blockchain Gaming Guild',
    totalDonations: 9.7,
    donors: 178,
    description: 'Supporting blockchain gaming development',
    category: 'Gaming'
  }
];

export default function PopularPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Popular Donation Addresses</h1>
      
      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>66.4 SOL</div>
          <div className={styles.statLabel}>Total Donations</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>750</div>
          <div className={styles.statLabel}>Total Donors</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>5</div>
          <div className={styles.statLabel}>Featured Projects</div>
        </div>
      </div>

      <div className={styles.addressesGrid}>
        {mockPopularAddresses.map((address, index) => (
          <div key={index} className={styles.addressCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.projectName}>{address.name}</h3>
              <span className={styles.category}>{address.category}</span>
            </div>
            <p className={styles.description}>{address.description}</p>
            <div className={styles.addressInfo}>
              <div className={styles.addressLabel}>Address:</div>
              <div className={styles.address}>{address.address}</div>
            </div>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statValue}>{address.totalDonations} SOL</span>
                <span className={styles.statLabel}>Total</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>{address.donors}</span>
                <span className={styles.statLabel}>Donors</span>
              </div>
            </div>
            <button className={styles.donateButton}>
              Donate Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 