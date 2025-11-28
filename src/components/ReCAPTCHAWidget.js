import React, { useEffect, useState, useRef } from 'react';

const ReCAPTCHAWidget = ({ onVerify, onExpire, onError, resetKey }) => {
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [widgetId, setWidgetId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const containerRef = useRef(null);
    const isInitialized = useRef(false);
    const timeoutRef = useRef(null);

    useEffect(() => {
        // Load reCAPTCHA script only once
        if (!window.grecaptchaScriptLoaded) {
            window.grecaptchaScriptLoaded = true;
            
            const script = document.createElement('script');
            script.src = 'https://www.google.com/recaptcha/api.js?render=explicit&hl=vi';
            script.async = true;
            script.defer = true;
            
            script.onload = () => {
                console.log('reCAPTCHA script loaded');
                setIsScriptLoaded(true);
                
                // Wait for grecaptcha to be ready with timeout
                let attempts = 0;
                const maxAttempts = 50; // 5 seconds max
                
                const checkReady = () => {
                    attempts++;
                    if (window.grecaptcha && window.grecaptcha.render) {
                        console.log('reCAPTCHA is ready');
                        setIsReady(true);
                        setIsLoading(false);
                    } else if (attempts < maxAttempts) {
                        setTimeout(checkReady, 100);
                    } else {
                        console.error('reCAPTCHA failed to initialize after timeout');
                        setIsLoading(false);
                        onError && onError();
                    }
                };
                checkReady();
            };
            
            script.onerror = () => {
                console.error('Failed to load reCAPTCHA script');
                setIsLoading(false);
                onError && onError();
            };

            // Set timeout for script loading
            timeoutRef.current = setTimeout(() => {
                if (!window.grecaptcha || !window.grecaptcha.render) {
                    console.error('reCAPTCHA script loading timeout');
                    setIsLoading(false);
                    onError && onError();
                }
            }, 10000); // 10 seconds timeout

            document.head.appendChild(script);
        } else if (window.grecaptcha && window.grecaptcha.render) {
            setIsScriptLoaded(true);
            setIsReady(true);
            setIsLoading(false);
        }

        // Cleanup timeout
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [onError]);

    useEffect(() => {
        if (isReady && window.grecaptcha && window.grecaptcha.render && containerRef.current && !isInitialized.current) {
            renderWidget();
            isInitialized.current = true;
        }

        // Reset when resetKey changes
        if (resetKey > 0 && widgetId && window.grecaptcha && window.grecaptcha.reset) {
            try {
                window.grecaptcha.reset(widgetId);
            } catch (error) {
                console.log('Reset failed, re-rendering...');
                isInitialized.current = false;
                setTimeout(() => {
                    if (isReady) renderWidget();
                }, 100);
            }
        }
    }, [isReady, resetKey]);

    const renderWidget = () => {
        const container = containerRef.current;
        if (!container || !window.grecaptcha || !window.grecaptcha.render) {
            console.log('reCAPTCHA not ready yet');
            return;
        }

        // Clear container
        container.innerHTML = '';

        try {
            const newWidgetId = window.grecaptcha.render(container, {
                sitekey: process.env.REACT_APP_RECAPTCHA_SITE_KEY,
                callback: (token) => {
                    console.log('reCAPTCHA verified with token:', token);
                    onVerify && onVerify(token);
                },
                'expired-callback': () => {
                    console.log('reCAPTCHA expired');
                    onExpire && onExpire();
                },
                'error-callback': () => {
                    console.log('reCAPTCHA error');
                    onError && onError();
                },
                theme: 'light',
                type: 'image',
                size: 'normal'
            });

            setWidgetId(newWidgetId);
            console.log('reCAPTCHA widget rendered with ID:', newWidgetId);
        } catch (error) {
            console.error('Error rendering reCAPTCHA:', error);
            onError && onError();
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (widgetId && window.grecaptcha && window.grecaptcha.reset) {
                try {
                    window.grecaptcha.reset(widgetId);
                } catch (error) {
                    console.log('Cleanup: Failed to reset widget');
                }
            }
        };
    }, [widgetId]);

    return (
        <div className="mb-3">
            <div 
                ref={containerRef}
                style={{ minHeight: '78px', width: '304px', margin: '0 auto' }}
            ></div>
            {isLoading && (
                <div className="text-center text-muted">
                    <small>Đang tải reCAPTCHA...</small>
                </div>
            )}
        </div>
    );
};

export default ReCAPTCHAWidget;
