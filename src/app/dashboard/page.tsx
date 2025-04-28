'use client';
import React, { useState } from 'react';
import GetLinkButton from '@/components/GetLinkButton/GetLinkButton';
import styles from './dashboard.module.css';

const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'link' | 'donations' | 'analytics'>('link');

  return (
    <div className={styles.dashboardContainer}>
      <nav className={styles.dashboardNav}>
        <button
          className={activeTab === 'link' ? styles.active : ''}
          onClick={() => setActiveTab('link')}
        >
          Отримати посилання
        </button>
        <button
          className={activeTab === 'donations' ? styles.active : ''}
          onClick={() => setActiveTab('donations')}
        >
          Мої донати
        </button>
        <button
          className={activeTab === 'analytics' ? styles.active : ''}
          onClick={() => setActiveTab('analytics')}
        >
          Аналітика
        </button>
      </nav>

      <div className={styles.dashboardContent}>
        {activeTab === 'link' && <GetLinkButton />}        
      </div>
    </div>
  );
};

export default DashboardPage;