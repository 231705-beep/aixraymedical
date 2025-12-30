import React from 'react';
import styles from './MedicalLoader.module.css';

const MedicalLoader = () => {
    return (
        <div className={styles.loaderContainer}>
            <div className={styles.pulse}></div>
            <p>Initializing Diagnostic Engine...</p>
        </div>
    );
};

export default MedicalLoader;
