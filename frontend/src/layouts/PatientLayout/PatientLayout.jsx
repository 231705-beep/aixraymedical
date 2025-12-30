import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Upload, FileText, Users, Calendar, Settings, LogOut, User } from 'lucide-react';
import styles from './PatientLayout.module.css';
import { motion } from 'framer-motion';

const PatientLayout = ({ children }) => {
    const navigate = useNavigate();

    const userString = localStorage.getItem('currentUser');
    let user;
    try {
        user = userString ? JSON.parse(userString) : null;
    } catch (e) {
        user = null;
    }

    // Ensure user is an object with fullName
    const fullName = (user && user.fullName) ? user.fullName : "Patient";
    const rawName = fullName.split(' ')[0];
    const patientName = rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase();

    const menuItems = [
        { path: '/patient/dashboard', icon: <LayoutDashboard size={22} />, label: 'Dashboard' },
        { path: '/patient/upload', icon: <Upload size={22} />, label: 'Upload X-ray' },
        { path: '/patient/reports', icon: <FileText size={22} />, label: 'AI Reports' },
        { path: '/patient/doctors', icon: <Users size={22} />, label: 'Recommended Doctors' },
        { path: '/patient/my-appointments', icon: <Calendar size={22} />, label: 'Appointments' },
        { path: '/patient/settings', icon: <Settings size={22} />, label: 'Settings' },
    ];

    return (
        <div className={styles.layout}>
            <motion.aside
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={styles.sidebar}
            >
                <div className={styles.sidebarLogo}>AI X-ray Health</div>
                <nav className={styles.navMenu}>
                    {menuItems.map((item, index) => (
                        <motion.div
                            key={item.path}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 + index * 0.1 }}
                        >
                            <NavLink
                                to={item.path}
                                className={({ isActive }) => `${styles.navItem} ${isActive ? styles.activeNavItem : ''}`}
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
                className={styles.mainContent}
            >
                {/* Header is now simplified, Dashboards handle their own welcome */}
                <header className={styles.header}>
                    <div style={{ opacity: 0.1 }}>{/* Spacer */}</div>
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={styles.profileInfo}
                        onClick={() => navigate('/patient/settings')}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className={styles.avatar}><User size={22} /></div>
                    </motion.div>
                </header>
                {children}
            </motion.main>
        </div>
    );
};

export default PatientLayout;
