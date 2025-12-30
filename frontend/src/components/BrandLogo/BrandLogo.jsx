import React from 'react';
import { motion } from 'framer-motion';
import styles from './BrandLogo.module.css';

const BrandLogo = ({ includeText = true, size = 40 }) => {
    return (
        <div className={styles.brandLogo}>
            <div className={styles.logoWrapper} style={{ width: size, height: size }}>
                <svg viewBox="0 0 100 100" className={styles.plusSvg}>
                    {/* The main plus sign shape */}
                    <path
                        d="M35 15 H65 V35 H85 V65 H65 V85 H35 V65 H15 V35 H35 Z"
                        fill="#3b82f6"
                        className={styles.mainPath}
                    />
                    {/* The "inside animation" - a highlight line passing through */}
                    <motion.path
                        d="M15 35 L85 65"
                        stroke="rgba(255, 255, 255, 0.4)"
                        strokeWidth="2"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{
                            pathLength: [0, 1, 0],
                            opacity: [0, 1, 0],
                            x: [-10, 0, 10],
                            y: [-10, 0, 10]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            repeatDelay: 1
                        }}
                    />
                    <motion.path
                        d="M35 15 L65 85"
                        stroke="rgba(255, 255, 255, 0.2)"
                        strokeWidth="1.5"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{
                            pathLength: [0, 1, 0],
                            opacity: [0, 1, 0]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.5,
                            repeatDelay: 1
                        }}
                    />
                </svg>
            </div>
            {includeText && (
                <span className={styles.brandText}>AI X-ray Health</span>
            )}
        </div>
    );
};

export default BrandLogo;
