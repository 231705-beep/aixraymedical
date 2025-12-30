import React from 'react';
import styles from './Navbar.module.css';
import { Bell } from 'lucide-react';
import BrandLogo from '../BrandLogo/BrandLogo';

const Navbar = ({ onNavigate }) => {
    const [scrolled, setScrolled] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            if (offset > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (e, targetId) => {
        e.preventDefault();
        if (targetId === 'how-it-works' && onNavigate) {
            onNavigate(targetId);
        } else {
            const element = document.getElementById(targetId);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
            <BrandLogo size={32} />
            <ul className={styles.navLinks}>
                <li><a href="#home" onClick={(e) => handleNavClick(e, 'home')}>Home</a></li>
                <li><a href="#how-it-works" onClick={(e) => handleNavClick(e, 'how-it-works')}>How It Works</a></li>
                <li><a href="#features" onClick={(e) => handleNavClick(e, 'features')}>Features</a></li>
            </ul>
            <div className={styles.navActions} style={{ color: 'white', cursor: 'pointer' }}>
                <Bell size={20} />
            </div>
        </nav>
    );
};

export default Navbar;
