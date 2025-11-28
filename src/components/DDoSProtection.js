import React, { useState, useEffect } from 'react';
import { MDBSpinner, MDBContainer, MDBRow, MDBCol, MDBBtn } from 'mdb-react-ui-kit';
import ReCAPTCHAWidget from './ReCAPTCHAWidget';
import { useNavigate } from 'react-router-dom';
import Honeypot from './Honeypot';
import { showAlert } from '../service/AlertServices';

const DDoSProtection = ({ children, onVerified }) => {
    const [isVerified, setIsVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [recaptchaToken, setRecaptchaToken] = useState('');
    const [recaptchaResetKey, setRecaptchaResetKey] = useState(0);
    const [verificationStatus, setVerificationStatus] = useState(''); // 'success', 'error', ''
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user already verified in this session
        const verified = sessionStorage.getItem('ddos_verified');
        const verifyTime = sessionStorage.getItem('ddos_verify_time');
        
        if (verified && verifyTime) {
            const timeDiff = Date.now() - parseInt(verifyTime);
            // Valid for 1 hour
            if (timeDiff < 60 * 60 * 1000) {
                setIsVerified(true);
                setIsLoading(false);
                if (onVerified) onVerified();
                return;
            }
        }
        
        setIsLoading(false);
    }, [onVerified]);

    const handleRecaptchaVerify = (token) => {
        console.log('reCAPTCHA verified with token:', token);
        setRecaptchaToken(token);
        setVerificationStatus('success');
        // Mark as verified for 1 hour
        sessionStorage.setItem('ddos_verified', 'true');
        sessionStorage.setItem('ddos_verify_time', Date.now().toString());
        setIsVerified(true);
        if (onVerified) onVerified();
        
        // Show success alert
        try {
            showAlert('Xác minh bảo mật thành công! Bạn có thể truy cập trang web.', 'success');
            console.log('Success alert sent for DDoS verification');
        } catch (error) {
            console.error('Error showing alert:', error);
            // Fallback: use browser alert
            window.alert('Xác minh bảo mật thành công! Bạn có thể truy cập trang web.');
        }

        // Auto navigate to home after 2 seconds
        setTimeout(() => {
            console.log('Auto navigating to home...');
            navigate('/');
        }, 2000);
    };

    const handleRecaptchaError = () => {
        console.log('reCAPTCHA error occurred');
        setRecaptchaToken('');
        setVerificationStatus('error');
        setRecaptchaResetKey(prev => prev + 1);
        
        // Show error alert
        try {
            showAlert('Xác minh bảo mật thất bại! Vui lòng thử lại.', 'error');
        } catch (error) {
            console.error('Error showing error alert:', error);
            // Fallback: use browser alert
            window.alert('Xác minh bảo mật thất bại! Vui lòng thử lại.');
        }
    };

    const handleRecaptchaExpire = () => {
        console.log('reCAPTCHA expired');
        setRecaptchaToken('');
        setVerificationStatus('error');
        setRecaptchaResetKey(prev => prev + 1);
        
        // Show expired alert
        try {
            showAlert('Phiên xác minh đã hết hạn! Vui lòng thử lại.', 'warning');
        } catch (error) {
            console.error('Error showing expired alert:', error);
            // Fallback: use browser alert
            window.alert('Phiên xác minh đã hết hạn! Vui lòng thử lại.');
        }
    };

    const handleGoToHome = () => {
        navigate('/');
    };

    if (isLoading) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center" 
                 style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <MDBContainer>
                    <MDBRow className="justify-content-center">
                        <MDBCol className="text-center">
                            <MDBSpinner color="light" size="lg" />
                            <p className="text-white mt-3">Đang kiểm tra bảo mật...</p>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </div>
        );
    }

    if (!isVerified) {
        return (
            <>
                <Honeypot onBotDetected={(info) => {
                    // console.log('Bot detected in DDoS protection:', info);
                    // Could block access or add extra verification
                }} />
                <div className="min-vh-100 d-flex align-items-center justify-content-center" 
                     style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <MDBContainer>
                        <MDBRow className="justify-content-center">
                            <MDBCol xs="12" md="8" lg="6">
                                <div className="bg-white rounded-3 shadow-lg p-4 p-md-5 text-center">
                                    <h3 className="mb-4 fw-bold text-dark">
                                        <i className="fas fa-shield-alt text-primary me-2"></i>
                                        Xác Minh Bảo Mật
                                    </h3>
                                    <p className="text-muted mb-4">
                                        Vui lòng xác minh bạn không phải là robot để tiếp tục truy cập
                                    </p>
                                    
                                    <div className="mb-4">
                                        <div style={{ minHeight: '78px', width: '304px', margin: '0 auto' }}>
                                            <ReCAPTCHAWidget 
                                                onVerify={handleRecaptchaVerify}
                                                onExpire={handleRecaptchaExpire}
                                                onError={handleRecaptchaError}
                                                resetKey={recaptchaResetKey}
                                            />
                                        </div>
                                    </div>
                                    
                                    {verificationStatus === 'success' && (
                                        <div className="alert alert-success mb-4">
                                            <i className="fas fa-check-circle me-2"></i>
                                            Xác minh thành công! Token: {recaptchaToken.substring(0, 20)}...
                                        </div>
                                    )}
                                    
                                    {verificationStatus === 'error' && (
                                        <div className="alert alert-danger mb-4">
                                            <i className="fas fa-exclamation-triangle me-2"></i>
                                            Xác minh thất bại! Vui lòng thử lại.
                                        </div>
                                    )}
                                    
                                    {/* <MDBBtn 
                                        color={recaptchaToken ? "success" : "secondary"} 
                                        size="lg" 
                                        onClick={recaptchaToken ? handleGoToHome : undefined}
                                        className="w-100"
                                        disabled={!recaptchaToken}
                                    >
                                        <i className="fas fa-home me-2"></i>
                                        {recaptchaToken ? "Về Trang Chủ" : "Chờ Xác Minh..."}
                                    </MDBBtn> */}
                                    
                                    <small className="text-muted">
                                        <i className="fas fa-info-circle me-1"></i>
                                        Bảo vệ này giúp ngăn chặn tấn công <span className='text-danger fw-bold'>Tú Nguyễn</span> và đồng bọn .
                                    </small>
                                </div>
                            </MDBCol>
                        </MDBRow>
                    </MDBContainer>
                </div>
            </>
        );
    }

    return (
        <>
            <Honeypot onBotDetected={(info) => {
                console.log('Bot detected in protected content:', info);
            }} />
            {children}
        </>
    );
};

export default DDoSProtection;
