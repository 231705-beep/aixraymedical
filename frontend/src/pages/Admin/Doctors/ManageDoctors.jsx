import React, { useState, useEffect } from 'react';
import styles from './ManageDoctors.module.css';
import API from '../../../utils/api';
import { UserCheck, UserX, Search, Filter } from 'lucide-react';

const ManageDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPendingDoctors = async () => {
        try {
            setLoading(true);
            const response = await API.get('/doctor/admin/pending');
            setDoctors(response.data);
        } catch (error) {
            console.error('Failed to fetch pending doctors:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingDoctors();
    }, []);

    const handleApprove = async (id) => {
        if (!window.confirm('Are you sure you want to approve this doctor?')) return;
        try {
            await API.patch(`/doctor/admin/${id}/approve`);
            alert('Doctor approved successfully');
            fetchPendingDoctors();
        } catch (error) {
            console.error('Approval failed:', error);
            alert('Failed to approve doctor');
        }
    };

    const handleSuspend = (id) => {
        alert('Suspension logic would be implemented here (Requires backend update)');
    };

    if (loading) return <div className={styles.section}><h2>ACCESSING_DATABASE...</h2></div>;

    return (
        <div className={styles.section}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ margin: 0 }}>Doctor Authorization</h1>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Verify and manage medical practitioner credentials</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                        <input
                            type="text"
                            placeholder="Search License or Name..."
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                padding: '8px 12px 8px 36px',
                                color: 'white',
                                fontSize: '0.85rem'
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.adminTable}>
                    <thead>
                        <tr>
                            <th>License No.</th>
                            <th>Doctor Detail</th>
                            <th>Specialization</th>
                            <th>Status</th>
                            <th>Verification</th>
                        </tr>
                    </thead>
                    <tbody>
                        {doctors.length > 0 ? doctors.map(doc => (
                            <tr key={doc.id}>
                                <td style={{ fontFamily: 'monospace', color: '#38bdf8' }}>{doc.licenseNumber || 'N/A'}</td>
                                <td>
                                    <div style={{ fontWeight: 600 }}>{doc.fullName}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{doc.user?.email}</div>
                                </td>
                                <td>{doc.specialization}</td>
                                <td>
                                    <span className={styles.badge} style={{ background: 'rgba(234, 179, 8, 0.1)', color: '#eab308' }}>
                                        {doc.isApproved ? 'Live' : 'Pending'}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() => handleApprove(doc.id)}
                                            style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.05)' }}
                                        >
                                            <UserCheck size={14} style={{ marginRight: '4px' }} /> Approve
                                        </button>
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() => handleSuspend(doc.id)}
                                            style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.05)' }}
                                        >
                                            <UserX size={14} style={{ marginRight: '4px' }} /> Reject
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                                    No pending doctor authorizations found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


export default ManageDoctors;
