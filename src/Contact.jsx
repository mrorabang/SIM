import { MDBIcon } from "mdb-react-ui-kit";
function Contact() {
    return ( 
        <div className="gr-contact">
            <center><h1>Liên Hệ</h1></center>
            <p>
            <MDBIcon className="icon" fas icon="phone" size="3x" />
             <a href="tel:0364304301">036.430.4301</a> - Mr. Minh Quân | 
             <a href="tel:0911858858">0911.858.858</a> - Mr.Minh Khánh
            <br />
            <MDBIcon fab icon="facebook" size="3x" /> <a href="https://www.facebook.com/mquan.0903?mibextid=LQQJ4d">https://www.facebook.com/mquan.0903?mibextid=LQQJ4d</a>
            </p>
            <br />

        </div>
     );
}

export default Contact;