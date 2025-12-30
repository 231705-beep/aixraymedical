import React, { useState, useEffect, useRef } from 'react';
import styles from './DoctorProfile.module.css';
import { Camera, Shield, Phone, Mail, Award, MapPin, Building2, X } from 'lucide-react';

const DoctorProfile = () => {
    const userString = localStorage.getItem('currentUser');
    const user = userString ? JSON.parse(userString) : null;
    const profile = user?.doctorProfile || {};
    const fileInputRef = useRef(null);
    // Profile v3 - Live Sync

    // Initialize state with actual user data from localStorage/backend
    const [userData, setUserData] = useState({
        fullName: profile.fullName || user?.fullName || "Doctor",
        email: user?.email || "",
        specialization: profile.specialization || "Not Specified",
        licenseNumber: profile.licenseNumber || "Not Provided",
        experience: profile.experience || 0,
        hospital: profile.hospital || "",
        clinicName: profile.clinicName || "",
        contactNumber: user?.contactNumber || profile.contactNumber || "",
        photoUrl: user?.photoUrl || profile.photoUrl || ""
    });

    // Password reset modal state
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleInputChange = (field, value) => {
        setUserData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = () => {
        // Update localStorage with new data
        const updatedUser = {
            ...user,
            contactNumber: userData.contactNumber,
            photoUrl: userData.photoUrl,
            doctorProfile: {
                ...user?.doctorProfile,
                hospital: userData.hospital,
                clinicName: userData.clinicName
            }
        };

        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        alert('Professional details saved successfully!');
    };

    // Handle photo upload
    const handlePhotoClick = () => {
        fileInputRef.current?.click();
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUserData(prev => ({
                    ...prev,
                    photoUrl: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle password reset
    const handlePasswordReset = () => {
        setShowPasswordModal(true);
    };

    const handlePasswordSubmit = () => {
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            alert('Please fill in all password fields');
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('New passwords do not match!');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }

        // Update password in localStorage
        const updatedUser = {
            ...user,
            password: passwordData.newPassword
        };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));

        alert('Password reset successfully!');
        setShowPasswordModal(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    // Format experience for display
    const formatExperience = (exp) => {
        if (!exp || exp === 0) return "New Professional";
        return `${exp}+ Years`;
    };

    return (
        <div className={styles.section}>
            <h1 className={styles.title} style={{ fontSize: '2.8rem', marginBottom: '3rem' }}>Professional Profile</h1>

            <div className={styles.card}>
                <div className={styles.profileHeader}>
                    <div className={styles.avatar} style={userData.photoUrl ? {
                        backgroundImage: `url(${userData.photoUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        fontSize: userData.photoUrl ? '0' : '3rem'
                    } : {}}>
                        {!userData.photoUrl && userData.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <div className={styles.profileInfo}>
                        <h2 className={styles.doctorName}>Dr. {userData.fullName}</h2>
                        <div className={styles.tagGroup}>
                            <span className={styles.specialtyTag}>{userData.specialization}</span>
                            <span className={styles.expTag}><Award size={14} /> {formatExperience(userData.experience)} Exp.</span>
                        </div>
                    </div>
                    <div className={styles.headerActions}>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handlePhotoChange}
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
                        <button className={styles.photoBtn} onClick={handlePhotoClick}>
                            <Camera size={18} /> Update Photo
                        </button>
                    </div>
                </div>

                <div className={styles.formContainer}>
                    <div className={styles.inputGrid}>
                        <div className={styles.inputGroup}>
                            <label><Mail size={16} /> Email Address</label>
                            <input
                                type="email"
                                value={userData.email}
                                readOnly
                                className={styles.inputField}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label><Shield size={16} /> Medical License ID</label>
                            <input
                                type="text"
                                value={userData.licenseNumber}
                                readOnly
                                className={styles.inputField}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label><Building2 size={16} /> Hospital/Clinic</label>
                            <input
                                type="text"
                                value={userData.hospital || userData.clinicName}
                                onChange={(e) => handleInputChange('hospital', e.target.value)}
                                className={styles.inputField}
                                placeholder="Enter hospital or clinic name"
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label><Phone size={16} /> Contact Number</label>
                            <input
                                type="text"
                                value={userData.contactNumber}
                                onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                                className={styles.inputField}
                                placeholder="Enter contact number"
                            />
                        </div>
                    </div>

                    <div className={styles.actionSection}>
                        <button className={styles.saveBtn} onClick={handleSave}>Save Professional Details</button>
                        <button className={styles.passwordBtn} onClick={handlePasswordReset}>Reset Password</button>
                    </div>
                </div>
            </div>

            {/* Password Reset Modal */}
            {showPasswordModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h2>Reset Password</h2>
                            <button className={styles.closeBtn} onClick={() => setShowPasswordModal(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.inputGroup}>
                                <label>Current Password</label>
                                <input
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                    className={styles.inputField}
                                    placeholder="Enter current password"
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                    className={styles.inputField}
                                    placeholder="Enter new password"
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    className={styles.inputField}
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={styles.cancelBtn} onClick={() => setShowPasswordModal(false)}>
                                Cancel
                            </button>
                            <button className={styles.submitBtn} onClick={handlePasswordSubmit}>
                                Reset Password
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorProfile;
