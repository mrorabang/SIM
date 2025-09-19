import React, {useEffect, useState} from 'react';
import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBCheckbox,
    MDBIcon
} from 'mdb-react-ui-kit';
import { getAccounts } from "../api/Accounts";
import {showAlert} from "../service/AlertServices";
import {useNavigate, Link} from "react-router-dom";
import bcrypt from 'bcryptjs';


function LoginPage() {
    const [accounts, setAccounts] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const nav = useNavigate();

    // Lấy dữ liệu accounts từ API
    useEffect(() => {
        async function fetchData() {
            const data = await getAccounts();
            setAccounts(data);
        }
        fetchData();

        }, []);


    const handleLogin = async () => {
        // Tìm tài khoản theo username
        const found = accounts.find(acc => acc.username === username);
        if (!found) {
            showAlert("Sai tài khoản hoặc mật khẩu", "error");
            return;
        }

        if (!found.status) {
            showAlert("Tài khoản đã bị cấm, vui lòng liên hệ quản trị viên!", "danger");
            return;
        }

        const isPasswordCorrect = await bcrypt.compare(password, found.password);
        if (isPasswordCorrect) {
            showAlert("Đăng nhập thành công", "success");
            localStorage.setItem("user",JSON.stringify(found));
            localStorage.setItem("authenticated", "true");
            console.log(localStorage.getItem("user"));
            nav('/');
        } else {
            showAlert("Sai tài khoản hoặc mật khẩu", "error");
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
        <MDBContainer fluid className='p-4'>
            {/* Nút Về Home */}
            <div className="mb-4">
                <Link to="/">
                    <MDBBtn
                        color="outline-primary"
                        className="d-flex align-items-center"
                        style={{
                            borderRadius: '25px',
                            padding: '8px 20px',
                            fontWeight: '600',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <MDBIcon fas icon="home" className="me-2" />
                        Về Home
                    </MDBBtn>
                </Link>
            </div>
            
            <MDBRow>
                <MDBCol md='6' className='text-center text-md-start d-flex flex-column justify-content-center'>
                    <h1 className="my-5 display-3 fw-bold ls-tight px-3">
                        Công cụ tạo ảnh <br/>
                        <span className="text-primary">Tiết kiệm thời gian</span>
                    </h1>
                    <p className='px-3' style={{color: 'hsl(217, 10%, 50.8%)'}}>
                        Công cụ tạo ảnh và tải ảnh xuống là công cụ được phát triển bởi Minh Quân. Hãy
                        sử dụng nó một cách tối ưu! Xin cảm ơn.
                    </p>
                </MDBCol>

                <MDBCol md='6'>
                    <MDBCard className='my-5'>
                        <MDBCardBody className='p-5'>
                            <MDBRow>
                                <div className="text-center fs-1 fw-bold">Login</div>
                            </MDBRow>

                            <MDBInput
                                wrapperClass='mb-4'
                                label='Username'
                                id='username'
                                type='text'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                            
                            <div className='mb-4 position-relative'>
                                <MDBInput
                                    label='Password'
                                    id='password'
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                />
                                <button
                                    type="button"
                                    className="btn btn-link position-absolute"
                                    style={{
                                        right: '10px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        border: 'none',
                                        background: 'none',
                                        padding: '0',
                                        zIndex: '10'
                                    }}
                                    onClick={togglePasswordVisibility}
                                >
                                    <MDBIcon 
                                        icon={showPassword ? 'eye-slash' : 'eye'} 
                                        size="xl"
                                        style={{ color: '#6c757d' }}
                                    />
                                </button>
                            </div>

                            <div className='d-flex justify-content-center mb-4'>
                                <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me'/>
                            </div>

                            <MDBBtn className='w-100 mb-4' size='md' onClick={handleLogin}>Login</MDBBtn>

                            {/* Nút Về Home thứ 2 */}
                            <div className="mb-4">
                                <Link to="/">
                                    <MDBBtn
                                        color="outline-secondary"
                                        className="w-100 d-flex align-items-center justify-content-center"
                                        style={{
                                            borderRadius: '25px',
                                            padding: '8px 20px',
                                            fontWeight: '600',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <MDBIcon fas icon="home" className="me-2" />
                                        Về Home
                                    </MDBBtn>
                                </Link>
                            </div>

                            <div className="text-center">
                                <p>or sign up with:</p>

                                <MDBBtn tag='a' color='none' className='mx-3' style={{color: '#1266f1'}}>
                                    <MDBIcon fab icon='facebook-f' size="sm"/>
                                </MDBBtn>

                                <MDBBtn tag='a' color='none' className='mx-3' style={{color: '#1266f1'}}>
                                    <MDBIcon fab icon='twitter' size="sm"/>
                                </MDBBtn>

                                <MDBBtn tag='a' color='none' className='mx-3' style={{color: '#1266f1'}}>
                                    <MDBIcon fab icon='google' size="sm"/>
                                </MDBBtn>

                                <MDBBtn tag='a' color='none' className='mx-3' style={{color: '#1266f1'}}>
                                    <MDBIcon fab icon='github' size="sm"/>
                                </MDBBtn>
                            </div>

                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
}

export default LoginPage;
