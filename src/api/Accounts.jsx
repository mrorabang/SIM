import {showAlert} from "../service/AlertServices";

export const getAccounts = async () => {
    const res = await fetch('https://683dc621199a0039e9e6d42d.mockapi.io/accounts');
    if (!res.ok) {
        throw new Error("Failed to fetch accounts");
    }
    return await res.json();
};

export const getAccount = async (id) => {
    try {
        const response = await fetch(`https://683dc621199a0039e9e6d42d.mockapi.io/accounts/${id}`);

        if (!response.ok) {
            throw new Error("Không thể lấy thông tin tài khoản!");
        }

        return await response.json();
    } catch (error) {
        console.error("Lỗi khi lấy tài khoản:", error);
        return null;
    }
};


// api/accounts.js
export const changeStatusAPI = async (id, currentStatus) => {
    try {
        const response = await fetch(`https://683dc621199a0039e9e6d42d.mockapi.io/accounts/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: !currentStatus }) // Đảo trạng thái
        });

        if (!response.ok) {
            throw new Error('Không thể cập nhật trạng thái');
        }

        return await response.json();
    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái:', error);
    }
};

export const saveAccount = async (account) => {
    try {
        const response = await fetch("https://683dc621199a0039e9e6d42d.mockapi.io/accounts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(account),
        });

        if (response.ok) {
            showAlert("Tạo tài khoản thành công!", "success");
        } else {
            showAlert("Có lỗi xảy ra, vui lòng thử lại!", "warning");
        }
    } catch (error) {
        console.error("Lỗi khi tạo tài khoản:", error);
        showAlert("Lỗi khi kết nối tới server!", "danger");
    }
};

export const checkUsernameExists = async (username) => {
    try {
        const response = await fetch("https://683dc621199a0039e9e6d42d.mockapi.io/accounts");
        const accounts = await response.json();
        return accounts.some(acc => acc.username === username);
    } catch (error) {
        console.error("Lỗi khi kiểm tra username:", error);
        return false;
    }
};

export const deleteAccount = async (id) => {
    try {
        const response = await fetch(`https://683dc621199a0039e9e6d42d.mockapi.io/accounts/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error("Không thể xóa tài khoản!");
        }
        return true;
    } catch (error) {
        console.error("Lỗi khi xóa tài khoản:", error);
        return false;
    }
};

export const changePassword = async (id, data) => {
    try {
        const response = await fetch(`https://683dc621199a0039e9e6d42d.mockapi.io/accounts/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            showAlert("Không thể cập nhật tài khoản!", "warning");
            return null;
        }
        // Bỏ thông báo "Update successful!" để tránh trùng lặp với thông báo upload avatar
        // showAlert("Update successful!", "success");
        localStorage.setItem("user", JSON.stringify(data));
        console.log(localStorage.getItem("user"));
        return await response.json();

    } catch (error) {
        console.error("Lỗi khi cập nhật tài khoản:", error);
        return null;
    }
};

