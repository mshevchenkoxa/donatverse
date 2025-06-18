'use client';
import React from 'react';
import styles from './Analytics.module.css';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

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

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
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

  const lineChartData = {
    labels: chartData.map(data => data.day),
    datasets: [
      {
        data: chartData.map(data => data.amount),
        borderColor: 'var(--primary)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointBackgroundColor: 'var(--primary)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const barChartData = {
    labels: chartData.map(data => data.day),
    datasets: [
      {
        data: chartData.map(data => data.amount),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

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
        <div className={styles.chartTitle}>Donations Trend (Last 7 Days)</div>
        <div className={styles.chartWrapper}>
          <Line data={lineChartData} options={chartOptions} />
        </div>
      </div>

      <div className={styles.chartContainer}>
        <div className={styles.chartTitle}>Daily Donation Volume</div>
        <div className={styles.chartWrapper}>
          <Bar data={barChartData} options={chartOptions} />
        </div>
      </div>

      <div className={styles.recentDonations}>
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