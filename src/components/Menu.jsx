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
    MDBNavbarToggler
} from "mdb-react-ui-kit";
import {Link, useNavigate} from "react-router-dom";
import React, {useState} from "react";
import {showConfirm} from "../service/AlertServices";
import {showAlert} from "../service/AlertServices";

function Menu() {
    const [openBasic, setOpenBasic] = useState(false);
    const fullname = localStorage.getItem("fullname");
    const role = localStorage.getItem("role");
    const nav = useNavigate();
    //xu ly logout
    const handleLogout = async () => {
        const confirm = await showConfirm("Are you sure?", "warning");
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
                        <img src="./img/logo1.png" width={"110px"} alt=""/>
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
                                {role === "ADMIN" && (
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

                        <MDBBtn
                            color="danger"
                            className="ms-auto d-flex align-items-center"
                            onClick={handleLogout}
                            style={{gap: "0.5rem"}}
                        >
                            <span className="fw-bold" style={{ whiteSpace: "nowrap" }}>{fullname}</span>
                            <MDBIcon icon="sign-out-alt"/>
                        </MDBBtn>
                    </MDBCollapse>
                </MDBContainer>
            </MDBNavbar>
        </>
    );
}

export default Menu;
