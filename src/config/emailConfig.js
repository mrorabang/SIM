// Cấu hình EmailJS đã được thiết lập sẵn
export const EMAIL_CONFIG = {
    // EmailJS Service Configuration
    SERVICE_ID: 'service_contact_form',
    TEMPLATE_ID: 'template_contact', 
    PUBLIC_KEY: 'user_contact_key',
    
    // Gmail App Password (đã cung cấp)
    GMAIL_APP_PASSWORD: 'cylh mtgs fadq ygiv',
    
    // Email template variables
    TEMPLATE_VARIABLES: {
        from_name: '{{from_name}}',
        from_email: '{{from_email}}',
        phone_number: '{{phone_number}}',
        subject: '{{subject}}',
        message: '{{message}}',
        to_email: '{{to_email}}'
    },
    
    // Default email template
    EMAIL_TEMPLATE: `
Subject: {{subject}} - Liên hệ từ {{from_name}}

Thông tin liên hệ:
- Tên: {{from_name}}
- Email: {{from_email}}
- Số điện thoại: {{phone_number}}
- Tiêu đề: {{subject}}

Nội dung tin nhắn:
{{message}}

---
Email được gửi tự động từ Contact Form
Thời gian: {{current_time}}
    `,
    
    // SMTP Configuration (nếu cần)
    SMTP_CONFIG: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'your-email@gmail.com', // Thay bằng email của bạn
            pass: 'cylh mtgs fadq ygiv'
        }
    }
};

export default EMAIL_CONFIG;
