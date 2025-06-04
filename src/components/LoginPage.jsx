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
import {useNavigate} from "react-router-dom";
import bcrypt from 'bcryptjs';


function LoginPage() {
    const [accounts, setAccounts] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
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
            localStorage.setItem("authenticated", "true");
            localStorage.setItem("fullname", found.fullname);
            localStorage.setItem("role", found.role);
            nav('/create');
        } else {
            showAlert("Sai tài khoản hoặc mật khẩu", "error");
        }
    };


    return (
        <MDBContainer fluid className='p-4'>
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
                            />
                            <MDBInput
                                wrapperClass='mb-4'
                                label='Password'
                                id='password'
                                type='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <div className='d-flex justify-content-center mb-4'>
                                <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me'/>
                            </div>

                            <MDBBtn className='w-100 mb-4' size='md' onClick={handleLogin}>Login</MDBBtn>

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
