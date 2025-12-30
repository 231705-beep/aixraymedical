import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, UserCog, History, LogOut, ShieldCheck } from 'lucide-react';
import styles from './AdminLayout.module.css';

const AdminLayout = ({ children }) => {
    const navigate = useNavigate();

    const menuItems = [
        { path: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'System Overview' },
        { path: '/admin/doctors', icon: <ShieldCheck size={20} />, label: 'Manage Doctors' },
        { path: '/admin/patients', icon: <Users size={20} />, label: 'Manage Patients' },
        { path: '/admin/logs', icon: <History size={20} />, label: 'Security Logs' },
    ];

    return (
        <div className={styles.layout}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarLogo}>AI X-ray Health <br></br>SYS CONTROL</div>
                <nav className={styles.navMenu}>
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `${styles.navItem} ${isActive ? styles.activeNavItem : ''}`}
                        >
                            {item.icon} <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
                <div className={styles.navItem} style={{ marginTop: 'auto', borderTop: '1px solid #334155', paddingTop: '1.5rem' }} onClick={() => navigate('/')}>
                    <LogOut size={20} /> <span>Terminal Exit</span>
                </div>
            </aside>

            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
