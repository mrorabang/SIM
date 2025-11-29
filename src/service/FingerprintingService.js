// Advanced Fingerprinting Service for Bot Detection
class FingerprintingService {
    constructor() {
        this.fingerprint = null;
        this.isGenerating = false;
    }

    // Generate comprehensive browser fingerprint
    async generateFingerprint() {
        if (this.isGenerating) return this.fingerprint;
        
        this.isGenerating = true;
        
        try {
            const fp = {
                // Basic browser info
                userAgent: navigator.userAgent,
                language: navigator.language,
                languages: navigator.languages || [],
                platform: navigator.platform,
                cookieEnabled: navigator.cookieEnabled,
                doNotTrack: navigator.doNotTrack,

                // Screen info
                screen: {
                    width: window.screen.width,
                    height: window.screen.height,
                    availWidth: window.screen.availWidth,
                    availHeight: window.screen.availHeight,
                    colorDepth: window.screen.colorDepth,
                    pixelDepth: window.screen.pixelDepth,
                    orientation: window.screen.orientation?.type || 'unknown'
                },

                // Window info
                window: {
                    innerWidth: window.innerWidth,
                    innerHeight: window.innerHeight,
                    outerWidth: window.outerWidth,
                    outerHeight: window.outerHeight,
                    devicePixelRatio: window.devicePixelRatio || 1
                },

                // Timezone
                timezone: {
                    offset: new Date().getTimezoneOffset(),
                    name: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    dst: this.detectDST()
                },

                // Hardware info
                hardware: {
                    cores: navigator.hardwareConcurrency || 'unknown',
                    memory: navigator.deviceMemory || 'unknown',
                    maxTouchPoints: navigator.maxTouchPoints || 0
                },

                // WebRTC info
                webrtc: await this.getWebRTCInfo(),

                // Canvas fingerprint
                canvas: await this.getCanvasFingerprint(),

                // WebGL fingerprint
                webgl: await this.getWebGLFingerprint(),

                // Audio fingerprint
                audio: await this.getAudioFingerprint(),

                // Font detection
                fonts: await this.detectFonts(),

                // Plugin detection
                plugins: this.detectPlugins(),

                // Network info
                network: await this.getNetworkInfo(),

                // Storage info
                storage: {
                    localStorage: this.checkStorage('localStorage'),
                    sessionStorage: this.checkStorage('sessionStorage'),
                    indexedDB: 'indexedDB' in window,
                    webSQL: 'openDatabase' in window
                },

                // Feature detection
                features: {
                    webgl: !!window.WebGLRenderingContext,
                    webgl2: !!window.WebGL2RenderingContext,
                    flash: this.detectFlash(),
                    java: navigator.javaEnabled(),
                    silverlight: this.detectSilverlight(),
                    activeX: !!window.ActiveXObject
                },

                // Behavior analysis
                behavior: {
                    mouseSpeed: this.calculateMouseSpeed(),
                    typingPattern: this.analyzeTypingPattern(),
                    scrollBehavior: this.analyzeScrollBehavior()
                },

                // Security settings
                security: {
                    adBlocker: this.detectAdBlocker(),
                    trackingProtection: this.detectTrackingProtection(),
                    privateMode: this.detectPrivateMode()
                },

                // Timestamp
                timestamp: Date.now()
            };

            // Generate hash
            fp.hash = this.generateHash(fp);
            
            this.fingerprint = fp;
            return fp;
        } catch (error) {
            console.error('Fingerprinting error:', error);
            return null;
        } finally {
            this.isGenerating = false;
        }
    }

