import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, XCircle, CheckCircle, AlertCircle } from 'lucide-react';
import styles from '../Patient.module.css';
import API from '../../../utils/api';

const MyAppointments = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('currentUser'));
            if (!user) return;

            const response = await API.get(`/appointments/patient/${user.id}`);
            const formatted = response.data.map(app => {
                const dateObj = new Date(app.date);
                const doctorName = app.doctor?.doctorProfile?.fullName || 'Doctor';
                return {
                    id: app.id,
                    doctor: `Dr. ${doctorName}`,
                    date: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    time: dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                    type: app.consultationMode === 'PHYSICAL' ? 'Physical' : 'Online',
                    status: app.status.charAt(0).toUpperCase() + app.status.slice(1).toLowerCase()
                };
            });
            setAppointments(formatted);
        } catch (error) {
            console.error('Failed to fetch appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (window.confirm('Are you sure you want to cancel this appointment?')) {
            try {
                await API.patch(`/appointments/${id}/status`, { status: 'CANCELLED' });
                // Optimistic update
                setAppointments(prev => prev.map(app =>
                    app.id === id ? { ...app, status: 'Cancelled' } : app
                ));
            } catch (error) {
                console.error('Failed to cancel appointment:', error);
                alert('Failed to cancel appointment. Please try again.');
            }
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Approved': return { bg: '#d1fae5', color: '#065f46', icon: <CheckCircle size={14} /> };
            case 'Pending': return { bg: '#fef3c7', color: '#92400e', icon: <AlertCircle size={14} /> };
            case 'Completed': return { bg: '#f1f5f9', color: '#475569', icon: <CheckCircle size={14} /> };
            case 'Rejected': return { bg: '#fee2e2', color: '#991b1b', icon: <XCircle size={14} /> };
            case 'Cancelled': return { bg: '#fee2e2', color: '#ef4444', icon: <XCircle size={14} /> };
            default: return {};
        }
    };

    return (
        <div className={styles.section}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <h2>My Appointments</h2>
                <button
                    className={styles.submitBtn}
                    style={{ width: 'auto', padding: '0.75rem 1.5rem' }}
                    onClick={() => navigate('/patient/doctors')}
                >
                    + New Appointment
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {appointments.map((app) => {
                    const style = getStatusStyle(app.status);
                    return (
                        <div key={app.id} className={styles.card} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                                <div style={{ background: 'var(--primary-light)', padding: '1rem', borderRadius: '12px' }}>
                                    <Calendar color="var(--primary-color)" />
                                </div>
                                <div>
                                    <h3 style={{ marginBottom: '0.25rem' }}>{app.doctor}</h3>
                                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Clock size={16} /> {app.time}, {app.date}</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={16} /> {app.type} Consultation</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    background: style.bg, color: style.color,
                                    padding: '0.4rem 0.8rem', borderRadius: '50px',
                                    fontSize: '0.75rem', fontWeight: '700'
                                }}>
                                    {style.icon} {app.status.toUpperCase()}
                                </div>
                                {app.status === 'Pending' || app.status === 'Approved' ? (
                                    <button
                                        onClick={() => handleCancel(app.id)}
                                        style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '600' }}
                                    >
                                        Cancel
                                    </button>
                                ) : null}
                            </div>
                        </div>
                    );
                })}
            </div>

            <h3 style={{ marginTop: '3rem', marginBottom: '1.5rem' }}>Appointment History</h3>
            <div className={styles.card} style={{ padding: 0 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#f8fafc' }}>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                            <th style={{ padding: '1rem 1.5rem' }}>Doctor</th>
                            <th style={{ padding: '1rem 1.5rem' }}>Date</th>
                            <th style={{ padding: '1rem 1.5rem' }}>Mode</th>
                            <th style={{ padding: '1rem 1.5rem' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '1rem 1.5rem' }}>Dr. Robert Fox</td>
                            <td style={{ padding: '1rem 1.5rem' }}>Oct 10, 2025</td>
                            <td style={{ padding: '1rem 1.5rem' }}>Physical</td>
                            <td style={{ padding: '1rem 1.5rem' }}><span style={{ color: 'var(--text-muted)' }}>Completed</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyAppointments;
