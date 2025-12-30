import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Folder, BarChart2, Calendar, Settings, LogOut, User } from 'lucide-react';
import styles from './DoctorLayout.module.css';
import { motion } from 'framer-motion';
import API from '../../utils/api';

const DoctorLayout = ({ children }) => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState(() => {
        const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
        return user.fullName || user.email?.split('@')[0] || 'Professional';
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await API.get('/auth/profile');
                const user = response.data;
                localStorage.setItem('currentUser', JSON.stringify(user));
                setUserName(user.fullName || user.email?.split('@')[0] || 'Professional');
            } catch (error) {
                console.error('Failed to sync profile:', error);
            }
        };
        fetchProfile();
    }, []);

    const menuItems = [
        { path: '/doctor/dashboard', icon: <LayoutDashboard size={22} />, label: 'Dashboard' },
        { path: '/doctor/history', icon: <Folder size={22} />, label: 'X-rays' },
        { path: '/doctor/reports', icon: <BarChart2 size={22} />, label: 'AI Reports' },
        { path: '/doctor/appointments', icon: <Calendar size={22} />, label: 'Appointments' },
        { path: '/doctor/settings', icon: <Settings size={22} />, label: 'Settings' },
    ];

    return (
        <div className={styles.app}>
            <div className={styles.container}>
                <motion.aside
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className={styles.sidebar}
                >
                    <div style={{ padding: '0 24px', marginBottom: '40px', fontSize: '20px', fontWeight: '800', color: '#00d9ff', letterSpacing: '1px' }}>
                        AI X-ray Health
                    </div>
                    <nav className={styles.nav}>
                        {menuItems.map((item, index) => (
                            <motion.div
                                key={item.path}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.1 + index * 0.1 }}
                            >
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) => `${styles.navBtn} ${isActive ? styles.active : ''}`}
                                >
                                    <span className={styles.icon}>{item.icon}</span>
                                    <span>{item.label}</span>
                                </NavLink>
                            </motion.div>
                        ))}
                    </nav>
                    <button className={styles.logoutBtn} onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('currentUser');
                        navigate('/');
                    }}>
                        <span className={styles.icon}><LogOut size={20} /></span>
                        <span>Logout</span>
                    </button>
                </motion.aside>

                <motion.main
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className={styles.content}
                >
                    <div className={styles.header}>
                        <div style={{ opacity: 0.1 }}>{/* Spacer */}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ color: '#7a8a9a', fontWeight: '500', fontSize: '0.9rem' }}>
                                Dr. {userName.split(' ')[0]}
                            </span>
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className={styles.userIcon}
                                onClick={() => navigate('/doctor/settings')}
                                style={{ cursor: 'pointer' }}
                            >
                                <User size={24} />
                            </motion.div>
                        </div>
                    </div>
                    {children}
                </motion.main>
            </div>
        </div>
    );
};

export default DoctorLayout;
