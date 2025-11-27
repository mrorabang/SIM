import { Navigate } from 'react-router-dom';
import { showAlert } from "./AlertServices";

const ProtectedRoute = ({ children, adminOnly }) => {
    // Simple validation with localStorage
    const isAuthenticated = localStorage.getItem("authenticated") === "true";
    
    // Get user data
    let user = null;
    try {
        const userData = localStorage.getItem("user");
        if (userData) {
            user = JSON.parse(userData);
        }
    } catch (error) {
        console.error("Lỗi khi parse user data:", error);
    }
    
    // Check if user exists and is authenticated
    if (!isAuthenticated || !user) {
        showAlert("Bạn cần đăng nhập để truy cập!", "warning");
        return <Navigate to="/login" />;
    }

    // Check admin role
    if (adminOnly && user?.role !== "ADMIN") {
        showAlert("Bạn không có quyền truy cập vào trang này!", "warning");
        return <Navigate to="/" />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
