import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, UserCheck, Calendar, FileText, Mail, Shield, CheckCircle } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import RoleSelector from '../../components/RoleSelector/RoleSelector';
import styles from './Landing.module.css';

import heroImage from '../../assets/images/lungs_transparent.png';

const Landing = () => {
    const [showModal, setShowModal] = useState(false);
    const [activeSection, setActiveSection] = useState('home');

    // Scroll detection to update active section
    useEffect(() => {
        const handleScroll = () => {
            const homeSection = document.getElementById('home');
            const howItWorksSection = document.getElementById('how-it-works');
            const featuresSection = document.getElementById('features');

            const scrollY = window.scrollY;
            const viewportHeight = window.innerHeight;

            // Simple heuristic to determine active section
            if (howItWorksSection) {
                const rect = howItWorksSection.getBoundingClientRect();
                // If How It Works is substantially visible (center of viewport)
                if (rect.top < viewportHeight * 0.6 && rect.bottom > viewportHeight * 0.4) {
                    setActiveSection('how-it-works');
                    return; // Priority to this middle section
                }
            }

            if (featuresSection) {
                const rect = featuresSection.getBoundingClientRect();
                if (rect.top < viewportHeight * 0.5) {
                    setActiveSection('features');
                    return;
                }
            }

            // Default to home if nothing else
            if (homeSection) {
                // Or if simply near top
                if (scrollY < viewportHeight * 0.3) {
                    setActiveSection('home');
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        // Trigger once on mount
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const steps = [
        { icon: <Cpu size={32} />, title: "AI Analysis", desc: "Our advanced AI models analyze the image for abnormalities." },
        { icon: <UserCheck size={32} />, title: "Doctor Verification", desc: "Certified radiologists review and verify the AI findings." },
        { icon: <Calendar size={32} />, title: "Book Appointment", desc: "Schedule a physical consultation with recommended specialists." },
        { icon: <FileText size={32} />, title: "Get Prescription", desc: "Receive verified digital prescriptions and reports." },
        { icon: <Mail size={32} />, title: "Email Notifications", desc: "Stay updated with instant email alerts about your status." }
    ];

    // Split steps for left/right layout
    const leftSteps = steps.slice(0, 3);
    const rightSteps = steps.slice(3);

    const features = [
        { title: "AI-Powered X-ray Analysis", desc: "State-of-the-art neural networks for precision diagnosis." },
        { title: "Doctor-Verified Reports", desc: "Every AI insight is double-checked by professional doctors." },
        { title: "Color-Coded Highlights", desc: "Visual indicators on X-rays for easy understanding." },
        { title: "Physical Appointments", desc: "Seamless booking for in-person hospital consultations." },
        { title: "Doctor Recommendations", desc: "Smart matching with specialists based on your diagnosis." },
        { title: "Prescription Management", desc: "View and download all your prescriptions in one place." }
    ];

    // Variants for text steps to ensure they repeat every time the section is entered
    const itemVariants = {
        hidden: ({ direction }) => ({
            opacity: 0,
            x: direction === 'left' ? -50 : 50,
            transition: { duration: 0.3 }
        }),
        visible: ({ index }) => ({
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.6,
                delay: 1.3 + (index * 0.1)
            }
        })
    };

    // Variants for feature cards with deep materialization effect
    const featureItemVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.9 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                delay: 0.8 + (i * 0.1), // Starts after lungs reach zoom backdrop
                ease: "easeOut"
            }
        })
    };

    // Animation Variants for the Fixed Lungs
    // Animation Variants for the Fixed Lungs
    const lungsVariants = {
        home: {
            top: '70%', // Moved down slightly
            left: '75%', // Positioned on the right side
            x: '-50%',
            y: '-50%',
            scale: 0.9,
            opacity: 1,
            transition: { duration: 0.8, ease: "easeInOut" }
        },
        'how-it-works': {
            top: '58%',
            left: '50%',
            x: '-50%',
            y: '-50%',
            scale: 0.65,
            opacity: 1,
            transition: { duration: 0.8, delay: 0.5, ease: "easeInOut" }
        },
        features: {
            top: '50%',
            left: '50%',
            x: '-50%',
            y: '-50%',
            scale: 4, // Reduced scale for performance
            opacity: 0.15,
            transition: { duration: 1, ease: "easeOut" }
        }
    };

    return (
        <div className={styles.landingContainer}>
            <div className={styles.landing}>
                <Navbar />

                {/* Persistent Fixed Lungs Graphic */}
                <motion.div
                    className={styles.fixedLungsContainer}
                    variants={lungsVariants}
                    initial="home"
                    animate={activeSection}
                    style={{
                        position: 'fixed',
                        zIndex: 10,
                        pointerEvents: 'none',
                        width: '600px',
                        height: '600px',
                        transformOrigin: 'center',
                    }}
                >
                    <motion.div
                        animate={{
                            rotateY: [0, 360],
                        }}
                        transition={{
                            rotateY: { duration: 15, repeat: Infinity, ease: "linear" },
                        }}
                        style={{ width: '100%', height: '100%' }}
                    >
                        <img src={heroImage} alt="3D Lungs" className={styles.lungsImage} />
                    </motion.div>
                </motion.div>

                <section id="home" className={styles.hero}>
                    <div className={styles.heroContent}>
                        <motion.h1
                            initial={{ opacity: 0, x: -50 }}
                            animate={activeSection === 'home' ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                            transition={{ duration: 0.8 }}
                        >
                            AI-Powered X-ray Analysis for Faster, Smarter Healthcare
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, x: -50 }}
                            animate={activeSection === 'home' ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            style={{ color: '#cbd5e1', fontSize: '1.10rem', lineHeight: '1.6', marginBottom: '2.3rem' }}
                        >
                            Upload your X-ray, get AI insights, interact with doctors, and receive e-prescriptions — all in one place.
                        </motion.p>
                        <motion.button
                            className={styles.cta}
                            onClick={() => setShowModal(true)}
                            initial={{ opacity: 0, y: 20 }}
                            animate={activeSection === 'home' ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            Get Started
                        </motion.button>
                    </div>
                    {/* Spacer for the graphic which is now fixed */}
                    <div className={styles.heroGraphicSpacer}></div>
                </section>

                <section id="how-it-works" className={styles.section}>
                    <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        animate={activeSection === 'how-it-works' ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
                        transition={{ duration: 0.6, delay: 0 }}
                    >
                        How It Works
                    </motion.h2>
                    <div className={styles.howItWorksGrid}>
                        {/* Left Column */}
                        <div className={styles.column}>
                            {leftSteps.map((step, index) => (
                                <motion.div
                                    key={index}
                                    className={styles.stepItem}
                                    custom={{ index, direction: 'left' }}
                                    variants={itemVariants}
                                    initial="hidden"
                                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                                    animate={activeSection === 'how-it-works' ? 'visible' : 'hidden'}
                                >
                                    <div style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>
                                        {step.icon}
                                    </div>
                                    <h3 style={{
                                        position: 'relative',
                                        display: 'inline-block',
                                        paddingBottom: '0.25rem',
                                        marginBottom: '0.5rem',
                                        fontSize: '1.1rem'
                                    }}>
                                        {step.title}
                                        <div style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '2px',
                                            backgroundColor: '#0066FF',
                                            borderRadius: '2px'
                                        }}></div>
                                    </h3>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem', lineHeight: '1.4' }}>
                                        {step.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Center Column - Just a Spacer for the Fixed Lungs */}
                        <div className={styles.centerSpacer}></div>

                        {/* Right Column */}
                        <div className={`${styles.column} ${styles.rightColumn}`}>
                            {rightSteps.map((step, index) => (
                                <motion.div
                                    key={index + 3}
                                    className={styles.stepItem}
                                    custom={{ index: index + 3, direction: 'right' }}
                                    variants={itemVariants}
                                    initial="hidden"
                                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                                    animate={activeSection === 'how-it-works' ? 'visible' : 'hidden'}
                                >
                                    <div style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>
                                        {step.icon}
                                    </div>
                                    <h3 style={{
                                        position: 'relative',
                                        display: 'inline-block',
                                        paddingBottom: '0.25rem',
                                        marginBottom: '0.5rem',
                                        fontSize: '1.1rem'
                                    }}>
                                        {step.title}
                                        <div style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '2px',
                                            backgroundColor: '#0066FF',
                                            borderRadius: '2px'
                                        }}></div>
                                    </h3>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem', lineHeight: '1.4' }}>
                                        {step.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="features" className={styles.section}>
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={activeSection === 'features' ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                    >
                        Our Multi-Layered Features
                    </motion.h2>
                    <div className={styles.grid}>
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                className={styles.card}
                                style={{ textAlign: 'left' }}
                                custom={index}
                                variants={featureItemVariants}
                                initial="hidden"
                                animate={activeSection === 'features' ? 'visible' : 'hidden'}
                            >
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                    <CheckCircle size={20} style={{ color: 'var(--success)', marginTop: '0.2rem' }} />
                                    <div>
                                        <h4 style={{ marginBottom: '0.3rem', fontSize: '1rem' }}>{feature.title}</h4>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{feature.desc}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <Footer />
                <RoleSelector isOpen={showModal} onClose={() => setShowModal(false)} />
            </div>
        </div >
    );
};

export default Landing;
