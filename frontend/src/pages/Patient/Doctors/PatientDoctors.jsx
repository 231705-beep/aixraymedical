import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, UserCheck, Sparkles, Calendar, ArrowRight, Info } from 'lucide-react';
import styles from './PatientDoctors.module.css';
import API from '../../../utils/api';

const PatientDoctors = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const aiReportId = location.state?.aiReportId;
    const suggestedSpecialization = location.state?.suggestedSpecialization;

    const [mode, setMode] = useState(aiReportId ? 'AI' : 'SEARCH');
    const [searchQuery, setSearchQuery] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllDoctors();
    }, []);

    const fetchAllDoctors = async () => {
        try {
            setLoading(true);
            const response = await API.get('/doctor/all');
            setDoctors(response.data);
            applyFilter(response.data, mode, searchQuery);
        } catch (error) {
            console.error('Failed to fetch doctors:', error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilter = (allDoctors, currentMode, query) => {
        let filtered = [...allDoctors];

        if (currentMode === 'AI' && suggestedSpecialization) {
            const suggested = suggestedSpecialization.toLowerCase();
            filtered = allDoctors.filter(doc => {
                const docSpec = doc.specialization?.toLowerCase() || '';
                return docSpec.includes(suggested) || suggested.includes(docSpec);
            });
        } else if (currentMode === 'SEARCH' && query) {
            const lowQuery = query.toLowerCase();
            filtered = allDoctors.filter(doc =>
                doc.fullName.toLowerCase().includes(lowQuery) ||
                doc.specialization?.toLowerCase().includes(lowQuery) ||
                doc.hospital?.toLowerCase().includes(lowQuery)
            );
        }

        setFilteredDoctors(filtered);
    };

    useEffect(() => {
        applyFilter(doctors, mode, searchQuery);
    }, [mode, searchQuery, doctors]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchAllDoctors();
    };

    return (
        <div className={styles.section}>
            <div className={styles.header}>
                <div>
                    <h2>Choose Your Specialist</h2>
                    <p>Select a verified doctor for your physical consultation</p>
                </div>

                <div className={styles.modeToggle}>
                    <button
                        className={mode === 'AI' ? styles.activeMode : ''}
                        onClick={() => setMode('AI')}
                        disabled={!aiReportId}
                    >
                        <Sparkles size={18} /> AI Recommended
                    </button>
                    <button
                        className={mode === 'SEARCH' ? styles.activeMode : ''}
                        onClick={() => setMode('SEARCH')}
                    >
                        <Search size={18} /> I have a doctor
                    </button>
                </div>
            </div>

            {mode === 'SEARCH' && (
                <form onSubmit={handleSearch} className={styles.searchBar}>
                    <input
                        type="text"
                        placeholder="Search doctor by name, email or specialization..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit">Search</button>
                </form>
            )}

            {loading ? (
                <div className={styles.loader}>Searching for doctors...</div>
            ) : (
                <div className={styles.grid}>
                    {filteredDoctors.length > 0 ? filteredDoctors.map((doc) => (
                        <div key={doc.id} className={styles.doctorCard}>
                            <div className={styles.avatarSection}>
                                <div className={styles.avatar}>
                                    {doc.fullName.split(' ').map(n => n[0]).join('')}
                                </div>
                                {mode === 'AI' && <div className={styles.aiBadge}><Sparkles size={12} /> AI Match</div>}
                            </div>
                            <h3>Dr. {doc.fullName}</h3>
                            <p className={styles.specialty}>{doc.specialization}</p>

                            <div className={styles.details}>
                                <div className={styles.detailItem}>
                                    <UserCheck size={16} />
                                    <span>{doc.experience}+ Years Experience</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <Info size={16} />
                                    <span>{doc.hospital || 'Main Medical Center'}</span>
                                </div>
                            </div>

                            <button
                                className={styles.bookBtn}
                                onClick={() => navigate('/patient/appointments', { state: { doctor: doc, aiReportId } })}
                            >
                                Select Doctor <ArrowRight size={18} />
                            </button>
                        </div>
                    )) : (
                        <div className={styles.noResults}>
                            {mode === 'AI'
                                ? `No ${suggestedSpecialization} specialists found for your specific case.`
                                : "No doctors found. Try a different search term."}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PatientDoctors;
