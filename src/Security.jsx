import { MDBBtn, MDBInput } from 'mdb-react-ui-kit';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
function Security() {
    const nav=useNavigate();
    const [password, setPassword] = useState("");
    const handlePasswordSubmit = () => {
      if (password === "9320") {
        nav(`/homeQLSQuan`);
      } else {
        alert("Mật khẩu không đúng. Vui lòng thử lại.");
      }
    };

    return (
        <div>
            <div style={{width:"50%",margin:'50px auto'}}>
                Enter Password:
                <MDBInput label='Example label' id='form1' type='text'
                    label="Password"
                    id="form1"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}/>
                <MDBBtn style={{display:'block',margin:'20px auto'}} onClick={handlePasswordSubmit}>OK</MDBBtn>
            </div>
        </div>
    );
}

export default Security;