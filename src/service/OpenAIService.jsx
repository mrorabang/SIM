import React, { useState } from 'react';
import { 
    sendOpenAIRequest, 
    createChatMessage, 
    processOpenAIResponse,
    OPENAI_CONFIG 
} from '../config/openai';

const OpenAIService = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Gửi tin nhắn đơn giản
    const sendMessage = async (message, systemPrompt = OPENAI_CONFIG.SYSTEM_PROMPTS.CHAT) => {
        setIsLoading(true);
        setError(null);
        
        try {
            const messages = [
                createChatMessage("system", systemPrompt),
                createChatMessage("user", message)
            ];
            
            const response = await sendOpenAIRequest(messages);
            const content = processOpenAIResponse(response);
            
            return content;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Chat với lịch sử
    const sendChatMessage = async (messages, systemPrompt = OPENAI_CONFIG.SYSTEM_PROMPTS.CHAT) => {
        setIsLoading(true);
        setError(null);
        
        try {
            const fullMessages = [
                createChatMessage("system", systemPrompt),
                ...messages
            ];
            
            const response = await sendOpenAIRequest(fullMessages);
            const content = processOpenAIResponse(response);
            
            return content;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Tạo nội dung sáng tạo
    const generateCreativeContent = async (prompt, type = "text") => {
        const systemPrompt = OPENAI_CONFIG.SYSTEM_PROMPTS.CREATIVE;
        return await sendMessage(prompt, systemPrompt);
    };

    // Hỗ trợ lập trình
    const generateCode = async (prompt) => {
        const systemPrompt = OPENAI_CONFIG.SYSTEM_PROMPTS.CODE;
        return await sendMessage(prompt, systemPrompt);
    };

    // Kiểm tra API key có hợp lệ không
    const validateAPIKey = async () => {
        try {
            await sendMessage("Hello", "You are a helpful assistant.");
            return true;
        } catch (err) {
            return false;
        }
    };

    return {
        sendMessage,
        sendChatMessage,
        generateCreativeContent,
        generateCode,
        validateAPIKey,
        isLoading,
        error
    };
};

// Hook để sử dụng OpenAI service
export const useOpenAI = () => {
    return OpenAIService();
};

// Export service instance
export default OpenAIService;
