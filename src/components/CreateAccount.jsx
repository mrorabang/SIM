import {useState} from "react";
import {useForm} from "react-hook-form";
import {showAlert} from "../service/AlertServices";
import {checkUsernameExists, saveAccount} from "../api/Accounts";
import bcrypt from "bcryptjs";
import {useNavigate} from "react-router-dom";

function CreateAccount() {
    const {register, handleSubmit, watch, formState: {errors}} = useForm();
    const [status] = useState(true); // Mặc định trạng thái là true
    const [confirmPassword, setConfirmPassword] = useState("");
    const nav = useNavigate();

    // Xử lý gửi form
    const onSubmit = async (data) => {
        if (data.password !== confirmPassword) {
            showAlert("Mật khẩu xác nhận không khớp!", "warning");
            return;
        }

        // Kiểm tra xem username đã tồn tại chưa
        const usernameExists = await checkUsernameExists(data.username);
        if (usernameExists) {
            showAlert("Username đã tồn tại, vui lòng chọn tên khác!", "warning");
            return;
        }

        const hashedPassword = await bcrypt.hash(data.password, 6);
        const accountData = {...data, password: hashedPassword, status};

        try {
            await saveAccount(accountData);
            showAlert("Tạo tài khoản thành công!", "success");
            nav('/account');
        } catch (error) {
            console.error("Lỗi khi tạo tài khoản:", error);
            showAlert("Có lỗi xảy ra, vui lòng thử lại!", "warning");
        }
    };

    return (
        <div className="">
            <div className="container mt-5">
                <form onSubmit={handleSubmit(onSubmit)} className="p-4 shadow rounded">

                    <div className="mb-3">
                        <label className="fw-bold">Full Name</label>
                        <input className="form-control" {...register("fullname", {required: true})} />
                        {errors.fullname && <small className="text-danger">Vui lòng nhập họ tên!</small>}
                    </div>

                    <div className="mb-3">
                        <label className="fw-bold">Username</label>
                        <input className="form-control" {...register("username", {required: true})} />
                        {errors.username && <small className="text-danger">Vui lòng nhập username!</small>}
                    </div>

                    <div className="mb-3">
                        <label className="fw-bold">Password</label>
                        <input type="password" className="form-control" {...register("password", {required: true})} />
                        {errors.password && <small className="text-danger">Mật khẩu không được bỏ trống!</small>}
                    </div>

                    {/* Xác nhận mật khẩu nằm ngoài form */}
                    <div className="mb-3">
                        <label className="fw-bold">Confirm Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="fw-bold">Role</label>
                        <select className="form-select" {...register("role", {required: true})}>
                            <option value="USER">USER</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                        {errors.role && <small className="text-danger">Vui lòng chọn vai trò!</small>}
                    </div>

                    <button type="submit" className="btn btn-primary w-100 fw-bold">SAVE</button>
                </form>
            </div>
        </div>
    );
}

export default CreateAccount;
