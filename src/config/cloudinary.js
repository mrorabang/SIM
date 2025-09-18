// Cloudinary configuration
export const cloudinaryConfig = {
    cloudName: 'dqa9zqx8d', // Cloud name của bạn
    apiKey: '788445524827272', // API Key từ dashboard
    apiSecret: 'Bd6u4vVfvcigiNITqGu8YxFsUAw', // API Secret từ dashboard (cần thay thế)
    uploadPreset: 'sim-avatar-upload' // Upload preset mặc định cho unsigned upload
};

// Upload function - Signed upload với API key và secret
export const uploadToCloudinary = async (file) => {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const formData = new FormData();
    
    formData.append('file', file);
    formData.append('api_key', cloudinaryConfig.apiKey);
    formData.append('timestamp', timestamp.toString());
    formData.append('cloud_name', cloudinaryConfig.cloudName);
    
    // Tạo signature cho signed upload
    const signature = await createSignature(timestamp);
    formData.append('signature', signature);

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Cloudinary upload error:', {
                status: response.status,
                statusText: response.statusText,
                error: errorData
            });
            throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.secure_url; // Trả về URL của ảnh đã upload
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
    }
};

// Tạo signature cho signed upload
const createSignature = async (timestamp) => {
    // Tạo signature từ timestamp và API secret
    const crypto = window.crypto || window.msCrypto;
    const encoder = new TextEncoder();
    const data = encoder.encode(`timestamp=${timestamp}${cloudinaryConfig.apiSecret}`);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
};

// Upload function - Không dùng upload preset (cần API key)
export const uploadToCloudinaryWithoutPreset = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', cloudinaryConfig.apiKey);
    formData.append('cloud_name', cloudinaryConfig.cloudName);

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Cloudinary upload without preset error:', {
                status: response.status,
                statusText: response.statusText,
                error: errorData
            });
            throw new Error(`Upload without preset failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error('Error uploading to Cloudinary without preset:', error);
        throw error;
    }
};

// Alternative upload function - Direct upload without preset (cần tạo upload preset trước)
export const uploadToCloudinaryDirect = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('cloud_name', cloudinaryConfig.cloudName);

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Cloudinary direct upload error:', {
                status: response.status,
                statusText: response.statusText,
                error: errorData
            });
            throw new Error(`Direct upload failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error('Error in direct upload to Cloudinary:', error);
        throw error;
    }
};

// Generate avatar URL with transformations
export const getAvatarUrl = (publicId, size = 100) => {
    if (!publicId) return null;
    
    return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/w_${size},h_${size},c_fill,g_face,r_max,f_auto/${publicId}`;
};
