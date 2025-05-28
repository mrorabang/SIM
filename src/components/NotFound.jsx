import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div style={{
            textAlign: 'center',
            padding: '100px',
        }}>
            <h1 style={{ fontSize: '5rem', color: '#ff4d4f' }}>404</h1>
            <p style={{ fontSize: '1.5rem' }}>Trang bạn tìm không tồn tại.</p>
            <Link to="/" style={{
                marginTop: '20px',
                display: 'inline-block',
                backgroundColor: '#007bff',
                color: '#fff',
                padding: '10px 20px',
                textDecoration: 'none',
                borderRadius: '5px'
            }}>
                Quay về trang chủ
            </Link>
        </div>
    );
};

export default NotFound;
