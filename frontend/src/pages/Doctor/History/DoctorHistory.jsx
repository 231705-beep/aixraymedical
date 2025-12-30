import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../../utils/api';
import styles from '../Dashboard/DoctorDashboard.module.css';

const DoctorHistory = () => {
    const navigate = useNavigate();
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await API.get('/doctor/reports');
                setCases(response.data);
            } catch (error) {
                console.error('Failed to fetch history:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    if (loading) return <div className={styles.section}><p>Loading verification history...</p></div>;

    return (
        <div className={styles.dashboard}>
            <div className={styles.card} style={{ minHeight: 'auto', height: '100%' }}>
                <h3 className={styles.cardTitle}>X-ray Verification History</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: '#ffffff' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                                <th style={{ padding: '15px 10px', color: '#7a8a9a', fontWeight: '500' }}>Case ID</th>
                                <th style={{ padding: '15px 10px', color: '#7a8a9a', fontWeight: '500' }}>Patient Name</th>
                                <th style={{ padding: '15px 10px', color: '#7a8a9a', fontWeight: '500' }}>Date Analyzed</th>
                                <th style={{ padding: '15px 10px', color: '#7a8a9a', fontWeight: '500' }}>AI Diagnosis</th>
                                <th style={{ padding: '15px 10px', color: '#7a8a9a', fontWeight: '500' }}>Confidence</th>
                                <th style={{ padding: '15px 10px', color: '#7a8a9a', fontWeight: '500' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cases.map((item) => (
                                <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '20px 10px', fontWeight: '600' }}>{item.xrayId.split('-')[0]}...</td>
                                    <td style={{ padding: '20px 10px' }}>{item.patientName}</td>
                                    <td style={{ padding: '20px 10px', color: '#7a8a9a' }}>{new Date(item.date).toLocaleDateString()}</td>
                                    <td style={{ padding: '20px 10px' }}>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            background: item.prediction === 'Normal' ? 'rgba(0, 255, 127, 0.1)' : 'rgba(255, 69, 58, 0.1)',
                                            color: item.prediction === 'Normal' ? '#00ff7f' : '#ff453a',
                                            fontSize: '12px',
                                            fontWeight: '600'
                                        }}>
                                            {item.prediction}
                                        </span>
                                    </td>
                                    <td style={{ padding: '20px 10px', color: '#00d9ff', fontWeight: 'bold' }}>{item.confidence.toFixed(1)}%</td>
                                    <td style={{ padding: '20px 10px' }}>
                                        <button
                                            onClick={() => navigate(`/doctor/reports/${item.xrayId}`)}
                                            style={{
                                                background: 'rgba(255,255,255,0.05)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                color: '#ffffff',
                                                padding: '6px 12px',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontSize: '12px'
                                            }}>
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DoctorHistory;
