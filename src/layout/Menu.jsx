import {
    MDBBtn,
    MDBCollapse,
    MDBContainer,
    MDBIcon,
    MDBNavbar,
    MDBNavbarBrand,
    MDBNavbarItem,
    MDBNavbarLink,
    MDBNavbarNav,
    MDBNavbarToggler,
    MDBTooltip,
    MDBDropdown,
    MDBDropdownToggle,
    MDBDropdownMenu,
    MDBDropdownItem,
    MDBBadge
} from "mdb-react-ui-kit";
import { Link, useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { showConfirm, showAlert } from "../service/AlertServices";
import { getAvatarUrl } from "../config/cloudinary";

function Menu() {
    const [openBasic, setOpenBasic] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeItem, setActiveItem] = useState("");
    const user = JSON.parse(localStorage.getItem("user"));
    const nav = useNavigate();
    const location = useLocation();

    // Detect scroll for navbar styling
    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            setScrolled(isScrolled);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Set active menu item based on current route
    useEffect(() => {
        const path = location.pathname;
        if (path.includes('/sim-generator')) setActiveItem('generator');
        else if (path.includes('/chat')) setActiveItem('chat');
        else if (path.includes('/contact')) setActiveItem('contact');
        else if (path.includes('/profile')) setActiveItem('profile');
        else if (path.includes('/account')) setActiveItem('account');
        else setActiveItem('');
    }, [location]);

    // Xử lý logout
    const handleLogout = async () => {
        const confirm = await showConfirm("Bạn có chắc chắn muốn đăng xuất?", "warning");
        if (confirm) {
            localStorage.clear();
            nav("/login");
            showAlert("Đã đăng xuất!", "success");
        }
    };

    const menuItems = [
        {
            path: "/sim-generator",
            label: "Image Generator",
            icon: "image",
            color: "primary"
        },
        {
            path: "/chat",
            label: "Chat with AI",
            icon: "comments",
            color: "success"
        },
        {
            path: "/contact",
            label: "Contact",
            icon: "envelope",
            color: "info"
        }
    ];

    const NavLink = ({ item, children }) => (
        <Link
            to={item.path}
            className={`nav-link d-flex align-items-center px-3 py-2 rounded-pill text-decoration-none ${activeItem === item.path.split('/')[1] ? 'active' : ''
                }`}
            style={{
                transition: 'all 0.3s ease',
                fontWeight: activeItem === item.path.split('/')[1] ? '600' : '500',
                color: activeItem === item.path.split('/')[1] ? '#fff' : '#ffffff',
                backgroundColor: activeItem === item.path.split('/')[1] ? `var(--bs-${item.color})` : 'rgba(255,255,255,0.1)'
            }}
            onMouseEnter={(e) => {
                if (activeItem !== item.path.split('/')[1]) {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
                    e.currentTarget.style.color = '#ffffff';
                }
            }}
            onMouseLeave={(e) => {
                if (activeItem !== item.path.split('/')[1]) {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.color = '#ffffff';
                }
            }}
        >
            {children}
        </Link>
    );

    return (
        <>
            <style>
                {`
                    .navbar-custom {
                        background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%) !important;
                        backdrop-filter: blur(10px);
                        transition: all 0.3s ease;
                        box-shadow: 0 2px 20px rgba(0,0,0,0.15);
                    }
                    
                    .navbar-scrolled {
                        background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%) !important;
                        backdrop-filter: blur(20px);
                        box-shadow: 0 4px 30px rgba(0,0,0,0.12);
                        border-bottom: 1px solid rgba(255,255,255,0.1);
                    }
                    
                    .navbar-brand-custom {
                        transition: all 0.3s ease;
                    }
                    
                    .navbar-brand-custom:hover {
                        transform: scale(1.05);
                    }
                    
                    .nav-link.active {
                        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    }
                    
                    .profile-dropdown {
                        background: rgba(255, 255, 255, 0.15);
                        backdrop-filter: blur(10px);
                        border: 2px solid rgba(255, 255, 255, 0.3);
                        border-radius: 20px;
                        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                        transition: all 0.3s ease;
                    }
                    
                    .profile-dropdown:hover {
                        background: rgba(255, 255, 255, 0.25);
                        border-color: rgba(255, 255, 255, 0.5);
                        transform: translateY(-2px);
                        box-shadow: 0 12px 40px rgba(0,0,0,0.4);
                    }
                    
                    .profile-avatar {
                        transition: all 0.3s ease;
                    }
                    
                    .profile-avatar:hover {
                        transform: scale(1.1);
                        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    }
                    
                    .dropdown-toggle::after {
                        display: none !important;
                    }
                    
                    .navbar-toggler {
                        border: none;
                        padding: 0.25rem 0.5rem;
                    }
                    
                    .navbar-toggler:focus {
                        box-shadow: none;
                    }
                `}
            </style>

            <MDBNavbar
                expand="lg"
                className={`fixed-top navbar-custom ${scrolled ? 'navbar-scrolled' : ''}`}
                style={{ zIndex: 1050 }}
            >
                <MDBContainer fluid className="px-4">
                    {/* Logo */}
                    <MDBNavbarBrand className="navbar-brand-custom">
                        <div className="d-flex align-items-center">
                            <img
                                src="./img/logo1.png"
                                width="120px"
                                alt="SIM Logo"
                                className="me-2"
                                style={{ filter: 'brightness(0) invert(1)' }}
                            />
                            <div className="d-none d-md-block">
                                <div className="fw-bold fs-5" style={{ color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                                    SIM Platform
                                </div>
                                <small className="text-muted" style={{ color: 'rgba(255,255,255,0.8)', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                                    AI-Powered Solutions
                                </small>
                            </div>
                        </div>
                    </MDBNavbarBrand>

                    {/* Mobile Toggle */}
                    <MDBNavbarToggler
                        aria-controls="navbarSupportedContent"
                        aria-expanded={openBasic}
                        aria-label="Toggle navigation"
                        onClick={() => setOpenBasic(!openBasic)}
                        style={{ color: '#fff' }}
                    >
                        <MDBIcon icon="bars" fas />
                    </MDBNavbarToggler>

                    <MDBCollapse navbar open={openBasic}>
                        <MDBNavbarNav className="me-auto mb-2 mb-lg-0">
                            {menuItems.map((item, index) => (
                                <MDBNavbarItem key={index} className="mx-1">
                                    <NavLink item={item}>
                                        <MDBIcon
                                            fas
                                            icon={item.icon}
                                            className="me-2"
                                            style={{ fontSize: '1.1rem' }}
                                        />
                                        <span className="d-none d-lg-inline">{item.label}</span>
                                    </NavLink>
                                </MDBNavbarItem>
                            ))}
                        </MDBNavbarNav>

                        {/* User Profile Dropdown */}
                        <MDBDropdown className="ms-auto">
                            <MDBDropdownToggle
                                tag="div"
                                className="d-flex align-items-center text-decoration-none"
                                style={{ cursor: 'pointer' }}
                            >
                                <div
                                    className="profile-dropdown d-flex align-items-center px-3 py-2"
                                    style={{
                                        transition: 'all 0.3s ease',
                                        minWidth: '140px'
                                    }}
                                >
                                    {user.avatar ? (
                                        <img
                                            src={getAvatarUrl(user.avatar, 36)}
                                            alt="Avatar"
                                            className="profile-avatar me-2"
                                            style={{
                                                width: '36px',
                                                height: '36px',
                                                borderRadius: '50%',
                                                objectFit: 'cover',
                                                border: '2px solid rgba(255,255,255,0.3)'
                                            }}
                                        />
                                    ) : (
                                        <div
                                            className="profile-avatar d-flex align-items-center justify-content-center me-2"
                                            style={{
                                                width: '36px',
                                                height: '36px',
                                                backgroundColor: 'rgba(255,255,255,0.2)',
                                                borderRadius: '50%',
                                                border: '2px solid rgba(255,255,255,0.3)'
                                            }}
                                        >
                                            <MDBIcon
                                                fas
                                                icon="user"
                                                className="text-white"
                                                style={{ fontSize: '1.2rem' }}
                                            />
                                        </div>
                                    )}
                                    <div className="d-flex flex-column">
                                        <div className="d-flex align-items-center">
                                            <span
                                                className="fw-bold me-2"
                                                style={{
                                                    fontSize: '0.9rem',
                                                    color: '#ffffff',
                                                    lineHeight: '1.2',
                                                    textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                                                }}
                                            >
                                                {user.fullname}
                                            </span>
                                            <MDBIcon
                                                fas
                                                icon="chevron-down"
                                                size="xs"
                                                style={{
                                                    color: 'rgba(255,255,255,0.9)',
                                                    fontSize: '0.7rem'
                                                }}
                                            />
                                        </div>

                                    </div>
                                </div>
                            </MDBDropdownToggle>

                            <MDBDropdownMenu
                                className="mt-2"
                                style={{
                                    borderRadius: '15px',
                                    border: 'none',
                                    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                                    minWidth: '200px'
                                }}
                            >

                                <MDBDropdownItem
                                    link
                                    onClick={() => nav("/profile")}
                                    className="d-flex align-items-center py-2"
                                >
                                    <MDBIcon fas icon="user" className="me-3 text-primary" />
                                    <div>
                                        <div className="fw-bold">Profile</div>
                                    </div>
                                </MDBDropdownItem>

                                {user.role === "ADMIN" && (
                                    <MDBDropdownItem
                                        link
                                        onClick={() => nav("/account")}
                                        className="d-flex align-items-center py-2"
                                    >
                                        <MDBIcon fas icon="users-cog" className="me-3 text-warning" />
                                        <div>
                                            <div className="fw-bold">Account Management</div>
                                        </div>
                                    </MDBDropdownItem>
                                )}

                                <MDBDropdownItem divider />

                                <MDBDropdownItem
                                    link
                                    onClick={handleLogout}
                                    className="d-flex align-items-center py-2 text-danger"
                                >
                                    <MDBIcon fas icon="sign-out-alt" className="me-3" />
                                    <div>
                                        <div className="fw-bold">Logout</div>
                                    </div>
                                </MDBDropdownItem>
                            </MDBDropdownMenu>
                        </MDBDropdown>
                    </MDBCollapse>
                </MDBContainer>
            </MDBNavbar>

            {/* Spacer for fixed navbar */}
            <div style={{ height: '80px' }}></div>
        </>
    );
}

export default Menu;
