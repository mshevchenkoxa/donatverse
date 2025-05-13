'use client';
import React, { useState } from 'react';
import GetLinkButton from '@/components/GetLinkButton/GetLinkButton';
import styles from './dashboard.module.css';
import DonationsList from '@/components/DonationsList/DonationsList';

const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'link' | 'donations' | 'analytics'>('link');

  return (
    <div className={styles.dashboardContainer}>
      <nav className={styles.dashboardNav}>
        <button
          className={activeTab === 'link' ? styles.active : styles.navButton}
          onClick={() => setActiveTab('link')}
        >
          Get <link rel="stylesheet" href="" />
        </button>
        <button
          className={activeTab === 'donations' ? styles.active : styles.navButton}
          onClick={() => setActiveTab('donations')}
        >
          My donation
        </button>
        <button
          className={activeTab === 'analytics' ? styles.active : styles.navButton}
          onClick={() => setActiveTab('analytics')}
        >
          Analystic
        </button>
      </nav>

      <div className={styles.dashboardContent}>
        {activeTab === 'link' && <GetLinkButton />}
        {activeTab === 'donations' && <DonationsList />}
      </div>
    </div>
  );
};

export default DashboardPage;