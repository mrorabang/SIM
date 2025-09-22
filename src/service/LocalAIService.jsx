/**
 * Local AI Service - Sử dụng responses có sẵn và pattern matching
 * Hoàn toàn miễn phí và không cần API key
 */

export class LocalAIService {
    constructor() {
        this.currentModel = "general-ai";
        
        // Định nghĩa các model AI khác nhau
        this.models = {
            "general-ai": {
                name: "General AI",
                description: "AI tổng quát, phù hợp cho mọi chủ đề",
                responses: {
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
                }
            },
            "creative-ai": {
                name: "Creative AI",
                description: "AI sáng tạo, chuyên về nghệ thuật, viết lách, ý tưởng",
                responses: {
                    greeting: [
                        "Xin chào! Tôi là Creative AI - chuyên gia về sáng tạo và nghệ thuật!",
                        "Chào bạn! Tôi có thể giúp bạn tạo ra những ý tưởng độc đáo.",
                        "Hello! Tôi là AI sáng tạo, sẵn sàng khơi nguồn cảm hứng cho bạn!",
                        "Chào! Tôi chuyên về viết lách, thiết kế và các ý tưởng sáng tạo.",
                        "Xin chào! Bạn muốn tạo ra điều gì thú vị hôm nay?"
                    ],
                    help: [
                        "Tôi có thể giúp bạn viết nội dung, tạo ý tưởng, thiết kế, hoặc giải quyết vấn đề sáng tạo.",
                        "Hãy cho tôi biết dự án sáng tạo của bạn, tôi sẽ giúp bạn phát triển nó!",
                        "Tôi chuyên về brainstorming, storytelling, và tạo ra những concept độc đáo.",
                        "Bạn cần ý tưởng cho bài viết, thiết kế, hay dự án nghệ thuật? Tôi ở đây để giúp!",
                        "Tôi có thể giúp bạn khám phá những góc nhìn mới và sáng tạo."
                    ],
                    creative: [
                        "Hãy thử nhìn vấn đề từ một góc độ hoàn toàn khác!",
                        "Điều gì sẽ xảy ra nếu chúng ta kết hợp hai ý tưởng tưởng chừng không liên quan?",
                        "Hãy tưởng tượng không có giới hạn - bạn sẽ làm gì?",
                        "Thử nghiệm là chìa khóa của sáng tạo. Bạn đã thử cách nào chưa?",
                        "Đôi khi những ý tưởng tốt nhất đến từ những sai lầm thú vị!"
                    ],
                    writing: [
                        "Hãy bắt đầu với một câu mở đầu thật ấn tượng!",
                        "Cảm xúc là yếu tố quan trọng nhất trong viết lách.",
                        "Hãy kể câu chuyện của bạn theo cách riêng biệt và độc đáo.",
                        "Chi tiết nhỏ có thể tạo nên sự khác biệt lớn trong tác phẩm.",
                        "Đừng sợ thử nghiệm với phong cách viết mới!"
                    ],
                    general: [
                        "Sáng tạo không có đúng sai, chỉ có thú vị và không thú vị!",
                        "Hãy để trí tưởng tượng của bạn bay xa!",
                        "Mỗi ý tưởng đều có giá trị, dù có vẻ kỳ lạ đến đâu.",
                        "Sáng tạo là quá trình, không phải kết quả cuối cùng.",
                        "Bạn có muốn thử một cách tiếp cận hoàn toàn mới không?"
                    ]
                }
            },
            "technical-ai": {
                name: "Technical AI",
                description: "AI kỹ thuật, chuyên về lập trình, công nghệ, giải quyết vấn đề",
                responses: {
                    greeting: [
                        "Xin chào! Tôi là Technical AI - chuyên gia về lập trình và công nghệ!",
                        "Chào bạn! Tôi có thể giúp bạn giải quyết các vấn đề kỹ thuật.",
                        "Hello! Tôi chuyên về code, debugging và phát triển phần mềm.",
                        "Chào! Tôi sẵn sàng giúp bạn với các dự án lập trình.",
                        "Xin chào! Bạn đang gặp vấn đề gì về công nghệ?"
                    ],
                    help: [
                        "Tôi có thể giúp bạn debug code, thiết kế hệ thống, hoặc giải thích các khái niệm kỹ thuật.",
                        "Hãy chia sẻ code hoặc mô tả vấn đề, tôi sẽ phân tích và đưa ra giải pháp!",
                        "Tôi chuyên về JavaScript, React, Python, và nhiều công nghệ khác.",
                        "Bạn cần tối ưu hóa code, fix bug, hay học công nghệ mới? Tôi ở đây để giúp!",
                        "Tôi có thể giúp bạn thiết kế architecture và best practices."
                    ],
                    programming: [
                        "Hãy xem xét vấn đề từ góc độ algorithm và data structure.",
                        "Code clean và readable quan trọng hơn code thông minh.",
                        "Hãy test kỹ lưỡng trước khi deploy!",
                        "Performance optimization cần được đo lường, không phải đoán.",
                        "Documentation là một phần không thể thiếu của code."
                    ],
                    debugging: [
                        "Hãy bắt đầu với việc reproduce lỗi một cách consistent.",
                        "Log và debug tools là bạn tốt nhất của developer.",
                        "Hãy kiểm tra từng bước một cách có hệ thống.",
                        "Đôi khi vấn đề nằm ở những chỗ không ngờ tới nhất.",
                        "Hãy thử approach khác nếu cách hiện tại không work."
                    ],
                    general: [
                        "Kỹ thuật là về giải quyết vấn đề một cách hiệu quả.",
                        "Hãy chia nhỏ vấn đề phức tạp thành các phần đơn giản hơn.",
                        "Learning không bao giờ dừng lại trong lĩnh vực công nghệ.",
                        "Best practice thay đổi theo thời gian, hãy luôn cập nhật.",
                        "Bạn có muốn tôi giải thích chi tiết hơn về vấn đề này không?"
                    ]
                }
            },
            "educational-ai": {
                name: "Educational AI",
                description: "AI giáo dục, chuyên về giảng dạy, giải thích, học tập",
                responses: {
                    greeting: [
                        "Xin chào! Tôi là Educational AI - người bạn học tập của bạn!",
                        "Chào bạn! Tôi có thể giúp bạn học và hiểu các khái niệm mới.",
                        "Hello! Tôi chuyên về giảng dạy và giải thích một cách dễ hiểu.",
                        "Chào! Tôi sẵn sàng giúp bạn với việc học tập và nghiên cứu.",
                        "Xin chào! Bạn muốn học về chủ đề gì hôm nay?"
                    ],
                    help: [
                        "Tôi có thể giúp bạn hiểu các khái niệm phức tạp, giải bài tập, hoặc chuẩn bị cho kỳ thi.",
                        "Hãy cho tôi biết bạn đang học gì, tôi sẽ giải thích theo cách dễ hiểu nhất!",
                        "Tôi chuyên về breaking down complex topics thành các phần đơn giản.",
                        "Bạn cần ôn tập, làm bài tập, hay học kiến thức mới? Tôi ở đây để giúp!",
                        "Tôi có thể tạo ra các ví dụ thực tế để bạn hiểu rõ hơn."
                    ],
                    learning: [
                        "Học tập hiệu quả cần có kế hoạch và thực hành thường xuyên.",
                        "Hãy đặt câu hỏi để hiểu sâu hơn về chủ đề này.",
                        "Mỗi người có cách học khác nhau - hãy tìm ra cách phù hợp với bạn.",
                        "Đừng sợ mắc lỗi - đó là cách học tốt nhất!",
                        "Hãy liên kết kiến thức mới với những gì bạn đã biết."
                    ],
                    explanation: [
                        "Hãy để tôi giải thích từng bước một cách chi tiết.",
                        "Tôi sẽ dùng ví dụ thực tế để bạn dễ hiểu hơn.",
                        "Hãy bắt đầu từ những khái niệm cơ bản trước.",
                        "Bạn có muốn tôi giải thích theo cách khác không?",
                        "Hãy thử áp dụng kiến thức này vào một tình huống cụ thể."
                    ],
                    general: [
                        "Kiến thức là sức mạnh - hãy không ngừng học hỏi!",
                        "Mỗi câu hỏi đều có giá trị trong quá trình học tập.",
                        "Hãy tò mò và khám phá những điều mới mẻ.",
                        "Học tập là một hành trình, không phải đích đến.",
                        "Bạn có muốn tôi tạo ra bài tập để luyện tập không?"
                    ]
                }
            },
            "entertainment-ai": {
                name: "Entertainment AI",
                description: "AI giải trí, chuyên về trò chơi, câu đố, kể chuyện",
                responses: {
                    greeting: [
                        "Xin chào! Tôi là Entertainment AI - chuyên gia về giải trí và vui chơi!",
                        "Chào bạn! Tôi có thể giúp bạn thư giãn và vui vẻ!",
                        "Hello! Tôi chuyên về games, jokes, và storytelling!",
                        "Chào! Tôi sẵn sàng chơi cùng bạn và tạo ra niềm vui!",
                        "Xin chào! Bạn muốn chơi gì hôm nay?"
                    ],
                    help: [
                        "Tôi có thể kể chuyện, tạo câu đố, chơi games, hoặc đơn giản là trò chuyện vui vẻ!",
                        "Hãy cho tôi biết bạn muốn làm gì để giải trí, tôi sẽ tạo ra niềm vui cho bạn!",
                        "Tôi chuyên về tạo ra những trải nghiệm thú vị và hài hước.",
                        "Bạn muốn nghe joke, chơi game, hay kể chuyện? Tôi ở đây để vui cùng bạn!",
                        "Tôi có thể tạo ra những hoạt động thú vị để bạn giải trí."
                    ],
                    games: [
                        "Hãy chơi một trò chơi thú vị! Tôi có nhiều ý tưởng hay.",
                        "Bạn thích trò chơi gì? Tôi có thể tạo ra game phù hợp!",
                        "Hãy thử thách bản thân với một câu đố khó!",
                        "Tôi có thể tạo ra trò chơi mới dựa trên sở thích của bạn.",
                        "Hãy chơi cùng nhau và tạo ra kỷ niệm vui vẻ!"
                    ],
                    jokes: [
                        "Tôi có một joke hay! Bạn có muốn nghe không?",
                        "Hãy cười một chút để tâm trạng tốt hơn!",
                        "Tôi có thể kể joke về bất kỳ chủ đề nào bạn muốn.",
                        "Laughter is the best medicine - hãy cười lên!",
                        "Tôi có thể tạo ra những tình huống hài hước cho bạn."
                    ],
                    stories: [
                        "Tôi có thể kể cho bạn nghe một câu chuyện thú vị!",
                        "Hãy để tôi tạo ra một adventure cho bạn!",
                        "Bạn thích thể loại truyện gì? Tôi có thể kể theo sở thích!",
                        "Tôi có thể tạo ra những nhân vật và plot twist bất ngờ.",
                        "Hãy cùng nhau tạo ra một câu chuyện tuyệt vời!"
                    ],
                    general: [
                        "Vui vẻ là điều quan trọng nhất trong cuộc sống!",
                        "Hãy tận hưởng từng khoảnh khắc!",
                        "Đôi khi chúng ta cần dừng lại và vui chơi một chút.",
                        "Tôi ở đây để mang lại niềm vui cho bạn!",
                        "Bạn có muốn thử một hoạt động vui nhộn không?"
                    ]
                }
            }
        };
        
        // Backward compatibility
        this.responses = this.models[this.currentModel].responses;
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
        const currentModelData = this.models[this.currentModel];

        // Pattern matching dựa trên model hiện tại
        if (this.isGreeting(lowerMessage)) {
            return this.getRandomResponse('greeting');
        }

        if (this.isHelpRequest(lowerMessage)) {
            return this.getRandomResponse('help');
        }

        // Pattern matching đặc biệt cho từng model
        if (this.currentModel === 'creative-ai') {
            if (this.isCreativeRelated(lowerMessage)) {
                return this.getRandomResponse('creative');
            }
            if (this.isWritingRelated(lowerMessage)) {
                return this.getRandomResponse('writing');
            }
        }

        if (this.currentModel === 'technical-ai') {
            if (this.isProgrammingRelated(lowerMessage)) {
                return this.getRandomResponse('programming');
            }
            if (this.isDebuggingRelated(lowerMessage)) {
                return this.getRandomResponse('debugging');
            }
        }

        if (this.currentModel === 'educational-ai') {
            if (this.isLearningRelated(lowerMessage)) {
                return this.getRandomResponse('learning');
            }
            if (this.isExplanationRequest(lowerMessage)) {
                return this.getRandomResponse('explanation');
            }
        }

        if (this.currentModel === 'entertainment-ai') {
            if (this.isGameRelated(lowerMessage)) {
                return this.getRandomResponse('games');
            }
            if (this.isJokeRequest(lowerMessage)) {
                return this.getRandomResponse('jokes');
            }
            if (this.isStoryRequest(lowerMessage)) {
                return this.getRandomResponse('stories');
            }
        }

        // Fallback cho technology (backward compatibility)
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
     * Kiểm tra xem có liên quan đến sáng tạo không
     */
    isCreativeRelated(message) {
        const creativeWords = ['sáng tạo', 'creative', 'nghệ thuật', 'art', 'thiết kế', 'design', 'ý tưởng', 'idea', 'viết', 'write', 'story', 'truyện'];
        return creativeWords.some(word => message.includes(word));
    }

    /**
     * Kiểm tra xem có liên quan đến viết lách không
     */
    isWritingRelated(message) {
        const writingWords = ['viết', 'write', 'bài viết', 'article', 'content', 'nội dung', 'blog', 'story', 'truyện', 'kể chuyện'];
        return writingWords.some(word => message.includes(word));
    }

    /**
     * Kiểm tra xem có liên quan đến lập trình không
     */
    isProgrammingRelated(message) {
        const programmingWords = ['code', 'lập trình', 'programming', 'debug', 'bug', 'function', 'hàm', 'variable', 'biến', 'algorithm', 'thuật toán'];
        return programmingWords.some(word => message.includes(word));
    }

    /**
     * Kiểm tra xem có liên quan đến debugging không
     */
    isDebuggingRelated(message) {
        const debuggingWords = ['debug', 'bug', 'lỗi', 'error', 'fix', 'sửa', 'troubleshoot', 'khắc phục', 'test', 'kiểm tra'];
        return debuggingWords.some(word => message.includes(word));
    }

    /**
     * Kiểm tra xem có liên quan đến học tập không
     */
    isLearningRelated(message) {
        const learningWords = ['học', 'learn', 'study', 'nghiên cứu', 'research', 'bài tập', 'exercise', 'kiến thức', 'knowledge', 'hiểu', 'understand'];
        return learningWords.some(word => message.includes(word));
    }

    /**
     * Kiểm tra xem có yêu cầu giải thích không
     */
    isExplanationRequest(message) {
        const explanationWords = ['giải thích', 'explain', 'tại sao', 'why', 'như thế nào', 'how', 'là gì', 'what is', 'mô tả', 'describe'];
        return explanationWords.some(word => message.includes(word));
    }

    /**
     * Kiểm tra xem có liên quan đến game không
     */
    isGameRelated(message) {
        const gameWords = ['game', 'trò chơi', 'chơi', 'play', 'puzzle', 'câu đố', 'quiz', 'thử thách', 'challenge'];
        return gameWords.some(word => message.includes(word));
    }

    /**
     * Kiểm tra xem có yêu cầu joke không
     */
    isJokeRequest(message) {
        const jokeWords = ['joke', 'đùa', 'hài hước', 'funny', 'cười', 'laugh', 'vui', 'hài'];
        return jokeWords.some(word => message.includes(word));
    }

    /**
     * Kiểm tra xem có yêu cầu kể chuyện không
     */
    isStoryRequest(message) {
        const storyWords = ['story', 'truyện', 'kể chuyện', 'tell story', 'adventure', 'phiêu lưu', 'tale', 'câu chuyện'];
        return storyWords.some(word => message.includes(word));
    }

    /**
     * Lấy response ngẫu nhiên từ category
     */
    getRandomResponse(category) {
        const currentModelData = this.models[this.currentModel];
        const responses = currentModelData.responses[category] || currentModelData.responses.general;
        const randomIndex = Math.floor(Math.random() * responses.length);
        return responses[randomIndex];
    }

    /**
     * Thay đổi model
     */
    setModel(model) {
        if (this.models[model]) {
            this.currentModel = model;
            this.responses = this.models[model].responses;
            console.log(`🔄 Switched to model: ${this.models[model].name}`);
            return true;
        } else {
            console.log(`❌ Model "${model}" not found. Available models:`, Object.keys(this.models));
            return false;
        }
    }

    /**
     * Lấy model hiện tại
     */
    getCurrentModel() {
        return {
            id: this.currentModel,
            name: this.models[this.currentModel].name,
            description: this.models[this.currentModel].description
        };
    }

    /**
     * Lấy danh sách models có sẵn
     */
    getAvailableModels() {
        const models = {};
        Object.keys(this.models).forEach(key => {
            models[this.models[key].name] = key;
        });
        return models;
    }

    /**
     * Lấy thông tin chi tiết về tất cả models
     */
    getAllModelsInfo() {
        return Object.keys(this.models).map(key => ({
            id: key,
            name: this.models[key].name,
            description: this.models[key].description
        }));
    }
}

// Export instance mặc định
export const localAIService = new LocalAIService();
