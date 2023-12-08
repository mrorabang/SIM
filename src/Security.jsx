import React, { useState, useEffect } from 'react';
import {
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBInput,
  MDBBtn
} from 'mdb-react-ui-kit';

export default function App() {
  const [basicModal, setBasicModal] = useState(true);
  const [password, setPassword] = useState("");
  const [shouldCloseModal, setShouldCloseModal] = useState(false);

  const handlePasswordSubmit = () => {
    if (password === "9320") {
      setShouldCloseModal(true);
    } else {
      alert("Mật khẩu không đúng. Vui lòng thử lại.");
    }
  };
  const handleCloseModal = () => {
    if (shouldCloseModal) {
      setBasicModal(false);
    }
  };
  useEffect(() => {
    if (basicModal) {
      setBasicModal(true);
    }
  }, [basicModal]);
  useEffect(() => {
    handleCloseModal();
  }, [shouldCloseModal]);

  return (
    <>
      <MDBModal
        open={basicModal}
        setopen={setBasicModal}
        tabIndex='-1'
        backdrop={shouldCloseModal ? true : 'static'}
        onClick={handleCloseModal}
      >
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Nhập mật khẩu</MDBModalTitle>
            </MDBModalHeader>
            <MDBModalBody>
              <MDBInput
                label='Nhập mật khẩu'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn onClick={handlePasswordSubmit}>OK</MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
}
