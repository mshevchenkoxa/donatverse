'use client';
import React from 'react';
import styles from './Analytics.module.css';

const Analytics: React.FC = () => {
  
  const stats = [
    { label: 'Total Donations', value: '3.2 SOL' },
    { label: 'Total Donators', value: '14' },
    { label: 'Avg Donation', value: '0.23 SOL' },
    { label: 'NFTs Minted', value: '8' },
  ];

  const donationsData = [
    { date: '2023-05-15', amount: 0.5, sender: '7xQZ...3fGt' },
    { date: '2023-05-14', amount: 1.2, sender: '9pLm...2kRt' },
    { date: '2023-05-12', amount: 0.3, sender: '4sDf...7hJk' },
    { date: '2023-05-10', amount: 0.7, sender: '1qWe...5tYu' },
    { date: '2023-05-08', amount: 0.5, sender: '6yHg...9iOp' },
  ];
  
  const chartData = [
    { day: 'Mon', amount: 0.8 },
    { day: 'Tue', amount: 0.5 },
    { day: 'Wed', amount: 1.2 },
    { day: 'Thu', amount: 0.3 },
    { day: 'Fri', amount: 0.7 },
    { day: 'Sat', amount: 1.5 },
    { day: 'Sun', amount: 0.9 },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Donation Analytics</h2>
      
      <div className={styles.statsContainer}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statCard}>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div className={styles.chartContainer}>
        <div className={styles.chartTitle}>Donations Last 7 Days</div>
        <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
          {chartData.map((data, index) => (
            <div 
              key={index}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: `${(data.amount / 2) * 100}%`,
                  background: 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))',
                  borderRadius: '4px',
                  transition: 'height 0.3s ease',
                }}
              />
              <div style={{ marginTop: '8px', color: 'var(--muted)', fontSize: '0.875rem' }}>
                {data.day}
              </div>
              <div style={{ color: 'var(--foreground)', fontSize: '0.75rem', fontWeight: '600' }}>
                {data.amount} SOL
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className={styles.chartTitle}>Recent Donations</h3>
        <table className={styles.donationsTable}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Sender</th>
            </tr>
          </thead>
          <tbody>
            {donationsData.map((donation, index) => (
              <tr key={index}>
                <td>{donation.date}</td>
                <td className={styles.solAmount}>{donation.amount} SOL</td>
                <td>{donation.sender}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Analytics;