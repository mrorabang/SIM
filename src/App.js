import "./App.css";
import Contact from "./Contact";
import Home from "./Home";
import HomeG from "./HomeG";
import Security from "./Security";
import { Routes, Route, Link } from "react-router-dom";
import React, { useState } from 'react';
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
} from 'mdb-react-ui-kit';
function App() {
  const [openBasic, setOpenBasic] = useState(false);

  return (
    <>
      <MDBNavbar expand="lg" light bgColor="light" className="fixed-top">
        <MDBContainer fluid>
          <MDBNavbarBrand>
            <img src="./img/logo1.png" width={'110px'} alt="" />
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
                <MDBNavbarLink active aria-current="page">
                <Link to="/homeg9320">Sim Trả Góp</Link>
                </MDBNavbarLink>
              </MDBNavbarItem>
              <MDBNavbarItem>
                <MDBNavbarLink>
                <Link to="/home9320">Sim Không Góp</Link>
                </MDBNavbarLink>
              </MDBNavbarItem>
              <MDBNavbarItem>
                <MDBNavbarLink >
                 <Link to="/contact">Liên Hệ</Link>
                </MDBNavbarLink>
              </MDBNavbarItem>
            </MDBNavbarNav>
          </MDBCollapse>
        </MDBContainer>
      </MDBNavbar> 

      <Routes>
        <Route path="/" element={<Security />} />
        <Route path="/home9320" element={<Home />} />
        <Route path="/homeg9320" element={<HomeG />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </>
  );
}
export default App;
