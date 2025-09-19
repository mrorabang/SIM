// Simple email service using Formspree (free, no setup required)
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xyzdrepv';

/**
 * Gửi email thông qua Formspree (miễn phí, không cần cấu hình)
 * @param {Object} templateParams - Tham số template email
 * @param {string} templateParams.from_name - Tên người gửi
 * @param {string} templateParams.from_email - Email người gửi
 * @param {string} templateParams.phone_number - Số điện thoại
 * @param {string} templateParams.subject - Tiêu đề
 * @param {string} templateParams.message - Nội dung tin nhắn
 * @param {string} templateParams.to_email - Email người nhận
 * @returns {Promise<Object>} - Kết quả gửi email
 */
export const sendContactEmail = async (templateParams) => {
    try {
        // Validate required parameters
        if (!templateParams.from_name || !templateParams.message) {
            throw new Error('Tên và nội dung tin nhắn là bắt buộc');
        }

        // Prepare email data for Formspree
        const emailData = {
            name: templateParams.from_name,
            email: templateParams.from_email || 'noreply@example.com',
            phone: templateParams.phone_number || '',
            subject: `${templateParams.subject || 'Liên hệ từ website'} - ${templateParams.from_name}`,
            message: `
Thông tin liên hệ mới:

Tên: ${templateParams.from_name}
Email: ${templateParams.from_email || 'Không cung cấp'}
Số điện thoại: ${templateParams.phone_number || 'Không cung cấp'}
Tiêu đề: ${templateParams.subject || 'Liên hệ từ website'}

Nội dung tin nhắn:
${templateParams.message}

---
Thời gian: ${new Date().toLocaleString('vi-VN')}
IP: ${window.location.hostname}
            `.trim(),
            _replyto: templateParams.from_email || 'noreply@example.com',
            _subject: `${templateParams.subject || 'Liên hệ từ website'} - ${templateParams.from_name}`,
            _next: window.location.href
        };

        // Send email using Formspree
        const response = await fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(emailData)
        });

        if (response.ok) {
            console.log('Email sent successfully');
            return {
                success: true,
                message: 'Email đã được gửi thành công!',
                result: response
            };
        } else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

    } catch (error) {
        console.error('Error sending email:', error);
        return {
            success: false,
            message: `Lỗi khi gửi email: ${error.message}`,
            error: error
        };
    }
};

/**
 * Gửi email báo cáo lỗi hoặc phản hồi
 * @param {Object} params - Tham số email
 * @returns {Promise<Object>} - Kết quả gửi email
 */
export const sendReportEmail = async (params) => {
    try {
        const emailData = {
            name: params.from_name || 'System',
            email: params.from_email || 'system@example.com',
            subject: `${params.subject || 'Báo cáo từ hệ thống'} - ${params.from_name || 'System'}`,
            message: `
Báo cáo từ hệ thống:

Tên: ${params.from_name || 'System'}
Email: ${params.from_email || 'system@example.com'}
Số điện thoại: ${params.phone_number || 'Không cung cấp'}
Loại báo cáo: ${params.report_type || 'general'}

Nội dung báo cáo:
${params.message}

---
Thời gian: ${new Date().toLocaleString('vi-VN')}
IP: ${window.location.hostname}
            `.trim(),
            _replyto: params.from_email || 'system@example.com',
            _subject: `${params.subject || 'Báo cáo từ hệ thống'} - ${params.from_name || 'System'}`,
            _next: window.location.href
        };

        const response = await fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            return {
                success: true,
                message: 'Báo cáo đã được gửi thành công!',
                result: result
            };
        } else {
            throw new Error(result.message || `HTTP error! status: ${response.status}`);
        }

    } catch (error) {
        console.error('Error sending report email:', error);
        return {
            success: false,
            message: `Lỗi khi gửi báo cáo: ${error.message}`,
            error: error
        };
    }
};

/**
 * Test kết nối email service
 * @returns {Promise<Object>} - Kết quả test
 */
export const testEmailConnection = async () => {
    try {
        const testData = {
            name: 'Test User',
            email: 'test@example.com',
            subject: 'Test Email - Test User',
            message: `
Test kết nối email service:

Tên: Test User
Email: test@example.com
Số điện thoại: 0123456789

Nội dung test:
Đây là email test từ hệ thống

---
Thời gian: ${new Date().toLocaleString('vi-VN')}
IP: ${window.location.hostname}
            `.trim(),
            _replyto: 'test@example.com',
            _subject: 'Test Email - Test User',
            _next: window.location.href
        };

        const response = await fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            return {
                success: true,
                message: 'Kết nối Web3Forms service thành công!',
                result: result
            };
        } else {
            throw new Error(result.message || `HTTP error! status: ${response.status}`);
        }

    } catch (error) {
        console.error('Web3Forms service connection test failed:', error);
        return {
            success: false,
            message: `Lỗi kết nối Web3Forms service: ${error.message}`,
            error: error
        };
    }
};

/**
 * Cấu hình email service
 * @param {string} endpoint - Formspree endpoint
 */
export const configureEmailService = (endpoint) => {
    FORMSPREE_ENDPOINT = endpoint;
    console.log('Email service configured successfully');
};

export default {
    sendContactEmail,
    sendReportEmail,
    testEmailConnection,
    configureEmailService
};