// src/components/Alert.js
import Swal from "sweetalert2";

/**
 * Hiển thị alert với nội dung và loại
 * @param {string} content - Nội dung hiển thị
 * @param {string} type - Loại alert: 'success', 'error', 'warning', 'info', 'question'
 */
const showAlert = (content, type = "info") => {
    Swal.fire({
        icon: type,
        title: content,
        confirmButtonText: "OK"
    });
};

export default showAlert;
