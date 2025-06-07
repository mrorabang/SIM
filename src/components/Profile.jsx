import React, { useEffect, useState } from "react";
import bcrypt from "bcryptjs";
import { showAlert } from "../service/AlertServices";
import { changePassword, getAccount } from "../api/Accounts";

function Profile() {
    const [user, setUser] = useState({ fullname: "", password: "", id: "" });
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

    return (
        <div className="container mt-5">
            <div className="card shadow-sm p-4">
                <h2 className="text-primary">Thông tin cá nhân</h2>
                <hr />
                <label><strong>Full name:</strong></label>
                <input
                    type="text"
                    className="form-control mb-2"
                    value={newFullname}
                    onChange={(e) => setNewFullname(e.target.value)}
                    placeholder="Enter fullname..."
                />

                <label><strong>New password:</strong></label>
                <input
                    type="password"
                    className="form-control mb-2"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password..."
                />

                <label><strong>Confirm Password:</strong></label>
                <input
                    type="password"
                    className="form-control mb-2"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Enter confirm password..."
                />

                {errorMessage && <p className="text-danger">{errorMessage}</p>}

                <button className="btn btn-success mt-3" onClick={handleUpdate}>Update</button>
            </div>
        </div>
    );
}

export default Profile;
