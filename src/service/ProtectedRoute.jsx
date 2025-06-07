import { Navigate } from 'react-router-dom';
import { showAlert } from "./AlertServices";

const ProtectedRoute = ({ children, adminOnly }) => {
    const isAuthenticated = localStorage.getItem("authenticated") === "true";
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(user);
    if (!isAuthenticated) {
        showAlert("Bạn cần đăng nhập để truy cập!", "warning");
        return <Navigate to="/login" />;
    }

    // Kiểm tra quyền truy cập, nếu role là USER và cần ADMIN → Chuyển về trang chính
    if (adminOnly && user.role !== "ADMIN") {
        showAlert("Bạn không có quyền truy cập vào trang này!", "warning");
        return <Navigate to="/create" />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
