import React, { useState, useEffect } from 'react';
import styles from './ManageUsers.module.css';
import API from '../../../utils/api';

const ManageUsers = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await API.get('/admin/users');
                const allUsers = response.data;
                const filteredPatients = allUsers.filter(u => u.role === 'PATIENT');
                setPatients(filteredPatients);
            } catch (error) {
                console.error('Failed to fetch patients:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, []);

    if (loading) return <div className={styles.section}><h2>INITIALIZING_USER_DATA...</h2></div>;

    return (
        <div className={styles.section}>
            <h1>Manage Patients</h1>
            <div className={styles.tableContainer} style={{ marginTop: '2rem' }}>
                <table className={styles.adminTable}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Joined At</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.length > 0 ? patients.map(p => (
                            <tr key={p.id}>
                                <td style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>{p.id.substring(0, 8)}...</td>
                                <td>{p.fullName || p.patientProfile?.fullName || 'N/A'}</td>
                                <td>{p.email}</td>
                                <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                                <td><span className={styles.badge} style={{ background: '#10b9811a', color: '#10b981' }}>Active</span></td>
                            </tr>
                        )) : (
                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>No patients found</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;
