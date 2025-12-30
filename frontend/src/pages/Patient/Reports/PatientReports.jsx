import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Calendar, ChevronRight, Activity } from 'lucide-react';
import styles from './PatientReports.module.css';
import API from '../../../utils/api';

const PatientReports = () => {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const response = await API.get('/xray/my-xrays');
            // Transform API data to UI format
            const formattedReports = response.data.map(xray => ({
                id: xray.id,
                displayId: `R-${xray.id.substring(0, 4).toUpperCase()}`,
                date: new Date(xray.uploadedAt || xray.createdAt).toLocaleDateString("en-US", {
                    year: 'numeric', month: 'short', day: 'numeric'
                }),
                type: 'Chest X-Ray', // Assuming chest for now
                status: xray.prediction ? 'AI Analyzed' : 'Processing',
                result: xray.prediction || 'Pending Analysis'
            }));
            setReports(formattedReports);
        } catch (error) {
            console.error('Failed to fetch reports:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.section}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h2 className={styles.pageTitle}>Medical Reports Archive</h2>
                    <p style={{ color: '#00d9ff', fontWeight: '500' }}>Access your history and AI diagnostics</p>
                </div>
                <button className={styles.submitBtn}>
                    Download All Records
                </button>
            </div>

            {loading ? (
                <div style={{ color: '#94a3b8', textAlign: 'center', marginTop: '50px' }}>Loading reports...</div>
            ) : reports.length > 0 ? (
                <div className={styles.cardGrid}>
                    {reports.map((report) => (
                        <div key={report.id} className={styles.card} onClick={() => navigate(`/patient/reports/${report.id}`)}>
                            <div className={styles.cardHeader}>
                                <div className={styles.idBadge}>
                                    <FileText size={14} /> {report.displayId}
                                </div>
                                <div className={styles.dateInfo}>
                                    <Calendar size={14} /> {report.date}
                                </div>
                            </div>

                            <h4 className={styles.reportType}>{report.type}</h4>
                            <p className={styles.resultText}>{report.result}</p>

                            <div className={styles.cardFooter}>
                                <span className={styles.statusBadge} style={{
                                    background: (report.result.toLowerCase().includes('normal') || report.status === 'AI Analyzed') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                    color: (report.result.toLowerCase().includes('normal') || report.status === 'AI Analyzed') ? '#10b981' : '#f87171',
                                    border: `1px solid ${(report.result.toLowerCase().includes('normal') || report.status === 'AI Analyzed') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                                }}>
                                    <Activity size={12} /> {report.status}
                                </span>
                                <button className={styles.viewBtn}>
                                    View Analysis <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ color: '#94a3b8', textAlign: 'center', marginTop: '50px' }}>No reports found. Upload an X-ray to see it here.</div>
            )}
        </div>
    );
};

export default PatientReports;
