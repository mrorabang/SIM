import React, { useState, useRef, useEffect } from "react";
import {
  MDBListGroup,
  MDBListGroupItem,
  MDBBadge,
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
} from "mdb-react-ui-kit";

const Home = () => {
    const [inputText, setInputText] = useState("");
    const [output, setOutput] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const originalInputText = useRef("");
    const parseInput = () => {
      const regex = /([\d.]+)=(.+)/g;
      const matches = [...inputText.matchAll(regex)];
  
      if (!matches || matches.length === 0) {
        console.log("Không có sản phẩm nào được tìm thấy.");
        return;
      }
  
      const result = matches.map((match) => {
        const name = match[1];
        const price = parseFloat(match[2]);
        return { name, price };
      });
  
      setOutput(result);
      originalInputText.current = inputText;
    };
  
    const handleSearch = () => {
      const filteredResults = output.filter((product) =>
        product.name.includes(searchTerm)
      );
      setOutput(filteredResults);
    };
  
    useEffect(() => {
      handleSearch();
    }, [searchTerm]);
  
    
    return (
      <div className="App">
        <label htmlFor="inputText">Hãy nhập mảng tại đây:</label>
        <textarea
          id="inputText"
          cols="30"
          rows="5"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        ></textarea>
        <br />
        <MDBBtn onClick={parseInput}>Tách số và Giá Bán</MDBBtn>
        <hr />
        <MDBContainer>
          <MDBRow center>
            <MDBCol size="4">
              <div className="result">
                <strong>Kết quả:</strong>
                <MDBListGroup numbered style={{ maxWidth: "26rem" }} light>
                  {output.map((o) => {
                    return (
                      <MDBListGroupItem className="d-flex justify-content-between align-items-center">
                        <div className="ms-2 me-auto">
                          <div className="fw-bold">Số: {o.name}</div>
                        </div>
                        <MDBBadge pill light>
                          {o.price} Triệu
                        </MDBBadge>
                      </MDBListGroupItem>
                    );
                  })}
                </MDBListGroup>
              </div>
            </MDBCol>
            <MDBCol size="4">
              <MDBInput
                label="Tìm số trong kết quả"
                id="formControlLg"
                type="text"
                size="lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </MDBCol>
          </MDBRow>
        </MDBContainer>
  
        <hr />
        <h1>Tạo ảnh</h1>
        {output.map((o) => {
          return (
            <>
              <div>
              <img src="./img/bg.jpg" className="img" width={'500px'} alt="" />
              <div className="group">
                <p className="name">{o.name}</p>
              <p className="price">Giá : {o.price} Triệu</p>
              </div>
              </div>
            </>
          );
        })}
      </div>
    );
  };
  
  export default Home;