import { useEffect, useState } from "react";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdb-react-ui-kit";
import { changeStatusAPI, getAccounts } from "../api/Accounts";
import { showAlert } from "../service/AlertServices";
import {useNavigate, useNavigation} from "react-router-dom";

function AccountManagement() {
    const [accounts, setAccounts] = useState([]);
    const nav = useNavigate();

    useEffect(() => {
        async function fetchData() {
            const data = await getAccounts();
            setAccounts(data);
            console.log(data);
        }

        fetchData();
    }, []);

    // Hàm xử lý trạng thái tài khoản
    const changeStatus = async (id, currentStatus) => {
        try {
            const updatedAccount = await changeStatusAPI(id, currentStatus);
            if (updatedAccount) {
                setAccounts(prevAccounts =>
                    prevAccounts.map(account =>
                        account.id === id ? updatedAccount : account
                    )
                );
                showAlert("Change status successfully", "success");
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái:", error);
            showAlert("Cập nhật trạng thái thất bại. Vui lòng thử lại!", "warning");
        }
    };

    return (
        <div className="container mt-5 fw-bold text-center">
            <MDBTable striped bordered hover>
                <MDBTableHead dark>
                    <tr>
                        <th className="fw-bold fs-4">ID</th>
                        <th className="fw-bold fs-4">Username</th>
                        <th className="fw-bold fs-4">Full name</th>
                        <th className="fw-bold fs-4">Role</th>
                        <th className="fw-bold fs-4">Status</th>
                        <th className="fw-bold fs-4">Actions</th>
                    </tr>
                </MDBTableHead>

                <MDBTableBody>
                    {accounts.map((account) => (
                        <tr key={account.id}>
                            <td className="fw-bold fs-5">{account.id}</td>
                            <td className="fw-bold fs-5">{account.username}</td>
                            <td className="fw-bold fs-5">{account.fullname}</td>
                            <td className="fw-bold fs-5">{account.role}</td>
                            <td className="fw-bold fs-5" style={{ color: account.status ? "green" : "red" }}>
                                {account.status ? "Hoạt động" : "Không hoạt động"}
                            </td>

                            <td>
                                <button
                                    onClick={() => changeStatus(account.id, account.status)}
                                    className={account.status ? "btn btn-danger" : "btn btn-success"}
                                    disabled={account.role === "ADMIN"}
                                >
                                    {account.status ? "Ban" : "Activate"}
                                </button>
                            </td>
                        </tr>
                    ))}
                </MDBTableBody>
            </MDBTable>

            <button className="btn btn-primary mt-1 mb-2" onClick={()=>nav('/new')}>Create new account?</button>

        </div>
    );
}

export default AccountManagement;
