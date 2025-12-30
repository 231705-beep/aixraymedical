import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PatientLayout from '../layouts/PatientLayout/PatientLayout';
import DoctorLayout from '../layouts/DoctorLayout/DoctorLayout';
import AdminLayout from '../layouts/AdminLayout/AdminLayout';

// Public Pages
import Landing from '../pages/Landing/Landing';
import Auth from '../pages/Auth/Auth';

// Patient Pages
import PatientDashboard from '../pages/Patient/Dashboard/PatientDashboard';
import UploadXray from '../pages/Patient/UploadXray/UploadXray';
import PatientReports from '../pages/Patient/Reports/PatientReports';
import AIReport from '../pages/Patient/Reports/AIReport';
import PatientDoctors from '../pages/Patient/Doctors/PatientDoctors';
import PatientAppointments from '../pages/Patient/Appointments/PatientAppointments';
import MyAppointments from '../pages/Patient/Appointments/MyAppointments';
import PatientPrescriptions from '../pages/Patient/Prescriptions/PatientPrescriptions';
import PatientProfile from '../pages/Patient/Profile/PatientProfile';

// Doctor Pages
import DoctorDashboard from '../pages/Doctor/Dashboard/DoctorDashboard';
import PatientCases from '../pages/Doctor/Cases/PatientCases';
import DoctorPrescriptions from '../pages/Doctor/Prescriptions/DoctorPrescriptions';
import DoctorProfile from '../pages/Doctor/Profile/DoctorProfile';
import DoctorHistory from '../pages/Doctor/History/DoctorHistory';
import DoctorReports from '../pages/Doctor/Reports/DoctorReports';
import DoctorAppointments from '../pages/Doctor/Appointments/DoctorAppointments';
import DoctorReportDetail from '../pages/Doctor/Reports/DoctorReportDetail';

// Admin Pages
import AdminLogin from '../pages/Admin/Login/AdminLogin';
import AdminDashboard from '../pages/Admin/Dashboard/AdminDashboard';
import ManageDoctors from '../pages/Admin/Doctors/ManageDoctors';
import ManageUsers from '../pages/Admin/Users/ManageUsers';
import SystemReports from '../pages/Admin/Reports/SystemReports';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            {/* Explicitly passing key to force re-render when switching routes */}
            <Route path="/auth/login" element={<Auth key="login" />} />
            <Route path="/auth/signup" element={<Auth key="signup" />} />
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Patient Routes */}
            <Route path="/patient" element={<Navigate to="/patient/dashboard" replace />} />
            <Route path="/patient/*" element={
                <PatientLayout>
                    <Routes>
                        <Route path="dashboard" element={<PatientDashboard />} />
                        <Route path="upload" element={<UploadXray />} />
                        <Route path="reports" element={<PatientReports />} />
                        <Route path="reports/:id" element={<AIReport />} />
                        <Route path="doctors" element={<PatientDoctors />} />
                        <Route path="appointments" element={<PatientAppointments />} />
                        <Route path="my-appointments" element={<MyAppointments />} />
                        <Route path="prescriptions" element={<PatientPrescriptions />} />
                        <Route path="settings" element={<PatientProfile />} />
                    </Routes>
                </PatientLayout>
            } />

            {/* Doctor Routes */}
            <Route path="/doctor" element={<Navigate to="/doctor/dashboard" replace />} />
            <Route path="/doctor/*" element={
                <DoctorLayout>
                    <Routes>
                        <Route path="dashboard" element={<DoctorDashboard />} />
                        <Route path="cases/:id" element={<PatientCases />} />
                        <Route path="prescribe/:id" element={<DoctorPrescriptions />} />
                        <Route path="appointments" element={<DoctorAppointments />} />
                        <Route path="reports" element={<DoctorReports />} />
                        <Route path="reports/:id" element={<DoctorReportDetail />} />
                        <Route path="settings" element={<DoctorProfile />} />
                        <Route path="history" element={<DoctorHistory />} />
                    </Routes>
                </DoctorLayout>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/*" element={
                <AdminLayout>
                    <Routes>
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="doctors" element={<ManageDoctors />} />
                        <Route path="patients" element={<ManageUsers />} />
                        <Route path="reports" element={<SystemReports />} />
                        <Route path="logs" element={<div style={{ padding: '2rem' }}><h1>Security Logs</h1><p>System activities and access logs.</p></div>} />
                    </Routes>
                </AdminLayout>
            } />

            {/* Default Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
