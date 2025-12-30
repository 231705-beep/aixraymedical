import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerGrid}>
                <div>
                    <h3>Radiology AI</h3>
                    <p>Advanced X-ray diagnostics powered by state-of-the-art AI technology.</p>
                </div>
                <div>
                    <h4>Contact Info</h4>
                    <p>Email: student.dev@air.university.edu</p>
                    <p>Department of Computer Science</p>
                </div>
                <div>
                    <h4>Project Info</h4>
                    <p>BSCS Final Year Project</p>
                    <p>Air University</p>
                </div>
                <div>
                    <h4>Legal</h4>
                    <p>Privacy Policy</p>
                    <p>Terms of Service</p>
                </div>
            </div>
            <p className={styles.copyright}>&copy; 2025 AI Medical X-Ray System. All Rights Reserved.</p>
            <a href="/admin/login" className={styles.adminLink}>Admin Portal Control</a>
        </footer>
    );
};

export default Footer;
