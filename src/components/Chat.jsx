import React, { useState, useEffect } from "react";
import {
    MainContainer,
    MessageContainer,
    MessageHeader,
    MessageInput,
    MessageList,
    MinChatUiProvider
} from "@minchat/react-chat-ui";
import { hybridAIService } from "../service/HybridAIService";

function Chat() {
    const [messages, setMessages] = useState([
        {
            text: "Xin chào! Tôi là AI, bạn cần tôi giúp gì?",
            user: { id: "ai", name: "AI Assistant" },
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedModel, setSelectedModel] = useState("local-ai");
    const [selectedService, setSelectedService] = useState("Local AI");
    const [availableModels, setAvailableModels] = useState(hybridAIService.getAvailableModels());
    const [availableServices] = useState(hybridAIService.getAvailableServices());

    const currentUserId = "user";

    const handleSend = async (text) => {
        if (!text.trim() || isLoading) return;

        const userMessage = {
            text: text,
            user: { id: currentUserId, name: "Bạn" }
        };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            // Tạo lịch sử cuộc trò chuyện từ messages gần đây
            const recentMessages = messages.slice(-6); // Lấy 6 tin nhắn gần nhất
            const conversationHistory = recentMessages
                .map(msg => `${msg.user.id === "ai" ? "AI" : "User"}: ${msg.text}`)
                .join("\n");

            const aiReply = await hybridAIService.sendMessage(text, conversationHistory);
            const aiMessage = {
                text: aiReply,
                user: { id: "ai", name: "AI Assistant" }
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (err) {
            console.error("❌ Lỗi AI:", err);
            setMessages(prev => [...prev, {
                text: "⚠️ Đã xảy ra lỗi khi xử lý AI. Vui lòng thử lại.",
                user: { id: "ai", name: "AI Assistant" }
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Thay đổi model
    const handleModelChange = (model) => {
        setSelectedModel(model);
        hybridAIService.setModel(model);
    };

    // Thay đổi service
    const handleServiceChange = (service) => {
        setSelectedService(service);
        hybridAIService.setService(service);
        // Cập nhật models khi thay đổi service
        setAvailableModels(hybridAIService.getAvailableModels());
    };

    // Xóa lịch sử chat
    const clearChat = () => {
        setMessages([{
            text: "Xin chào! Tôi là AI, bạn cần tôi giúp gì?",
            user: { id: "ai", name: "AI Assistant" },
        }]);
    };

    return (
        <MinChatUiProvider theme="#6ea9d7">
            <MainContainer style={{ height: '80vh' }}>
                <MessageContainer>
                    <MessageHeader 
                        title="Trò chuyện với AI (Local)"
                        rightElement={
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                                <select 
                                    value={selectedService} 
                                    onChange={(e) => handleServiceChange(e.target.value)}
                                    style={{
                                        padding: '5px 8px',
                                        borderRadius: '5px',
                                        border: '1px solid #ccc',
                                        fontSize: '11px',
                                        minWidth: '100px'
                                    }}
                                >
                                    {availableServices.map((service) => (
                                        <option key={service.value} value={service.name}>
                                            {service.name}
                                        </option>
                                    ))}
                                </select>
                                <select 
                                    value={selectedModel} 
                                    onChange={(e) => handleModelChange(e.target.value)}
                                    style={{
                                        padding: '5px 8px',
                                        borderRadius: '5px',
                                        border: '1px solid #ccc',
                                        fontSize: '11px',
                                        minWidth: '120px'
                                    }}
                                >
                                    {Object.entries(availableModels).map(([key, value]) => (
                                        <option key={key} value={value}>
                                            {key}
                                        </option>
                                    ))}
                                </select>
                                <button 
                                    onClick={clearChat}
                                    style={{
                                        padding: '5px 8px',
                                        borderRadius: '5px',
                                        border: '1px solid #ccc',
                                        backgroundColor: '#f8f9fa',
                                        cursor: 'pointer',
                                        fontSize: '11px'
                                    }}
                                >
                                    Xóa chat
                                </button>
                            </div>
                        }
                    />
                    <MessageList 
                        currentUserId={currentUserId} 
                        messages={messages} 
                        style={{ 
                            height: isLoading ? 'calc(100vh - 200px)' : 'calc(100vh - 150px)' 
                        }}
                    />
                    {isLoading && (
                        <div style={{ 
                            textAlign: 'center', 
                            padding: '10px',
                            color: '#666',
                            fontSize: '14px'
                        }}>
                            AI đang suy nghĩ...
                        </div>
                    )}
                    <MessageInput 
                        onSendMessage={handleSend} 
                        showSendButton 
                        disabled={isLoading}
                        placeholder={isLoading ? "Đang xử lý..." : "Nhập tin nhắn..."}
                    />
                </MessageContainer>
            </MainContainer>
        </MinChatUiProvider>
    );
}

export default Chat;
