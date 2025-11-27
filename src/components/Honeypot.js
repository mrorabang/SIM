import React, { useState, useEffect } from 'react';
import { showAlert } from '../service/AlertServices';
import attackNotificationService from '../service/AttackNotificationService';

const Honeypot = ({ onBotDetected }) => {
    const [botDetected, setBotDetected] = useState(false);
    const [attackerInfo, setAttackerInfo] = useState({});

    useEffect(() => {
        // 1. Detect if user is too fast (bot behavior)
        const startTime = Date.now();
        
        const detectBot = () => {
            const endTime = Date.now();
            const loadTime = endTime - startTime;
            
            // If page loads in <100ms, likely bot
            if (loadTime < 100) {
                handleBotDetection('ultra_fast_load', { loadTime });
            }
        };

        // Delay detection
        setTimeout(detectBot, 200);

        // 2. Detect mouse movement (humans move mouse)
        let mouseMoved = false;
        const handleMouseMove = () => {
            mouseMoved = true;
        };

        window.addEventListener('mousemove', handleMouseMove);

        // Check if mouse never moved (likely bot)
        setTimeout(() => {
            if (!mouseMoved && !botDetected) {
                handleBotDetection('no_mouse_movement', { mouseEvents: 0 });
            }
        }, 5000);

        // 3. Detect keyboard interaction
        let keyPressed = false;
        const handleKeyPress = () => {
            keyPressed = true;
        };

        window.addEventListener('keypress', handleKeyPress);

        setTimeout(() => {
            if (!keyPressed && !mouseMoved && !botDetected) {
                handleBotDetection('no_interaction', { mouseEvents: 0, keyPresses: 0 });
            }
        }, 10000);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('keypress', handleKeyPress);
        };
    }, []);

    const handleBotDetection = (reason, data) => {
        if (botDetected) return; // Only detect once

        const info = {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            ip: 'client-side', // Real IP needs server-side
            reason,
            data,
            screen: {
                width: window.screen.width,
                height: window.screen.height
            },
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            url: window.location.href,
            referrer: document.referrer
        };

        setAttackerInfo(info);
        setBotDetected(true);

        // Log to console
        console.warn('🐞 BOT DETECTED:', info);

        // Send email notification
        attackNotificationService.sendAttackNotification(info);

        // Show alert
        showAlert(`Bot detected! Reason: ${reason}`, 'warning');

        // Call parent callback
        if (onBotDetected) {
            onBotDetected(info);
        }

        // Store in localStorage for tracking
        const bots = JSON.parse(localStorage.getItem('detected_bots') || '[]');
        bots.push(info);
        localStorage.setItem('detected_bots', JSON.stringify(bots.slice(-10))); // Keep last 10
    };

    // Hidden honeypot field for bots
    const handleHoneypotFocus = () => {
        handleBotDetection('honeypot_focus', { fieldType: 'honeypot' });
    };

    const handleHoneypotInput = () => {
        handleBotDetection('honeypot_input', { fieldType: 'honeypot' });
    };

    if (botDetected) {
        return (
            <div className="alert alert-warning position-fixed top-0 start-50 translate-middle-x mt-3" 
                 style={{ zIndex: 9999, minWidth: '300px' }}>
                <h6 className="alert-heading">
                    <i className="fas fa-robot me-2"></i>
                    Bot Activity Detected
                </h6>
                <small className="d-block">
                    <strong>Reason:</strong> {attackerInfo.reason}<br/>
                    <strong>Time:</strong> {attackerInfo.timestamp}<br/>
                    <strong>User Agent:</strong> {attackerInfo.userAgent?.substring(0, 50)}...
                </small>
                <button 
                    className="btn btn-sm btn-outline-warning mt-2"
                    onClick={() => setBotDetected(false)}
                >
                    Dismiss
                </button>
            </div>
        );
    }

    return (
        <>
            {/* Hidden honeypot field - bots will fill this */}
            <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                <input
                    type="text"
                    name="honeypot"
                    tabIndex="-1"
                    autoComplete="off"
                    onFocus={handleHoneypotFocus}
                    onInput={handleHoneypotInput}
                />
            </div>

            {/* Hidden link for bots */}
            <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                <a href="#honeypot" onClick={() => handleBotDetection('honeypot_link', { element: 'link' })}>
                    Hidden link
                </a>
            </div>

            {/* CSS trap for bots */}
            <style jsx>{`
                .honeypot {
                    position: absolute !important;
                    left: -9999px !important;
                    top: -9999px !important;
                    visibility: hidden !important;
                }
            `}</style>
        </>
    );
};

export default Honeypot;
