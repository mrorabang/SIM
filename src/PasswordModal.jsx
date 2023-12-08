import React, { useState } from "react";

const PasswordModal = ({ isOpen, onClose, onPasswordSubmit }) => {
  const [password, setPassword] = useState("");

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = () => {
    onPasswordSubmit(password);
  };

  return (
    <>
      {isOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={onClose}>
              &times;
            </span>
            <h2>Enter Password</h2>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
            />
            <button onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      )}
    </>
  );
};

export default PasswordModal;
