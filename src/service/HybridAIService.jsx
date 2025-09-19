/**
 * Hybrid AI Service - Kết hợp nhiều AI services
 * Tự động fallback khi một service không hoạt động
 */

import { localAIService } from "./LocalAIService";
import { freeAIService } from "./FreeAIService";

export class HybridAIService {
    constructor() {
        this.services = [
            { name: "Local AI", service: localAIService, priority: 1 },
            { name: "Free AI", service: freeAIService, priority: 2 }
        ];
        this.currentService = localAIService;
        this.currentServiceName = "Local AI";
    }

    /**
     * Gửi tin nhắn với auto-fallback
     */
    async sendMessage(message, conversationHistory = "") {
        // Thử service hiện tại trước
        try {
            const response = await this.currentService.sendMessage(message, conversationHistory);
            if (response && response.length > 0) {
                return response;
            }
        } catch (error) {
            console.warn(`⚠️ Service ${this.currentServiceName} failed:`, error);
        }

        // Fallback sang service khác
        for (const { name, service } of this.services) {
            if (service === this.currentService) continue;

            try {
                console.log(`🔄 Trying fallback service: ${name}`);
                const response = await service.sendMessage(message, conversationHistory);
                if (response && response.length > 0) {
                    this.currentService = service;
                    this.currentServiceName = name;
                    console.log(`✅ Switched to service: ${name}`);
                    return response;
                }
            } catch (error) {
                console.warn(`⚠️ Fallback service ${name} also failed:`, error);
            }
        }

        // Nếu tất cả đều fail, dùng local service
        return await localAIService.sendMessage(message, conversationHistory);
    }

    /**
     * Thay đổi service
     */
    setService(serviceName) {
        const serviceConfig = this.services.find(s => s.name === serviceName);
        if (serviceConfig) {
            this.currentService = serviceConfig.service;
            this.currentServiceName = serviceName;
            console.log(`🔄 Switched to service: ${serviceName}`);
        }
    }

    /**
     * Lấy danh sách services
     */
    getAvailableServices() {
        return this.services.map(s => ({
            name: s.name,
            value: s.name.toLowerCase().replace(/\s+/g, '-')
        }));
    }

    /**
     * Lấy service hiện tại
     */
    getCurrentService() {
        return this.currentServiceName;
    }

    /**
     * Thay đổi model (delegate to current service)
     */
    setModel(model) {
        this.currentService.setModel(model);
    }

    /**
     * Lấy models từ service hiện tại
     */
    getAvailableModels() {
        return this.currentService.getAvailableModels();
    }
}

// Export instance mặc định
export const hybridAIService = new HybridAIService();