    // Get WebRTC information
    async getWebRTCInfo() {
        try {
            const data = {
                supported: !!window.RTCPeerConnection || !!window.webkitRTCPeerConnection,
                ips: []
            };

            if (data.supported) {
                const pc = new RTCPeerConnection({iceServers: []});
                
                // Create offer to get local IP
                pc.createDataChannel('');
                
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                
                // Wait for ICE candidates
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const candidates = pc.localDescription.sdp.split('\n');
                for (const line of candidates) {
                    if (line.includes('a=candidate:') && line.includes('typ:host')) {
                        const parts = line.split(' ');
                        const ip = parts[4];
                        if (ip && !data.ips.includes(ip)) {
                            data.ips.push(ip);
                        }
                    }
                }
                
                pc.close();
            }
            
            return data;
        } catch (error) {
            return { supported: false, error: error.message };
        }
    }

    // Canvas fingerprinting
    async getCanvasFingerprint() {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = 200;
            canvas.height = 50;
            
            // Draw text with various styles
            ctx.textBaseline = 'top';
            ctx.font = '14px Arial';
            ctx.fillStyle = '#f60';
            ctx.fillRect(2, 2, 100, 20);
            ctx.fillStyle = '#069';
            ctx.fillText('Canvas fingerprint 🎨', 2, 15);
            ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
            ctx.fillText('Canvas fingerprint 🎨', 4, 17);
            
            const dataURL = canvas.toDataURL();
            return {
                data: dataURL.substring(0, 100), // Truncate for storage
                hash: this.simpleHash(dataURL)
            };
        } catch (error) {
            return { error: error.message };
        }
    }

    // WebGL fingerprinting
    async getWebGLFingerprint() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            
            if (!gl) {
                return { supported: false };
            }
            
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            
            return {
                supported: true,
                vendor: gl.getParameter(gl.VENDOR),
                renderer: gl.getParameter(gl.RENDERER),
                unmaskedVendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'hidden',
                unmaskedRenderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'hidden',
                version: gl.getParameter(gl.VERSION),
                shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
                extensions: gl.getSupportedExtensions()
            };
        } catch (error) {
            return { supported: false, error: error.message };
        }
    }

    // Audio fingerprinting
    async getAudioFingerprint() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) {
                return { supported: false };
            }
            
            const context = new AudioContext();
            const oscillator = context.createOscillator();
            const analyser = context.createAnalyser();
            const gain = context.createGain();
            const scriptProcessor = context.createScriptProcessor(256, 1, 1);
            
            oscillator.connect(analyser);
            analyser.connect(scriptProcessor);
            scriptProcessor.connect(gain);
            gain.connect(context.destination);
            
            oscillator.start(0);
            
            return new Promise((resolve) => {
                setTimeout(() => {
                    const frequencyData = new Uint8Array(analyser.frequencyBinCount);
                    analyser.getByteFrequencyData(frequencyData);
                    
                    oscillator.stop();
                    context.close();
                    
                    resolve({
                        supported: true,
                        hash: this.simpleHash(Array.from(frequencyData).join(','))
                    });
                }, 100);
            });
        } catch (error) {
            return { supported: false, error: error.message };
        }
    }

    // Font detection
    async detectFonts() {
        const testFonts = [
            'Arial', 'Verdana', 'Times New Roman', 'Courier New', 'Georgia',
            'Palatino', 'Garamond', 'Comic Sans MS', 'Trebuchet MS', 'Arial Black',
            'Impact', 'Lucida Console', 'Tahoma', 'Lucida Sans Unicode', 'MS Sans Serif',
            'MS Serif', 'Helvetica', 'Geneva', 'Courier', 'Monaco', 'Optima'
        ];
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const baseText = 'mmmmmmmmmmlli';
        const baseSize = '72px';
        
        const detected = [];
        
        for (const font of testFonts) {
            ctx.font = baseSize + ' ' + font;
            const width = ctx.measureText(baseText).width;
            
            // Test with monospace fallback
            ctx.font = baseSize + ' monospace';
            const monospaceWidth = ctx.measureText(baseText).width;
            
            if (width !== monospaceWidth) {
                detected.push(font);
            }
        }
        
        return detected;
    }

    // Plugin detection
    detectPlugins() {
        const plugins = [];
        
        if (navigator.plugins) {
            for (let i = 0; i < navigator.plugins.length; i++) {
                const plugin = navigator.plugins[i];
                plugins.push({
                    name: plugin.name,
                    description: plugin.description,
                    filename: plugin.filename,
                    version: plugin.version
                });
            }
        }
        
        return plugins;
    }

    // Network information
    async getNetworkInfo() {
        try {
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            
            const info = {
                online: navigator.onLine,
                connection: null
            };
            
            if (connection) {
                info.connection = {
                    effectiveType: connection.effectiveType,
                    downlink: connection.downlink,
                    rtt: connection.rtt,
                    saveData: connection.saveData
                };
            }
            
            return info;
        } catch (error) {
            return { online: navigator.onLine, error: error.message };
        }
    }

    // Storage check
    checkStorage(type) {
        try {
            const storage = window[type];
            const key = 'test_' + Date.now();
            storage.setItem(key, 'test');
            storage.removeItem(key);
            return true;
        } catch (error) {
            return false;
        }
    }

    // Detect DST (Daylight Saving Time)
    detectDST() {
        const now = new Date();
        const year = now.getFullYear();
        
        // Test dates for DST
        const jan = new Date(year, 0, 1);
        const jul = new Date(year, 6, 1);
        
        const janOffset = jan.getTimezoneOffset();
        const julOffset = jul.getTimezoneOffset();
        
        return janOffset !== julOffset;
    }

    // Detect Flash
    detectFlash() {
        try {
            if (navigator.plugins) {
                for (let i = 0; i < navigator.plugins.length; i++) {
                    if (navigator.plugins[i].name.toLowerCase().includes('flash')) {
                        return true;
                    }
                }
            }
            
            if (typeof window.ActiveXObject !== 'undefined') {
                try {
                    new window.ActiveXObject('ShockwaveFlash.ShockwaveFlash');
                    return true;
                } catch (error) {
                    return false;
                }
            }
            
            return false;
        } catch (error) {
            return false;
        }
    }

    // Detect Silverlight
    detectSilverlight() {
        try {
            if (typeof window.ActiveXObject !== 'undefined') {
                try {
                    new window.ActiveXObject('AgControl.AgControl');
                    return true;
                } catch (error) {
                    return false;
                }
            }
            
            if (navigator.plugins) {
                for (let i = 0; i < navigator.plugins.length; i++) {
                    if (navigator.plugins[i].name.toLowerCase().includes('silverlight')) {
                        return true;
                    }
                }
            }
            
            return false;
        } catch (error) {
            return false;
        }
    }

    // Detect Ad Blocker
    detectAdBlocker() {
        try {
            const testAd = document.createElement('div');
            testAd.innerHTML = '&nbsp;';
            testAd.className = 'adsbox pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad';
            testAd.style.cssText = 'position: absolute; top: -10px; left: -10px; visibility: hidden;';
            
            document.body.appendChild(testAd);
            
            setTimeout(() => {
                document.body.removeChild(testAd);
            }, 100);
            
            return testAd.offsetHeight === 0;
        } catch (error) {
            return false;
        }
    }

    // Detect Tracking Protection
    detectTrackingProtection() {
        try {
            // Test if tracking protection is enabled
            const testTracker = document.createElement('img');
            testTracker.src = 'https://www.google-analytics.com/collect?v=1&t=pageview';
            testTracker.style.display = 'none';
            
            document.body.appendChild(testTracker);
            
            setTimeout(() => {
                document.body.removeChild(testTracker);
            }, 100);
            
            // This is a simplified test
            return false;
        } catch (error) {
            return false;
        }
    }

    // Detect Private Mode
    detectPrivateMode() {
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            return false;
        } catch (error) {
            return true;
        }
    }

    // Mouse speed calculation
    calculateMouseSpeed() {
        let mouseEvents = [];
        let lastTime = Date.now();
        
        const handler = (e) => {
            const now = Date.now();
            const speed = Math.sqrt(Math.pow(e.movementX, 2) + Math.pow(e.movementY, 2)) / (now - lastTime);
            mouseEvents.push(speed);
            lastTime = now;
            
            if (mouseEvents.length > 100) {
                mouseEvents.shift();
            }
        };
        
        document.addEventListener('mousemove', handler);
        
        setTimeout(() => {
            document.removeEventListener('mousemove', handler);
        }, 5000);
        
        return {
            average: mouseEvents.reduce((a, b) => a + b, 0) / mouseEvents.length || 0,
            max: Math.max(...mouseEvents) || 0,
            events: mouseEvents.length
        };
    }

    // Typing pattern analysis
    analyzeTypingPattern() {
        let keyEvents = [];
        
        const handler = (e) => {
            keyEvents.push({
                key: e.key,
                timestamp: Date.now()
            });
            
            if (keyEvents.length > 50) {
                keyEvents.shift();
            }
        };
        
        document.addEventListener('keydown', handler);
        
        setTimeout(() => {
            document.removeEventListener('keydown', handler);
        }, 10000);
        
        // Calculate typing speed and rhythm
        const intervals = [];
        for (let i = 1; i < keyEvents.length; i++) {
            intervals.push(keyEvents[i].timestamp - keyEvents[i-1].timestamp);
        }
        
        return {
            averageInterval: intervals.reduce((a, b) => a + b, 0) / intervals.length || 0,
            keysPerMinute: keyEvents.length > 0 ? (keyEvents.length / 10) * 60 : 0,
            rhythm: intervals.length > 0 ? intervals.reduce((a, b) => a + Math.abs(b - intervals[0]), 0) / intervals.length : 0
        };
    }

    // Scroll behavior analysis
    analyzeScrollBehavior() {
        let scrollEvents = [];
        
        const handler = () => {
            scrollEvents.push({
                x: window.scrollX,
                y: window.scrollY,
                timestamp: Date.now()
            });
            
            if (scrollEvents.length > 100) {
                scrollEvents.shift();
            }
        };
        
        window.addEventListener('scroll', handler);
        
        setTimeout(() => {
            window.removeEventListener('scroll', handler);
        }, 5000);
        
        return {
            totalScrolls: scrollEvents.length,
            averageSpeed: scrollEvents.length > 1 ? 
                Math.abs(scrollEvents[scrollEvents.length-1].y - scrollEvents[0].y) / 5000 : 0,
            smoothness: scrollEvents.length > 1 ? 
                this.calculateSmoothness(scrollEvents) : 0
        };
    }

    // Calculate scroll smoothness
    calculateSmoothness(events) {
        if (events.length < 3) return 0;
        
        let totalVariation = 0;
        for (let i = 1; i < events.length - 1; i++) {
            const prev = events[i-1].y;
            const curr = events[i].y;
            const next = events[i+1].y;
            
            const expected = (prev + next) / 2;
            totalVariation += Math.abs(curr - expected);
        }
        
        return totalVariation / (events.length - 2);
    }

    // Generate hash from fingerprint data
    generateHash(data) {
        const str = JSON.stringify(data);
        return this.simpleHash(str);
    }

    // Simple hash function
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString(36);
    }

    // Get current fingerprint
    getFingerprint() {
        return this.fingerprint;
    }

    // Reset fingerprint
    reset() {
        this.fingerprint = null;
        this.isGenerating = false;
    }
}

// Export singleton instance
const fingerprintingService = new FingerprintingService();
export default fingerprintingService;

// Make available globally for testing
window.fingerprintingService = fingerprintingService;
window.testFingerprinting = async () => {
    console.log('🔍 Generating fingerprint...');
    const fp = await fingerprintingService.generateFingerprint();
    console.log('📊 Fingerprint result:', fp);
    return fp;
};
