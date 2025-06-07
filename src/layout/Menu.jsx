import {
    MDBBtn,
    MDBCollapse,
    MDBContainer,
    MDBIcon,
    MDBNavbar,
    MDBNavbarBrand,
    MDBNavbarItem,
    MDBNavbarLink,
    MDBNavbarNav,
    MDBNavbarToggler, MDBTooltip
} from "mdb-react-ui-kit";
import {Link, useNavigate} from "react-router-dom";
import React, {useState} from "react";
import {showConfirm, showAlert} from "../service/AlertServices";

function Menu() {
    const [openBasic, setOpenBasic] = useState(false);
    const user = JSON.parse(localStorage.getItem("user"));
    const nav = useNavigate();

    // Xử lý logout
    const handleLogout = async () => {
        const confirm = await showConfirm("Bạn có chắc chắn muốn đăng xuất?", "warning");
        if (confirm) {
            localStorage.clear();
            nav("/login");
            showAlert("Đã đăng xuất!", "success");
        }
    };

    return (
        <>
            <MDBNavbar expand="lg" light bgColor="light" className="fixed-top">
                <MDBContainer fluid>
                    <MDBNavbarBrand>
                        <img src="./img/logo1.png" width={"110px"} alt="Logo"/>
                    </MDBNavbarBrand>

                    <MDBNavbarToggler
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                        onClick={() => setOpenBasic(!openBasic)}
                    >
                        <MDBIcon icon="bars" fas/>
                    </MDBNavbarToggler>

                    <MDBCollapse navbar open={openBasic}>
                        <MDBNavbarNav className="me-auto mb-2 mb-lg-0">
                            <MDBNavbarItem>
                                <MDBNavbarLink>
                                    <Link to="/create">Create Picture</Link>
                                </MDBNavbarLink>
                            </MDBNavbarItem>

                            <MDBNavbarItem>
                                <MDBNavbarLink>
                                    <Link to="/filter">Filter</Link>
                                </MDBNavbarLink>
                            </MDBNavbarItem>

                            <MDBNavbarItem>
                                {user.role === "ADMIN" && (
                                    <MDBNavbarLink>
                                        <Link to="/account">Account Management</Link>
                                    </MDBNavbarLink>
                                )}
                            </MDBNavbarItem>

                            <MDBNavbarItem>
                                <MDBNavbarLink>
                                    <Link to="/chat">Chat with AI</Link>
                                </MDBNavbarLink>
                            </MDBNavbarItem>

                            <MDBNavbarItem>
                                <MDBNavbarLink>
                                    <Link to="/contact">Contact</Link>
                                </MDBNavbarLink>
                            </MDBNavbarItem>
                        </MDBNavbarNav>

                        {/* Hiển thị Full Name bên trái Avatar */}
                        <MDBTooltip tag="span" title={user.fullname} placement="bottom">
                            <MDBIcon
                                fas
                                icon="user-circle"
                                size="2x"
                                className="cursor-pointer me-3"
                                onClick={() => nav("/profile")}
                            />
                        </MDBTooltip>




                        <MDBBtn color="danger" onClick={handleLogout} size="sm">
                            <MDBIcon fas icon="sign-out-alt"/>
                        </MDBBtn>
                    </MDBCollapse>
                </MDBContainer>
            </MDBNavbar>
        </>
    );
}

export default Menu;
