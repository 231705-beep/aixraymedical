import React, { useState } from 'react';
import { Upload as UploadIcon } from 'lucide-react';
import styles from './UploadXray.module.css';
import API from '../../../utils/api';
import { useNavigate } from 'react-router-dom';

const UploadXray = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await API.post('/xray/upload', formData);

            // Navigate to the real report page using the ID from backend
            const xrayId = response.data.id;

            // Optional: Give the AI a moment to process before redirecting
            // This is purely for UX so the user likely sees the result immediately
            setTimeout(() => {
                navigate(`/patient/reports/${xrayId}`);
            }, 2000);

        } catch (error) {
            console.error('Upload Failed:', error);
            let errorMessage = 'Upload failed. Please try again.';

            if (error.code === 'ERR_NETWORK' || !error.response) {
                errorMessage = 'Connection Error. Please ensure the backend server is running.';
            } else {
                errorMessage = error.response?.data?.message || error.message;
            }

            alert(`Upload Failed: ${errorMessage}`);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className={styles.section}>
            <h2>Upload New Investigation</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Please upload a clear DICOM or JPEG/PNG X-ray image for AI analysis.</p>

            <div className={styles.uploadCard} onClick={() => !uploading && document.getElementById('fileInput').click()}>
                <input type="file" id="fileInput" hidden onChange={handleFileChange} accept="image/*" disabled={uploading} />
                <UploadIcon size={48} color="var(--primary-color)" style={{ marginBottom: '1rem' }} />
                <h3>{uploading ? 'ANALYZING_SYSTEM_DATA...' : (selectedFile ? selectedFile.name : 'Click to browse or drag and drop')}</h3>
                <p>Maximum file size: 25MB</p>
                {preview && <img src={preview} alt="Preview" className={styles.previewImage} />}
            </div>

            {selectedFile && (
                <button
                    className={styles.submitBtn}
                    style={{ width: 'auto', padding: '1rem 4rem', marginTop: '2rem' }}
                    onClick={handleUpload}
                    disabled={uploading}
                >
                    {uploading ? 'SYSTEM_PROCESSING...' : 'Proceed to AI Analysis'}
                </button>
            )}
        </div>
    );
};


export default UploadXray;
