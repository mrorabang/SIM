import React, { useState } from 'react';
import { MDBBtn, MDBIcon, MDBSpinner } from 'mdb-react-ui-kit';
import { uploadToCloudinary, getAvatarUrl } from '../config/cloudinary';
import { showAlert } from '../service/AlertServices';

function AvatarUpload({ currentAvatar, onAvatarChange, size = 120 }) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            showAlert('Vui lòng chọn file ảnh!', 'warning');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showAlert('Kích thước file không được vượt quá 5MB!', 'warning');
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreview(e.target.result);
        };
        reader.readAsDataURL(file);

        // Upload to Cloudinary
        uploadAvatar(file);
    };

    const uploadAvatar = async (file) => {
        setUploading(true);
        try {
            const avatarUrl = await uploadToCloudinary(file);
            
            // Extract public_id from URL
            const publicId = extractPublicId(avatarUrl);
            
            onAvatarChange(avatarUrl, publicId);
            setPreview(null);
            // showAlert('Upload avatar thành công!', 'success');
        } catch (error) {
            console.error('Upload error:', error);
            showAlert('Lỗi upload avatar!', 'error');
            setPreview(null);
        } finally {
            setUploading(false);
        }
    };

    const extractPublicId = (url) => {
        // Extract public_id from Cloudinary URL
        const parts = url.split('/');
        const filename = parts[parts.length - 1];
        return filename.split('.')[0];
    };

    const getDisplayAvatar = () => {
        if (preview) return preview;
        if (currentAvatar) {
            // If currentAvatar is a public_id, generate URL
            if (!currentAvatar.startsWith('http')) {
                return getAvatarUrl(currentAvatar, size);
            }
            return currentAvatar;
        }
        return null;
    };

    return (
        <div className="d-flex flex-column align-items-center">
            <div 
                className="position-relative mb-3"
                style={{ 
                    width: `${size}px`, 
                    height: `${size}px`,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '3px solid #dee2e6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f8f9fa'
                }}
            >
                {getDisplayAvatar() ? (
                    <img
                        src={getDisplayAvatar()}
                        alt="Avatar"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                ) : (
                    <MDBIcon 
                        fas 
                        icon="user-circle" 
                        size="4x" 
                        className="text-muted"
                    />
                )}
                
                {uploading && (
                    <div 
                        className="position-absolute d-flex align-items-center justify-content-center"
                        style={{
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            color: 'white'
                        }}
                    >
                        <MDBSpinner size="sm" className="me-2" />
                        <span>Uploading...</span>
                    </div>
                )}
            </div>

            <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                disabled={uploading}
            />
            
            <MDBBtn
                color="primary"
                size="sm"
                onClick={() => document.getElementById('avatar-upload').click()}
                disabled={uploading}
                className="d-flex align-items-center"
            >
                {uploading ? (
                    <>
                        <MDBSpinner size="sm" className="me-2" />
                        Uploading...
                    </>
                ) : (
                    <>
                        <MDBIcon fas icon="camera" className="me-2" />
                        {currentAvatar ? 'Change Avatar' : 'Upload Avatar'}
                    </>
                )}
            </MDBBtn>
        </div>
    );
}

export default AvatarUpload;
