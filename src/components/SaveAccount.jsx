import React, { useState } from 'react';
import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBCardHeader,
    MDBInput,
    MDBIcon,
    MDBSpinner
} from 'mdb-react-ui-kit';
import { Link, useNavigate } from 'react-router-dom';
import { showAlert } from '../service/AlertServices';
import { checkUsernameExists, saveAccount } from '../api/Accounts';
import bcrypt from 'bcryptjs';
import AvatarUpload from './AvatarUpload';

function SaveAccount() {
    const [formData, setFormData] = useState({
        fullname: '',
        username: '',
        password: '',
        confirmPassword: '',
        role: 'USER'
    });
    const [avatar, setAvatar] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const nav = useNavigate();

    // Xử lý thay đổi input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Xử lý avatar change
    const handleAvatarChange = (avatarUrl, publicId) => {
        setAvatar(publicId);
    };

    // Validation form
    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.fullname.trim()) {
            newErrors.fullname = 'Vui lòng nhập họ và tên';
        } else if (formData.fullname.trim().length < 2) {
            newErrors.fullname = 'Họ tên phải có ít nhất 2 ký tự';
        }
        
        if (!formData.username.trim()) {
            newErrors.username = 'Vui lòng nhập tên đăng nhập';
        } else if (formData.username.trim().length < 3) {
            newErrors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
            newErrors.username = 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới';
        }
        
        if (!formData.password) {
            newErrors.password = 'Vui lòng nhập mật khẩu';
        } 
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Xử lý submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        
        try {
            // Kiểm tra username đã tồn tại chưa
            const usernameExists = await checkUsernameExists(formData.username);
            if (usernameExists) {
                setErrors({ username: 'Tên đăng nhập đã tồn tại, vui lòng chọn tên khác!' });
                return;
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(formData.password, 10);
            
            // Tạo account data
            const accountData = {
                fullname: formData.fullname.trim(),
                username: formData.username.trim(),
                password: hashedPassword,
                role: formData.role,
                status: true,
                isApprove: false, // Tài khoản mới cần được admin duyệt
                avatar: avatar
            };

            // Lưu account
            await saveAccount(accountData);
            
            showAlert("Đăng ký tài khoản thành công! Tài khoản của bạn đang chờ admin duyệt. Bạn sẽ nhận được thông báo khi được phê duyệt.", "success");
            nav('/login');
            
        } catch (error) {
            console.error("Lỗi khi tạo tài khoản:", error);
            showAlert("Có lỗi xảy ra khi tạo tài khoản. Vui lòng thử lại!", "error");
        } finally {
            setIsLoading(false);
        }
    };

    // Toggle password visibility
    const togglePasswordVisibility = (field) => {
        if (field === 'password') {
            setShowPassword(!showPassword);
        } else {
            setShowConfirmPassword(!showConfirmPassword);
        }
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
                                <MDBIcon icon="user-plus" size="3x" className="text-white mb-3" />
                                <h2 className="text-white mb-0 fw-bold">Đăng Ký Tài Khoản</h2>
                                <p className="text-white-50 mb-0">Tạo tài khoản mới để bắt đầu sử dụng</p>
                            </MDBCardHeader>

                            <MDBCardBody className="p-4 p-md-5">
                                {/* Form */}
                                <form onSubmit={handleSubmit}>
                                    {/* Avatar Upload Section */}
                                    <div className="text-center mb-4">
                                        <AvatarUpload
                                            currentAvatar={avatar}
                                            onAvatarChange={handleAvatarChange}
                                            size={80}
                                        />
                                        <p className="text-muted small mt-2">
                                            <MDBIcon icon="camera" className="me-1" />
                                            Tải lên ảnh đại diện (tùy chọn)
                                        </p>
                                    </div>

                                    {/* Full Name Field */}
                                    <div className="mb-4">
                                        <label className="form-label fw-bold text-dark">
                                            <MDBIcon icon="user" className="me-2 text-primary" />
                                            Họ và tên *
                                        </label>
                                        <MDBInput
                                            wrapperClass='mb-2'
                                            id='fullname'
                                            name='fullname'
                                            type='text'
                                            value={formData.fullname}
                                            onChange={handleInputChange}
                                            placeholder="Nhập họ và tên của bạn..."
                                            className={errors.fullname ? 'is-invalid' : ''}
                                        />
                                        {errors.fullname && (
                                            <div className="text-danger small">
                                                <MDBIcon icon="exclamation-triangle" className="me-1" />
                                                {errors.fullname}
                                            </div>
                                        )}
                                    </div>

                                    {/* Username Field */}
                                    <div className="mb-4">
                                        <label className="form-label fw-bold text-dark">
                                            <MDBIcon icon="at" className="me-2 text-primary" />
                                            Tên đăng nhập *
                                        </label>
                                        <MDBInput
                                            wrapperClass='mb-2'
                                            id='username'
                                            name='username'
                                            type='text'
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            placeholder="Nhập tên đăng nhập..."
                                            className={errors.username ? 'is-invalid' : ''}
                                        />
                                        {errors.username && (
                                            <div className="text-danger small">
                                                <MDBIcon icon="exclamation-triangle" className="me-1" />
                                                {errors.username}
                                            </div>
                                        )}
                                        <small className="text-muted">
                                            Chỉ được chứa chữ cái, số và dấu gạch dưới
                                        </small>
                                    </div>

                                    {/* Password Field */}
                                    <div className="mb-4">
                                        <label className="form-label fw-bold text-dark">
                                            <MDBIcon icon="lock" className="me-2 text-primary" />
                                            Mật khẩu *
                                        </label>
                                        <div className="position-relative">
                                            <MDBInput
                                                wrapperClass='mb-2'
                                                id='password'
                                                name='password'
                                                type={showPassword ? 'text' : 'password'}
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                placeholder="Nhập mật khẩu..."
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
                                                onClick={() => togglePasswordVisibility('password')}
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
                                        <small className="text-muted">
                                            Ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và số
                                        </small>
                                    </div>

                                    {/* Confirm Password Field */}
                                    <div className="mb-4">
                                        <label className="form-label fw-bold text-dark">
                                            <MDBIcon icon="lock" className="me-2 text-primary" />
                                            Xác nhận mật khẩu *
                                        </label>
                                        <div className="position-relative">
                                            <MDBInput
                                                wrapperClass='mb-2'
                                                id='confirmPassword'
                                                name='confirmPassword'
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                placeholder="Nhập lại mật khẩu..."
                                                className={errors.confirmPassword ? 'is-invalid' : ''}
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
                                                onClick={() => togglePasswordVisibility('confirmPassword')}
                                            >
                                                <MDBIcon 
                                                    icon={showConfirmPassword ? 'eye-slash' : 'eye'} 
                                                    size="lg"
                                                />
                                            </button>
                                        </div>
                                        {errors.confirmPassword && (
                                            <div className="text-danger small">
                                                <MDBIcon icon="exclamation-triangle" className="me-1" />
                                                {errors.confirmPassword}
                                            </div>
                                        )}
                                    </div>

                                    {/* Role Field */}
                                    {/* <div className="mb-4">
                                        <label className="form-label fw-bold text-dark">
                                            <MDBIcon icon="user-tag" className="me-2 text-primary" />
                                            Vai trò
                                        </label>
                                        <select 
                                            className="form-select"
                                            name="role"
                                            value={formData.role}
                                            onChange={handleInputChange}
                                        >
                                            <option value="USER">Người dùng (USER)</option>
                                        </select>
                                        <small className="text-muted">
                                            Tài khoản mới sẽ có quyền người dùng
                                        </small>
                                    </div> */}

                                    {/* Terms and Conditions */}
                                    <div className="mb-4">
                                        <div className="alert alert-info small d-flex align-items-start">
                                            <MDBIcon icon="info-circle" className="me-2 mt-1" />
                                            <div>
                                                Bằng cách đăng ký, bạn đồng ý với 
                                                <Link to="#" className="text-decoration-none fw-bold ms-1">
                                                    Điều khoản sử dụng
                                                </Link> và 
                                                <Link to="#" className="text-decoration-none fw-bold ms-1">
                                                    Chính sách bảo mật
                                                </Link> của chúng tôi.
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <MDBBtn 
                                        className='w-100 mb-4 py-3' 
                                        size='lg' 
                                        type="submit"
                                        disabled={isLoading}
                                        style={{ borderRadius: '10px', fontWeight: '600' }}
                                    >
                                        {isLoading ? (
                                            <>
                                                <MDBSpinner size="sm" className="me-2" />
                                                Đang tạo tài khoản...
                                            </>
                                        ) : (
                                            <>
                                                <MDBIcon icon="user-plus" className="me-2" />
                                                Đăng Ký Ngay
                                            </>
                                        )}
                                    </MDBBtn>
                                </form>

                                {/* Login Link */}
                                <div className="text-center">
                                    <p className="text-muted mb-0">
                                        Đã có tài khoản? 
                                        <Link to="/login" className="text-primary text-decoration-none fw-bold ms-1">
                                            Đăng nhập ngay
                                        </Link>
                                    </p>
                                </div>
                            </MDBCardBody>
                        </MDBCard>

                        {/* Features Card */}
                        <MDBCard className="mt-4 shadow-sm" style={{ borderRadius: '15px' }}>
                            <MDBCardBody className="p-4">
                                <h5 className="text-center text-primary mb-3">
                                    <MDBIcon icon="gift" className="me-2" />
                                    Lợi ích khi đăng ký
                                </h5>
                                <MDBRow>
                                    <MDBCol md="4" className="text-center mb-3">
                                        <MDBIcon icon="images" size="2x" className="text-primary mb-2" />
                                        <h6 className="text-dark">Tạo ảnh miễn phí</h6>
                                        <small className="text-muted">Tạo ảnh với AI không giới hạn</small>
                                    </MDBCol>
                                    <MDBCol md="4" className="text-center mb-3">
                                        <MDBIcon icon="cloud" size="2x" className="text-success mb-2" />
                                        <h6 className="text-dark">Lưu trữ đám mây</h6>
                                        <small className="text-muted">Lưu ảnh trên Cloudinary</small>
                                    </MDBCol>
                                    <MDBCol md="4" className="text-center mb-3">
                                        <MDBIcon icon="shield-alt" size="2x" className="text-info mb-2" />
                                        <h6 className="text-dark">Bảo mật cao</h6>
                                        <small className="text-muted">Mã hóa mật khẩu an toàn</small>
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

export default SaveAccount;
