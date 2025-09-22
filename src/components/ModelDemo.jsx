import React, { useState } from 'react';
import { localAIService } from '../service/LocalAIService';

const ModelDemo = () => {
    const [selectedModel, setSelectedModel] = useState('general-ai');
    const [testMessage, setTestMessage] = useState('Xin chào!');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const allModels = localAIService.getAllModelsInfo();

    const handleModelChange = (modelId) => {
        setSelectedModel(modelId);
        localAIService.setModel(modelId);
    };

    const handleTest = async () => {
        if (!testMessage.trim()) return;
        
        setIsLoading(true);
        try {
            const result = await localAIService.sendMessage(testMessage);
            setResponse(result);
        } catch (error) {
            setResponse('Lỗi: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const testMessages = {
        'general-ai': [
            'Xin chào!',
            'Bạn có thể giúp tôi không?',
            'Công nghệ AI thật thú vị!'
        ],
        'creative-ai': [
            'Tôi cần ý tưởng sáng tạo!',
            'Giúp tôi viết một câu chuyện',
            'Tôi muốn thiết kế logo'
        ],
        'technical-ai': [
            'Làm sao để debug code?',
            'Giải thích thuật toán sorting',
            'Tôi gặp lỗi JavaScript'
        ],
        'educational-ai': [
            'Giải thích về machine learning',
            'Tôi muốn học React',
            'Làm bài tập toán'
        ],
        'entertainment-ai': [
            'Kể cho tôi nghe một câu chuyện',
            'Chơi game với tôi',
            'Kể joke vui'
        ]
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2>Demo Local AI Models</h2>
            
            <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
                    Chọn Model:
                </label>
                <select 
                    value={selectedModel} 
                    onChange={(e) => handleModelChange(e.target.value)}
                    style={{
                        padding: '8px 12px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        fontSize: '14px',
                        minWidth: '200px'
                    }}
                >
                    {allModels.map((model) => (
                        <option key={model.id} value={model.id}>
                            {model.name}
                        </option>
                    ))}
                </select>
                
                <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                    <strong>Mô tả:</strong> {allModels.find(m => m.id === selectedModel)?.description}
                </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
                    Tin nhắn test:
                </label>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <input
                        type="text"
                        value={testMessage}
                        onChange={(e) => setTestMessage(e.target.value)}
                        style={{
                            flex: 1,
                            padding: '8px 12px',
                            borderRadius: '5px',
                            border: '1px solid #ccc',
                            fontSize: '14px'
                        }}
                        placeholder="Nhập tin nhắn để test..."
                    />
                    <button
                        onClick={handleTest}
                        disabled={isLoading}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '5px',
                            border: '1px solid #007bff',
                            backgroundColor: '#007bff',
                            color: 'white',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        {isLoading ? 'Đang xử lý...' : 'Test'}
                    </button>
                </div>
                
                <div style={{ marginBottom: '10px' }}>
                    <strong>Tin nhắn mẫu:</strong>
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '5px' }}>
                        {testMessages[selectedModel]?.map((msg, index) => (
                            <button
                                key={index}
                                onClick={() => setTestMessage(msg)}
                                style={{
                                    padding: '4px 8px',
                                    borderRadius: '3px',
                                    border: '1px solid #ddd',
                                    backgroundColor: '#f8f9fa',
                                    cursor: 'pointer',
                                    fontSize: '12px'
                                }}
                            >
                                {msg}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {response && (
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
                        Phản hồi:
                    </label>
                    <div style={{
                        padding: '15px',
                        backgroundColor: '#e9ecef',
                        borderRadius: '5px',
                        border: '1px solid #dee2e6',
                        minHeight: '50px',
                        whiteSpace: 'pre-wrap'
                    }}>
                        {response}
                    </div>
                </div>
            )}

            <div style={{ marginTop: '30px' }}>
                <h3>Thông tin các Model:</h3>
                <div style={{ display: 'grid', gap: '15px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                    {allModels.map((model) => (
                        <div key={model.id} style={{
                            padding: '15px',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            backgroundColor: selectedModel === model.id ? '#e3f2fd' : '#f8f9fa'
                        }}>
                            <h4 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>
                                {model.name}
                            </h4>
                            <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                                {model.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ModelDemo;
