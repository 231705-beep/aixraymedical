import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ShieldCheck, AlertTriangle } from 'lucide-react';
import API from '../../../utils/api';
import styles from './PatientCases.module.css';

const PatientCases = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCaseData = async () => {
            try {
                const response = await API.get(`/xray/${id}`);
                setReport(response.data);
            } catch (error) {
                console.error('Failed to fetch case data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCaseData();
    }, [id]);

    if (loading) return <div className={styles.section}><p>Loading clinical case...</p></div>;
    if (!report) return <div className={styles.section}><p>Case not found.</p></div>;

    const aiData = report.aiReport;
    const imageUrl = report.imageUrl && (report.imageUrl.startsWith('http') ? report.imageUrl : `http://localhost:3001/${report.imageUrl}`);


    return (
        <div className={styles.section}>
            <button onClick={() => navigate('/doctor/dashboard')} style={{ marginBottom: '1.5rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                <ChevronLeft size={18} /> Back to Patients
            </button>

            <div className={styles.diagnosticView}>
                <div className={styles.imageOverlayContainer}>
                    <div className={styles.imageOverlay}>
                        <img
                            src={imageUrl}
                            alt="Scan"
                            style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#0a0f1c' }}
                        />
                        <div style={{
                            position: 'absolute', top: '1rem', right: '1rem',
                            background: aiData?.riskLevel === 'CRITICAL' || aiData?.riskLevel === 'HIGH' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(0, 217, 255, 0.9)',
                            color: 'white', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold'
                        }}>
                            AI DETECTION: {aiData?.confidence?.toFixed(0) || 0}% CONFIDENCE
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                        <div style={{
                            flex: 1, padding: '1rem',
                            background: aiData?.riskLevel === 'CRITICAL' || aiData?.riskLevel === 'HIGH' ? '#fee2e2' : '#e0f7ff',
                            borderRadius: '12px'
                        }}>
                            <h4 style={{ color: aiData?.riskLevel === 'CRITICAL' || aiData?.riskLevel === 'HIGH' ? '#991b1b' : '#006680', marginBottom: '0.5rem' }}>
                                AI Diagnosis: {aiData?.prediction}
                            </h4>
                            <p style={{ fontSize: '0.9rem', color: '#1e293b' }}>{aiData?.findings}</p>
                        </div>
                        <div style={{ flex: 1, padding: '1rem', background: '#d1fae5', borderRadius: '12px' }}>
                            <h4 style={{ color: '#065f46', marginBottom: '0.5rem' }}>Doctor Verification</h4>
                            <p style={{ fontSize: '0.9rem' }}>Awaiting your clinical assessment and final verification.</p>
                        </div>
                    </div>
                </div>

                <div className={styles.diagPanel}>
                    <h3>Clinical Assessment</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: '600' }}>Diagnosis Note</label>
                        <textarea placeholder="Type your diagnosis here..."></textarea>

                        <label style={{ fontSize: '0.875rem', fontWeight: '600' }}>Prescription</label>
                        <textarea placeholder="e.g. Amoxicillin 500mg, twice daily for 7 days" style={{ minHeight: '100px' }}></textarea>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button className={styles.btnPrimary} style={{ flex: 1, background: '#10b981' }}>Verify & Sign</button>
                            <button className={styles.btnPrimary} style={{ flex: 1, background: '#ef4444' }}>Flag for Review</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientCases;
