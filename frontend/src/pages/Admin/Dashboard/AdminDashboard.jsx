import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell
} from 'recharts';
import {
    Users, Activity, FileText, Zap,
    TrendingUp, BarChart3, Clock, AlertCircle, Calendar
} from 'lucide-react';
import styles from './AdminDashboard.module.css';
import API from '../../../utils/api';

const lineData = [
    { name: 'Mon', count: 400 },
    { name: 'Tue', count: 600 },
    { name: 'Wed', count: 800 },
    { name: 'Thu', count: 700 },
    { name: 'Fri', count: 1100 },
    { name: 'Sat', count: 1500 },
    { name: 'Sun', count: 1200 },
];

const barData = [
    { name: 'Normal', value: 120, color: '#10b981' },
    { name: 'Pneumonia', value: 45, color: '#f59e0b' },
    { name: 'Effusion', value: 30, color: '#ef4444' },
    { name: 'Nodule', value: 15, color: '#38bdf8' },
];

const AdminDashboard = () => {
    // REVERTED TO MOCK DATA FOR UI REFINEMENT
    const [stats, setStats] = React.useState(null);
    const [activity, setActivity] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, activityRes] = await Promise.all([
                    API.get('/admin/stats'),
                    API.get('/admin/activity')
                ]);
                setStats(statsRes.data);
                setActivity(activityRes.data);
            } catch (error) {
                console.error('Failed to fetch admin data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) return <div className={styles.section} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><h2>INITIALIZING_SYSTEM_CORE...</h2></div>;

    const barData = [
        { name: 'Normal', value: 120, color: '#10b981' },
        { name: 'Pneumonia', value: 45, color: '#f59e0b' },
        { name: 'Effusion', value: 30, color: '#ef4444' },
        { name: 'Nodule', value: 15, color: '#38bdf8' },
    ];

    return (
        <div className={styles.section}>
            <div className={styles.header}>
                <h1>System Security Dashboard</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className={styles.badge} style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                        SYSTEM_ONLINE
                    </div>
                </div>
            </div>

            <div className={styles.cardGrid}>
                <div className={styles.statCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase' }}>Total Patients</p>
                        <Users size={16} color="#00d9ff" />
                    </div>
                    <h2 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>{stats?.totalPatients || 0}</h2>
                    <p style={{ color: '#10b981', fontSize: '0.75rem' }}>+12% from last month</p>
                </div>
                <div className={styles.statCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase' }}>Verified Doctors</p>
                        <Zap size={16} color="#10b981" />
                    </div>
                    <h2 style={{ fontSize: '2rem', margin: '0.5rem 0', color: '#10b981' }}>{stats?.verifiedDoctors || 0}</h2>
                    <p style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Across 19 specialties</p>
                </div>
                <div className={styles.statCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase' }}>Total X-rays</p>
                        <FileText size={16} color="#38bdf8" />
                    </div>
                    <h2 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>{stats?.totalXrays || 0}</h2>
                    <p style={{ color: '#10b981', fontSize: '0.75rem' }}>Live database count</p>
                </div>
                <div className={styles.statCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase' }}>Active Appointments</p>
                        <Calendar size={16} color="#8b5cf6" />
                    </div>
                    <h2 style={{ fontSize: '2rem', margin: '0.5rem 0', color: '#8b5cf6' }}>{stats?.totalAppointments || 0}</h2>
                    <p style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Live schedule count</p>
                </div>
            </div>

            <div className={styles.chartsGrid}>
                <div className={styles.chartCard}>
                    <p className={styles.chartTitle}><TrendingUp size={18} /> Analysis Trends</p>
                    <ResponsiveContainer width="100%" height="85%">
                        <LineChart data={stats?.analysisTrends || []}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                            <YAxis stroke="#64748b" fontSize={12} />
                            <Tooltip
                                contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                                itemStyle={{ color: '#00d9ff' }}
                            />
                            <Line type="monotone" dataKey="count" stroke="#00d9ff" strokeWidth={3} dot={{ fill: '#00d9ff', r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className={styles.chartCard}>
                    <p className={styles.chartTitle}><BarChart3 size={18} /> Diagnosis Distribution</p>
                    <ResponsiveContainer width="100%" height="85%">
                        <BarChart data={stats?.diagnosisDistribution || barData}>
                            <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                            <YAxis stroke="#64748b" fontSize={12} />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                            />
                            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                {(stats?.diagnosisDistribution || barData).map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className={styles.tableContainer}>
                <div className={styles.tableHeader}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock size={18} color="#00d9ff" /> Recent System Logs
                    </h3>
                </div>
                <table className={styles.adminTable}>
                    <thead>
                        <tr>
                            <th>Patient ID</th>
                            <th>Status/Analysis</th>
                            <th>AI Findings</th>
                            <th>Verification</th>
                            <th>Uploaded At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activity.length > 0 ? activity.map((item) => (
                            <tr key={item.id}>
                                <td style={{ fontSize: '0.8rem', color: '#38bdf8' }}>
                                    {item.patient?.fullName || item.patientId.substring(0, 8) + '...'}
                                </td>
                                <td>
                                    <span className={styles.badge} style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#cbd5e1' }}>
                                        {item.status || 'UPLOADED'}
                                    </span>
                                </td>
                                <td>
                                    <span className={styles.badge} style={{
                                        background: item.aiReport?.riskLevel === 'CRITICAL' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                        color: item.aiReport?.riskLevel === 'CRITICAL' ? '#ef4444' : '#10b981'
                                    }}>
                                        {item.aiReport?.prediction || 'Pending Analysis'}
                                    </span>
                                </td>
                                <td>
                                    <span className={styles.badge} style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}>
                                        {item.aiReport ? 'Verified' : 'Pending'}
                                    </span>
                                </td>
                                <td>
                                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                                        {new Date(item.uploadedAt).toLocaleString()}
                                    </span>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>No recent system logs found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


export default AdminDashboard;

