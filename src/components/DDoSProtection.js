import React, { useState, useEffect } from 'react';
import { MDBSpinner, MDBContainer, MDBRow, MDBCol, MDBBtn } from 'mdb-react-ui-kit';
import TurnstileWidget from './TurnstileWidget';
import { useNavigate } from 'react-router-dom';
import Honeypot from './Honeypot';

const DDoSProtection = ({ children, onVerified }) => {
    const [isVerified, setIsVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [turnstileToken, setTurnstileToken] = useState('');
    const [turnstileResetKey, setTurnstileResetKey] = useState(0);
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

    const handleTurnstileVerify = (token) => {
        console.log('Turnstile verified with token:', token);
        setTurnstileToken(token);
        // Mark as verified for 1 hour
        sessionStorage.setItem('ddos_verified', 'true');
        sessionStorage.setItem('ddos_verify_time', Date.now().toString());
        setIsVerified(true);
        if (onVerified) onVerified();
    };

    const handleGoToHome = () => {
        navigate('/');
    };

    const handleTurnstileError = () => {
        setTurnstileToken('');
        setTurnstileResetKey(prev => prev + 1);
    };

    const handleTurnstileExpire = () => {
        setTurnstileToken('');
        setTurnstileResetKey(prev => prev + 1);
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
                    console.log('Bot detected in DDoS protection:', info);
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
                                        <div style={{ minHeight: '65px' }}>
                                            <TurnstileWidget 
                                                onVerify={handleTurnstileVerify}
                                                onExpire={handleTurnstileExpire}
                                                onError={handleTurnstileError}
                                                resetKey={turnstileResetKey}
                                            />
                                        </div>
                                    </div>
                                    
                                    {turnstileToken && (
                                        <div className="alert alert-success mb-4">
                                            <i className="fas fa-check-circle me-2"></i>
                                            Xác minh thành công! Token: {turnstileToken.substring(0, 20)}...
                                        </div>
                                    )}
                                    
                                    <MDBBtn 
                                        color={turnstileToken ? "success" : "secondary"} 
                                        size="lg" 
                                        onClick={turnstileToken ? handleGoToHome : undefined}
                                        className="w-100"
                                        disabled={!turnstileToken}
                                    >
                                        <i className="fas fa-home me-2"></i>
                                        {turnstileToken ? "Về Trang Chủ" : "Chờ Xác Minh..."}
                                    </MDBBtn>
                                    
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
