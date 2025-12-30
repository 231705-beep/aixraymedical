import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RoleModal.module.css';

const RoleModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2>Get Started</h2>
                <p>Choose how you would like to continue</p>
                <div className={styles.options}>
                    <button
                        onClick={() => { navigate('/auth/signup?role=patient'); onClose(); }}
                        className={styles.patientBtn}
                    >
                        Continue as Patient
                    </button>
                    <button
                        onClick={() => { navigate('/auth/signup?role=doctor'); onClose(); }}
                        className={styles.doctorBtn}
                    >
                        Continue as Doctor
                    </button>
                </div>
                <button onClick={onClose} className={styles.cancelBtn}>Cancel</button>
            </div>
        </div>
    );
};

export default RoleModal;
