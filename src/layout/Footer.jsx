import React from "react";
import {
    MDBContainer,
    MDBFooter,
    MDBIcon,
    MDBRow,
    MDBCol
} from "mdb-react-ui-kit";

function Footer() {
    return (
        <MDBFooter
            bgColor="light"
            className="text-center text-lg-left mt-auto border-top"
        >
            <MDBContainer className="p-4">
                <MDBRow className="align-items-center">
                    {/* Logo và tên website */}
                    <MDBCol lg="6" md="12" className="mb-4 mb-md-0 d-flex align-items-center">
                        <img src={process.env.PUBLIC_URL + '/img/logo1.png'}
                            width="60" alt="Logo" className="me-2" />
                        <h6 className="text-muted m-0">© 2025 Minh Quan Web</h6>
                    </MDBCol>

                    {/* Social Icons */}
                    <MDBCol lg="6" md="12" className="text-center text-lg-end">
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="me-3 text-muted"
                        >
                            <MDBIcon fab icon="facebook-f" />
                        </a>
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="me-3 text-muted"
                        >
                            <MDBIcon fab icon="twitter" />
                        </a>
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="me-3 text-muted"
                        >
                            <MDBIcon fab icon="instagram" />
                        </a>
                        <a
                            href="mailto:contact@example.com"
                            className="text-muted"
                        >
                            <MDBIcon fas icon="envelope" />
                        </a>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </MDBFooter>
    );
}

export default Footer;
