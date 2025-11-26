import React, { useState } from "react";
import {
    MainContainer,
    MessageContainer,
    MessageHeader,
    MessageInput,
    MessageList,
    MinChatUiProvider
} from "@minchat/react-chat-ui";
import OpenAIService from "../service/OpenAIService";

function Chat() {
    const [messages, setMessages] = useState([
        {
            text: "Xin chào! Tôi là AI, bạn cần tôi giúp gì?",
            user: { id: "ai", name: "AI Assistant" },
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const openAIService = OpenAIService();

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
            const aiReply = await openAIService.sendMessage(text);
            
            const aiMessage = {
                text: aiReply,
                user: { id: "ai", name: "AI Assistant" }
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (err) {
            console.error("Lỗi khi gửi tin nhắn:", err);
            // Xử lý lỗi nếu cần
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chat-container" style={{ height: "85vh" }}>
            <MinChatUiProvider theme="#70a7ffff">
                <MainContainer>
                    <MessageContainer>
                        <MessageHeader />
                        <MessageList
                            currentUserId={currentUserId}
                            messages={messages}
                            // loading={isLoading}
                        />
                        <MessageInput
                            placeholder="Nhập tin nhắn..."
                            onSendMessage={handleSend}
                            disabled={isLoading}
                        />
                    </MessageContainer>
                </MainContainer>
            </MinChatUiProvider>
        </div>
    );
}

export default Chat;