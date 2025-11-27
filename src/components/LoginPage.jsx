import React, {useEffect, useState} from 'react';
import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBCardHeader,
    MDBInput,
    MDBCheckbox,
    MDBIcon,
    MDBSpinner
} from 'mdb-react-ui-kit';
import { getAccounts } from "../api/Accounts";
import {showAlert} from "../service/AlertServices";
import {useNavigate, Link} from "react-router-dom";
import bcrypt from 'bcryptjs';
import TurnstileWidget from './TurnstileWidget';
import AuthService from "../service/AuthService";


function LoginPage() {
    const [accounts, setAccounts] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState({});
    const [turnstileToken, setTurnstileToken] = useState('');
    const [turnstileResetKey, setTurnstileResetKey] = useState(0);
    const nav = useNavigate();

    // Lấy dữ liệu accounts từ API
    useEffect(() => {
        async function fetchData() {
            const data = await getAccounts();
            setAccounts(data);
        }
        fetchData();
    }, []);

    // Load saved username nếu có
    useEffect(() => {
        const savedUsername = localStorage.getItem("savedUsername");
        const rememberMeStatus = localStorage.getItem("rememberMe");
        if (savedUsername && rememberMeStatus === "true") {
            setUsername(savedUsername);
            setRememberMe(true);
        }
    }, []);


    const validateForm = () => {
        const newErrors = {};
        
        if (!username.trim()) {
            newErrors.username = 'Vui lòng nhập tên đăng nhập';
        }
        
        if (!turnstileToken) {
            newErrors.turnstile = 'Vui lòng xác minh bạn không phải là robot';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        if (!validateForm()) {
            return;
        }

        // Rate limiting check
        try {
            AuthService.canAttemptLogin();
        } catch (error) {
            showAlert(error.message, "error");
            return;
        }

        setIsLoading(true);
        
        try {
            // Tìm tài khoản theo username
            const found = accounts.find(acc => acc.username === username);
            if (!found) {
                AuthService.recordLoginAttempt(false);
                showAlert("Sai tài khoản hoặc mật khẩu", "error");
                setTurnstileToken('');
                setTurnstileResetKey(prev => prev + 1);
                return;
            }

            if (!found.status) {
                AuthService.recordLoginAttempt(false);
                showAlert("Tài khoản đã bị cấm, vui lòng liên hệ quản trị viên!", "danger");
                setTurnstileToken('');
                setTurnstileResetKey(prev => prev + 1);
                return;
            }

            if (found.isApprove === false) {
                AuthService.recordLoginAttempt(false);
                showAlert("Tài khoản của bạn chưa được admin duyệt. Vui lòng chờ phê duyệt hoặc liên hệ quản trị viên!", "warning");
                setTurnstileToken('');
                setTurnstileResetKey(prev => prev + 1);
                return;
            }

            const isPasswordCorrect = await bcrypt.compare(password, found.password);
            if (isPasswordCorrect) {
                // Record successful login attempt
                AuthService.recordLoginAttempt(true);
                
                // Create secure session
                AuthService.generateSessionToken(found);
                
                showAlert("Đăng nhập thành công", "success");
                
                // Update old localStorage for compatibility
                localStorage.setItem("user", JSON.stringify(found));
                localStorage.setItem("authenticated", "true");
                
                if (rememberMe) {
                    localStorage.setItem("rememberMe", "true");
                    localStorage.setItem("savedUsername", username);
                } else {
                    localStorage.removeItem("rememberMe");
                    localStorage.removeItem("savedUsername");
                }
                
                // Dispatch custom event to update Menu component
                window.dispatchEvent(new CustomEvent('userUpdated'));
                
                nav('/');
            } else {
                AuthService.recordLoginAttempt(false);
                showAlert("Sai tài khoản hoặc mật khẩu", "error");
                setTurnstileToken('');
                setTurnstileResetKey(prev => prev + 1);
            }
        } catch (error) {
            AuthService.recordLoginAttempt(false);
            showAlert("Có lỗi xảy ra khi đăng nhập", "error");
            setTurnstileToken('');
            setTurnstileResetKey(prev => prev + 1);
        } finally {
            setIsLoading(false);
        }
    };

    // Xử lý phím Enter
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };


    return (
        <div className="min-vh-100 d-flex align-items-center" style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '20px 0'
        }}>
            <MDBContainer fluid className="px-3">
                {/* Header với nút về home */}
                <div className="text-center mb-4">
                    <Link to="/" className="text-decoration-none">
                        <MDBBtn
                            color="light"
                            className="d-inline-flex align-items-center shadow-sm"
                            style={{
                                borderRadius: '25px',
                                padding: '10px 25px',
                                fontWeight: '600',
                                transition: 'all 0.3s ease',
                                border: 'none'
                            }}
                        >
                            <MDBIcon fas icon="home" className="me-2" />
                            Về Trang Chủ
                        </MDBBtn>
                    </Link>
                </div>

                <MDBRow className="justify-content-center">
                    <MDBCol xs="12" sm="10" md="8" lg="6" xl="5">
                        <MDBCard className="shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                            {/* Card Header */}
                            <MDBCardHeader 
                                className="text-center py-4" 
                                style={{ 
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    border: 'none'
                                }}
                            >
                                <MDBIcon icon="user-circle" size="3x" className="text-white mb-3" />
                                <h2 className="text-white mb-0 fw-bold">Đăng Nhập</h2>
                                <p className="text-white-50 mb-0">Chào mừng bạn quay trở lại!</p>
                            </MDBCardHeader>

                            <MDBCardBody className="p-4 p-md-5">
                                {/* Form */}
                                <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                                    {/* Username Field */}
                                    <div className="mb-4">
                                        <label className="form-label fw-bold text-dark">
                                            <MDBIcon icon="user" className="me-2 text-primary" />
                                            Tên đăng nhập
                                        </label>
                                        <MDBInput
                                            wrapperClass='mb-2'
                                            id='username'
                                            type='text'
                                            value={username}
                                            onChange={(e) => {
                                                setUsername(e.target.value);
                                                if (errors.username) {
                                                    setErrors({...errors, username: ''});
                                                }
                                            }}
                                            onKeyPress={handleKeyPress}
                                            placeholder="Nhập tên đăng nhập của bạn..."
                                            className={errors.username ? 'is-invalid' : ''}
                                        />
                                        {errors.username && (
                                            <div className="text-danger small">
                                                <MDBIcon icon="exclamation-triangle" className="me-1" />
                                                {errors.username}
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Password Field */}
                                    <div className="mb-4">
                                        <label className="form-label fw-bold text-dark">
                                            <MDBIcon icon="lock" className="me-2 text-primary" />
                                            Mật khẩu
                                        </label>
                                        <div className="position-relative">
                                            <MDBInput
                                                wrapperClass='mb-2'
                                                id='password'
                                                type={showPassword ? 'text' : 'password'}
                                                value={password}
                                                onChange={(e) => {
                                                    setPassword(e.target.value);
                                                    if (errors.password) {
                                                        setErrors({...errors, password: ''});
                                                    }
                                                }}
                                                onKeyPress={handleKeyPress}
                                                placeholder="Nhập mật khẩu của bạn..."
                                                className={errors.password ? 'is-invalid' : ''}
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-link position-absolute"
                                                style={{
                                                    right: '15px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    border: 'none',
                                                    background: 'none',
                                                    padding: '0',
                                                    zIndex: '10',
                                                    color: '#6c757d'
                                                }}
                                                onClick={togglePasswordVisibility}
                                            >
                                                <MDBIcon 
                                                    icon={showPassword ? 'eye-slash' : 'eye'} 
                                                    size="lg"
                                                />
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <div className="text-danger small">
                                                <MDBIcon icon="exclamation-triangle" className="me-1" />
                                                {errors.password}
                                            </div>
                                        )}
                                    </div>

                                    {/* Remember Me */}
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <MDBCheckbox 
                                            name='rememberMe' 
                                            id='rememberMe' 
                                            label='Ghi nhớ đăng nhập'
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                        />
                                        <Link to="#" className="text-decoration-none text-primary small">
                                            Quên mật khẩu?
                                        </Link>
                                    </div>

                                    {/* Turnstile Verification */}
                                    <div className="mb-4">
                                        <TurnstileWidget 
                                            onVerify={(token) => setTurnstileToken(token)}
                                            onExpire={() => {
                                                setTurnstileToken('');
                                                setErrors({...errors, turnstile: 'Phiên xác minh đã hết hạn, vui lòng thử lại'});
                                            }}
                                            onError={() => {
                                                setTurnstileToken('');
                                                setErrors({...errors, turnstile: 'Lỗi xác minh, vui lòng thử lại'});
                                            }}
                                            resetKey={turnstileResetKey}
                                        />
                                        {errors.turnstile && (
                                            <div className="text-danger small mt-2">
                                                <MDBIcon icon="exclamation-triangle" className="me-1" />
                                                {errors.turnstile}
                                            </div>
                                        )}
                                    </div>

                                    {/* Login Button */}
                                    <MDBBtn 
                                        className='w-100 mb-4 py-3' 
                                        size='lg' 
                                        onClick={handleLogin}
                                        disabled={isLoading}
                                        style={{ borderRadius: '10px', fontWeight: '600' }}
                                    >
                                        {isLoading ? (
                                            <>
                                                <MDBSpinner size="sm" className="me-2" />
                                                Đang đăng nhập...
                                            </>
                                        ) : (
                                            <>
                                                <MDBIcon icon="sign-in-alt" className="me-2" />
                                                Đăng Nhập
                                            </>
                                        )}
                                    </MDBBtn>
                                </form>

                                {/* Divider */}
                                {/* <div className="text-center mb-4">
                                    <hr className="my-3" />
                                    <span className="text-muted small bg-white px-3">Hoặc</span>
                                </div> */}

                                {/* Social Login */}
                                {/* <div className="text-center mb-4">
                                    <p className="text-muted small mb-3">Đăng nhập bằng tài khoản xã hội</p>
                                    <div className="d-flex justify-content-center gap-3">
                                        <MDBBtn 
                                            tag='a' 
                                            color='light' 
                                            className='rounded-circle shadow-sm'
                                            style={{ width: '45px', height: '45px', padding: '0' }}
                                        >
                                            <MDBIcon fab icon='google' style={{color: '#db4437'}}/>
                                        </MDBBtn>
                                        <MDBBtn 
                                            tag='a' 
                                            color='light' 
                                            className='rounded-circle shadow-sm'
                                            style={{ width: '45px', height: '45px', padding: '0' }}
                                        >
                                            <MDBIcon fab icon='facebook-f' style={{color: '#3b5998'}}/>
                                        </MDBBtn>
                                        <MDBBtn 
                                            tag='a' 
                                            color='light' 
                                            className='rounded-circle shadow-sm'
                                            style={{ width: '45px', height: '45px', padding: '0' }}
                                        >
                                            <MDBIcon fab icon='github' style={{color: '#333'}}/>
                                        </MDBBtn>
                                    </div>
                                </div> */}

                                {/* Register Link */}
                                <div className="text-center">
                                    <p className="text-muted mb-0">
                                        Chưa có tài khoản? 
                                        <Link to="/register" className="text-primary text-decoration-none fw-bold ms-1">
                                            Đăng ký ngay
                                        </Link>
                                    </p>
                                </div>
                            </MDBCardBody>
                        </MDBCard>

                        {/* Features Card */}
                        <MDBCard className="mt-4 shadow-sm" style={{ borderRadius: '15px' }}>
                            <MDBCardBody className="p-4">
                                <h5 className="text-center text-primary mb-3">
                                    <MDBIcon icon="star" className="me-2" />
                                    Tính năng nổi bật
                                </h5>
                                <MDBRow>
                                    <MDBCol md="4" className="text-center mb-3">
                                        <MDBIcon icon="images" size="2x" className="text-primary mb-2" />
                                        <h6 className="text-dark">Tạo ảnh hàng loạt</h6>
                                        <small className="text-muted">Tạo nhiều ảnh cùng lúc</small>
                                    </MDBCol>
                                    <MDBCol md="4" className="text-center mb-3">
                                        <MDBIcon icon="download" size="2x" className="text-success mb-2" />
                                        <h6 className="text-dark">Tải xuống nhanh</h6>
                                        <small className="text-muted">Hỗ trợ nhiều định dạng</small>
                                    </MDBCol>
                                    <MDBCol md="4" className="text-center mb-3">
                                        <MDBIcon icon="mobile-alt" size="2x" className="text-info mb-2" />
                                        <h6 className="text-dark">Responsive</h6>
                                        <small className="text-muted">Hoạt động mọi thiết bị</small>
                                    </MDBCol>
                                </MDBRow>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </div>
    );
}

export default LoginPage;
