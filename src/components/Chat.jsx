import React, { useState } from "react";
import {
    MainContainer,
    MessageContainer,
    MessageHeader,
    MessageInput,
    MessageList,
    MinChatUiProvider
} from "@minchat/react-chat-ui";

function Chat() {
    const [messages, setMessages] = useState([
        {
            text: "Xin chào! Tôi là AI, bạn cần tôi giúp gì?",
            user: { id: "ai", name: "AI Assistant" },
        }
    ]);

    const currentUserId = "user";

    const handleSend = async (text) => {
        if (!text.trim()) return;

        const userMessage = {
            text: String(text),  // Ép kiểu chuỗi
            user: { id: currentUserId, name: "Bạn" }
        };
        setMessages(prev => [...prev, userMessage]);

        // Gọi AI và thêm phản hồi
        try {
            const aiReply = await getAIResponse(text);
            const aiMessage = {
                text: String(aiReply),  // Ép kiểu chuỗi
                user: { id: "ai", name: "AI Assistant" }
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (err) {
            setMessages(prev => [...prev, {
                text: "⚠️ Đã xảy ra lỗi khi xử lý AI.",
                user: { id: "ai", name: "AI Assistant" }
            }]);
        }
    };

    const getAIResponse = async (inputText) => {
        try {
            if (typeof window !== "undefined" && window.puter && window.puter.ai) {
                const response = await window.puter.ai.chat(inputText);
                return response || "Tôi chưa hiểu bạn nói gì.";
            } else {
                console.error("Puter.js chưa được tải hoặc chưa khởi tạo đúng.");
                return "Không thể kết nối với AI lúc này.";
            }
        } catch (error) {
            console.error("Lỗi gọi API Puter:", error);
            return "Xin lỗi, tôi không thể phản hồi lúc này.";
        }
    };


    return (
        <MinChatUiProvider theme="#6ea9d7">
            <MainContainer style={{ height: '100vh' }}>
                <MessageContainer>
                    <MessageHeader title="Trò chuyện với AI (Hugging Face API)" />
                    <MessageList currentUserId={currentUserId} messages={messages} />
                    <MessageInput onSendMessage={handleSend} showSendButton />
                </MessageContainer>
            </MainContainer>
        </MinChatUiProvider>
    );
}

export default Chat;
