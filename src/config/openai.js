// OpenAI Configuration
export const OPENAI_CONFIG = {
    // API endpoint
    API_URL: "https://api.openai.com/v1/chat/completions",
    
    // Default model
    DEFAULT_MODEL: process.env.REACT_APP_OPENAI_MODEL || "gpt-3.5-turbo",
    
    // API key từ environment variable
    API_KEY: process.env.REACT_APP_OPENAI_API_KEY,
    
    // Organization ID (optional)
    ORG_ID: process.env.REACT_APP_OPENAI_ORG_ID,
    
    // Default parameters
    DEFAULT_PARAMS: {
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
    },
    
    // System prompts for different use cases
    SYSTEM_PROMPTS: {
        CHAT: "Bạn là một trợ lý AI thân thiện và hữu ích. Hãy trả lời bằng tiếng Việt một cách tự nhiên và chính xác.",
        CODE: "Bạn là một lập trình viên chuyên nghiệp. Hãy giúp đỡ với các vấn đề lập trình và code review.",
        CREATIVE: "Bạn là một nhà sáng tạo nội dung. Hãy giúp tạo ra những ý tưởng sáng tạo và nội dung hấp dẫn."
    }
};

// Helper function để tạo request headers
export const createOpenAIHeaders = () => {
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_CONFIG.API_KEY}`
    };
    
    if (OPENAI_CONFIG.ORG_ID) {
        headers["OpenAI-Organization"] = OPENAI_CONFIG.ORG_ID;
    }
    
    return headers;
};

// Helper function để tạo request body
export const createOpenAIRequestBody = (messages, model = OPENAI_CONFIG.DEFAULT_MODEL, params = {}) => {
    return {
        model: model,
        messages: messages,
        ...OPENAI_CONFIG.DEFAULT_PARAMS,
        ...params
    };
};

// Helper function để gửi request đến OpenAI
export const sendOpenAIRequest = async (messages, model = OPENAI_CONFIG.DEFAULT_MODEL, params = {}) => {
    if (!OPENAI_CONFIG.API_KEY) {
        throw new Error("OpenAI API key chưa được cấu hình. Vui lòng thêm REACT_APP_OPENAI_API_KEY vào file .env");
    }
    
    try {
        const response = await fetch(OPENAI_CONFIG.API_URL, {
            method: "POST",
            headers: createOpenAIHeaders(),
            body: JSON.stringify(createOpenAIRequestBody(messages, model, params))
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`OpenAI API Error: ${errorData.error?.message || response.statusText}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("OpenAI API Error:", error);
        throw error;
    }
};

// Helper function để tạo chat message
export const createChatMessage = (role, content) => {
    return { role, content };
};

// Helper function để xử lý response
export const processOpenAIResponse = (data) => {
    if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content;
    }
    return "Xin lỗi, tôi không thể tạo phản hồi.";
};
