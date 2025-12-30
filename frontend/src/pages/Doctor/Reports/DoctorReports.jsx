import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../../utils/api';
import styles from '../Dashboard/DoctorDashboard.module.css';

const DoctorReports = () => {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await API.get('/doctor/reports');
                setReports(response.data);
            } catch (error) {
                console.error('Failed to fetch reports:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    // Derived analytics
    const totalAnalyses = reports.length;
    const criticalCount = reports.filter(r => r.riskLevel === 'CRITICAL' || r.riskLevel === 'HIGH').length;
    const avgConfidence = reports.length > 0
        ? (reports.reduce((acc, r) => acc + r.confidence, 0) / reports.length).toFixed(1)
        : '0';

    const findingsMap = {};
    reports.forEach(r => {
        findingsMap[r.prediction] = (findingsMap[r.prediction] || 0) + 1;
    });
    const findings = Object.entries(findingsMap).map(([condition, count]) => ({
        condition,
        count,
        percentage: ((count / totalAnalyses) * 100).toFixed(0) + '%'
    })).sort((a, b) => b.count - a.count);

    return (
        <div className={styles.dashboard}>
            {/* MINI STATS */}
            <div className={styles.grid} style={{ marginBottom: '30px' }}>
                <div className={styles.card} style={{ height: '220px', minHeight: 'auto', justifyContent: 'center' }}>
                    <p className={styles.statLabel} style={{ fontSize: '14px', marginBottom: '15px' }}>Total Analyses</p>
                    <p className={styles.statNumber} style={{ color: '#fff', fontSize: '42px' }}>{totalAnalyses}</p>
                    <p style={{ color: '#7a8a9a', fontSize: '12px', marginTop: '10px' }}>Live Records</p>
                </div>
                <div className={styles.card} style={{ height: '220px', minHeight: 'auto', justifyContent: 'center' }}>
                    <p className={styles.statLabel} style={{ fontSize: '14px', marginBottom: '15px' }}>Average Confidence</p>
                    <p className={styles.statNumber} style={{ color: '#00d9ff', fontSize: '42px' }}>{avgConfidence}%</p>
                    <p style={{ color: '#7a8a9a', fontSize: '12px', marginTop: '10px' }}>AI Model Output</p>
                </div>
                <div className={styles.card} style={{ height: '220px', minHeight: 'auto', justifyContent: 'center' }}>
                    <p className={styles.statLabel} style={{ fontSize: '14px', marginBottom: '15px' }}>Critical Cases</p>
                    <p className={styles.statNumber} style={{ color: '#ff453a', fontSize: '42px' }}>{criticalCount}</p>
                    <p style={{ color: '#7a8a9a', fontSize: '12px', marginTop: '10px' }}>Requires Attention</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
                {/* DETAILED FINDINGS */}
                <div className={styles.card} style={{ height: 'auto', minHeight: 'auto' }}>
                    <h3 className={styles.cardTitle}>Diagnostic Breakdown</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {findings.length > 0 ? findings.map((finding) => (
                            <div key={finding.condition} style={{ width: '100%' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ffffff', marginBottom: '8px', fontSize: '14px' }}>
                                    <span>{finding.condition}</span>
                                    <span style={{ color: '#7a8a9a' }}>{finding.count} cases ({finding.percentage})</span>
                                </div>
                                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{
                                        width: finding.percentage,
                                        height: '100%',
                                        background: '#00d9ff',
                                        boxShadow: '0 0 10px rgba(0, 217, 255, 0.5)'
                                    }} />
                                </div>
                            </div>
                        )) : <p style={{ color: '#7a8a9a' }}>No data available yet.</p>}
                    </div>
                </div>

                {/* RECENT RECORDS TABLE */}
                <div className={styles.card} style={{ height: 'auto', minHeight: 'auto' }}>
                    <h3 className={styles.cardTitle}>Recent AI Analyses</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', color: '#7a8a9a', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <th style={{ padding: '12px' }}>Patient</th>
                                <th style={{ padding: '12px' }}>Result</th>
                                <th style={{ padding: '12px' }}>Risk</th>
                                <th style={{ padding: '12px' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map((report) => (
                                <tr key={report.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', color: '#fff', fontSize: '14px' }}>
                                    <td style={{ padding: '15px 12px' }}>{report.patientName}</td>
                                    <td style={{ padding: '15px 12px' }}>{report.prediction}</td>
                                    <td style={{ padding: '15px 12px' }}>
                                        <span style={{
                                            padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold',
                                            background: report.riskLevel === 'CRITICAL' || report.riskLevel === 'HIGH' ? 'rgba(255,69,58,0.1)' : 'rgba(0,217,255,0.1)',
                                            color: report.riskLevel === 'CRITICAL' || report.riskLevel === 'HIGH' ? '#ff453a' : '#00d9ff'
                                        }}>
                                            {report.riskLevel}
                                        </span>
                                    </td>
                                    <td style={{ padding: '15px 12px' }}>
                                        <button
                                            onClick={() => navigate(`/doctor/reports/${report.xrayId}`)}
                                            style={{ background: 'rgba(0,217,255,0.1)', color: '#00d9ff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                                        >
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

export default DoctorReports;
