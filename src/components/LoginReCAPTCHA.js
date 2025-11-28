import React, { useEffect, useState, useRef, useCallback } from 'react';

const LoginReCAPTCHA = ({ onVerify, onExpire, onError, resetKey }) => {
    const [isReady, setIsReady] = useState(false);
    const [widgetId, setWidgetId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const containerRef = useRef(null);
    const isInitialized = useRef(false);
    const timeoutRef = useRef(null);

    // Suppress reCAPTCHA timeout errors globally
    useEffect(() => {
        const originalConsoleError = console.error;
        console.error = (...args) => {
            // Filter out reCAPTCHA timeout errors
            const message = args[0];
            if (typeof message === 'string' && 
                (message.includes('Timeout') || 
                 message.includes('bframe') || 
                 message.includes('recaptcha'))) {
                return; // Suppress reCAPTCHA timeout errors
            }
            originalConsoleError.apply(console, args);
        };

        // Suppress unhandled promise rejections for reCAPTCHA
        const originalOnUnhandledRejection = window.onunhandledrejection;
        window.onunhandledrejection = (event) => {
            if (event.reason && 
                (event.reason.message?.includes('Timeout') || 
                 event.reason.toString().includes('recaptcha'))) {
                event.preventDefault(); // Suppress reCAPTCHA timeout rejections
                return;
            }
            if (originalOnUnhandledRejection) {
                originalOnUnhandledRejection(event);
            }
        };

        return () => {
            console.error = originalConsoleError;
            window.onunhandledrejection = originalOnUnhandledRejection;
        };
    }, []);

    const renderWidget = useCallback(() => {
        const container = containerRef.current;
        if (!container || !window.grecaptcha || !window.grecaptcha.render) {
            console.log('Login reCAPTCHA not ready yet');
            return;
        }

        // Clear container
        container.innerHTML = '';

        try {
            const newWidgetId = window.grecaptcha.render(container, {
                sitekey: process.env.REACT_APP_RECAPTCHA_SITE_KEY,
                callback: (token) => {
                    console.log('Login reCAPTCHA verified with token:', token);
                    onVerify && onVerify(token);
                },
                'expired-callback': () => {
                    console.log('Login reCAPTCHA expired');
                    onExpire && onExpire();
                },
                'error-callback': () => {
                    console.log('Login reCAPTCHA error');
                    onError && onError();
                },
                theme: 'light',
                type: 'image',
                size: 'normal'
            });

            setWidgetId(newWidgetId);
            console.log('Login reCAPTCHA widget rendered with ID:', newWidgetId);
        } catch (error) {
            console.error('Error rendering login reCAPTCHA:', error);
            onError && onError();
        }
    }, [onVerify, onExpire, onError]);

    useEffect(() => {
        // Load reCAPTCHA script only once for login
        if (!window.loginRecaptchaScriptLoaded) {
            window.loginRecaptchaScriptLoaded = true;
            
            const script = document.createElement('script');
            script.src = 'https://www.google.com/recaptcha/api.js?render=explicit&hl=vi';
            script.async = true;
            script.defer = true;
            
            script.onload = () => {
                console.log('Login reCAPTCHA script loaded');
                
                // Wait for grecaptcha to be ready with timeout
                let attempts = 0;
                const maxAttempts = 50; // 5 seconds max
                
                const checkReady = () => {
                    attempts++;
                    if (window.grecaptcha && window.grecaptcha.render) {
                        console.log('Login reCAPTCHA is ready');
                        setIsReady(true);
                        setIsLoading(false);
                    } else if (attempts < maxAttempts) {
                        setTimeout(checkReady, 100);
                    } else {
                        console.error('Login reCAPTCHA failed to initialize after timeout');
                        setIsLoading(false);
                        // Don't call onError for timeout - just hide loading
                    }
                };
                checkReady();
            };
            
            script.onerror = () => {
                console.error('Failed to load login reCAPTCHA script');
                setIsLoading(false);
                onError && onError();
            };

            // Set timeout for script loading
            timeoutRef.current = setTimeout(() => {
                if (!window.grecaptcha || !window.grecaptcha.render) {
                    console.error('Login reCAPTCHA script loading timeout');
                    setIsLoading(false);
                    // Don't call onError for timeout - just hide loading
                }
            }, 10000); // 10 seconds timeout

            document.head.appendChild(script);
        } else if (window.grecaptcha && window.grecaptcha.render) {
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
                console.log('Login reset failed, re-rendering...');
                isInitialized.current = false;
                setTimeout(() => {
                    if (isReady) renderWidget();
                }, 100);
            }
        }
    }, [isReady, resetKey, widgetId, renderWidget]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (widgetId && window.grecaptcha && window.grecaptcha.reset) {
                try {
                    window.grecaptcha.reset(widgetId);
                } catch (error) {
                    console.log('Login cleanup: Failed to reset widget');
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
                    <small>Đang tải xác minh...</small>
                </div>
            )}
        </div>
    );
};

export default LoginReCAPTCHA;
