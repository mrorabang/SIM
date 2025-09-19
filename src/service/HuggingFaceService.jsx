import { HUGGINGFACE_CONFIG, createRequestBody, processResponse } from "../config/huggingface";

/**
 * Service để gọi Hugging Face Inference API
 */
export class HuggingFaceService {
    constructor(model = HUGGINGFACE_CONFIG.DEFAULT_MODEL) {
        this.model = model;
        this.apiUrl = `${HUGGINGFACE_CONFIG.API_URL}/${model}`;
    }

    /**
     * Gửi tin nhắn đến Hugging Face API
     * @param {string} message - Tin nhắn từ người dùng
     * @param {string} conversationHistory - Lịch sử cuộc trò chuyện (optional)
     * @returns {Promise<string>} - Phản hồi từ AI
     */
    async sendMessage(message, conversationHistory = "") {
        try {
            // Tạo context từ lịch sử cuộc trò chuyện
            const context = conversationHistory ? 
                `${conversationHistory}\nUser: ${message}\nAI:` : 
                `User: ${message}\nAI:`;

            const requestBody = createRequestBody(context, this.model);

            console.log("🤖 Gửi request đến Hugging Face:", {
                model: this.model,
                message: message,
                context: context.substring(0, 100) + "..."
            });

            const response = await fetch(this.apiUrl, {
                method: "POST",
                headers: HUGGINGFACE_CONFIG.HEADERS,
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("❌ Lỗi Hugging Face API:", response.status, errorText);
                
                // Xử lý các lỗi phổ biến
                if (response.status === 503) {
                    return "Model đang được tải, vui lòng thử lại sau vài giây...";
                } else if (response.status === 429) {
                    return "Quá nhiều yêu cầu, vui lòng thử lại sau...";
                } else if (response.status === 401) {
                    return "Lỗi xác thực API. Vui lòng kiểm tra cấu hình.";
                } else {
                    return `Lỗi API: ${response.status}. Vui lòng thử lại.`;
                }
            }

            const data = await response.json();
            console.log("✅ Response từ Hugging Face:", data);

            const aiResponse = processResponse(data);
            
            // Làm sạch response
            return this.cleanResponse(aiResponse);

        } catch (error) {
            console.error("❌ Lỗi khi gọi Hugging Face API:", error);
            return "Xin lỗi, có lỗi xảy ra khi kết nối đến AI. Vui lòng thử lại.";
        }
    }

    /**
     * Làm sạch response từ AI
     * @param {string} response - Response thô từ AI
     * @returns {string} - Response đã được làm sạch
     */
    cleanResponse(response) {
        if (!response) return "Xin lỗi, tôi không thể tạo phản hồi.";

        // Loại bỏ các phần không cần thiết
        let cleaned = response
            .replace(/User:.*?AI:/g, "") // Loại bỏ context cũ
            .replace(/^AI:\s*/g, "") // Loại bỏ prefix "AI:"
            .replace(/\n+/g, " ") // Thay thế nhiều newline bằng space
            .trim();

        // Nếu response quá ngắn hoặc không có ý nghĩa
        if (cleaned.length < 3) {
            return "Xin lỗi, tôi không hiểu câu hỏi của bạn. Bạn có thể hỏi lại không?";
        }

        // Giới hạn độ dài response
        if (cleaned.length > 500) {
            cleaned = cleaned.substring(0, 500) + "...";
        }

        return cleaned;
    }

    /**
     * Thay đổi model
     * @param {string} newModel - Tên model mới
     */
    setModel(newModel) {
        this.model = newModel;
        this.apiUrl = `${HUGGINGFACE_CONFIG.API_URL}/${newModel}`;
        console.log("🔄 Đã chuyển sang model:", newModel);
    }

    /**
     * Lấy danh sách models có sẵn
     * @returns {Object} - Danh sách models
     */
    getAvailableModels() {
        return HUGGINGFACE_CONFIG.MODELS;
    }

    /**
     * Kiểm tra trạng thái model
     * @returns {Promise<boolean>} - Model có sẵn không
     */
    async checkModelStatus() {
        try {
            const response = await fetch(this.apiUrl, {
                method: "GET",
                headers: HUGGINGFACE_CONFIG.HEADERS
            });
            return response.ok;
        } catch (error) {
            console.error("❌ Lỗi kiểm tra model:", error);
            return false;
        }
    }
}

// Export instance mặc định
export const huggingFaceService = new HuggingFaceService();

// Export các helper functions
export const switchModel = (model) => {
    huggingFaceService.setModel(model);
};

export const getAvailableModels = () => {
    return huggingFaceService.getAvailableModels();
};

export const checkModelStatus = async () => {
    return await huggingFaceService.checkModelStatus();
};
