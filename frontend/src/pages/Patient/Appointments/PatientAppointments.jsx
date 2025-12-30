import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Clock, CreditCard, ShieldCheck, ArrowLeft, Info } from 'lucide-react';
import styles from './PatientAppointments.module.css';
import API from '../../../utils/api';

const PatientAppointments = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { doctor, aiReportId } = location.state || {};

    // REVERTED TO MOCK DATA FOR UI REFINEMENT
    const [availableSlots, setAvailableSlots] = useState([
        { id: '1', startTime: '10:00 AM' },
        { id: '2', startTime: '11:30 AM' },
        { id: '3', startTime: '02:00 PM' },
        { id: '4', startTime: '04:30 PM' }
    ]);
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!doctor) {
            navigate('/patient/doctors');
            return;
        }
        console.log('PatientAppointments in Mock Mode');
    }, [doctor]);

    const fetchAvailability = () => { };

    const handleBooking = async (e) => {
        e.preventDefault();
        if (!selectedDate || !selectedSlot) {
            setError('Please select both date and time slot');
            return;
        }

        setLoading(true);
        try {
            // Construct ISO Date from Date + Time Slot
            // Assuming time slots are simple strings like "10:00 AM"
            // We need to parse them to set hours/minutes on the date object
            const dateTime = new Date(selectedDate);
            const [time, period] = selectedSlot.split(' ');
            let [hours, minutes] = time.split(':');
            if (period === 'PM' && hours !== '12') hours = parseInt(hours) + 12;
            else if (period === 'AM' && hours === '12') hours = 0;
            dateTime.setHours(hours, minutes, 0, 0);

            // FIX: Ensure we use the User ID (which links to the Login ID) not the Profile ID
            const payloadDoctorId = doctor.user?.id || doctor.userId;

            if (!payloadDoctorId) {
                console.error('Doctor ID mismatch: Missing User ID', doctor);
                setError('System Error: Could not identify selected doctor. Please try again.');
                return;
            }

            await API.post('/appointments', {
                doctorId: payloadDoctorId,
                date: dateTime.toISOString(),
                aiReportId: aiReportId || null,
                consultationMode: 'PHYSICAL',
                paymentMode: 'ONSITE',
                notes: 'Standard consultation request'
            });

            alert('Appointment request sent successfully!');
            navigate('/patient/my-appointments'); // Correct redirect path
        } catch (err) {
            console.error('Booking failed:', err);
            const msg = err.response?.data?.message || err.message || 'Failed to book appointment';
            setError(typeof msg === 'string' ? msg : (msg[0] || JSON.stringify(msg)));
        } finally {
            setLoading(false);
        }
    };

    if (!doctor) return null;

    return (
        <div className={styles.section}>
            <button className={styles.backBtn} onClick={() => navigate(-1)}>
                <ArrowLeft size={18} /> Back to Selection
            </button>

            <div className={styles.bookingContainer}>
                <div className={styles.doctorInfoCard}>
                    <div className={styles.doctorHeader}>
                        <div className={styles.avatar}>
                            {doctor.fullName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                            <h3>Dr. {doctor.fullName}</h3>
                            <p className={styles.specialization}>{doctor.specialization}</p>
                        </div>
                    </div>
                    <div className={styles.infoList}>
                        <div className={styles.infoItem}>
                            <ShieldCheck size={18} />
                            <span>Verified Medical Professional</span>
                        </div>
                        <div className={styles.infoItem}>
                            <Info size={18} />
                            <span>Facility: {doctor.hospitalName || 'Main Medical Center'}</span>
                        </div>
                    </div>
                </div>

                <div className={styles.formCard}>
                    <h2>Book Physical Appointment</h2>
                    <p className={styles.subtitle}>Select your preferred date and time for consultation</p>

                    <form className={styles.form} onSubmit={handleBooking}>
                        <div className={styles.inputGroup}>
                            <label><Calendar size={18} /> Select Date</label>
                            <input
                                type="date"
                                min={new Date().toISOString().split('T')[0]}
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label><Clock size={18} /> Select Time Slot</label>
                            <div className={styles.slotsGrid}>
                                {availableSlots.map((slot) => (
                                    <button
                                        key={slot.id}
                                        type="button"
                                        className={`${styles.slotBtn} ${selectedSlot === slot.startTime ? styles.selectedSlot : ''}`}
                                        onClick={() => setSelectedSlot(slot.startTime)}
                                    >
                                        {slot.startTime}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles.paymentNotice}>
                            <div className={styles.paymentHeader}>
                                <CreditCard size={18} />
                                <span>Payment Mode: Pay On-Site</span>
                            </div>
                            <p>No upfront payment required. You will pay at the hospital during your visit.</p>
                        </div>

                        {error && <p className={styles.error}>{error}</p>}

                        <button type="submit" className={styles.submitBtn} disabled={loading}>
                            {loading ? 'Processing...' : 'Confirm Appointment Request'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PatientAppointments;
