/**
 * Free AI Service - Sử dụng các API miễn phí khác
 */

// Sử dụng Hugging Face Spaces API (miễn phí)
const HUGGINGFACE_SPACES_API = "https://api-inference.huggingface.co/models";

// Sử dụng một model đơn giản hơn
const SIMPLE_MODELS = {
    GPT2: "gpt2",
    DIALOGPT: "microsoft/DialoGPT-small", // Sử dụng small thay vì medium
    CODE: "microsoft/CodeGPT-small-py"
};

export class FreeAIService {
    constructor() {
        this.currentModel = SIMPLE_MODELS.GPT2;
    }

    /**
     * Gửi tin nhắn đến AI
     */
    async sendMessage(message, conversationHistory = "") {
        try {
            // Thử với model đơn giản trước
            const response = await this.trySimpleModel(message);
            if (response) {
                return response;
            }

            // Nếu không thành công, thử model khác
            return await this.tryAlternativeModel(message);

        } catch (error) {
            console.error("❌ Lỗi Free AI Service:", error);
            return this.getFallbackResponse(message);
        }
    }

    /**
     * Thử với model đơn giản
     */
    async trySimpleModel(message) {
        try {
            const response = await fetch(`${HUGGINGFACE_SPACES_API}/${this.currentModel}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    inputs: message,
                    parameters: {
                        max_length: 50,
                        temperature: 0.7,
                        do_sample: true,
                        return_full_text: false
                    }
                })
            });

            if (response.ok) {
                const data = await response.json();
                return this.processResponse(data);
            }
            return null;
        } catch (error) {
            console.error("❌ Lỗi model đơn giản:", error);
            return null;
        }
    }

    /**
     * Thử với model khác
     */
    async tryAlternativeModel(message) {
        const models = Object.values(SIMPLE_MODELS);
        
        for (const model of models) {
            try {
                const response = await fetch(`${HUGGINGFACE_SPACES_API}/${model}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        inputs: message,
                        parameters: {
                            max_length: 50,
                            temperature: 0.7,
                            do_sample: true,
                            return_full_text: false
                        }
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    this.currentModel = model;
                    return this.processResponse(data);
                }
            } catch (error) {
                console.error(`❌ Lỗi model ${model}:`, error);
                continue;
            }
        }
        
        return null;
    }

    /**
     * Xử lý response
     */
    processResponse(data) {
        if (Array.isArray(data) && data.length > 0) {
            let response = data[0].generated_text || data[0].text || "";
            
            // Làm sạch response
            response = response
                .replace(/^.*?AI:\s*/g, "")
                .replace(/User:.*$/g, "")
                .trim();

            if (response.length < 3) {
                return "Xin chào! Tôi có thể giúp gì cho bạn?";
            }

            return response.substring(0, 200);
        }
        return "Xin chào! Tôi có thể giúp gì cho bạn?";
    }

    /**
     * Response dự phòng
     */
    getFallbackResponse(message) {
        const responses = [
            "Xin chào! Tôi là AI assistant. Bạn cần tôi giúp gì?",
            "Tôi có thể giúp bạn trả lời câu hỏi. Hãy hỏi tôi nhé!",
            "Chào bạn! Tôi sẵn sàng hỗ trợ bạn.",
            "Xin chào! Bạn muốn tôi giúp gì hôm nay?",
            "Tôi là AI assistant. Bạn có câu hỏi gì không?"
        ];
        
        // Chọn response dựa trên message
        const index = message.length % responses.length;
        return responses[index];
    }

    /**
     * Thay đổi model
     */
    setModel(model) {
        this.currentModel = model;
    }

    /**
     * Lấy models có sẵn
     */
    getAvailableModels() {
        return SIMPLE_MODELS;
    }
}

// Export instance mặc định
export const freeAIService = new FreeAIService();
