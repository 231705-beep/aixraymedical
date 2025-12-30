import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, ShieldAlert } from 'lucide-react';
import styles from './AdminLogin.module.css';
import API from '../../../utils/api';

const AdminLogin = () => {
    const [pin, setPin] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (pin === '1234') {
            setLoading(true);
            try {
                // Real Admin Login
                const response = await API.post('/auth/login', {
                    email: 'admin@medmail.com',
                    password: 'admin123'
                });

                const { access_token, user } = response.data;
                localStorage.setItem('token', access_token);
                localStorage.setItem('currentUser', JSON.stringify(user));

                navigate('/admin/dashboard');
            } catch (err) {
                console.error('Admin Auth Failed:', err);
                alert('SYSTEM CRITICAL ERROR: SERVER UNREACHABLE OR INVALID CREDENTIALS');
            } finally {
                setLoading(false);
            }
        } else {
            alert('SYSTEM ACCESS DENIED: INVALID PIN');
            setPin('');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.loginCard}>
                <div className={styles.iconWrapper}>
                    <ShieldAlert size={48} color="#ef4444" />
                </div>
                <h2>RESTRICTED ACCESS</h2>
                <p>AUTHORIZED PERSONNEL ONLY</p>
                <form onSubmit={handleLogin} className={styles.form}>
                    <div className={styles.pinDisplay}>
                        {'•'.repeat(pin.length).padEnd(4, ' ')}
                    </div>
                    <div className={styles.keypad}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(num => (
                            <button
                                key={num}
                                type="button"
                                onClick={() => pin.length < 4 && setPin(pin + num)}
                            >
                                {num}
                            </button>
                        ))}
                        <button type="button" onClick={() => setPin('')} className={styles.clearBtn}>CLR</button>
                    </div>
                    <button type="submit" className={styles.accessBtn} disabled={pin.length !== 4}>
                        <Terminal size={18} /> INITIALIZE_SESSION
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
