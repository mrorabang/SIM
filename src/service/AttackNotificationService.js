// Attack Notification Service
class AttackNotificationService {
    constructor() {
        this.ADMIN_EMAIL = 'dangminhquan9320@gmail.com'; // Default admin email
        this.ATTACK_ENDPOINT = 'https://formspree.io/f/xyzdrepv'; // Same endpoint as contact form
    }

    // Gửi email notification khi phát hiện tấn công
    async sendAttackNotification(attackInfo) {
        const subject = `🚨 BOT ATTACK DETECTED - ${new Date().toLocaleString()}`;
        const body = this.formatAttackEmail(attackInfo);

        try {
            // Method 1: Dùng Formspree (free & easy)
            if (this.ATTACK_ENDPOINT.includes('formspree')) {
                await this.sendViaFormspree(subject, body);
            }
            
            // // Method 2: Dùng EmailJS (free tier)
            // else if (window.emailjs) {
            //     await this.sendViaEmailJS(subject, body, attackInfo);
            // }
            
            // // Method 3: Fallback - console + localStorage
            // else {
            //     this.logAttackForLater(attackInfo, subject, body);
            // }

            console.log('📧 Attack notification sent successfully');
            
        } catch (error) {
            console.error('Failed to send attack notification:', error);
            // Fallback: store for later
            this.logAttackForLater(attackInfo, subject, body);
        }
    }

    // Format email content
    formatAttackEmail(attackInfo) {
        return `
🚨 SECURITY ALERT - BOT ATTACK DETECTED 🚨

========================================
ATTACK DETAILS:
========================================
Timestamp: ${attackInfo.timestamp}
Detection Reason: ${attackInfo.reason}
User Agent: ${attackInfo.userAgent}
Language: ${attackInfo.language}
Platform: ${attackInfo.platform}
Screen Resolution: ${attackInfo.screen?.width}x${attackInfo.screen?.height}
Timezone: ${attackInfo.timezone}

========================================
DETECTION DATA:
========================================
${JSON.stringify(attackInfo.data, null, 2)}

========================================
RECOMMENDED ACTIONS:
========================================
1. Check server logs for this IP
2. Consider blocking suspicious IPs
3. Monitor for repeated attacks
4. Review security measures

========================================
SYSTEM INFO:
========================================
Page: ${window.location.href}
Referrer: ${document.referrer}
Generated: ${new Date().toISOString()}

========================================
This is an automated security alert.
Please investigate immediately.
========================================
        `.trim();
    }

    // Gửi qua Formspree
    async sendViaFormspree(subject, body) {
        const response = await fetch(this.ATTACK_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                from_name: 'Security System',
                from_email: 'security@system.com',
                phone_number: 'N/A',
                subject: subject,
                message: body,
                to_email: this.ADMIN_EMAIL
            })
        });

        if (!response.ok) {
            throw new Error(`Formspree error: ${response.status}`);
        }

        return response.json();
    }

    // Gửi qua EmailJS
    // async sendViaEmailJS(subject, body, attackInfo) {
    //     const templateParams = {
    //         to_email: this.ADMIN_EMAIL,
    //         subject: subject,
    //         message: body,
    //         attack_reason: attackInfo.reason,
    //         attack_time: attackInfo.timestamp,
    //         user_agent: attackInfo.userAgent
    //     };

    //     const response = await window.emailjs.send(
    //         'service_your_service_id', // Service ID
    //         'template_your_template_id', // Template ID
    //         templateParams,
    //         'your_public_key' // Public Key
    //     );

    //     return response;
    // }

    // Fallback: Lưu lại để gửi sau
    logAttackForLater(attackInfo, subject, body) {
        // Lưu vào localStorage
        const pendingNotifications = JSON.parse(
            localStorage.getItem('pending_attack_notifications') || '[]'
        );
        
        pendingNotifications.push({
            timestamp: new Date().toISOString(),
            subject,
            body,
            attackInfo
        });

        // Giữ lại 10 notification gần nhất
        localStorage.setItem(
            'pending_attack_notifications', 
            JSON.stringify(pendingNotifications.slice(-10))
        );

        // Log ra console
        console.warn('📧 ATTACK NOTIFICATION (SAVED LOCALLY):');
        console.warn('Subject:', subject);
        console.warn('Body:', body);
        console.warn('Stored in localStorage for manual sending');
    }

    // Gửi các notification đang chờ
    async sendPendingNotifications() {
        const pending = JSON.parse(
            localStorage.getItem('pending_attack_notifications') || '[]'
        );

        if (pending.length === 0) {
            console.log('No pending notifications to send');
            return;
        }

        console.log(`Sending ${pending.length} pending notifications...`);

        for (const notification of pending) {
            try {
                await this.sendAttackNotification(notification.attackInfo);
                console.log('✅ Sent pending notification from:', notification.timestamp);
            } catch (error) {
                console.error('❌ Failed to send pending notification:', error);
            }
        }

        // Xóa đã gửi thành công
        localStorage.removeItem('pending_attack_notifications');
    }

    // Test email service
    async testEmailService() {
        const testAttack = {
            timestamp: new Date().toISOString(),
            reason: 'test_notification',
            userAgent: 'Test Bot',
            language: 'en-US',
            platform: 'Test',
            screen: { width: 1920, height: 1080 },
            timezone: 'Asia/Ho_Chi_Minh',
            data: { test: true }
        };

        console.log('📧 Testing email notification service...');
        await this.sendAttackNotification(testAttack);
    }

    // Quick test function for browser console
    static quickTest() {
        const service = new AttackNotificationService();
        console.log('🚀 Starting bot attack test...');
        service.testEmailService().then(() => {
            console.log('✅ Test completed! Check your email.');
        }).catch(error => {
            console.error('❌ Test failed:', error);
        });
    }
}

const attackNotificationService = new AttackNotificationService();
export default attackNotificationService;

// Make available globally for testing
window.testAttackNotification = () => AttackNotificationService.quickTest();
window.attackNotificationService = attackNotificationService;
