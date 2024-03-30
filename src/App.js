import "./App.css";
import Contact from "./Contact";
import HomeG from "./HomeG";
import { Routes, Route, Link } from "react-router-dom";
import React, { useState } from "react";
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBCollapse,
} from "mdb-react-ui-kit";
import Sort from "./Sort";
function App() {
  const [openBasic, setOpenBasic] = useState(false);

  return (
    <>
      <MDBNavbar expand="lg" light bgColor="light" className="fixed-top">
        <MDBContainer fluid>
          <MDBNavbarBrand>
            <img src="./img/logo1.png" width={"110px"} alt="" />
          </MDBNavbarBrand>
          <MDBNavbarToggler
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={() => setOpenBasic(!openBasic)}
          >
            <MDBIcon icon="bars" fas />
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

      <Routes>
        <Route path="/" element={<HomeG />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/filter" element={<Sort />} />
      </Routes>
    </>
  );
}
export default App;
