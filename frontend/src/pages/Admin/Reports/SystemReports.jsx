import React from 'react';
import styles from './SystemReports.module.css';

const SystemReports = () => {
    return (
        <div className={styles.section}>
            <h1>System Analytics & Reports</h1>
            <div className={styles.cardGrid}>
                <div className={styles.statCard}>
                    <h3>Monthly Active Users</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>4,302</p>
                </div>
                <div className={styles.statCard}>
                    <h3>AI Verification Success</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>94.8%</p>
                </div>
            </div>
        </div>
    );
};

export default SystemReports;
