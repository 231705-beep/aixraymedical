import React from 'react';
import { FileText, Download, Calendar, User } from 'lucide-react';
import styles from './PatientPrescriptions.module.css';

const PatientPrescriptions = () => {
    const prescriptions = [
        { id: 1, doctor: "Dr. Michael Chen", date: "Oct 25, 2025", diagnosis: "Bacterial Pneumonia", medicines: ["Amoxicillin 500mg", "Paracetamol 500mg"] },
        { id: 2, doctor: "Dr. Sarah Johnson", date: "Sep 12, 2025", diagnosis: "Common Cold", medicines: ["Vitamin C", "Cough Syrup"] }
    ];

    return (
        <div className={styles.section}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <h2>My Prescriptions</h2>
            </div>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
                {prescriptions.map((p) => (
                    <div key={p.id} className={styles.card} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                            <div style={{ background: '#f1f5f9', padding: '1rem', borderRadius: '12px' }}>
                                <FileText color="#64748b" />
                            </div>
                            <div>
                                <h3 style={{ marginBottom: '0.25rem' }}>{p.diagnosis}</h3>
                                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><User size={16} /> {p.doctor}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={16} /> {p.date}</span>
                                </div>
                                <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                                    {p.medicines.map((med, i) => (
                                        <span key={i} style={{ fontSize: '0.75rem', background: 'var(--primary-light)', color: 'var(--primary-color)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: '600' }}>{med}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <button className={styles.actionBtn} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Download size={18} /> Download PDF
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PatientPrescriptions;
