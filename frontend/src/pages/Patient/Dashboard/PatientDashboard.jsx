import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import API from '../../../utils/api';
import styles from './PatientDashboard.module.css';

const PatientDashboard = () => {
    const navigate = useNavigate();
    // REVERTED TO MOCK DATA FOR UI REFINEMENT
    const [latestReport, setLatestReport] = useState(null);
    const [stats, setStats] = useState({ xrays: 0, appointments: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('currentUser'));
                if (!user) return;

                // Parallel fetch for efficiency
                const [xrayRes, apptRes] = await Promise.all([
                    API.get('/xray/my-xrays').catch(() => ({ data: [] })),
                    API.get(`/appointments/patient/${user.id}`).catch(() => ({ data: [] }))
                ]);

                // Update Stats
                setStats({
                    xrays: xrayRes.data.length,
                    appointments: apptRes.data.length
                });

                // Set Latest Report (if exists)
                if (xrayRes.data.length > 0) {
                    // Assuming API returns latest first, or sorting is needed. taking first for now.
                    // Mapping backend entity structure to UI expectation if needed
                    const latest = xrayRes.data[0];
                    // Verify if latest has report data attached, otherwise use defaults
                    setLatestReport({
                        id: latest.id,
                        aiReport: latest.aiReport || { prediction: 'Pending', riskLevel: 'UNKNOWN', confidence: 0 }
                    });
                }
            } catch (error) {
                console.error('Dashboard load failed:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
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

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    const pulseVariants = {
        animate: {
            boxShadow: [
                "0 0 20px rgba(0, 217, 255, 0.1), 0 20px 50px rgba(0, 0, 0, 0.5)",
                "0 0 40px rgba(0, 217, 255, 0.3), 0 20px 50px rgba(0, 0, 0, 0.5)",
                "0 0 20px rgba(0, 217, 255, 0.1), 0 20px 50px rgba(0, 0, 0, 0.5)"
            ],
            transition: {
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const floatVariants = {
        animate: {
            y: [0, -8, 0],
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
            className={styles.section}
        >
            {/* Welcome Header */}
            <div style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#fff', marginBottom: '0.5rem' }}>
                    Welcome back, {
                        JSON.parse(localStorage.getItem('currentUser'))?.fullName?.split(' ')[0] ||
                        JSON.parse(localStorage.getItem('currentUser'))?.patientProfile?.fullName?.split(' ')[0] ||
                        JSON.parse(localStorage.getItem('currentUser'))?.email?.split('@')[0] ||
                        'User'
                    }!
                </h1>
                <p style={{ color: '#00d9ff', fontSize: '1rem', fontWeight: '500' }}>Your personalized health overview.</p>
            </div>

            {/* 1. Top Banner */}
            <motion.div
                variants={pulseVariants}
                animate="animate"
                whileHover={{ scale: 1.01 }}
                className={styles.banner}
                onClick={() => navigate('/patient/upload')}
                style={{ cursor: 'pointer' }}
            >
                <div className={styles.bannerText}>
                    Upload an X-ray to begin analysis <span>→</span>
                </div>
            </motion.div>

            {/* 2. Three-column Grid */}
            <div className={styles.grid}>
                {/* Card 1: Upload */}
                <motion.div
                    variants={itemVariants}
                    whileHover={{ y: -8, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={styles.card}
                    onClick={() => navigate('/patient/upload')}
                    style={{ cursor: 'pointer' }}
                >
                    <div className={styles.iconWrapper}>
                        <motion.div variants={floatVariants} animate="animate" style={{ width: '100%', height: '100%' }}>
                            <svg viewBox="0 0 64 64" fill="none" className={styles.customIcon}>
                                <rect x="12" y="16" width="40" height="32" rx="4" stroke="#00d9ff" strokeWidth="2.5" />
                                <path d="M 32 20 L 32 36" stroke="#00d9ff" strokeWidth="2.5" strokeLinecap="round" />
                                <path d="M 26 26 L 32 20 L 38 26" stroke="#00d9ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </motion.div>
                    </div>
                    <h3 className={styles.cardTitle}>Upload X-ray</h3>
                    <p className={styles.cardDesc}>Total Uploads: {stats.xrays}</p>
                </motion.div>

                {/* Card 2: Report */}
                <motion.div
                    variants={itemVariants}
                    whileHover={{ y: -8, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={styles.card}
                    onClick={() => navigate(latestReport ? `/patient/reports/${latestReport.id}` : '/patient/reports')}
                    style={{ cursor: 'pointer' }}
                >
                    <div className={styles.iconWrapper}>
                        <motion.div variants={floatVariants} animate="animate" style={{ width: '100%', height: '100%' }}>
                            <svg viewBox="0 0 64 64" fill="none" className={styles.customIcon}>
                                <rect x="16" y="12" width="32" height="40" rx="3" stroke="#00d9ff" strokeWidth="2.5" />
                                <path d="M 24 24 H 40" stroke="#00d9ff" strokeWidth="2.5" strokeLinecap="round" />
                                <path d="M 24 32 H 34" stroke="#00d9ff" strokeWidth="2.5" strokeLinecap="round" />
                                <rect x="24" y="40" width="6" height="6" rx="1" fill="#00d9ff" />
                                <rect x="34" y="40" width="6" height="6" rx="1" fill="#00d9ff" />
                            </svg>
                        </motion.div>
                    </div>
                    <h3 className={styles.cardTitle}>Latest Report</h3>
                    <p className={styles.cardDesc}>
                        {latestReport?.aiReport ? (
                            <span style={{ color: latestReport.aiReport.prediction === 'Normal' ? '#10b981' : '#ef4444' }}>
                                Result: {latestReport.aiReport.prediction}
                            </span>
                        ) : 'No reports yet'}
                    </p>
                </motion.div>

                {/* Card 3: Appointments */}
                <motion.div
                    variants={itemVariants}
                    whileHover={{ y: -8, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={styles.card}
                    onClick={() => navigate(stats.appointments > 0 ? '/patient/my-appointments' : '/patient/appointments')}
                    style={{ cursor: 'pointer' }}
                >
                    <div className={styles.iconWrapper}>
                        <motion.div variants={floatVariants} animate="animate" style={{ width: '100%', height: '100%' }}>
                            <svg viewBox="0 0 64 64" fill="none" className={styles.customIcon}>
                                <rect x="12" y="14" width="40" height="38" rx="4" stroke="#00d9ff" strokeWidth="2.5" />
                                <path d="M 12 24 H 52" stroke="#00d9ff" strokeWidth="2.5" />
                                <path d="M 22 10 V 18" stroke="#00d9ff" strokeWidth="2.5" strokeLinecap="round" />
                                <path d="M 42 10 V 18" stroke="#00d9ff" strokeWidth="2.5" strokeLinecap="round" />
                                <path d="M 26 36 L 30 40 L 38 32" stroke="#00d9ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </motion.div>
                    </div>
                    <h3 className={styles.cardTitle}>Appointments</h3>
                    <p className={styles.cardDesc}>{stats.appointments} Scheduled</p>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default PatientDashboard;
