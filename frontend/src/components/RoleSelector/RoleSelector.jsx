import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Stethoscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './RoleSelector.module.css';
import BrandLogo from '../BrandLogo/BrandLogo';

const RoleSelector = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    const handleSelect = (role) => {
        onClose();
        navigate(`/auth/login?role=${role}`);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className={styles.overlay} onClick={onClose}>
                    <motion.div
                        className={styles.modal}
                        onClick={e => e.stopPropagation()}
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    >
                        <button className={styles.closeBtn} onClick={onClose}><X /></button>

                        <div className={styles.logoContainer}>
                            <BrandLogo size={60} />
                        </div>

                        <p className={styles.continueText}>Continue as</p>

                        <div className={styles.roleActions}>
                            <button
                                className={styles.patientBtn}
                                onClick={() => handleSelect('patient')}
                            >
                                Patient
                            </button>
                            <button
                                className={styles.doctorBtn}
                                onClick={() => handleSelect('doctor')}
                            >
                                Doctor
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default RoleSelector;
