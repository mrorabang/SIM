import Swal from "sweetalert2";

const showAlert = (content, type = "info") => {
    Swal.fire({
        icon: type,
        title: content,
        confirmButtonText: "OK"
    });
};

const showConfirm = async (content, type = "warning") => {
    const result = await Swal.fire({
        icon: type,
        title: content,
        showCancelButton: true,
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy",
    });

    return result.isConfirmed;
};

export { showAlert, showConfirm };

