import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBCardHeader,
    MDBBtn,
    MDBIcon,
    MDBBadge,
    MDBInput
} from "mdb-react-ui-kit";
import { changeStatusAPI, deleteAccount, getAccounts, updateAccount } from "../api/Accounts";
import { showAlert, showConfirm } from "../service/AlertServices";
import { useNavigate } from "react-router-dom";
import { getAvatarUrl } from "../config/cloudinary";

function AccountManagement() {
    const [accounts, setAccounts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredAccounts, setFilteredAccounts] = useState([]);
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'pending'
    const itemsPerPage = 6;
    const nav = useNavigate();

    useEffect(() => {
        async function fetchData() {
            const data = await getAccounts();
            setAccounts(data);
            setFilteredAccounts(data);
        }
        fetchData();
    }, []);

    // Filter accounts based on search term and active tab
    useEffect(() => {
        let filtered = accounts.filter(account =>
            account.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            account.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            account.role.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Filter by approval status
        if (activeTab === 'pending') {
            filtered = filtered.filter(account => account.isApprove === false);
        }

        setFilteredAccounts(filtered);
        setCurrentPage(0); // Reset to first page when filtering
    }, [searchTerm, accounts, activeTab]);

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
                showAlert("Cập nhật trạng thái thành công!", "success");
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái:", error);
            showAlert("Cập nhật trạng thái thất bại. Vui lòng thử lại!", "warning");
        }
    };

    // Hàm duyệt tài khoản
    const approveAccount = async (id) => {
        try {
            const account = accounts.find(acc => acc.id === id);
            if (!account) return;

            const updatedAccount = await updateAccount(id, { ...account, isApprove: true });
            if (updatedAccount) {
                setAccounts(prevAccounts =>
                    prevAccounts.map(acc =>
                        acc.id === id ? updatedAccount : acc
                    )
                );
                showAlert("Duyệt tài khoản thành công!", "success");
            }
        } catch (error) {
            console.error("Lỗi khi duyệt tài khoản:", error);
            showAlert("Duyệt tài khoản thất bại. Vui lòng thử lại!", "warning");
        }
    };

    const handleDeleteClick = async (account) => {
        const confirmed = await showConfirm(
            `Bạn có chắc chắn muốn xóa tài khoản "${account.username}"?`,
            "warning"
        );
        
        if (confirmed) {
            const success = await deleteAccount(account.id);
            if (success) {
                setAccounts(prevAccounts => prevAccounts.filter(acc => acc.id !== account.id));
                setFilteredAccounts(prevFiltered => prevFiltered.filter(acc => acc.id !== account.id));
                showAlert("Xóa tài khoản thành công!", "success");
            } else {
                showAlert("Xóa tài khoản thất bại. Vui lòng thử lại!", "danger");
            }
        }
    };

    const offset = currentPage * itemsPerPage;
    const currentPageData = filteredAccounts.slice(offset, offset + itemsPerPage);

    return (
        <MDBContainer fluid className="py-4">
            {/* Header Section */}
            <div className="d-flex justify-content-between align-items-center mb-4 mt-5">
                <div>
                    <h2 className="fw-bold text-primary mb-1">Quản lý tài khoản</h2>
                    <p className="text-muted mb-0">Quản lý và theo dõi tất cả tài khoản người dùng</p>
                </div>
                <MDBBtn
                    color="primary"
                    onClick={() => nav('/new')}
                    className="d-flex align-items-center"
                >
                    <MDBIcon fas icon="plus" className="me-2" />
                    Tạo tài khoản mới
                </MDBBtn>
            </div>

            {/* Search and Stats */}
            <MDBCard className="mb-4">
                <MDBCardBody>
                    <MDBRow className="align-items-center">
                        <MDBCol md="6">
                            <MDBInput
                                label="Tìm kiếm tài khoản..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                icon="search"
                            />
                        </MDBCol>
                        <MDBCol md="6" className="text-end">
                            <div className="d-flex justify-content-end gap-3">
                                <div className="text-center">
                                    <div className="fw-bold text-primary fs-4">{filteredAccounts.length}</div>
                                    <small className="text-muted">Tổng tài khoản</small>
                                </div>
                                <div className="text-center">
                                    <div className="fw-bold text-warning fs-4">
                                        {filteredAccounts.filter(acc => acc.isApprove === false).length}
                                    </div>
                                    <small className="text-muted">Chờ duyệt</small>
                                </div>
                                <div className="text-center">
                                    <div className="fw-bold text-success fs-4">
                                        {filteredAccounts.filter(acc => acc.status && acc.isApprove).length}
                                    </div>
                                    <small className="text-muted">Đã duyệt</small>
                                </div>
                                <div className="text-center">
                                    <div className="fw-bold text-danger fs-4">
                                        {filteredAccounts.filter(acc => !acc.status).length}
                                    </div>
                                    <small className="text-muted">Bị khóa</small>
                                </div>
                            </div>
                        </MDBCol>
                    </MDBRow>
                </MDBCardBody>
            </MDBCard>

            {/* Tabs */}
            <div className="mb-4">
                <ul className="nav nav-tabs" id="accountTabs" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveTab('all')}
                        >
                            <MDBIcon fas icon="users" className="me-2" />
                            Tất cả ({accounts.length})
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === 'pending' ? 'active' : ''}`}
                            onClick={() => setActiveTab('pending')}
                        >
                            <MDBIcon fas icon="clock" className="me-2" />
                            Chờ duyệt ({accounts.filter(acc => acc.isApprove === false).length})
                        </button>
                    </li>
                </ul>
            </div>

            {/* Accounts Grid */}
            <MDBRow>
                {currentPageData.map((account) => (
                    <MDBCol md="6" lg="4" className="mb-4" key={account.id}>
                        <MDBCard className="h-100 shadow-sm">
                            <MDBCardBody className="p-3">
                                {/* Avatar and Basic Info */}
                                <div className="d-flex align-items-center mb-2">
                                    <div className="position-relative me-2">
                                        {account.avatar ? (
                                            <img
                                                src={getAvatarUrl(account.avatar, 50)}
                                                alt="Avatar"
                                                className="rounded-circle"
                                                style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    objectFit: 'cover',
                                                    border: '2px solid #e9ecef'
                                                }}
                                            />
                                        ) : (
                                            <div
                                                className="rounded-circle d-flex align-items-center justify-content-center"
                                                style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    backgroundColor: '#e9ecef',
                                                    border: '2px solid #e9ecef'
                                                }}
                                            >
                                                <MDBIcon fas icon="user" size="lg" className="text-muted" />
                                            </div>
                                        )}
                                        <MDBBadge
                                            color={
                                                account.isApprove === false ? "warning" :
                                                account.status ? "success" : "danger"
                                            }
                                            className="position-absolute"
                                            style={{
                                                top: '-5px',
                                                right: '-5px',
                                                width: '20px',
                                                height: '20px',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '10px'
                                            }}
                                        >
                                            {account.isApprove === false ? '⏳' : account.status ? '✓' : '✗'}
                                        </MDBBadge>
                                    </div>
                                    <div className="flex-grow-1">
                                        <h6 className="fw-bold mb-1">{account.fullname}</h6>
                                        <p className="text-muted small mb-0">@{account.username}</p>
                                        <MDBBadge
                                            color={account.role === "ADMIN" ? "primary" : "secondary"}
                                            className="mt-1"
                                        >
                                            {account.role}
                                        </MDBBadge>
                                    </div>
                                </div>

                                {/* Account Details */}
                                <div className="mb-2">
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <span className="text-muted small">ID:</span>
                                        <span className="fw-bold small">#{account.id}</span>
                                    </div>
                                    {/* Only show approval status if account is pending approval */}
                                    {account.isApprove === false && (
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                            <span className="text-muted small">Duyệt:</span>
                                            <span className="fw-bold small text-warning">
                                                Chờ duyệt
                                            </span>
                                        </div>
                                    )}
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="text-muted small">Trạng thái:</span>
                                        <span className={`fw-bold small ${account.status ? 'text-success' : 'text-danger'}`}>
                                            {account.status ? 'Hoạt động' : 'Bị khóa'}
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="d-flex gap-1 flex-wrap">
                                    {/* Approve Button - only show for pending accounts */}
                                    {account.isApprove === false && (
                                        <MDBBtn
                                            size="sm"
                                            color="success"
                                            onClick={() => approveAccount(account.id)}
                                            className="flex-fill"
                                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                                        >
                                            <MDBIcon fas icon="check" className="me-1" />
                                            Duyệt
                                        </MDBBtn>
                                    )}
                                    
                                    {/* Status Toggle Button */}
                                    <MDBBtn
                                        size="sm"
                                        color={account.status ? "danger" : "success"}
                                        onClick={() => changeStatus(account.id, account.status)}
                                        disabled={account.role === "ADMIN" || account.isApprove === false}
                                        className="flex-fill"
                                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                                    >
                                        <MDBIcon fas icon={account.status ? "ban" : "check"} className="me-1" />
                                        {account.status ? "Khóa" : "Mở"}
                                    </MDBBtn>
                                    
                                    {/* Delete Button */}
                                    <MDBBtn
                                        size="sm"
                                        color="warning"
                                        onClick={() => handleDeleteClick(account)}
                                        disabled={account.role === "ADMIN"}
                                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                                    >
                                        <MDBIcon fas icon="trash" />
                                    </MDBBtn>
                                </div>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                ))}
            </MDBRow>

            {/* Empty State */}
            {currentPageData.length === 0 && (
                <MDBCard className="text-center py-5">
                    <MDBCardBody>
                        <MDBIcon fas icon="users" size="4x" className="text-muted mb-3" />
                        <h5 className="text-muted">Không tìm thấy tài khoản nào</h5>
                        <p className="text-muted">Thử thay đổi từ khóa tìm kiếm hoặc tạo tài khoản mới</p>
                    </MDBCardBody>
                </MDBCard>
            )}

            {/* Pagination */}
            {filteredAccounts.length > itemsPerPage && (
                <div className="d-flex justify-content-center mt-4">
                    <ReactPaginate
                        previousLabel={<MDBIcon fas icon="chevron-left" />}
                        nextLabel={<MDBIcon fas icon="chevron-right" />}
                        pageCount={Math.ceil(filteredAccounts.length / itemsPerPage)}
                        onPageChange={(event) => setCurrentPage(event.selected)}
                        containerClassName={"pagination pagination-lg"}
                        activeClassName={"active"}
                        pageClassName={"page-item"}
                        pageLinkClassName={"page-link"}
                        previousClassName={"page-item"}
                        previousLinkClassName={"page-link"}
                        nextClassName={"page-item"}
                        nextLinkClassName={"page-link"}
                        breakClassName={"page-item"}
                        breakLinkClassName={"page-link"}
                    />
                </div>
            )}

        </MDBContainer>
    );
}

export default AccountManagement;
