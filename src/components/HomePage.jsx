import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBIcon } from 'mdb-react-ui-kit';
import './HomePage.css';
// Import ảnh nền
const bgImage = process.env.PUBLIC_URL + '/img/bg.jpg';

function HomePage() {
    const [isVisible, setIsVisible] = useState(false);
    const [currentFeature, setCurrentFeature] = useState(0);

    useEffect(() => {
        // Trigger animation after component mounts
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    // Auto-rotate features
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentFeature(prev => (prev + 1) % features.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const features = [
        {
            icon: 'image',
            title: 'AI Image Generator',
            description: 'Tạo ảnh nghệ thuật với AI mạnh mẽ',
            color: 'primary',
            path: '/sim-generator'
        },
        {
            icon: 'comments',
            title: 'Chat với AI',
            description: 'Trò chuyện thông minh với AI Assistant',
            color: 'success',
            path: '/chat'
        },
        {
            icon: 'envelope',
            title: 'Liên hệ',
            description: 'Kết nối và hỗ trợ từ đội ngũ chuyên nghiệp',
            color: 'info',
            path: '/contact'
        }
    ];

    const stats = [
        { number: '10K+', label: 'Ảnh đã tạo' },
        { number: '5K+', label: 'Người dùng' },
        { number: '99%', label: 'Hài lòng' },
        { number: '24/7', label: 'Hỗ trợ' }
    ];

    return (
        <div className="homepage">
            {/* Hero Section */}
            <section className="hero-section">
                <div 
                    className="hero-background"
                    style={{
                        backgroundImage: `url(${bgImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                >
                    <div className="hero-overlay"></div>
                </div>
                
                <MDBContainer className="hero-content">
                    <MDBRow className="align-items-center min-vh-100">
                        <MDBCol lg="6" className="text-center text-lg-start">
                            <div className={`hero-text ${isVisible ? 'animate-fade-in-up' : ''}`}>
                                <h1 className="hero-title">
                                    Chào mừng đến với
                                    <span className="gradient-text"> SIM Platform</span>
                                </h1>
                                <p className="hero-subtitle">
                                    Nền tảng AI tiên tiến với khả năng tạo ảnh và trò chuyện thông minh. 
                                    Khám phá sức mạnh của trí tuệ nhân tạo ngay hôm nay.
                                </p>
                                <div className="hero-buttons">
                                    <MDBBtn
                                        color="primary"
                                        size="lg"
                                        className="me-3 mb-3 hero-btn"
                                        tag={Link}
                                        to="/sim-generator"
                                    >
                                        <MDBIcon icon="image" className="me-2" />
                                        Bắt đầu tạo ảnh
                                    </MDBBtn>
                                    <MDBBtn
                                        color="outline-light"
                                        size="lg"
                                        className="mb-3 hero-btn"
                                        tag={Link}
                                        to="/chat"
                                    >
                                        <MDBIcon icon="comments" className="me-2" />
                                        Chat với AI
                                    </MDBBtn>
                                </div>
                            </div>
                        </MDBCol>
                        
                        <MDBCol lg="6" className="text-center">
                            <div className={`hero-visual ${isVisible ? 'animate-fade-in-right' : ''}`}>
                                <div className="floating-cards">
                                    <div className="card-1">
                                        <MDBIcon icon="image" size="3x" className="text-primary" />
                                        <p>AI Generator</p>
                                    </div>
                                    <div className="card-2">
                                        <MDBIcon icon="comments" size="3x" className="text-success" />
                                        <p>AI Chat</p>
                                    </div>
                                    <div className="card-3">
                                        <MDBIcon icon="cog" size="3x" className="text-info" />
                                        <p>Smart Tools</p>
                                    </div>
                                </div>
                            </div>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </section>

            {/* Features Section */}
            <section className="features-section py-5">
                <MDBContainer>
                    <div className="text-center mb-5">
                        <h2 className={`section-title ${isVisible ? 'animate-fade-in-up' : ''}`}>
                            Tính năng nổi bật
                        </h2>
                        <p className="section-subtitle">
                            Khám phá các công cụ AI mạnh mẽ được thiết kế cho bạn
                        </p>
                    </div>
                    
                    <MDBRow>
                        {features.map((feature, index) => (
                            <MDBCol md="4" key={index} className="mb-4">
                                <div 
                                    className={`feature-card ${isVisible ? 'animate-fade-in-up' : ''}`}
                                    style={{ animationDelay: `${index * 0.2}s` }}
                                >
                                    <div className="feature-icon">
                                        <MDBIcon 
                                            icon={feature.icon} 
                                            size="3x" 
                                            className={`text-${feature.color}`}
                                        />
                                    </div>
                                    <h4 className="feature-title">{feature.title}</h4>
                                    <p className="feature-description">{feature.description}</p>
                                    <MDBBtn
                                        color={feature.color}
                                        tag={Link}
                                        to={feature.path}
                                        className="feature-btn"
                                    >
                                        Khám phá ngay
                                        <MDBIcon icon="arrow-right" className="ms-2" />
                                    </MDBBtn>
                                </div>
                            </MDBCol>
                        ))}
                    </MDBRow>
                </MDBContainer>
            </section>

            {/* Stats Section */}
            <section className="stats-section py-5">
                <MDBContainer>
                    <MDBRow>
                        {stats.map((stat, index) => (
                            <MDBCol md="3" key={index} className="text-center mb-4">
                                <div 
                                    className={`stat-item ${isVisible ? 'animate-fade-in-up' : ''}`}
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <h3 className="stat-number">{stat.number}</h3>
                                    <p className="stat-label">{stat.label}</p>
                                </div>
                            </MDBCol>
                        ))}
                    </MDBRow>
                </MDBContainer>
            </section>

            {/* CTA Section */}
            <section className="cta-section py-5">
                <MDBContainer>
                    <div className="text-center">
                        <div className={`cta-content ${isVisible ? 'animate-fade-in-up' : ''}`}>
                            <h2 className="cta-title">Sẵn sàng bắt đầu?</h2>
                            <p className="cta-subtitle">
                                Tham gia cùng hàng nghìn người dùng đang sử dụng SIM Platform
                            </p>
                            <MDBBtn
                                color="primary"
                                size="lg"
                                className="cta-btn"
                                tag={Link}
                                to="/sim-generator"
                            >
                                <MDBIcon icon="rocket" className="me-2" />
                                Bắt đầu ngay
                            </MDBBtn>
                        </div>
                    </div>
                </MDBContainer>
            </section>
        </div>
    );
}

export default HomePage;
