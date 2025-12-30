import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import styles from './Auth.module.css';
import lungsIcon from '../../assets/images/lungs_transparent.png';
import API from '../../utils/api'; // Import API utility

const Auth = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isLogin, setIsLogin] = useState(true);
    const [isActive, setIsActive] = useState(false);
    const [role, setRole] = useState(searchParams.get('role') || 'patient');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [fullName, setFullName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [licenseNumber, setLicenseNumber] = useState('');
    const [experience, setExperience] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const paramRole = searchParams.get('role');
        if (paramRole) setRole(paramRole);
    }, [searchParams]);

    // Load saved credentials when component mounts or role changes
    useEffect(() => {
        const savedEmail = localStorage.getItem(`${role}_email`);
        const savedPassword = localStorage.getItem(`${role}_password`);
        if (savedEmail && savedPassword) {
            setEmail(savedEmail);
            setPassword(savedPassword);
            setRememberMe(true);
        } else {
            setEmail('');
            setPassword('');
            setRememberMe(false);
        }
    }, [role]);

    const handleAuth = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (isLogin) {
                // Login Request
                const response = await API.post('/auth/login', { email, password });
                const { access_token, user } = response.data;

                localStorage.setItem('token', access_token);
                localStorage.setItem('currentUser', JSON.stringify(user));
                console.log('DEBUG: Login Success. User Object from Backend:', user);
                console.log('DEBUG: currentUser in LocalStorage:', localStorage.getItem('currentUser'));

                // Navigate based on role from backend, or fallback to selected role
                // Ensuring we navigate to the correct dashboard
                // Handle Remember Me
                const backendRole = user.role.toLowerCase();
                if (rememberMe) {
                    localStorage.setItem(`${backendRole}_email`, email);
                    localStorage.setItem(`${backendRole}_password`, password);
                } else {
                    localStorage.removeItem(`${backendRole}_email`);
                    localStorage.removeItem(`${backendRole}_password`);
                }

                if (backendRole === 'admin') navigate('/admin/dashboard');
                else if (backendRole === 'doctor') navigate('/doctor/dashboard');
                else navigate('/patient/dashboard');

            } else {
                // Registration Request
                const newUser = {
                    fullName,
                    email,
                    password,
                    role: role.toUpperCase(), // Backend likely expects uppercase enum
                    ...(role === 'patient' ? { age: Number(age), gender, phoneNumber } : { specialization, licenseNumber, experience })
                };

                await API.post('/auth/signup', newUser);

                alert('Registration successful! Please sign in.');
                setIsActive(false);
                setIsLogin(true);
            }
        } catch (err) {
            console.error('Auth Error Details:', err);
            const data = err.response?.data;
            let msg = 'Authentication failed.';

            if (data) {
                if (typeof data.message === 'string') msg = data.message;
                else if (Array.isArray(data.message)) msg = data.message[0];
                else if (data.error) msg = data.error;
            } else {
                msg = err.message || msg;
            }

            setError(msg);
        }
    };

    const toggleMode = (login) => {
        setIsActive(!login);
        setIsLogin(login);
        setError('');
    };

    // Role-specific messaging
    const toggleContent = {
        patient: {
            leftTitle: "Hello, Patient!",
            leftText: "Register to get instant X-ray analysis reports",
            rightTitle: "Welcome Back!",
            rightText: "Access your AI-powered health portal"
        },
        doctor: {
            leftTitle: "Hello, Doctor!",
            leftText: "Join our AI-powered diagnostic platform",
            rightTitle: "Doctor Portal",
            rightText: "Continue your clinical assessments"
        }
    };

    const content = toggleContent[role] || toggleContent.patient;

    return (
        <div className={styles.authContainer}>
            <div className={`${styles.container} ${isActive ? styles.active : ''}`}>
                <button className={styles.backBtn} onClick={() => navigate('/')}>
                    <ChevronLeft size={18} /> BACK
                </button>

                {/* SIGN UP FORM */}
                <div className={`${styles.formContainer} ${styles.signUp}`}>
                    <form onSubmit={handleAuth}>
                        <h1>Sign Up</h1>
                        <p style={{ marginTop: '-10px', marginBottom: '20px', fontWeight: '600' }}>
                            {role === 'doctor' ? 'Medical Professional Account' : 'Patient Health Account'}
                        </p>

                        {error && <div className={styles.errorMessage}>{error}</div>}

                        <input
                            type="text"
                            placeholder="Full Name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required={!isLogin}
                        />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Create Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        {/* Patient Specific Fields */}
                        {role === 'patient' && (
                            <>
                                <input
                                    type="number"
                                    placeholder="Age"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    required={!isLogin}
                                />
                                <select
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    required={!isLogin}
                                >
                                    <option value="" disabled>Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                                <input
                                    type="tel"
                                    placeholder="Phone Number (Optional)"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                            </>
                        )}

                        {/* Doctor Specific Fields */}
                        {role === 'doctor' && (
                            <>
                                <select
                                    value={specialization}
                                    onChange={(e) => setSpecialization(e.target.value)}
                                    required={!isLogin}
                                >
                                    <option value="" disabled>Select Specialization</option>
                                    <option value="Radiology">Radiology</option>
                                    <option value="Pulmonology">Pulmonology (Thorax)</option>
                                    <option value="Cardiology">Cardiology</option>
                                    <option value="Neurology">Neurology</option>
                                    <option value="Orthopedics">Orthopedics</option>
                                    <option value="Oncology">Oncology</option>
                                    <option value="Pediatrics">Pediatrics</option>
                                    <option value="General Medicine">General Medicine</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="Medical License Number"
                                    value={licenseNumber}
                                    onChange={(e) => setLicenseNumber(e.target.value)}
                                    required={!isLogin}
                                />
                                <select
                                    value={experience}
                                    onChange={(e) => setExperience(e.target.value)}
                                    required={!isLogin}
                                >
                                    <option value="" disabled>Years of Experience</option>
                                    <option value="0-5">0–5 Years</option>
                                    <option value="5-10">5–10 Years</option>
                                    <option value="10+">10+ Years</option>
                                </select>
                            </>
                        )}

                        <button type="submit">Get Started</button>

                        <div className={styles.mobileToggle}>
                            <span>Already have an account?</span>
                            <button type="button" onClick={() => toggleMode(true)}>Sign In</button>
                        </div>
                    </form>
                </div>

                {/* SIGN IN FORM */}
                <div className={`${styles.formContainer} ${styles.signIn}`}>
                    <form onSubmit={handleAuth}>
                        <h1>Sign In</h1>
                        <p style={{ marginTop: '-10px', marginBottom: '20px', fontWeight: '600' }}>
                            {role === 'doctor' ? ' Doctor Dashboard' : 'Patient Health Portal'}
                        </p>

                        {error && <div className={styles.errorMessage}>{error}</div>}

                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Your Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                            <input
                                type="checkbox"
                                id="rememberMe"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                style={{ width: 'auto', cursor: 'pointer' }}
                            />
                            <label htmlFor="rememberMe" style={{ fontSize: '14px', color: '#94a3b8', cursor: 'pointer', margin: 0 }}>
                                Remember my email and password
                            </label>
                        </div>

                        <a href="#" className={styles.forgotPass}>Forgot your password?</a>

                        <button type="submit">Sign In</button>

                        <div className={styles.mobileToggle}>
                            <span>Don't have an account?</span>
                            <button type="button" onClick={() => toggleMode(false)}>Sign Up</button>
                        </div>
                    </form>
                </div>

                {/* TOGGLE PANELS */}
                <div className={styles.toggleContainer}>
                    <div className={styles.toggle}>
                        <div className={`${styles.togglePanel} ${styles.toggleLeft}`}>
                            <motion.div
                                className={styles.lungsContent}
                                animate={{ rotateY: 360 }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            >
                                <img src={lungsIcon} alt="Rotating Lungs" className={styles.lungsImage} />
                            </motion.div>
                            <h1>{content.leftTitle}</h1>
                            <p>{content.leftText}</p>
                            <button className={styles.hidden} onClick={() => toggleMode(true)}>Sign In</button>
                        </div>
                        <div className={`${styles.togglePanel} ${styles.toggleRight}`}>
                            <motion.div
                                className={styles.lungsContent}
                                animate={{ rotateY: 360 }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            >
                                <img src={lungsIcon} alt="Rotating Lungs" className={styles.lungsImage} />
                            </motion.div>
                            <h1>{content.rightTitle}</h1>
                            <p>{content.rightText}</p>
                            <button className={styles.hidden} onClick={() => toggleMode(false)}>Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
