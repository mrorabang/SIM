import {
    MDBCollapse,
    MDBContainer,
    MDBIcon,
    MDBNavbar,
    MDBNavbarBrand, MDBNavbarItem, MDBNavbarLink,
    MDBNavbarNav,
    MDBNavbarToggler
} from "mdb-react-ui-kit";
import {Link} from "react-router-dom";
import React, {useState} from "react";

function Menu() {
    const [openBasic, setOpenBasic] = useState(false);

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
                        <MDBNavbarNav className="mr-auto mb-2 mb-lg-0">
                            <MDBNavbarItem>
                                <div className="navbar-link-container">
                                    <MDBNavbarLink
                                        active
                                        aria-current="page"
                                        className="nav-link"
                                    >
                                        <Link to="/">Create Picture</Link>
                                    </MDBNavbarLink>
                                </div>
                            </MDBNavbarItem>

                            <MDBNavbarItem>
                                <div className="navbar-link-container">
                                    <MDBNavbarLink
                                        active
                                        aria-current="page"
                                        className="nav-link"
                                    >
                                        <Link to="/filter">Filter</Link>
                                    </MDBNavbarLink>
                                </div>
                            </MDBNavbarItem>

                            <MDBNavbarItem>
                                <div className="navbar-link-container">
                                    <MDBNavbarLink
                                        active
                                        aria-current="page"
                                        className="nav-link"
                                    >
                                        <Link to="/contact">Contact</Link>
                                    </MDBNavbarLink>
                                </div>
                            </MDBNavbarItem>
                        </MDBNavbarNav>
                    </MDBCollapse>
                </MDBContainer>
            </MDBNavbar>
        </>
    )
}

export default Menu;