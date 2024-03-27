import React, { useState, useRef } from "react";
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
  MDBIcon
} from "mdb-react-ui-kit";
import html2canvas from "html2canvas";
import Swal from 'sweetalert2';

const HomeG = () => {
  const [inputText, setInputText] = useState("");
  const [output, setOutput] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const originalInputText = useRef("");
  const [filteredOutput, setFilteredOutput] = useState([]);


  const parseInput = () => {
    // const regex = /([\d.]+)\s*-\s*(.+)/g; // phan biet bang dau -
    const regex = /([\d.]+)\s*=\s*(.+)/g; // phan biet bang dau =

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
    //filter theo gia
    // const filteredResult = result.filter((item) => item.price >=50);//filter giá trên 50tr
    // setFilteredOutput(filteredResult);

    setOutput(result);//truyen vao khi muon filter
    // setOutput(result);
    originalInputText.current = inputText;
  };

  const handleImageChange = (e) => {
    // Lấy file từ sự kiện onChange
    const file = e.target.files[0];

    // Kiểm tra xem có file được chọn không
    if (file) {
      // Kiểm tra định dạng của file (ví dụ: kiểm tra có phải là file hình ảnh không)
      if (file.type.startsWith('image/')) {
        // Đọc file thành URL dạng base64
        const reader = new FileReader();
        reader.onload = (readerEvent) => {
          setSelectedImage(readerEvent.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        // Nếu không phải là file hình ảnh, bạn có thể xử lý hoặc thông báo lỗi ở đây
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
      <MDBBtn onClick={parseInput}>Tách số và Giá Bán</MDBBtn><br /><br />
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
              value={searchTerm}
            // onChange={(e) => setSearchTerm(e.target.value)}
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
              {/* set hình vuông có kích thước 736*736 */}
              <div className="mask">
                <div className="d-flex justify-content-center align-items-center h-100">
                  <p className="text-red mb-0 homeg-name" >
                    {o.product} <br />
                    <span className="homeg-price" style={{
                      color: "black", fontSize: '40px'
                    }}>
                      Giá bán: {o.price} Triệu <br /> <span style={{color:'rgb(185, 39, 39)',fontSize:'20px'}}>(Còn bớt lộc)<br />Hỗ Trợ Trả Góp</span>
                    </span>
                  </p>
                </div>
              </div>
            </label>
          </div>
          <br /><br /><br />
        </div>
      ))}
    </div>
  );
};

export default HomeG;