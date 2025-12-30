import React, { useState } from 'react';
import styles from './PatientProfile.module.css';
import { Camera, Trash2, Mail, Shield, Smartphone, MapPin, Bell, User, Check } from 'lucide-react';

const PatientProfile = () => {
    const userString = localStorage.getItem('currentUser');
    const user = userString ? JSON.parse(userString) : null;
    const profile = user?.patientProfile || {};

    const [formData, setFormData] = useState({
        fullName: profile.fullName || user?.fullName || "User",
        email: user?.email || "",
        phone: profile.contact || "",
        age: profile.age || "",
        gender: profile.gender || "",
        location: profile.location || "Not Specified",
        emailNotifications: true,
        appointmentReminders: true
    });

    const [showSuccess, setShowSuccess] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSaveChanges = () => {
        // Update currentUser in localStorage
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const updatedUser = {
            ...currentUser,
            fullName: formData.fullName,
            email: formData.email,
            patientProfile: {
                ...currentUser?.patientProfile,
                contact: formData.phone,
                age: formData.age,
                gender: formData.gender,
                location: formData.location,
            },
            emailNotifications: formData.emailNotifications,
            appointmentReminders: formData.appointmentReminders
        };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));

        // Show success message
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    return (
        <div className={styles.section}>
            <h1 className={styles.title}>Account Settings</h1>

            {showSuccess && (
                <div className={styles.successToast}>
                    <Check size={20} />
                    Changes saved successfully!
                </div>
            )}

            <div className={styles.card}>
                <div className={styles.avatarSection}>
                    <div className={styles.avatar}>
                        {formData.fullName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className={styles.avatarActions}>
                        <button className={styles.changeBtn}><Camera size={16} /> Change Photo</button>
                        <button className={styles.removeBtn}><Trash2 size={16} /> Remove</button>
                    </div>
                </div>

                <div className={styles.formGrid}>
                    <div className={styles.inputGroup}>
                        <label><User size={16} /> Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className={styles.inputField}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label><Mail size={16} /> Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={styles.inputField}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label><Smartphone size={16} /> Phone Number</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className={styles.inputField}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Age</label>
                        <input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleInputChange}
                            className={styles.inputField}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Gender</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            className={styles.inputField}
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className={styles.inputGroup}>
                        <label><MapPin size={16} /> Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            className={styles.inputField}
                        />
                    </div>
                </div>

                <div className={styles.preferencesSection}>
                    <h3><Bell size={18} /> Notification Preferences</h3>
                    <div className={styles.checkboxGroup}>
                        <label className={styles.checkbox}>
                            <input
                                type="checkbox"
                                name="emailNotifications"
                                checked={formData.emailNotifications}
                                onChange={handleInputChange}
                            />
                            Email notifications for new reports
                        </label>
                        <label className={styles.checkbox}>
                            <input
                                type="checkbox"
                                name="appointmentReminders"
                                checked={formData.appointmentReminders}
                                onChange={handleInputChange}
                            />
                            Appointment reminders
                        </label>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button className={styles.saveBtn} onClick={handleSaveChanges}>Save Changes</button>
                    <button className={styles.passwordBtn}><Shield size={16} /> Reset Password</button>
                </div>
            </div>
        </div>
    );
};

export default PatientProfile;
