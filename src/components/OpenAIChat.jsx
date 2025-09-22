import React, { useState, useRef, useEffect } from 'react';
import { useOpenAI } from '../service/OpenAIService';

const OpenAIChat = () => {
    const { sendMessage, isLoading, error } = useOpenAI();
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [apiKeyStatus, setApiKeyStatus] = useState('checking');
    const messagesEndRef = useRef(null);

    // Auto scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Kiểm tra API key khi component mount
    useEffect(() => {
        const checkAPIKey = async () => {
            try {
                await sendMessage("Hello");
                setApiKeyStatus('valid');
            } catch (err) {
                setApiKeyStatus('invalid');
            }
        };
        checkAPIKey();
    }, [sendMessage]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = { role: 'user', content: inputMessage };
        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');

        try {
            const response = await sendMessage(inputMessage);
            const aiMessage = { role: 'assistant', content: response };
            setMessages(prev => [...prev, aiMessage]);
        } catch (err) {
            const errorMessage = { role: 'assistant', content: `Lỗi: ${err.message}` };
            setMessages(prev => [...prev, errorMessage]);
        }
    };

    const clearChat = () => {
        setMessages([]);
    };

    if (apiKeyStatus === 'checking') {
        return (
            <div className="card">
                <div className="card-body text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Đang kiểm tra API key...</p>
                </div>
            </div>
        );
    }

    if (apiKeyStatus === 'invalid') {
        return (
            <div className="card">
                <div className="card-body text-center">
                    <div className="alert alert-warning">
                        <h5>API Key chưa được cấu hình</h5>
                        <p>Vui lòng thêm REACT_APP_OPENAI_API_KEY vào file .env</p>
                        <small>Xem hướng dẫn trong file OPENAI_SETUP.md</small>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Chat AI (OpenAI)</h5>
                <button 
                    className="btn btn-sm btn-outline-secondary"
                    onClick={clearChat}
                    disabled={messages.length === 0}
                >
                    <i className="fas fa-trash me-1"></i>
                    Xóa chat
                </button>
            </div>
            <div className="card-body p-0">
                {/* Messages */}
                <div 
                    className="p-3" 
                    style={{ 
                        height: '400px', 
                        overflowY: 'auto',
                        backgroundColor: '#f8f9fa'
                    }}
                >
                    {messages.length === 0 ? (
                        <div className="text-center text-muted">
                            <i className="fas fa-robot fa-3x mb-3"></i>
                            <p>Xin chào! Tôi là AI assistant. Hãy bắt đầu cuộc trò chuyện!</p>
                        </div>
                    ) : (
                        messages.map((message, index) => (
                            <div 
                                key={index} 
                                className={`mb-3 d-flex ${message.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
                            >
                                <div 
                                    className={`p-3 rounded-3 ${
                                        message.role === 'user' 
                                            ? 'bg-primary text-white' 
                                            : 'bg-white border'
                                    }`}
                                    style={{ maxWidth: '80%' }}
                                >
                                    <div className="d-flex align-items-center mb-1">
                                        <i className={`fas ${message.role === 'user' ? 'fa-user' : 'fa-robot'} me-2`}></i>
                                        <small className="text-muted">
                                            {message.role === 'user' ? 'Bạn' : 'AI'}
                                        </small>
                                    </div>
                                    <div style={{ whiteSpace: 'pre-wrap' }}>
                                        {message.content}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                    {isLoading && (
                        <div className="d-flex justify-content-start mb-3">
                            <div className="bg-white border p-3 rounded-3">
                                <div className="d-flex align-items-center">
                                    <i className="fas fa-robot me-2"></i>
                                    <small className="text-muted me-2">AI</small>
                                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="border-top p-3">
                    <form onSubmit={handleSendMessage}>
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nhập tin nhắn..."
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                disabled={isLoading}
                            />
                            <button 
                                className="btn btn-primary" 
                                type="submit"
                                disabled={!inputMessage.trim() || isLoading}
                            >
                                {isLoading ? (
                                    <div className="spinner-border spinner-border-sm" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                ) : (
                                    <i className="fas fa-paper-plane"></i>
                                )}
                            </button>
                        </div>
                    </form>
                    {error && (
                        <div className="alert alert-danger mt-2 mb-0">
                            <small>{error}</small>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OpenAIChat;
