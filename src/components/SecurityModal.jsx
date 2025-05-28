import {
    MDBBtn,
    MDBInput,
    MDBModal,
    MDBModalBody,
    MDBModalContent,
    MDBModalDialog,
    MDBModalFooter,
    MDBModalHeader,
    MDBModalTitle
} from "mdb-react-ui-kit";
import React, {useEffect, useState} from "react";
import showAlert from "../config/showAlert"; // ✅ import SweetAlert2

function SecurityModal() {
    const [passwordModalOpen, setPasswordModalOpen] = useState(true);
    const [password, setPassword] = useState("");

    useEffect(() => {
        const isAuthenticated = sessionStorage.getItem("authenticated");
        if (isAuthenticated === "true") {
            setPasswordModalOpen(false);
        }
    }, []);

    const handlePasswordSubmit = () => {
        if (password === "9320") {
            showAlert("Login successfully", "success");
            sessionStorage.setItem("authenticated", "true"); // ✅ Lưu vào localStorage
            setPasswordModalOpen(false);
        } else {
            showAlert("Login failed.", "error");
            setPassword(""); // Xóa ô input
        }
    };

    return (
        <MDBModal open={passwordModalOpen} staticBackdrop tabIndex="-1">
            <MDBModalDialog>
                <MDBModalContent>
                    <MDBModalHeader>
                        <MDBModalTitle>Nhập mật khẩu</MDBModalTitle>
                    </MDBModalHeader>
                    <MDBModalBody>
                        <MDBInput
                            label="Nhập mật khẩu"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn onClick={handlePasswordSubmit}>OK</MDBBtn>
                    </MDBModalFooter>
                </MDBModalContent>
            </MDBModalDialog>
        </MDBModal>
    );
}

export default SecurityModal;
