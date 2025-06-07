import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate"; // Import React Paginate
import { MDBTable, MDBTableHead, MDBTableBody } from "mdb-react-ui-kit";
import {changeStatusAPI, deleteAccount, getAccounts} from "../api/Accounts";
import {showAlert, showConfirm} from "../service/AlertServices";
import { useNavigate } from "react-router-dom";

function AccountManagement() {
    const [accounts, setAccounts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;
    const nav = useNavigate();

    useEffect(() => {
        async function fetchData() {
            const data = await getAccounts();
            setAccounts(data);
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

    const handleDelete = async (id) => {
        const confirmDelete = await showConfirm("Bạn có chắc chắn muốn xóa tài khoản này?");
        if (!confirmDelete) return;

        const success = await deleteAccount(id);
        if (success) {
            setAccounts(prevAccounts => prevAccounts.filter(account => account.id !== id));
        }
    };


    // Tính toán dữ liệu phân trang
    const offset = currentPage * itemsPerPage;
    const currentPageData = accounts.slice(offset, offset + itemsPerPage);

    return (
        <div className="container mt-5 fw-bold text-center">
            <div className="text-start">
                <button className="btn btn-primary mt-5 mb-3" onClick={() => nav('/new')}>
                    Create new account ?
                </button>
            </div>

            <MDBTable striped bordered hover>
                <MDBTableHead dark>
                    <tr>
                        <th className="fw-bold fs-5">ID</th>
                        <th className="fw-bold fs-5">Username</th>
                        <th className="fw-bold fs-5">Full name</th>
                        <th className="fw-bold fs-5">Role</th>
                        <th className="fw-bold fs-5">Status</th>
                        <th className="fw-bold fs-5">Actions</th>
                    </tr>
                </MDBTableHead>

                <MDBTableBody>
                    {currentPageData.map((account) => (
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

                                {/* Nút xóa tài khoản */}
                                <button
                                    onClick={() => handleDelete(account.id)}
                                    className="btn btn-warning ms-2"
                                    disabled={account.role === "ADMIN"}
                                >
                                    Delete
                                </button>
                            </td>

                        </tr>
                    ))}
                </MDBTableBody>
            </MDBTable>

            {/* Phân trang */}
            <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                pageCount={Math.ceil(accounts.length / itemsPerPage)}
                onPageChange={(event) => setCurrentPage(event.selected)}
                containerClassName={"pagination justify-content-center mt-3"}
                activeClassName={"active"}
                pageClassName={"page-item"}
                pageLinkClassName={"page-link"}
                previousClassName={"page-item"}
                previousLinkClassName={"page-link"}
                nextClassName={"page-item"}
                nextLinkClassName={"page-link"}
            />
        </div>
    );
}

export default AccountManagement;
