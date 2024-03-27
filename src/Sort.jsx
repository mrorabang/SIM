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
    MDBRadio,
    MDBInputGroup
} from "mdb-react-ui-kit";
import Swal from 'sweetalert2';

function Sort() {
    const [inputText, setInputText] = useState("");
    const [output, setOutput] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [filterType, setFilterType] = useState(""); // State mới để lưu trữ giá trị được chọn từ ô radio
    const originalInputText = useRef("");
    const [filteredOutput, setFilteredOutput] = useState([]);

    const parseInput = () => {
        const regex = /([\d.]+)\s*=\s*(.+)/g; // phan biet bang dau =
        // const regex = /([\d.]+)\s*-\s*(.+)/g; // phan biet bang dau -
        
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

        // Lọc kết quả dựa trên giá và loại filter
        let filteredResult = [];
        if (filterType === '<=') {
            filteredResult = result.filter((item) => item.price <= parseFloat(searchTerm));
        } else if (filterType === '>=') {
            filteredResult = result.filter((item) => item.price >= parseFloat(searchTerm));
        } else if (filterType === '=') {
            filteredResult = result.filter((item) => item.price === parseFloat(searchTerm));
        }

        setFilteredOutput(filteredResult);
        setOutput(filteredResult);
        originalInputText.current = inputText;
    };

    return (
        <>
            <div className="App">
                <div className="header">
                    <h1>FILTER BY PRICE</h1>
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
                <div className="inputprice mt-3 mb-3">
                    <MDBInput
                        label="Giá đưa vào...(Triệu)"
                        id="formControlLg"
                        type="text"
                        size="lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="gr-radio">
                    <MDBRadio name='inlineRadio' id='inlineRadio1' value='<=' label='Kết quả nhỏ hơn/bằng giá đưa vào' inline onChange={() => setFilterType('<=')} />
                    <MDBRadio name='inlineRadio' id='inlineRadio2' value='>=' label='Kết quả lớn hơn/bằng giá đưa vào' inline onChange={() => setFilterType('>=')} />
                    <MDBRadio name='inlineRadio' id='inlineRadio2' value='=' label=' Kết quả bằng giá đưa vào' inline onChange={() => setFilterType('=')} />
                </div>
                <br />
                <MDBBtn onClick={parseInput}>Filter</MDBBtn><br /><br />
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
                            <strong>Danh sách kết quả</strong>

                            <MDBInputGroup>
                                <textarea
                                    readOnly
                                    className="form-control"
                                    value={output.map((o,i) => `${o.product} = ${o.price} Triệu`).join("\n")}
                                ></textarea>
                            </MDBInputGroup>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
                <br /><br />
            </div>
        </>
    );
}

export default Sort;
