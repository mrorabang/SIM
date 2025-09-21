import React, { useEffect, useState } from "react";
import bcrypt from "bcryptjs";
import { showAlert } from "../service/AlertServices";
import { changePassword, getAccount } from "../api/Accounts";
import AvatarUpload from "./AvatarUpload";
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardHeader, MDBBadge, MDBIcon } from "mdb-react-ui-kit";

function Profile() {
    const [user, setUser] = useState({ fullname: "", password: "", id: "", avatar: "", email: "", createdAt: "" });
    const [newFullname, setNewFullname] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");

    useEffect(() => {
        const fetchUser = async () => {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);

                // Lấy dữ liệu mới nhất từ API theo ID
                const latestUser = await getAccount(parsedUser.id);
                if (latestUser) {
                    setUser(latestUser);
                    setNewFullname(latestUser.fullname);
                } else {
                    showAlert("Không thể lấy thông tin người dùng!", "warning");
                }
            }
        };

        fetchUser();
    }, []);

    const handleUpdate = async () => {
        if (newPassword && newPassword !== confirmPassword) {
            return showAlert("Mật khẩu xác nhận không khớp!", "warning");
        }

        if (newPassword && newPassword.length < 6) {
            return showAlert("Mật khẩu phải có ít nhất 6 ký tự!", "warning");
        }

        setIsLoading(true);
        
        try {
        const hashedPassword = newPassword
            ? await bcrypt.hash(newPassword, 6)
            : user.password;

        const updatedData = {
            fullname: newFullname,
            password: hashedPassword,
                avatar: user.avatar || "",
        };

        const response = await changePassword(user.id, updatedData);
        if (response) {
            const updatedUser = { ...user, ...updatedData };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUser(updatedUser);
            showAlert("Cập nhật thành công!", "success");

            setNewPassword("");
            setConfirmPassword("");
        } else {
            showAlert("Lỗi cập nhật!", "warning");
            }
        } catch (error) {
            showAlert("Có lỗi xảy ra khi cập nhật!", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAvatarChange = (avatarUrl, publicId) => {
        const updatedUser = { ...user, avatar: publicId };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        // Tự động cập nhật avatar lên API ngay khi upload
        updateAvatarInAPI(publicId);
    };

    const updateAvatarInAPI = async (avatarPublicId) => {
        try {
            const response = await changePassword(user.id, {
                fullname: user.fullname,
                password: user.password,
                avatar: avatarPublicId
            });
            
            if (response) {
                // showAlert("Avatar đã được cập nhật!", "success");
            }
        } catch (error) {
            console.error("Lỗi cập nhật avatar:", error);
            showAlert("Lỗi cập nhật avatar!", "warning");
        }
    };

    return (
        <MDBContainer className="mt-4">
            <MDBRow className="justify-content-center">
                <MDBCol md="10" lg="8">
                    {/* Header Card */}
                    <MDBCard className="shadow-sm mb-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                        <MDBCardBody className="text-white p-4">
                            <MDBRow className="align-items-center">
                                <MDBCol md="3" className="text-center">
                                <AvatarUpload
                                    currentAvatar={user.avatar}
                                    onAvatarChange={handleAvatarChange}
                                        size={100}
                                    />
                                </MDBCol>
                                <MDBCol md="9">
                                    <h2 className="mb-2">{user.fullname || "Chưa cập nhật"}</h2>
                                    <p className="mb-1">
                                        <MDBIcon icon="envelope" className="me-2" />
                                        {user.email || "Chưa có email"}
                                    </p>
                                    <p className="mb-0">
                                        <MDBIcon icon="calendar" className="me-2" />
                                        Tham gia: {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : "Không xác định"}
                                    </p>
                                </MDBCol>
                            </MDBRow>
                        </MDBCardBody>
                    </MDBCard>

                    {/* Navigation Tabs */}
                    <MDBCard className="shadow-sm mb-4">
                        <MDBCardBody className="p-0">
                            <div className="nav nav-tabs" role="tablist">
                                <button
                                    className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('profile')}
                                    style={{ border: 'none', background: 'none' }}
                                >
                                    <MDBIcon icon="user" className="me-2" />
                                    Thông tin cá nhân
                                </button>
                                <button
                                    className={`nav-link ${activeTab === 'security' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('security')}
                                    style={{ border: 'none', background: 'none' }}
                                >
                                    <MDBIcon icon="lock" className="me-2" />
                                    Bảo mật
                                </button>
                            </div>
                        </MDBCardBody>
                    </MDBCard>

                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <MDBCard className="shadow-sm">
                            <MDBCardHeader className="bg-primary text-white">
                                <h5 className="mb-0">
                                    <MDBIcon icon="user-edit" className="me-2" />
                                    Chỉnh sửa thông tin
                                </h5>
                            </MDBCardHeader>
                            <MDBCardBody className="p-4">
                                <div className="mb-4">
                                    <label className="form-label fw-bold">
                                        <MDBIcon icon="user" className="me-2 text-primary" />
                                        Họ và tên
                                    </label>
                                <input
                                    type="text"
                                        className="form-control form-control-lg"
                                    value={newFullname}
                                    onChange={(e) => setNewFullname(e.target.value)}
                                        placeholder="Nhập họ và tên của bạn..."
                                />
                            </div>

                                <div className="mb-4">
                                    <label className="form-label fw-bold">
                                        <MDBIcon icon="envelope" className="me-2 text-primary" />
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control form-control-lg"
                                        value={user.email || ""}
                                        disabled
                                        placeholder="Email sẽ được thêm trong tương lai..."
                                    />
                                    <small className="text-muted">Tính năng email sẽ được phát triển trong tương lai</small>
                                </div>

                                <div className="d-grid">
                                    <button 
                                        className="btn btn-primary btn-lg" 
                                        onClick={handleUpdate}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Đang cập nhật...
                                            </>
                                        ) : (
                                            <>
                                                <MDBIcon icon="save" className="me-2" />
                                                Cập nhật thông tin
                                            </>
                                        )}
                                    </button>
                                </div>
                            </MDBCardBody>
                        </MDBCard>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <MDBCard className="shadow-sm">
                            <MDBCardHeader className="bg-warning text-dark">
                                <h5 className="mb-0">
                                    <MDBIcon icon="shield-alt" className="me-2" />
                                    Thay đổi mật khẩu
                                </h5>
                            </MDBCardHeader>
                            <MDBCardBody className="p-4">
                                <div className="alert alert-info">
                                    <MDBIcon icon="info-circle" className="me-2" />
                                    <strong>Lưu ý:</strong> Để trống mật khẩu nếu không muốn thay đổi
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-bold">
                                        <MDBIcon icon="lock" className="me-2 text-warning" />
                                        Mật khẩu mới
                                    </label>
                                <input
                                    type="password"
                                        className="form-control form-control-lg"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)..."
                                />
                                    {newPassword && newPassword.length < 6 && (
                                        <small className="text-danger">Mật khẩu phải có ít nhất 6 ký tự</small>
                                    )}
                            </div>

                                <div className="mb-4">
                                    <label className="form-label fw-bold">
                                        <MDBIcon icon="lock" className="me-2 text-warning" />
                                        Xác nhận mật khẩu
                                    </label>
                                <input
                                    type="password"
                                        className="form-control form-control-lg"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Nhập lại mật khẩu mới..."
                                />
                                    {newPassword && confirmPassword && newPassword !== confirmPassword && (
                                        <small className="text-danger">Mật khẩu xác nhận không khớp</small>
                                    )}
                            </div>

                                {errorMessage && (
                                    <div className="alert alert-danger">
                                        <MDBIcon icon="exclamation-triangle" className="me-2" />
                                        {errorMessage}
                                    </div>
                                )}

                            <div className="d-grid">
                                    <button 
                                        className="btn btn-warning btn-lg" 
                                        onClick={handleUpdate}
                                        disabled={isLoading || (newPassword && newPassword !== confirmPassword)}
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Đang cập nhật...
                                            </>
                                        ) : (
                                            <>
                                                <MDBIcon icon="key" className="me-2" />
                                                Cập nhật mật khẩu
                                            </>
                                        )}
                                </button>
                            </div>
                            </MDBCardBody>
                        </MDBCard>
                    )}

                    {/* Account Stats */}
                    <MDBCard className="shadow-sm mt-4">
                        <MDBCardHeader className="bg-info text-white">
                            <h5 className="mb-0">
                                <MDBIcon icon="chart-line" className="me-2" />
                                Thống kê tài khoản
                            </h5>
                        </MDBCardHeader>
                        <MDBCardBody className="p-4">
                            <MDBRow>
                                <MDBCol md="4" className="text-center mb-3">
                                    <div className="p-3 bg-light rounded">
                                        <MDBIcon icon="images" size="2x" className="text-primary mb-2" />
                                        <h4 className="text-primary">0</h4>
                                        <p className="text-muted mb-0">Ảnh đã tạo</p>
                                    </div>
                                </MDBCol>
                                <MDBCol md="4" className="text-center mb-3">
                                    <div className="p-3 bg-light rounded">
                                        <MDBIcon icon="download" size="2x" className="text-success mb-2" />
                                        <h4 className="text-success">0</h4>
                                        <p className="text-muted mb-0">Lần tải xuống</p>
                                    </div>
                                </MDBCol>
                                <MDBCol md="4" className="text-center mb-3">
                                    <div className="p-3 bg-light rounded">
                                        <MDBIcon icon="star" size="2x" className="text-warning mb-2" />
                                        <h4 className="text-warning">VIP</h4>
                                        <p className="text-muted mb-0">Gói dịch vụ</p>
                                    </div>
                                </MDBCol>
                            </MDBRow>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
}

export default Profile;
