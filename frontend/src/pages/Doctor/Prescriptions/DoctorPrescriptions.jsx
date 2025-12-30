import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Send, FileText, Plus, Trash2 } from 'lucide-react';
import API from '../../../utils/api';
import styles from './DoctorPrescriptions.module.css';

const DoctorPrescriptions = () => {
    const { id } = useParams();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [medicines, setMedicines] = useState([
        { id: 1, name: '', dosage: '', frequency: '', duration: '' }
    ]);

    useEffect(() => {
        const fetchCaseData = async () => {
            try {
                const response = await API.get(`/xray/${id}`);
                setReport(response.data);
            } catch (error) {
                console.error('Failed to fetch case for prescription:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCaseData();
    }, [id]);

    const addMedicine = () => {
        setMedicines([...medicines, { id: Date.now(), name: '', dosage: '', frequency: '', duration: '' }]);
    };

    const removeMedicine = (id) => {
        setMedicines(medicines.filter(m => m.id !== id));
    };

    if (loading) return <div className={styles.section}><p>Preparing prescription workspace...</p></div>;

    return (
        <div className={styles.section}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <h2>Prescription Writer</h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className={styles.btnPrimary} style={{ background: '#64748b' }}>Preview PDF</button>
                    <button className={styles.btnPrimary} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Send size={18} /> Send to Patient
                    </button>
                </div>
            </div>

            <div className={styles.diagPanel} style={{ maxWidth: '900px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <div>
                        <h4 style={{ color: '#64748b' }}>Patient Details</h4>
                        <p style={{ fontWeight: '700' }}>{report?.patient?.patientProfile?.fullName || report?.patient?.email} (P-{report?.patientId?.split('-')[0]})</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <h4 style={{ color: '#64748b' }}>Diagnosis</h4>
                        <p style={{ fontWeight: '700', color: report?.aiReport?.riskLevel === 'CRITICAL' ? '#ef4444' : '#00d9ff' }}>
                            {report?.aiReport?.prediction || 'Pending AI Analysis'}
                        </p>
                    </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1.1rem' }}>Medications</h3>
                        <button onClick={addMedicine} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-color)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}>
                            <Plus size={18} /> Add More
                        </button>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', textAlign: 'left', fontSize: '0.8rem', color: '#64748b' }}>
                                <th style={{ padding: '0.75rem' }}>Medicine Name</th>
                                <th style={{ padding: '0.75rem' }}>Dosage</th>
                                <th style={{ padding: '0.75rem' }}>Frequency</th>
                                <th style={{ padding: '0.75rem' }}>Duration</th>
                                <th style={{ padding: '0.75rem' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {medicines.map((m) => (
                                <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '0.75rem' }}><input type="text" placeholder="e.g. Amoxicillin" style={{ width: '100%', border: 'none', background: 'none', borderBottom: '1px solid #e2e8f0', padding: '0.4rem' }} /></td>
                                    <td style={{ padding: '0.75rem' }}><input type="text" placeholder="500mg" style={{ width: '100%', border: 'none', background: 'none', borderBottom: '1px solid #e2e8f0', padding: '0.4rem' }} /></td>
                                    <td style={{ padding: '0.75rem' }}><input type="text" placeholder="Twice daily" style={{ width: '100%', border: 'none', background: 'none', borderBottom: '1px solid #e2e8f0', padding: '0.4rem' }} /></td>
                                    <td style={{ padding: '0.75rem' }}><input type="text" placeholder="7 days" style={{ width: '100%', border: 'none', background: 'none', borderBottom: '1px solid #e2e8f0', padding: '0.4rem' }} /></td>
                                    <td style={{ padding: '0.75rem' }}>
                                        {medicines.length > 1 && <Trash2 size={18} color="#ef4444" style={{ cursor: 'pointer' }} onClick={() => removeMedicine(m.id)} />}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Additional Notes</h3>
                    <textarea placeholder="e.g. Bed rest recommended for 3 days. Complete the full course of antibiotics." style={{ minHeight: '120px' }}></textarea>
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', color: '#64748b', fontSize: '0.875rem' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></div>
                    Digitally signed by Dr. {JSON.parse(localStorage.getItem('currentUser'))?.fullName || 'Verification System'}
                </div>
            </div>
        </div>
    );
};

export default DoctorPrescriptions;
