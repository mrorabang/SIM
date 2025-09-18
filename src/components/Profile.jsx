import React, { useEffect, useState } from "react";
import bcrypt from "bcryptjs";
import { showAlert } from "../service/AlertServices";
import { changePassword, getAccount } from "../api/Accounts";
import AvatarUpload from "./AvatarUpload";
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody } from "mdb-react-ui-kit";

function Profile() {
    const [user, setUser] = useState({ fullname: "", password: "", id: "", avatar: "" });
    const [newFullname, setNewFullname] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

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

        const hashedPassword = newPassword
            ? await bcrypt.hash(newPassword, 6)
            : user.password;

        const updatedData = {
            fullname: newFullname,
            password: hashedPassword,
            avatar: user.avatar || "", // Đảm bảo avatar được gửi (có thể là chuỗi rỗng nếu chưa có)
        };

        const response = await changePassword(user.id, updatedData);
        if (response) {
            // Cập nhật localStorage với toàn bộ thông tin mới
            const updatedUser = { ...user, ...updatedData };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUser(updatedUser);
            showAlert("Cập nhật thành công!", "success");

            // Reset password fields
            setNewPassword("");
            setConfirmPassword("");
        } else {
            showAlert("Lỗi cập nhật!", "warning");
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
        <MDBContainer className="mt-5">
            <MDBRow className="justify-content-center">
                <MDBCol md="8" lg="6">
                    <MDBCard className="shadow-sm">
                        <MDBCardBody className="p-4">
                            <h2 className="text-primary text-center mb-4">Thông tin cá nhân</h2>
                            
                            {/* Avatar Upload Section */}
                            <div className="text-center mb-4">
                                <AvatarUpload
                                    currentAvatar={user.avatar}
                                    onAvatarChange={handleAvatarChange}
                                    size={80}
                                />
                                {/* Avatar ID ẩn để giao diện gọn gàng hơn */}
                                {/* {user.avatar && (
                                    <p className="text-muted small mt-2">
                                        Avatar ID: {user.avatar}
                                    </p>
                                )} */}
                            </div>

                            <hr />

                            <div className="mb-3">
                                <label className="form-label"><strong>Full name:</strong></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={newFullname}
                                    onChange={(e) => setNewFullname(e.target.value)}
                                    placeholder="Enter fullname..."
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label"><strong>New password:</strong></label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password..."
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label"><strong>Confirm Password:</strong></label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Enter confirm password..."
                                />
                            </div>

                            {errorMessage && <p className="text-danger">{errorMessage}</p>}

                            <div className="d-grid">
                                <button className="btn btn-success" onClick={handleUpdate}>
                                    Update Profile
                                </button>
                            </div>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
}

export default Profile;
