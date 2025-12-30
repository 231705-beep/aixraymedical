import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import API from '../../../utils/api';
import styles from './DoctorDashboard.module.css';

const DoctorDashboard = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [stats, setStats] = useState({ newReports: 0, pendingReview: 0, totalPatients: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const user = JSON.parse(localStorage.getItem('currentUser'));
            console.log('DEBUG: Dashboard Mount. User from LocalStorage:', user);
            try {
                if (!user) return;

                const [apptRes, statsRes] = await Promise.all([
                    API.get(`/appointments/doctor/${user.id}`),
                    API.get('/doctor/dashboard')
                ]);

                setAppointments(apptRes.data);
                setStats({
                    newReports: statsRes.data.newReports || 0,
                    pendingReview: statsRes.data.pendingAppointments || 0,
                    totalPatients: statsRes.data.totalPatients || 0
                });
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const cardVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    const floatVariants = {
        animate: {
            y: [0, -10, 0],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={styles.dashboard}
        >
            {/* Welcome Header */}
            <div style={{ marginBottom: '6rem' }}>
                <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#fff', marginBottom: '0.8rem' }}>
                    Welcome back, Dr. {
                        JSON.parse(localStorage.getItem('currentUser'))?.fullName?.split(' ')[0] ||
                        JSON.parse(localStorage.getItem('currentUser'))?.doctorProfile?.fullName?.split(' ')[0] ||
                        JSON.parse(localStorage.getItem('currentUser'))?.email?.split('@')[0] ||
                        'Professional'
                    }!
                </h1>
                <p style={{ color: '#00d9ff', fontSize: '1rem', fontWeight: '500' }}>Manage your patients and reports efficiently.</p>
            </div>

            <div className={styles.grid}>
                {/* 1. Quick Stats Card */}
                <motion.div variants={cardVariants} whileHover={{ y: -8, scale: 1.02 }} className={styles.card}>
                    <h3 className={styles.cardTitle}>Live Overview</h3>
                    <div className={styles.statGroup}>
                        <div className={styles.stat}>
                            <p className={styles.statLabel}>Total Patients</p>
                            <p className={styles.statNumber}>{stats.totalPatients}</p>
                        </div>
                        <div className={styles.stat}>
                            <p className={styles.statLabel}>Pending Tasks</p>
                            <p className={styles.statNumber}>{stats.pendingReview}</p>
                        </div>
                    </div>
                </motion.div>

                {/* 2. Pending X-rays Card */}
                <motion.div
                    variants={cardVariants}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className={styles.card}
                    onClick={() => navigate('/doctor/reports')}
                    style={{ cursor: 'pointer' }}
                >
                    <div className={styles.iconContainer}>
                        <motion.div variants={floatVariants} animate="animate" className={styles.iconWrapper}>
                            <svg viewBox="0 0 64 64" fill="none" className={styles.customIcon}>
                                <rect x="12" y="8" width="40" height="48" rx="4" stroke="#00d9ff" strokeWidth="2.5" />
                                <path d="M 22 24 L 42 24" stroke="#00d9ff" strokeWidth="2.5" strokeLinecap="round" />
                                <path d="M 22 34 Q 27 28 32 34 T 42 34" stroke="#00d9ff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                                <path d="M 22 44 L 42 44" stroke="#00d9ff" strokeWidth="2.5" strokeLinecap="round" />
                            </svg>
                        </motion.div>
                    </div>
                    <p className={styles.cardText}>AI Insight Reports</p>
                    <p className={styles.cardDesc}>{stats.newReports} Cases detected</p>
                </motion.div>

                {/* 3. Upcoming Appointments Card */}
                <motion.div
                    variants={cardVariants}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className={styles.card}
                    onClick={() => navigate('/doctor/appointments')}
                    style={{ cursor: 'pointer' }}
                >
                    <div className={styles.iconContainer}>
                        <motion.div variants={floatVariants} animate="animate" className={styles.iconWrapper}>
                            <svg viewBox="0 0 64 64" fill="none" className={styles.customIcon}>
                                <rect x="12" y="12" width="40" height="40" rx="4" stroke="#00d9ff" strokeWidth="2.5" />
                                <path d="M 12 24 H 52" stroke="#00d9ff" strokeWidth="2.5" />
                                <path d="M 22 10 V 18" stroke="#00d9ff" strokeWidth="2.5" strokeLinecap="round" />
                                <path d="M 42 10 V 18" stroke="#00d9ff" strokeWidth="2.5" strokeLinecap="round" />
                                <path d="M 26 36 L 30 40 L 38 32" stroke="#00d9ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </motion.div>
                    </div>
                    <p className={styles.cardText}>Scheduled Consults</p>
                    <p className={styles.cardDesc}>{appointments.length} Total Visits</p>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default DoctorDashboard;
