import { Navigate } from 'react-router-dom';
import {showAlert} from "./AlertServices";

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem("authenticated") === "true";
    if (!isAuthenticated) {
        showAlert("Bạn cần đăng nhập để truy cập!", "warning");
        return <Navigate to="/login" />;
    }

    console.log("isAuthenticated:", isAuthenticated);
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};



export default ProtectedRoute;
