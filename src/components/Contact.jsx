import React, { useState } from "react";
import { MDBInputGroup, MDBIcon, MDBInput, MDBBtn } from "mdb-react-ui-kit";
import {showAlert} from "../service/AlertServices";

function Contact() {
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        showAlert('Chức năng đang phát triển!',"info")
        return;
    };

    return (
        <div className="gr-contact">
            <center>
                <h1>Liên Hệ</h1>
            </center>
            <p>
                <MDBIcon className="icon me-3" fas icon="phone" size="2x" />
                <a href="tel:0364304301">036.430.4301</a> - Mr. Minh Quân
                <a className="ms-3" href="tel:0911858858">0911.858.858</a> - Mr.Minh Khánh
                <br />
                <MDBIcon fab icon="facebook" className="me-3" size="3x" />{" "}
                <a href="https://www.facebook.com/mquan.0903?mibextid=LQQJ4d">
                    Minh Quân
                </a>

                <a className="ms-3" href="https://www.facebook.com/profile.php?id=100058690037583&mibextid=LQQJ4d">Minh Khánh</a>
            </p>
            <br />

            {/* Form */}
            <div className="form">
                <MDBInput label='Bạn tên gì ?' id='form1' type='text' value={name} onChange={(e) => setName(e.target.value)} />
                <br />
                <MDBInput label='Nhập số điện thoại bạn ...' id='form2' type='text' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                <br />
                <MDBInputGroup>
                    <textarea className='form-control' placeholder="Xin nhận góp ý tại đây ..." value={message} onChange={(e) => setMessage(e.target.value)} />
                </MDBInputGroup> <br />
                <MDBBtn rounded className='mx-2' color='dark' onClick={handleSubmit}>
                    Gửi
                </MDBBtn>
            </div>
        </div>
    );
    
}

export default Contact;
