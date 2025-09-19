// Hugging Face Configuration
export const HUGGINGFACE_CONFIG = {
    // API endpoint cho text generation
    API_URL: "https://api-inference.huggingface.co/models",
    
    // Các models miễn phí tốt cho chat (không cần token)
    MODELS: {
        // Model đa ngôn ngữ (hỗ trợ tiếng Việt)
        MULTILINGUAL: "microsoft/DialoGPT-medium",
        
        // Model chat chuyên dụng
        CHAT: "microsoft/DialoGPT-medium",
        
        // Model general purpose
        GENERAL: "gpt2",
        
        // Model code generation
        CODE: "microsoft/CodeGPT-small-py",
        
        // Model tiếng Việt (có thể cần token)
        VIETNAMESE: "VietAI/vietnamese-gpt2"
    },
    
    // Default model
    DEFAULT_MODEL: "microsoft/DialoGPT-medium",
    
    // API headers - không cần token cho một số models
    HEADERS: {
        "Content-Type": "application/json"
    },
    
    // Request parameters
    PARAMS: {
        max_length: 100,
        temperature: 0.7,
        do_sample: true,
        top_p: 0.9,
        repetition_penalty: 1.1,
        return_full_text: false
    }
};

// Helper function để tạo request body
export const createRequestBody = (input, model = HUGGINGFACE_CONFIG.DEFAULT_MODEL) => {
    return {
        inputs: input,
        parameters: HUGGINGFACE_CONFIG.PARAMS,
        options: {
            use_cache: false,
            wait_for_model: true
        }
    };
};

// Helper function để xử lý response
export const processResponse = (data) => {
    if (Array.isArray(data) && data.length > 0) {
        return data[0].generated_text || data[0].text || "Xin lỗi, tôi không thể tạo phản hồi.";
    }
    return "Xin lỗi, có lỗi xảy ra khi xử lý phản hồi.";
};
