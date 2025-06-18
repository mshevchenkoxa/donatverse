'use client';
import React from 'react';
import styles from './page.module.css';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

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

const categoryData = {
  labels: ['Education', 'Research', 'Art', 'DeFi', 'Gaming'],
  datasets: [
    {
      data: [15.8, 12.3, 8.5, 20.1, 9.7],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(239, 68, 68, 0.8)',
      ],
      borderColor: [
        'rgba(59, 130, 246, 1)',
        'rgba(16, 185, 129, 1)',
        'rgba(245, 158, 11, 1)',
        'rgba(139, 92, 246, 1)',
        'rgba(239, 68, 68, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

const topDonorsData = {
  labels: ['Donor 1', 'Donor 2', 'Donor 3', 'Donor 4', 'Donor 5'],
  datasets: [
    {
      label: 'Donation Amount (SOL)',
      data: [5.2, 4.8, 3.9, 3.5, 3.1],
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
      borderRadius: 4,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        color: 'var(--muted)',
        padding: 20,
        font: {
          size: 12,
        },
      },
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
    },
  },
};

const barChartOptions = {
  ...chartOptions,
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
      ticks: {
        color: 'var(--muted)',
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: 'var(--muted)',
      },
    },
  },
};

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

      <div className={styles.chartsContainer}>
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Donations by Category</h3>
          <div className={styles.chartWrapper}>
            <Pie data={categoryData} options={chartOptions} />
          </div>
        </div>
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Top Donors</h3>
          <div className={styles.chartWrapper}>
            <Bar data={topDonorsData} options={barChartOptions} />
          </div>
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