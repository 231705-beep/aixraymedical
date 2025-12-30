import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, AlertTriangle, ShieldCheck, UserCheck, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import API from '../../../utils/api';
// Reuse existing styles to ensure exact match
import styles from '../../Patient/Reports/AIReport.module.css';

const DoctorReportDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const reportRef = useRef(null);
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReportDetail = async () => {
            try {
                const response = await API.get(`/xray/${id}`);
                setReport(response.data);
            } catch (error) {
                console.error('Failed to fetch report detail:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchReportDetail();
    }, [id]);

    if (loading) return <div className={styles.section}><p>Loading report analysis...</p></div>;
    if (!report) return <div className={styles.section}><p>Report not found.</p></div>;

    const aiData = report.aiReport;
    const imageUrl = report.imageUrl && (report.imageUrl.startsWith('http') ? report.imageUrl : `http://localhost:3001/uploads/${report.imageUrl.split(/[\\/]/).pop()}`);
    const riskScore = aiData?.confidence || 0;

    const handleExportPDF = async () => {
        try {
            const element = reportRef.current;
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#0a0f1c'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = 10;

            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
            pdf.save(`AI_Report_${report.id}_${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        }
    };

    return (
        <div className={styles.section}>
            <header className={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={() => navigate(-1)} className={styles.actionBtn} style={{ padding: '8px' }}>
                        <ArrowLeft size={18} />
                    </button>
                    <h1 className={styles.title}>Clinical Report Review</h1>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className={styles.actionBtn} onClick={handleExportPDF}><Download size={18} /> Export PDF</button>
                    <button className={styles.actionBtn}><Share2 size={18} /> Share Case</button>
                </div>
            </header>

            <div ref={reportRef} className={styles.grid}>
                {/* Left: Enhanced X-Ray Display */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className={styles.xrayContainer}
                    style={{ height: '480px' }}
                >
                    <img
                        src={imageUrl}
                        alt="Patient Scan"
                        style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '20px' }}
                    />
                </motion.div>

                {/* Right: Beautiful Result Stack */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className={styles.card}
                    >
                        <h3 className={styles.cardTitle}>Neural Analysis</h3>
                        <div className={styles.summaryBox}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                {aiData?.prediction === 'Normal' ?
                                    <ShieldCheck size={32} color="#10b981" /> :
                                    <AlertTriangle size={32} color="#f43f5e" />
                                }
                                <div>
                                    <h4 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#fff', margin: 0 }}>{aiData?.prediction}</h4>
                                    <span style={{ color: aiData?.prediction === 'Normal' ? '#10b981' : '#f43f5e', fontSize: '0.8rem', fontWeight: '700' }}>
                                        AI SYSTEM DETECTION
                                    </span>
                                </div>
                            </div>
                            <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: '1.6' }}>{aiData?.findings}</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className={styles.card}
                    >
                        <h3 className={styles.cardTitle}>Severity Index</h3>
                        <div className={styles.gaugeWrapper}>
                            <div className={styles.gaugeTrack} />
                            <motion.div
                                className={styles.gaugeFill}
                                initial={{ rotate: -90 }}
                                animate={{ rotate: -90 + (riskScore * 1.8) }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                style={{
                                    borderTopColor: aiData?.riskLevel === 'HIGH' ? '#f43f5e' : '#00d9ff',
                                    borderRightColor: aiData?.riskLevel === 'HIGH' ? '#f43f5e' : '#00d9ff'
                                }}
                            />
                            <div className={styles.gaugeValue}>
                                <span className={styles.percentage}>{riskScore.toFixed(0)}%</span>
                                <span className={styles.riskLabel} style={{ color: aiData?.riskLevel === 'HIGH' ? '#f43f5e' : '#00d9ff' }}>
                                    {aiData?.riskLevel} RISK
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default DoctorReportDetail;
