import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Calendar, User, FileText } from 'lucide-react';
import styles from '../Dashboard/DoctorDashboard.module.css';
import API from '../../../utils/api';

const DoctorAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('currentUser'));
            if (!user) return;

            const response = await API.get(`/appointments/doctor/${user.id}`);
            const formatted = response.data.map(appt => ({
                id: appt.id,
                patient: {
                    name: appt.patient?.patientProfile?.fullName || appt.patient?.email || 'Patient',
                    email: appt.patient?.email
                },
                date: appt.date,
                consultationMode: appt.consultationMode,
                status: appt.status.toUpperCase()
            }));
            setAppointments(formatted);
        } catch (error) {
            console.error('Failed to fetch doctor appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (id) => {
        try {
            await API.patch(`/appointments/${id}/accept`);
            setAppointments(prev => prev.map(appt =>
                appt.id === id ? { ...appt, status: 'ACCEPTED' } : appt
            ));
            alert('Appointment accepted successfully');
        } catch (error) {
            console.error('Accept failed:', error);
            alert('Failed to accept appointment');
        }
    };

    const handleReject = async (id) => {
        const reason = prompt('Please provide a reason for rejection:');
        if (!reason) return;

        try {
            await API.patch(`/appointments/${id}/reject`, { reason });
            setAppointments(prev => prev.map(appt =>
                appt.id === id ? { ...appt, status: 'REJECTED' } : appt
            ));
            alert('Appointment rejected successfully');
        } catch (error) {
            console.error('Reject failed:', error);
            alert('Failed to reject appointment');
        }
    };

    return (
        <div className={styles.dashboard}>
            <div className={styles.card} style={{ height: 'auto', minHeight: 'auto' }}>
                <h3 className={styles.cardTitle}>My Appointment Schedule</h3>
                <p style={{ color: '#7a8a9a', marginTop: '-20px', marginBottom: '30px', fontSize: '14px' }}>
                    View and manage your daily agenda of patient consultations.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {loading ? <p>Loading appointments...</p> : appointments.length > 0 ? appointments.map((appt) => (
                        <div key={appt.id} style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: '12px',
                            padding: '24px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            transition: 'all 0.3s ease'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{
                                    width: '50px',
                                    height: '50px',
                                    background: 'rgba(0, 217, 255, 0.1)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#00d9ff',
                                    fontWeight: 'bold',
                                    fontSize: '18px'
                                }}>
                                    {appt.patient.name[0].toUpperCase()}
                                </div>
                                <div>
                                    <h4 style={{ color: '#ffffff', margin: '0 0 5px 0', fontSize: '18px', fontWeight: 'bold' }}>{appt.patient.name}</h4>
                                    <div style={{ display: 'flex', gap: '15px', color: '#94a3b8', fontSize: '14px' }}>
                                        <span style={{ color: 'var(--primary-color)' }}>{appt.patient.email}</span>
                                        <span><Clock size={14} /> {new Date(appt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        <span><Calendar size={14} /> {new Date(appt.date).toLocaleDateString()}</span>
                                        <span><FileText size={14} /> {appt.consultationMode}</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                {appt.status === 'PENDING' ? (
                                    <>
                                        <button
                                            onClick={() => handleAccept(appt.id)}
                                            style={{ background: 'rgba(0, 255, 127, 0.1)', color: '#00ff7f', border: '1px solid rgba(0, 255, 127, 0.2)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600' }}
                                        >
                                            <CheckCircle size={16} /> Accept
                                        </button>
                                        <button
                                            onClick={() => handleReject(appt.id)}
                                            style={{ background: 'rgba(255, 68, 68, 0.1)', color: '#ff4444', border: '1px solid rgba(255, 68, 68, 0.2)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600' }}
                                        >
                                            <XCircle size={16} /> Reject
                                        </button>
                                    </>
                                ) : (
                                    <span style={{
                                        padding: '6px 16px',
                                        borderRadius: '20px',
                                        background: appt.status === 'ACCEPTED' ? 'rgba(0, 255, 127, 0.1)' : 'rgba(255, 68, 68, 0.1)',
                                        color: appt.status === 'ACCEPTED' ? '#00ff7f' : '#ff4444',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        border: `1px solid ${appt.status === 'ACCEPTED' ? 'rgba(0, 255, 127, 0.2)' : 'rgba(255, 68, 68, 0.2)'}`
                                    }}>
                                        {appt.status}
                                    </span>
                                )}
                            </div>
                        </div>
                    )) : <p style={{ color: '#94a3b8' }}>No appointments found.</p>}
                </div>
            </div>
        </div>
    );
};

export default DoctorAppointments;
