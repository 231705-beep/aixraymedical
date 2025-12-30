import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, AlertTriangle, ShieldCheck, UserCheck, ArrowRight } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import styles from './AIReport.module.css';
import API from '../../../utils/api';

const AIReport = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const reportRef = useRef(null);

    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const response = await API.get(`/xray/${id}`);
                const data = response.data;

                // Extract filename robustly and ensure /uploads/ prefix
                const rawPath = data.imageUrl || '';
                const filename = rawPath.split(/[\\/]/).pop();
                const imageUrl = filename ? `http://localhost:3001/uploads/${filename}` : null;
                setReport({
                    id: data.id,
                    imageUrl: imageUrl, // Use the served static URL
                    aiReport: data.aiReport || {
                        prediction: 'Pending Analysis',
                        findings: 'AI is processing this image. Please refresh shortly.',
                        confidence: 0,
                        riskLevel: 'UNKNOWN'
                    }
                });
            } catch (error) {
                console.error('Failed to fetch report:', error);
                alert('Could not load report details.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchReport();
        }
    }, [id]);

    if (loading) return <div className={styles.loader}>Loading analysis...</div>;
    if (!report) return <div className={styles.error}>Report not found.</div>;

    const aiData = report.aiReport;
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
            pdf.save(`AI_Report_${report.id.substring(0, 8)}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        }
    };

    const getConsultationAdvice = () => {
        const specialization = aiData?.specialization;
        const prediction = aiData?.prediction?.toLowerCase() || '';

        if (specialization) {
            return {
                type: specialization,
                reason: `for a specialized review of ${prediction}.`
            };
        }

        // Fallback for legacy reports or if specialization is missing
        if (prediction.includes('pneumonia') || prediction.includes('lung') || prediction.includes('effusion')) {
            return { type: 'Pulmonologist', reason: 'to manage respiratory infection.' };
        } else if (prediction.includes('heart') || prediction.includes('cardiomegaly')) {
            return { type: 'Cardiologist', reason: 'for heart assessment.' };
        } else if (prediction === 'normal') {
            return { type: 'General Physician', reason: 'for a routine checkup.' };
        }
        return { type: 'Radiologist', reason: 'for diagnostic review.' };
    };

    const advice = getConsultationAdvice();

    return (
        <div className={styles.section}>
            <header className={styles.header}>
                <h1 className={styles.title}>Diagnostic Intelligence</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className={styles.actionBtn} onClick={handleExportPDF}><Download size={18} /> Export PDF</button>
                    <button className={styles.actionBtn}><Share2 size={18} /></button>
                </div>
            </header>

            <div ref={reportRef} className={styles.grid}>
                {/* Left: Enhanced X-Ray Display */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className={styles.xrayContainer}
                    style={{ height: '480px', position: 'relative', overflow: 'hidden' }}
                >
                    <img
                        src={report.imageUrl}
                        alt="Scanned biometric input"
                        style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '20px' }}
                    />

                    {/* Visual Analysis Overlay - Simulates AI Attention */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '40%',
                            height: '40%',
                            borderRadius: '50%',
                            border: `2px solid ${aiData?.prediction?.toLowerCase().includes('normal') ? '#10b981' : '#f43f5e'}`,
                            boxShadow: `0 0 30px ${aiData?.prediction?.toLowerCase().includes('normal') ? 'rgba(16, 185, 129, 0.4)' : 'rgba(244, 63, 94, 0.4)'}`,
                            pointerEvents: 'none'
                        }}
                    />
                    <motion.div
                        initial={{ top: '0%' }}
                        animate={{ top: '100%' }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            height: '2px',
                            background: 'linear-gradient(90deg, transparent, #00d9ff, transparent)',
                            boxShadow: '0 0 10px #00d9ff',
                            pointerEvents: 'none'
                        }}
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
                                {aiData?.prediction?.toLowerCase() === 'normal' ?
                                    <ShieldCheck size={32} color="#10b981" /> :
                                    <AlertTriangle size={32} color="#f43f5e" />
                                }
                                <div>
                                    <h4 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#fff', margin: 0 }}>{aiData?.prediction}</h4>
                                    <span style={{ color: aiData?.prediction?.toLowerCase() === 'normal' ? '#10b981' : '#f43f5e', fontSize: '0.8rem', fontWeight: '700' }}>
                                        AI SYSTEM DETECTION
                                    </span>
                                </div>
                            </div>
                            <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: '1.6' }}>{aiData?.findings}</p>
                        </div>

                        <div style={{ background: 'rgba(0, 217, 255, 0.05)', borderRadius: '15px', padding: '1.2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <UserCheck size={24} color="#00d9ff" />
                            <div>
                                <p style={{ color: '#fff', margin: 0, fontSize: '0.95rem' }}>
                                    Recommendation:
                                </p>
                                <p style={{ color: '#00d9ff', margin: 0, fontSize: '1.1rem', fontWeight: '700' }}>
                                    Consult a {advice.type} {advice.reason}
                                </p>
                            </div>
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

                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className={styles.submitBtn}
                        onClick={() => navigate('/patient/doctors', {
                            state: {
                                aiReportId: report.id,
                                suggestedSpecialization: advice.type
                            }
                        })}
                    >
                        Bridge to Specialist <ArrowRight size={20} />
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default AIReport;
