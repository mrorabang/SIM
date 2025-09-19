/**
 * Local AI Service - Sử dụng responses có sẵn và pattern matching
 * Hoàn toàn miễn phí và không cần API key
 */

export class LocalAIService {
    constructor() {
        this.responses = {
            greeting: [
                "Xin chào! Tôi là AI assistant. Bạn cần tôi giúp gì?",
                "Chào bạn! Tôi sẵn sàng hỗ trợ bạn.",
                "Xin chào! Bạn muốn tôi giúp gì hôm nay?",
                "Tôi là AI assistant. Bạn có câu hỏi gì không?",
                "Chào! Tôi có thể giúp bạn trả lời câu hỏi."
            ],
            help: [
                "Tôi có thể giúp bạn trả lời câu hỏi, giải thích khái niệm, hoặc trò chuyện.",
                "Bạn có thể hỏi tôi về bất kỳ chủ đề nào. Tôi sẽ cố gắng trả lời tốt nhất có thể.",
                "Tôi sẵn sàng giúp bạn với các câu hỏi về công nghệ, cuộc sống, hoặc bất kỳ chủ đề nào khác.",
                "Hãy hỏi tôi bất cứ điều gì bạn muốn biết!",
                "Tôi ở đây để giúp đỡ bạn. Bạn muốn hỏi gì?"
            ],
            technology: [
                "Công nghệ đang phát triển rất nhanh. Bạn quan tâm đến lĩnh vực nào?",
                "AI, machine learning, web development - tất cả đều rất thú vị!",
                "Công nghệ giúp cuộc sống trở nên dễ dàng hơn. Bạn có dự án nào đang làm không?",
                "Lập trình là một kỹ năng rất hữu ích trong thời đại này.",
                "Công nghệ mở ra nhiều cơ hội mới cho mọi người."
            ],
            general: [
                "Đó là một câu hỏi thú vị! Bạn có thể chia sẻ thêm chi tiết không?",
                "Tôi hiểu bạn đang hỏi về điều này. Bạn muốn tôi giải thích như thế nào?",
                "Đây là một chủ đề hay. Bạn có kinh nghiệm gì về nó không?",
                "Tôi cần hiểu rõ hơn về câu hỏi của bạn. Bạn có thể nói cụ thể hơn không?",
                "Đó là một vấn đề quan trọng. Bạn đã thử cách nào chưa?"
            ]
        };
    }

    /**
     * Gửi tin nhắn và nhận phản hồi
     */
    async sendMessage(message, conversationHistory = "") {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

        const response = this.generateResponse(message);
        return response;
    }

    /**
     * Tạo phản hồi dựa trên tin nhắn
     */
    generateResponse(message) {
        const lowerMessage = message.toLowerCase();

        // Pattern matching
        if (this.isGreeting(lowerMessage)) {
            return this.getRandomResponse('greeting');
        }

        if (this.isHelpRequest(lowerMessage)) {
            return this.getRandomResponse('help');
        }

        if (this.isTechnologyRelated(lowerMessage)) {
            return this.getRandomResponse('technology');
        }

        // Default response
        return this.getRandomResponse('general');
    }

    /**
     * Kiểm tra xem có phải lời chào không
     */
    isGreeting(message) {
        const greetings = ['chào', 'hello', 'hi', 'xin chào', 'hey', 'chào bạn'];
        return greetings.some(greeting => message.includes(greeting));
    }

    /**
     * Kiểm tra xem có phải yêu cầu giúp đỡ không
     */
    isHelpRequest(message) {
        const helpWords = ['giúp', 'help', 'hỗ trợ', 'làm sao', 'cách', 'hướng dẫn'];
        return helpWords.some(word => message.includes(word));
    }

    /**
     * Kiểm tra xem có liên quan đến công nghệ không
     */
    isTechnologyRelated(message) {
        const techWords = ['code', 'lập trình', 'ai', 'công nghệ', 'tech', 'programming', 'javascript', 'react', 'python'];
        return techWords.some(word => message.includes(word));
    }

    /**
     * Lấy response ngẫu nhiên từ category
     */
    getRandomResponse(category) {
        const responses = this.responses[category] || this.responses.general;
        const randomIndex = Math.floor(Math.random() * responses.length);
        return responses[randomIndex];
    }

    /**
     * Thay đổi model (không có tác dụng với local service)
     */
    setModel(model) {
        console.log("Local AI Service không hỗ trợ thay đổi model");
    }

    /**
     * Lấy danh sách models (giả lập)
     */
    getAvailableModels() {
        return {
            "Local AI": "local-ai",
            "Smart Assistant": "smart-assistant",
            "Help Bot": "help-bot"
        };
    }
}

// Export instance mặc định
export const localAIService = new LocalAIService();
