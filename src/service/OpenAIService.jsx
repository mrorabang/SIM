import { 
    sendOpenAIRequest, 
    createChatMessage, 
    processOpenAIResponse,
    OPENAI_CONFIG 
} from '../config/openai';
import {useState} from 'react';

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

    return {
        sendMessage,
        sendChatMessage,
        isLoading,
        error
    };
};

export default OpenAIService;

// Hook for React components
export const useOpenAI = () => {
    const service = OpenAIService();
    return service;
};