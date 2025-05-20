'use client';
import React, { useState } from 'react';
import GetLinkButton from '@/components/GetLinkButton/GetLinkButton';
import styles from './dashboard.module.css';
import DonationsList from '@/components/DonationsList/DonationsList';

type TabType = 'link' | 'donations' | 'analytics';

function DashboardTabs({ activeTab, setActiveTab }: { activeTab: TabType, setActiveTab: (tab: TabType) => void }) {
  return (
    <nav className={styles.dashboardNav} aria-label="Dashboard tabs">
      <button
        className={activeTab === 'link' ? styles.active : styles.navButton}
        onClick={() => setActiveTab('link')}
        type="button"
      >
        Получить ссылку
      </button>
      <button
        className={activeTab === 'donations' ? styles.active : styles.navButton}
        onClick={() => setActiveTab('donations')}
        type="button"
      >
        Мои донаты
      </button>
      <button
        className={activeTab === 'analytics' ? styles.active : styles.navButton}
        onClick={() => setActiveTab('analytics')}
        type="button"
      >
        Аналитика
      </button>
    </nav>
  );
}

const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('link');

  return (
    <div className={styles.dashboardContainer}>
      <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className={styles.dashboardContent}>
        {activeTab === 'link' && <GetLinkButton />}
        {activeTab === 'donations' && <DonationsList />}
        {activeTab === 'analytics' && (
          <div style={{textAlign: 'center', color: 'var(--muted)'}}>Аналитика скоро будет доступна.</div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;