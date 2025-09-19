import { Navigate } from 'react-router-dom';
import { showAlert } from "./AlertServices";

const ProtectedRoute = ({ children, adminOnly }) => {
    const isAuthenticated = localStorage.getItem("authenticated") === "true";
    
    // Lấy user data với error handling
    let user = null;
    try {
        const userData = localStorage.getItem("user");
        if (userData) {
            user = JSON.parse(userData);
        }
    } catch (error) {
        console.error("Lỗi khi parse user data:", error);
    }
    
    console.log("ProtectedRoute - User:", user);
    
    if (!isAuthenticated || !user) {
        showAlert("Bạn cần đăng nhập để truy cập!", "warning");
        return <Navigate to="/login" />;
    }

    // Kiểm tra quyền truy cập, nếu role là USER và cần ADMIN → Chuyển về trang chính
    if (adminOnly && user?.role !== "ADMIN") {
        showAlert("Bạn không có quyền truy cập vào trang này!", "warning");
        return <Navigate to="/sim-generator" />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
