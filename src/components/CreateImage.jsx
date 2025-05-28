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
  MDBFile,
  MDBIcon,
  MDBRadio,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter
} from "mdb-react-ui-kit";
import html2canvas from "html2canvas";
import Swal from 'sweetalert2';
import SecurityModal from "./SecurityModal";

const CreateImage = () => {
  const [inputText, setInputText] = useState("");
  const [output, setOutput] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const originalInputText = useRef("");
  const [filterType, setFilterType] = useState("=");
  const [buttonDisabled, setButtonDisabled] = useState(true); // State để kiểm soát trạng thái của nút

  useEffect(() => {
    // Kiểm tra nội dung của textarea và cập nhật trạng thái của nút
    if (inputText.trim() === "") {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  }, [inputText]);

  const parseInput = () => {
    let regex;
    if (filterType === '=') {
      regex = /([\d.]+)\s*=\s*(.+)/g;
    } else if (filterType === '-') {
      regex = /([\d.]+)\s*-\s*(.+)/g;
    }
    const matches = [...inputText.matchAll(regex)];

    if (!matches || matches.length === 0) {
      console.log("Không có sản phẩm nào được tìm thấy.");
      return;
    }

    const result = matches.map((match) => {
      const product = match[1];
      const price = parseFloat(match[2]);
      return { product, price };
    });

    setOutput(result);
    originalInputText.current = inputText;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (readerEvent) => {
          setSelectedImage(readerEvent.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        console.error('Chỉ chấp nhận file hình ảnh.');
      }
    }
  };

  const handleAllImagesButtonClick = () => {
    const downloadPromises = [];

    output.forEach((o, index) => {
      const container = document.getElementById(`imageContainer-${index}`);
      const downloadPromise = html2canvas(container).then((canvas) => {
        const imgUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = imgUrl;
        link.download = `Sim_${index + 1}.png`;
        link.click();
      });

      downloadPromises.push(downloadPromise);
    });

    Promise.all(downloadPromises).then(() => {
      console.log("Đã tải xuống tất cả ảnh!");
      Swal.fire("Đã tải xuống tất cả ảnh !");
    });
  };

  return (
    <div className="App">
      <div className="header">
        <h1>CREATE PICTURE</h1>
      </div>
      <label htmlFor="inputText" style={{ fontSize: '30px' }}>Hãy nhập list tại đây:</label><br />
      <textarea
        id="inputText"
        cols="30"
        rows="5"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      ></textarea>
      <br />
      <div className="upload">
        <MDBFile size='sm' id='formFileSm' onChange={handleImageChange} />
      </div>
      <div className="gr-radio">
        <MDBRadio name='inlineRadio' id='inlineRadio1' value='<=' checked={filterType === '='} label="Phân cách bởi dấu '=' " inline onChange={() => setFilterType('=')} />
        <MDBRadio name='inlineRadio' id='inlineRadio2' value='>=' label="Phân cách bởi dấu '-' " inline onChange={() => setFilterType('-')} />
      </div>
      <MDBBtn disabled={buttonDisabled} onClick={parseInput}>Tách số và Giá Bán</MDBBtn><br /><br />
      <MDBBtn onClick={handleAllImagesButtonClick}>
        <MDBIcon fas icon="download" />
        Tải tất cả ảnh
      </MDBBtn>
      <hr />
      <MDBContainer>
        <MDBRow center>
          <MDBCol size="4">
            <div className="result">
              <strong>Kết quả ( {output.length} số ) :</strong>
              <MDBListGroup numbered style={{ maxWidth: "26rem" }} light>
                {output.map((o, index) => (
                  <MDBListGroupItem
                    key={index}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">{o.product}</div>
                    </div>
                    <MDBBadge pill light>
                      {o.price} Triệu <br />
                    </MDBBadge>
                  </MDBListGroupItem>
                ))}
              </MDBListGroup>
            </div>
          </MDBCol>
          <MDBCol size="4">
            <MDBInput
              label="Tìm số trong kết quả"
              id="formControlLg"
              type="text"
              size="lg"
            />
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <br /><br />
      <hr />
      <h1>Tạo ảnh</h1>
      {output.map((o, index) => (
        <div key={index}>
          <div className="gr-img">
            <label className="bg-image label-img" id={`imageContainer-${index}`}>
              <img src={selectedImage} alt="Sample" />
              <div className="mask">
                <div className="d-flex justify-content-center align-items-center h-100">
                  <p className="text-red mb-0 homeg-name" >
                    {o.product} <br />
                    <span className="homeg-price" style={{
                      color: "black", fontSize: '40px'
                    }}>
                      Giá bán: {o.price} Triệu <br /> <span style={{ color: 'rgb(185, 39, 39)', fontSize: '20px' }}>(Còn bớt lộc)<br />Hỗ Trợ Trả Góp</span>
                    </span>
                  </p>
                </div>
              </div>
            </label>
          </div>
          <br /><br /><br />
        </div>
      ))}
      <SecurityModal/>
    </div>
  );
};

export default CreateImage;
