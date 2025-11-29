// Attack Notification Service
class AttackNotificationService {
    constructor() {
        // Load admin email from environment with fallback
        this.ADMIN_EMAIL = this.loadAdminEmail();
        this.ATTACK_ENDPOINT = 'https://formspree.io/f/xyzdrepv'; // Same endpoint as contact form
        
        console.log('📧 AttackNotificationService initialized');
        console.log('📧 Admin email:', this.ADMIN_EMAIL);
    }

    // Load admin email from environment
    loadAdminEmail() {
        try {
            const email = process.env.REACT_APP_ADMIN_EMAIL;
            if (email && email.includes('@')) {
                console.log('✅ Admin email loaded from .env:', email);
                return email;
            } else {
                console.warn('⚠️ REACT_APP_ADMIN_EMAIL not found or invalid in .env');
                console.log('📧 Using fallback email: admin@example.com');
                return 'admin@example.com';
            }
        } catch (error) {
            console.error('❌ Error loading admin email:', error);
            console.log('📧 Using fallback email: admin@example.com');
            return 'admin@example.com';
        }
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

    // Format attack information for email
    formatAttackEmail(attackInfo) {
        let emailBody = `
🚨 BOT ATTACK DETECTED 🚨
========================
⏰ Time: ${attackInfo.timestamp}
🎯 Reason: ${attackInfo.reason}
🌐 URL: ${attackInfo.url}
🔗 Referrer: ${attackInfo.referrer || 'Direct'}

🖥️ BROWSER INFO:
• User Agent: ${attackInfo.userAgent}
• Language: ${attackInfo.language}
• Platform: ${attackInfo.platform}
• Screen: ${attackInfo.screen?.width}x${attackInfo.screen?.height}
• Timezone: ${attackInfo.timezone}`;

        // Add fingerprint information if available
        if (attackInfo.fingerprint) {
            const fp = attackInfo.fingerprint;
            emailBody += `

🔍 FINGERPRINT ANALYSIS:
• Hash: ${fp.hash || 'N/A'}
• Browser: ${fp.userAgent || 'N/A'}
• Language: ${fp.language || 'N/A'}
• Platform: ${fp.platform || 'N/A'}
• Screen: ${fp.screen?.width}x${fp.screen?.height} (${fp.screen?.colorDepth}bit)
• Window: ${fp.window?.innerWidth}x${fp.window?.innerHeight}
• Device Pixel Ratio: ${fp.window?.devicePixelRatio}
• Hardware Cores: ${fp.hardware?.cores || 'N/A'}
• Memory: ${fp.hardware?.memory || 'N/A'}GB
• Touch Points: ${fp.hardware?.maxTouchPoints || 0}

🎨 CANVAS FINGERPRINT:
• Hash: ${fp.canvas?.hash || 'N/A'}

🎮 WEBGL INFO:
• Vendor: ${fp.webgl?.vendor || 'N/A'}
• Renderer: ${fp.webgl?.renderer || 'N/A'}
• Version: ${fp.webgl?.version || 'N/A'}

🔊 AUDIO FINGERPRINT:
• Hash: ${fp.audio?.hash || 'N/A'}

🔤 FONTS DETECTED:
• Count: ${fp.fonts?.length || 0}
• List: ${fp.fonts?.slice(0, 10).join(', ') || 'N/A'}

🔌 PLUGINS:
• Count: ${fp.plugins?.length || 0}
• List: ${fp.plugins?.slice(0, 5).map(p => p.name).join(', ') || 'N/A'}

🌐 NETWORK INFO:
• Online: ${fp.network?.online ? 'Yes' : 'No'}
• Connection: ${fp.network?.connection?.effectiveType || 'N/A'}
• Downlink: ${fp.network?.connection?.downlink || 'N/A'}Mbps
• RTT: ${fp.network?.connection?.rtt || 'N/A'}ms

💾 STORAGE:
• LocalStorage: ${fp.storage?.localStorage ? 'Yes' : 'No'}
• SessionStorage: ${fp.storage?.sessionStorage ? 'Yes' : 'No'}
• IndexedDB: ${fp.storage?.indexedDB ? 'Yes' : 'No'}

🛡️ SECURITY:
• Ad Blocker: ${fp.security?.adBlocker ? 'Yes' : 'No'}
• Tracking Protection: ${fp.security?.trackingProtection ? 'Yes' : 'No'}
• Private Mode: ${fp.security?.privateMode ? 'Yes' : 'No'}

📊 BEHAVIOR ANALYSIS:
• Mouse Speed: ${fp.behavior?.mouseSpeed?.average || 0}px/ms
• Typing Speed: ${fp.behavior?.typingPattern?.keysPerMinute || 0} keys/min
• Scroll Events: ${fp.behavior?.scrollBehavior?.totalScrolls || 0}

📋 ADDITIONAL DATA:
${JSON.stringify(attackInfo.data, null, 2)}

🔒 SECURITY ALERT:
This automated alert indicates potential bot activity.
Please review the fingerprint data for further analysis.

========================================
SYSTEM INFO:
========================================
Page: ${window.location.href}
Referrer: ${document.referrer}
Generated: ${new Date().toISOString()}

========================================
This is an automated security alert.
Please investigate immediately.
========================================`;
        }

        return emailBody;
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

    // Test email service with fingerprint
    // async testEmailService() {
    //     console.log('🔍 Generating fingerprint for test...');
    //     const fingerprint = await window.fingerprintingService.generateFingerprint();
        
    //     const testAttack = {
    //         timestamp: new Date().toISOString(),
    //         reason: 'test_notification_with_fingerprint',
    //         userAgent: navigator.userAgent,
    //         language: navigator.language,
    //         platform: navigator.platform,
    //         ip: 'client-side',
    //         screen: { width: window.screen.width, height: window.screen.height },
    //         timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    //         url: window.location.href,
    //         referrer: document.referrer,
    //         fingerprint: fingerprint,
    //         data: { 
    //             test: true,
    //             fingerprint_hash: fingerprint?.hash,
    //             browser_info: 'Test attack with full fingerprinting'
    //         }
    //     };

    //     console.log('📧 Testing email notification service with fingerprint...');
    //     console.log('🔍 Test fingerprint:', fingerprint?.hash);
    //     await this.sendAttackNotification(testAttack);
    // }

    // // Simulate bot attack
    // async simulateBotAttack() {
    //     console.log('🤖 Simulating bot attack...');
        
    //     // Generate fingerprint
    //     const fingerprint = await window.fingerprintingService.generateFingerprint();
        
    //     const simulatedAttack = {
    //         timestamp: new Date().toISOString(),
    //         reason: 'honeypot_input', // Common bot detection reason
    //         userAgent: navigator.userAgent,
    //         language: navigator.language,
    //         platform: navigator.platform,
    //         ip: 'client-side',
    //         screen: { width: window.screen.width, height: window.screen.height },
    //         timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    //         url: window.location.href,
    //         referrer: document.referrer,
    //         fingerprint: fingerprint,
    //         data: {
    //             simulated: true,
    //             honeypot_field: 'bot_filled_input',
    //             detection_method: 'honeypot_trap',
    //             fingerprint_hash: fingerprint?.hash,
    //             attack_patterns: ['no_mouse_movement', 'ultra_fast_load', 'honeypot_input']
    //         }
    //     };

    //     console.log('🚀 Sending simulated bot attack notification...');
    //     await this.sendAttackNotification(simulatedAttack);
    //     return simulatedAttack;
    // }

    // // Test multiple attack scenarios
    // async testAttackScenarios() {
    //     console.log('🎯 Testing multiple attack scenarios...');
        
    //     const scenarios = [
    //         {
    //             reason: 'ultra_fast_load',
    //             data: { loadTime: 50, threshold: 100 }
    //         },
    //         {
    //             reason: 'no_mouse_movement',
    //             data: { mouseEvents: 0, timeElapsed: 5000 }
    //         },
    //         {
    //             reason: 'honeypot_focus',
    //             data: { fieldType: 'honeypot', element: 'hidden_input' }
    //         },
    //         {
    //             reason: 'honeypot_input',
    //             data: { fieldType: 'honeypot', value: 'bot_detected' }
    //         },
    //         {
    //             reason: 'no_interaction',
    //             data: { mouseEvents: 0, keyPresses: 0, timeElapsed: 10000 }
    //         }
    //     ];

    //     for (let i = 0; i < scenarios.length; i++) {
    //         const scenario = scenarios[i];
    //         console.log(`📧 Testing scenario ${i + 1}/${scenarios.length}: ${scenario.reason}`);
            
    //         const attack = {
    //             timestamp: new Date().toISOString(),
    //             reason: scenario.reason,
    //             userAgent: navigator.userAgent,
    //             language: navigator.language,
    //             platform: navigator.platform,
    //             ip: 'client-side',
    //             screen: { width: window.screen.width, height: window.screen.height },
    //             timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    //             url: window.location.href,
    //             referrer: document.referrer,
    //             fingerprint: await window.fingerprintingService.generateFingerprint(),
    //             data: scenario.data
    //         };

    //         await this.sendAttackNotification(attack);
            
    //         // Wait between attacks
    //         await new Promise(resolve => setTimeout(resolve, 1000));
    //     }
        
    //     console.log('✅ All attack scenarios tested!');
    // }

    // // Quick test function for browser console
    // static quickTest() {
    //     const service = new AttackNotificationService();
    //     console.log('🚀 Starting bot attack test...');
    //     console.log('📧 Admin email:', service.ADMIN_EMAIL);
    //     service.testEmailService().then(() => {
    //         console.log('✅ Test completed! Check your email.');
    //     }).catch(error => {
    //         console.error('❌ Test failed:', error);
    //     });
    // }

    // // Simple email test (no fingerprint)
    // static simpleEmailTest() {
    //     const service = new AttackNotificationService();
    //     console.log('📧 Testing simple email...');
    //     console.log('📧 Admin email:', service.ADMIN_EMAIL);
        
    //     const simpleAttack = {
    //         timestamp: new Date().toISOString(),
    //         reason: 'simple_email_test',
    //         userAgent: navigator.userAgent,
    //         language: navigator.language,
    //         platform: navigator.platform,
    //         ip: 'client-side',
    //         screen: { width: window.screen.width, height: window.screen.height },
    //         timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    //         url: window.location.href,
    //         referrer: document.referrer,
    //         fingerprint: null,
    //         data: { 
    //             simple_test: true,
    //             message: 'This is a simple email test to verify Formspree is working',
    //             timestamp: new Date().toLocaleString()
    //         }
    //     };

    //     service.sendAttackNotification(simpleAttack).then(() => {
    //         console.log('✅ Simple email sent! Check:', service.ADMIN_EMAIL);
    //     }).catch(error => {
    //         console.error('❌ Simple email failed:', error);
    //     });
    // }

    // Get current admin email
    getAdminEmail() {
        return this.ADMIN_EMAIL;
    }

    // Update admin email (for runtime changes)
    setAdminEmail(email) {
        if (email && email.includes('@')) {
            this.ADMIN_EMAIL = email;
            console.log('📧 Admin email updated to:', email);
        } else {
            console.warn('⚠️ Invalid email format:', email);
        }
    }

    // Reload admin email from environment
    reloadAdminEmail() {
        const oldEmail = this.ADMIN_EMAIL;
        this.ADMIN_EMAIL = this.loadAdminEmail();
        console.log('📧 Admin email reloaded:', oldEmail, '→', this.ADMIN_EMAIL);
        return this.ADMIN_EMAIL;
    }
}

const attackNotificationService = new AttackNotificationService();
export default attackNotificationService;

// Make available globally for production use only
window.attackNotificationService = attackNotificationService;
window.getAdminEmail = () => attackNotificationService.getAdminEmail();
window.setAdminEmail = (email) => attackNotificationService.setAdminEmail(email);
window.reloadAdminEmail = () => attackNotificationService.reloadAdminEmail();
