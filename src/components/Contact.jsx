import React, { useState, useEffect } from "react";
import { 
    MDBContainer, 
    MDBRow, 
    MDBCol, 
    MDBCard, 
    MDBCardBody, 
    MDBCardHeader,
    MDBInput, 
    MDBBtn, 
    MDBIcon,
    MDBTextArea,
    MDBValidation,
    MDBValidationItem
} from "mdb-react-ui-kit";
import {showAlert} from "../service/AlertServices";
import {sendContactEmail} from "../service/SendMail";

function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        phoneNumber: "",
        email: "",
        subject: "",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [recipientEmail, setRecipientEmail] = useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Load email từ localStorage khi component mount
    useEffect(() => {
        const savedEmail = localStorage.getItem('recipientEmail');
        if (savedEmail) {
            setRecipientEmail(savedEmail);
        }
    }, []);

    const validateForm = () => {
        if (!formData.name.trim()) {
            showAlert('Vui lòng nhập họ tên!', 'warning');
            return false;
        }
        if (!formData.phoneNumber.trim()) {
            showAlert('Vui lòng nhập số điện thoại!', 'warning');
            return false;
        }
        if (!formData.message.trim()) {
            showAlert('Vui lòng nhập nội dung tin nhắn!', 'warning');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        // Kiểm tra email nhận
        // if (!recipientEmail) {
        //     const email = prompt('Vui lòng nhập email của bạn để nhận tin nhắn liên hệ:');
        //     if (!email) {
        //         showAlert('Vui lòng nhập email để tiếp tục!', 'warning');
        //         return;
        //     }
        //     setRecipientEmail(email);
        //     localStorage.setItem('recipientEmail', email);
        // }
        
        setIsSubmitting(true);
        
        try {
            // Chuẩn bị dữ liệu email
            const emailParams = {
                from_name: formData.name,
                from_email: formData.email || 'noreply@example.com',
                phone_number: formData.phoneNumber,
                subject: formData.subject || 'Liên hệ từ website',
                message: formData.message,
                to_email: recipientEmail
            };

            // Gửi email
            const result = await sendContactEmail(emailParams);
            
            if (result.success) {
                showAlert('Cảm ơn bạn đã liên hệ! Email đã được gửi thành công. Chúng tôi sẽ phản hồi sớm nhất có thể.', 'success');
                
                // Reset form
                setFormData({
                    name: "",
                    phoneNumber: "",
                    email: "",
                    subject: "",
                    message: ""
                });
            } else {
                showAlert(`Lỗi khi gửi email: ${result.message}`, 'error');
            }
        } catch (error) {
            console.error('Error sending email:', error);
            showAlert('Có lỗi xảy ra khi gửi email. Vui lòng thử lại sau!', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactInfo = [
        {
            icon: "phone",
            title: "Điện thoại",
            content: [
                { label: "Mr. Minh Quân", phone: "036.430.4301" },
                { label: "Mr. Minh Khánh", phone: "0911.858.858" }
            ]
        },
        {
            icon: "envelope",
            title: "Email",
            content: [
                { label: "Hỗ trợ", email: "support@sim.com" },
                { label: "Kỹ thuật", email: "tech@sim.com" }
            ]
        },
        {
            icon: "facebook",
            title: "Facebook",
            content: [
                { label: "Minh Quân", link: "https://www.facebook.com/mquan.0903?mibextid=LQQJ4d" },
                { label: "Minh Khánh", link: "https://www.facebook.com/profile.php?id=100058690037583&mibextid=LQQJ4d" }
            ]
        },
        {
            icon: "map-marker-alt",
            title: "Địa chỉ",
            content: [
                { label: "Văn phòng", address: "123 Đường ABC, Quận XYZ, TP.HCM" }
            ]
        }
    ];

    return (
        <MDBContainer fluid className="py-5">
            {/* Header Section */}
            <div className="text-center mb-5" >
                <h1 className="fw-bold text-primary mb-1">Liên hệ với chúng tôi</h1>
                <p className="text-muted fs-5">Chúng tôi luôn sẵn sàng hỗ trợ và lắng nghe ý kiến của bạn</p>
            </div>

            <MDBRow className="g-4">
                {/* Contact Information */}
                <MDBCol lg="4" md="6">
                    <MDBCard className="h-100 shadow-sm">
                        <MDBCardHeader className="bg-primary text-white">
                            <h4 className="mb-0">
                                <MDBIcon fas icon="info-circle" className="me-2" />
                                Thông tin liên hệ
                            </h4>
                        </MDBCardHeader>
                        <MDBCardBody className="p-4">
                            {contactInfo.map((info, index) => (
                                <div key={index} className="mb-4">
                                    <h6 className="fw-bold text-primary mb-3">
                                        <MDBIcon 
                                            fas={info.icon !== "facebook"} 
                                            fab={info.icon === "facebook"}
                                            icon={info.icon} 
                                            className="me-2" 
                                        />
                                        {info.title}
                                    </h6>
                                    {info.content.map((item, itemIndex) => (
                                        <div key={itemIndex} className="mb-2">
                                            <div className="fw-bold small">{item.label}</div>
                                            {item.phone && (
                                                <a href={`tel:${item.phone.replace(/\./g, '')}`} className="text-decoration-none">
                                                    {item.phone}
                                                </a>
                                            )}
                                            {item.email && (
                                                <a href={`mailto:${item.email}`} className="text-decoration-none">
                                                    {item.email}
                                                </a>
                                            )}
                                            {item.link && (
                                                <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                                                    Facebook Profile
                                                </a>
                                            )}
                                            {item.address && (
                                                <span className="text-muted">{item.address}</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>

                {/* Contact Form */}
                <MDBCol lg="8" md="6">
                    <MDBCard className="h-100 shadow-sm">
                        <MDBCardHeader className="bg-success text-white">
                            <h4 className="mb-0">
                                <MDBIcon fas icon="paper-plane" className="me-2" />
                                Gửi tin nhắn cho chúng tôi
                            </h4>
                        </MDBCardHeader>
                        <MDBCardBody className="p-4">
                            <MDBValidation onSubmit={handleSubmit} className="needs-validation" noValidate>
                                <MDBRow className="g-3">
                                    <MDBCol md="6">
                                        <MDBValidationItem feedback="Vui lòng nhập họ tên!" invalid>
                                            <MDBInput
                                                label="Họ và tên *"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </MDBValidationItem>
                                    </MDBCol>
                                    <MDBCol md="6">
                                        <MDBValidationItem feedback="Vui lòng nhập số điện thoại!" invalid>
                                            <MDBInput
                                                label="Số điện thoại *"
                                                name="phoneNumber"
                                                value={formData.phoneNumber}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </MDBValidationItem>
                                    </MDBCol>
                                    <MDBCol md="6">
                                        <MDBInput
                                            label="Email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                        />
                                    </MDBCol>
                                    <MDBCol md="6">
                                        <MDBInput
                                            label="Chủ đề"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                        />
                                    </MDBCol>
                                    <MDBCol md="12">
                                        <MDBValidationItem feedback="Vui lòng nhập nội dung tin nhắn!" invalid>
                                            <MDBTextArea
                                                label="Nội dung tin nhắn *"
                                                name="message"
                                                rows="5"
                                                value={formData.message}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </MDBValidationItem>
                                    </MDBCol>
                                    <MDBCol md="12">
                                        <div className="d-flex gap-2">
                                            <MDBBtn
                                                type="submit"
                                                color="primary"
                                                size="lg"
                                                disabled={isSubmitting}
                                                className="flex-fill"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <MDBIcon fas icon="spinner" spin className="me-2" />
                                                        Đang gửi...
                                                    </>
                                                ) : (
                                                    <>
                                                        <MDBIcon fas icon="paper-plane" className="me-2" />
                                                        Gửi tin nhắn
                                                    </>
                                                )}
                                            </MDBBtn>
                                            <MDBBtn
                                                type="button"
                                                color="secondary"
                                                size="lg"
                                                onClick={() => setFormData({
                                                    name: "",
                                                    phoneNumber: "",
                                                    email: "",
                                                    subject: "",
                                                    message: ""
                                                })}
                                            >
                                                <MDBIcon fas icon="undo" className="me-2" />
                                                Làm mới
                                            </MDBBtn>
                                        </div>
                                    </MDBCol>
                                </MDBRow>
                            </MDBValidation>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>

            {/* Additional Info */}
            <MDBRow className="mt-5">
                <MDBCol md="12">
                    <MDBCard className="bg-light">
                        <MDBCardBody className="text-center p-4">
                            <h5 className="fw-bold text-primary mb-3">
                                <MDBIcon fas icon="clock" className="me-2" />
                                Thời gian làm việc
                            </h5>
                            <MDBRow>
                                <MDBCol md="3">
                                    <div className="fw-bold">Thứ 2 - Thứ 6</div>
                                    <div className="text-muted">8:00 - 17:00</div>
                                </MDBCol>
                                <MDBCol md="3">
                                    <div className="fw-bold">Thứ 7</div>
                                    <div className="text-muted">8:00 - 12:00</div>
                                </MDBCol>
                                <MDBCol md="3">
                                    <div className="fw-bold">Chủ nhật</div>
                                    <div className="text-muted">Nghỉ</div>
                                </MDBCol>
                                <MDBCol md="3">
                                    <div className="fw-bold">Hỗ trợ 24/7</div>
                                    <div className="text-success">Hotline: 1900-xxxx</div>
                                </MDBCol>
                            </MDBRow>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
}

export default Contact;
