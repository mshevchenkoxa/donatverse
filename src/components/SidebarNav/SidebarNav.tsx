'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './SidebarNav.module.css';
import WalletConnection from '../WalletConnection';

const navItems = [
  { label: 'Main', href: '/' },
  { label: 'Dashboard', href: '/dashboard?tab=link' },
  { label: 'Donation', href: '/donate' },
  { label: 'Popular', href: '/popular' },
];

const SidebarNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className={styles.sidebar}>
      <h2 className={styles.logo}>💸 Donatverse</h2>
      <ul className={styles.navList}>
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`${styles.navItem} ${
                pathname === item.href ? styles.active : ''
              }`}
            >
              {item.label}
            </Link>            
          </li>
        ))}
      </ul>
      <WalletConnection />
    </nav>
  );
};

export default SidebarNav;
