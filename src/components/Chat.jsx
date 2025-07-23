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
            text: text,
            user: { id: currentUserId, name: "Bạn" }
        };
        setMessages(prev => [...prev, userMessage]);

        try {
            const aiReply = await callOpenAI(text);
            const aiMessage = {
                text: aiReply,
                user: { id: "ai", name: "AI Assistant" }
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (err) {
            console.error("❌ Lỗi AI:", err);
            setMessages(prev => [...prev, {
                text: "⚠️ Đã xảy ra lỗi khi xử lý AI.",
                user: { id: "ai", name: "AI Assistant" }
            }]);
        }
    };

    const callOpenAI = async (inputText) => {
        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // 👉 Đặt biến môi trường REACT_APP_OPENAI_API_KEY trong .env
                    "Authorization": `Bearer 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`
                },
                body: JSON.stringify({
                    "model": "gpt-4o-mini",
                    "store": true,
                    "messages": [
                        {"role": "user", "content": inputText}
                    ]
                })
            });

            if (!response.ok) {
                console.error("❌ Lỗi HTTP:", response.status, await response.text());
                return "Xin lỗi, tôi không thể phản hồi lúc này.";
            }

            const data = await response.json();

            if (data.choices && data.choices.length > 0) {
                return data.choices[0].message.content.trim();
            } else {
                return "AI không có phản hồi.";
            }
        } catch (error) {
            console.error("❌ Lỗi fetch OpenAI:", error);
            return "Xin lỗi, tôi không thể phản hồi lúc này.";
        }
    };

    return (
        <MinChatUiProvider theme="#6ea9d7">
            <MainContainer style={{ height: '100vh' }}>
                <MessageContainer>
                    <MessageHeader title="Trò chuyện với AI" />
                    <MessageList currentUserId={currentUserId} messages={messages} />
                    <MessageInput onSendMessage={handleSend} showSendButton />
                </MessageContainer>
            </MainContainer>
        </MinChatUiProvider>
    );
}

export default Chat;
