import React, { useState, useRef, useCallback } from 'react';
import { Stage, Layer, Image, Text, Group, Line, Rect } from 'react-konva';
import useImage from 'use-image';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { showAlert } from '../service/AlertServices';
import Konva from 'konva';

const SimImageGenerator = () => {
    const [backgroundImage, setBackgroundImage] = useState(null);
    const [simList, setSimList] = useState('');
    const [simData, setSimData] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [textConfig, setTextConfig] = useState({
        simNumber: { 
            x: 100, y: 100, 
            fontSize: 24, 
            color: '#000000',
            fontFamily: 'Arial',
            fontStyle: 'normal',
            fontWeight: 'normal',
            stroke: '#ffffff',
            strokeWidth: 0,
            shadowColor: '#000000',
            shadowBlur: 2,
            shadowOffset: { x: 1, y: 1 },
            opacity: 1
        },
        price: { 
            x: 100, y: 150, 
            fontSize: 20, 
            color: '#ff0000',
            fontFamily: 'Arial',
            fontStyle: 'normal',
            fontWeight: 'bold',
            stroke: '#ffffff',
            strokeWidth: 1,
            shadowColor: '#000000',
            shadowBlur: 2,
            shadowOffset: { x: 1, y: 1 },
            opacity: 1
        }
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [selectedText, setSelectedText] = useState('simNumber'); // 'simNumber', 'price', hoặc 'custom'
    const [customTexts, setCustomTexts] = useState([]); // Mảng các text tùy chỉnh
    const [newTextContent, setNewTextContent] = useState(''); // Nội dung text mới
    const [downloadFormat, setDownloadFormat] = useState('zip'); // 'zip', 'individual', hoặc 'onebyone'
    const [snapEnabled, setSnapEnabled] = useState(true); // Bật/tắt auto snap
    const [showSnapGuides, setShowSnapGuides] = useState(false); // Hiển thị guide lines
    const [selectedTextId, setSelectedTextId] = useState(null); // ID của text đang được chọn
    const [duplicateSims, setDuplicateSims] = useState([]); // Danh sách SIM trùng lặp
    const [showDuplicateChecker, setShowDuplicateChecker] = useState(false); // Hiển thị công cụ kiểm tra trùng
    const [imageQuality, setImageQuality] = useState(2); // Chất lượng ảnh: 1=thường, 2=cao, 3=rất cao
    const stageRef = useRef(null);
    const [image] = useImage(backgroundImage);

    // Xử lý upload ảnh
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setBackgroundImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Xử lý danh sách SIM
    const handleSimListChange = (event) => {
        const value = event.target.value;
        setSimList(value);
        
        // Parse danh sách SIM từ text với nhiều định dạng phân tách
        const lines = value.split('\n').filter(line => line.trim());
        const parsedData = lines.map((line, index) => {
            // Hỗ trợ nhiều định dạng: dấu phẩy, tab, dấu =, dấu -
            const separators = [',', '\t', '=', '-'];
            let parts = [];
            let usedSeparator = '';
            
            // Tìm separator phù hợp
            for (const sep of separators) {
                if (line.includes(sep)) {
                    parts = line.split(sep).map(part => part.trim());
                    usedSeparator = sep;
                    break;
                }
            }
            
            // Nếu không tìm thấy separator, coi như chỉ có số SIM
            if (parts.length === 0) {
                parts = [line.trim()];
            }
            
            // Làm sạch dữ liệu
            const simNumber = parts[0] || '';
            let price = parts[1] || '';
            
            // Xử lý giá tiền: loại bỏ ký tự không cần thiết
            if (price) {
                // Loại bỏ dấu phẩy, dấu chấm trong số
                price = price.replace(/[,.]/g, '');
                // Chỉ giữ lại số
                price = price.replace(/\D/g, '');
            }
            
            return {
                simNumber: simNumber,
                price: price,
                originalLine: line,
                lineNumber: index + 1,
                separator: usedSeparator
            };
        });
        setSimData(parsedData);
    };

    // Helper function để tính kích thước text
    const calculateTextSize = (textConfig, textContent) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const fontString = `${textConfig.fontStyle} ${textConfig.fontWeight} ${textConfig.fontSize}px ${textConfig.fontFamily}`;
        ctx.font = fontString;
        const textMetrics = ctx.measureText(textContent);
        return {
            width: textMetrics.width,
            height: textConfig.fontSize * 0.8
        };
    };

    // Tính toán vị trí snap (auto căn chỉnh) - đã tắt hoàn toàn
    const calculateSnapPosition = (x, y, textWidth = 0, textHeight = 0) => {
        // Tắt hoàn toàn chức năng auto snap
        return { x, y };
    };

    // Cập nhật vị trí text khi kéo thả
    const handleTextDrag = (type, newPos) => {
        setTextConfig(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                x: Math.round(newPos.x),
                y: Math.round(newPos.y)
            }
        }));
    };

    // Cập nhật vị trí text khi thay đổi input
    const handleTextPositionChange = (type, property, value) => {
        setTextConfig(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                [property]: parseInt(value) || 0
            }
        }));
    };

    // Cập nhật style text
    const handleTextStyleChange = (type, property, value) => {
        setTextConfig(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                [property]: value
            }
        }));
    };

    // Xử lý click vào text để chọn
    const handleTextClick = (textType, customIndex = null) => {
        if (textType === 'custom' && customIndex !== null) {
            setSelectedText(`custom_${customIndex}`);
            setSelectedTextId(`custom_${customIndex}`);
        } else {
            setSelectedText(textType);
            setSelectedTextId(textType);
        }
    };

    // Thêm text mới
    const addCustomText = () => {
        if (!newTextContent.trim()) {
            showAlert('Vui lòng nhập nội dung text!', 'warning');
            return;
        }

        const newText = {
            id: Date.now(),
            content: newTextContent,
            x: 50,
            y: 200,
            fontSize: 20,
            color: '#000000',
            fontFamily: 'Arial',
            fontStyle: 'normal',
            fontWeight: 'normal',
            stroke: '#ffffff',
            strokeWidth: 0,
            shadowColor: '#000000',
            shadowBlur: 2,
            shadowOffset: { x: 1, y: 1 },
            opacity: 1
        };

        setCustomTexts(prev => [...prev, newText]);
        setSelectedText(`custom_${newText.id}`);
        setNewTextContent('');
        showAlert('Đã thêm text mới!', 'success');
    };

    // Xóa text tùy chỉnh
    const removeCustomText = (textId) => {
        setCustomTexts(prev => prev.filter(text => text.id !== textId));
        if (selectedText === `custom_${textId}`) {
            setSelectedText('simNumber');
            setSelectedTextId('simNumber');
        }
        showAlert('Đã xóa text!', 'success');
    };

    // Cập nhật text tùy chỉnh
    const updateCustomText = (textId, property, value) => {
        setCustomTexts(prev => prev.map(text => 
            text.id === textId ? { ...text, [property]: value } : text
        ));
    };

    // Cập nhật vị trí custom text
    const updateCustomTextPosition = (textId, newPos) => {
        setCustomTexts(prev => prev.map(text => 
            text.id === textId ? { 
                ...text, 
                x: Math.round(newPos.x), 
                y: Math.round(newPos.y) 
            } : text
        ));
    };

    // Tạo border rectangle cho text được chọn với kích thước chính xác
    const createSelectionBorder = (textConfig, textContent = '') => {
        const padding = 4; // Padding nhỏ để border sát text
        
        // Tính toán kích thước text dựa trên nội dung và font
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Cấu hình font giống như text thực tế
        const fontString = `${textConfig.fontStyle} ${textConfig.fontWeight} ${textConfig.fontSize}px ${textConfig.fontFamily}`;
        ctx.font = fontString;
        
        // Đo kích thước text thực tế
        const textMetrics = ctx.measureText(textContent || 'Sample Text');
        const textWidth = textMetrics.width;
        
        // Ước tính chiều cao text dựa trên font size
        // Sử dụng hệ số nhỏ hơn để border sát text hơn
        const textHeight = textConfig.fontSize * 0.8; // Giảm hệ số để sát text hơn
        
        return {
            x: textConfig.x - padding,
            y: textConfig.y - padding,
            width: textWidth + (padding * 2),
            height: textHeight + (padding * 2),
            stroke: '#007bff',
            strokeWidth: 2,
            dash: [5, 5],
            opacity: 0.8,
            fill: 'rgba(0, 123, 255, 0.1)'
        };
    };

    // Kiểm tra SIM trùng lặp
    const checkDuplicateSims = () => {
        if (!simData.length) {
            showAlert('Vui lòng nhập danh sách SIM trước!', 'warning');
            return;
        }

        const simCounts = {};
        const duplicates = [];

        // Đếm số lần xuất hiện của mỗi SIM
        simData.forEach((sim, index) => {
            const simNumber = sim.simNumber.trim();
            if (simNumber) {
                if (!simCounts[simNumber]) {
                    simCounts[simNumber] = [];
                }
                simCounts[simNumber].push({
                    ...sim,
                    originalIndex: index + 1
                });
            }
        });

        // Tìm các SIM trùng lặp
        Object.keys(simCounts).forEach(simNumber => {
            if (simCounts[simNumber].length > 1) {
                duplicates.push({
                    simNumber: simNumber,
                    count: simCounts[simNumber].length,
                    occurrences: simCounts[simNumber]
                });
            }
        });

        setDuplicateSims(duplicates);

        if (duplicates.length > 0) {
            showAlert(`Tìm thấy ${duplicates.length} SIM trùng lặp!`, 'warning');
            setShowDuplicateChecker(true);
        } else {
            showAlert('Không có SIM trùng lặp!', 'success');
        }
    };

    // Xóa SIM trùng lặp (giữ lại SIM đầu tiên)
    const removeDuplicateSims = () => {
        if (duplicateSims.length === 0) return;

        const seenSims = new Set();
        const uniqueSims = simData.filter(sim => {
            const simNumber = sim.simNumber.trim();
            if (seenSims.has(simNumber)) {
                return false; // Bỏ qua SIM trùng
            }
            seenSims.add(simNumber);
            return true;
        });

        setSimData(uniqueSims);
        setSimList(uniqueSims.map(sim => `${sim.simNumber}${sim.price ? ' = ' + sim.price : ''}`).join('\n'));
        setDuplicateSims([]);
        setShowDuplicateChecker(false);
        showAlert(`Đã xóa ${simData.length - uniqueSims.length} SIM trùng lặp!`, 'success');
    };

    // Lấy config của text được chọn
    const getSelectedTextConfig = () => {
        if (selectedText === 'simNumber') {
            return textConfig.simNumber;
        } else if (selectedText === 'price') {
            return textConfig.price;
        } else if (selectedText.startsWith('custom_')) {
            const textId = parseInt(selectedText.split('_')[1]);
            return customTexts.find(text => text.id === textId) || textConfig.simNumber;
        }
        return textConfig.simNumber;
    };

    // Cập nhật config của text được chọn
    const updateSelectedTextConfig = (property, value) => {
        if (selectedText === 'simNumber') {
            handleTextStyleChange('simNumber', property, value);
        } else if (selectedText === 'price') {
            handleTextStyleChange('price', property, value);
        } else if (selectedText.startsWith('custom_')) {
            const textId = parseInt(selectedText.split('_')[1]);
            updateCustomText(textId, property, value);
        }
    };

    // Tạo ảnh cho một SIM sử dụng HTML5 Canvas
    const generateImageForSim = (simNumber, price) => {
        return new Promise((resolve, reject) => {
            try {
                // Kiểm tra ảnh nền có sẵn không
                if (!image) {
                    reject(new Error('Ảnh nền chưa được tải'));
                    return;
                }

                // Tạo canvas với độ phân giải cao
                const scale = imageQuality; // Sử dụng chất lượng đã chọn
                const canvas = document.createElement('canvas');
                canvas.width = 600 * scale; // 600px * scale
                canvas.height = 400 * scale; // 400px * scale
                const ctx = canvas.getContext('2d');
                
                // Scale context để vẽ với tỷ lệ cao
                ctx.scale(scale, scale);

                // Tạo image object mới
                const img = new window.Image();
                img.crossOrigin = 'anonymous';
                
                img.onload = () => {
                    try {
                        // Vẽ ảnh nền
                        ctx.drawImage(img, 0, 0, 600, 400);

                        // Cấu hình font cho text
                        const simFont = `${textConfig.simNumber.fontStyle} ${textConfig.simNumber.fontWeight} ${textConfig.simNumber.fontSize}px ${textConfig.simNumber.fontFamily}`;
                        const priceFont = `${textConfig.price.fontStyle} ${textConfig.price.fontWeight} ${textConfig.price.fontSize}px ${textConfig.price.fontFamily}`;

                        // Vẽ text số SIM - tự động căn giữa cho từng text
                        ctx.font = simFont;
                        ctx.fillStyle = textConfig.simNumber.color;
                        ctx.strokeStyle = textConfig.simNumber.stroke;
                        ctx.lineWidth = textConfig.simNumber.strokeWidth;
                        ctx.shadowColor = textConfig.simNumber.shadowColor;
                        ctx.shadowBlur = textConfig.simNumber.shadowBlur;
                        ctx.shadowOffsetX = textConfig.simNumber.shadowOffset.x;
                        ctx.shadowOffsetY = textConfig.simNumber.shadowOffset.y;
                        ctx.globalAlpha = textConfig.simNumber.opacity;

                        // Tính toán vị trí căn giữa cho text hiện tại
                        const currentSimText = simNumber || '0123456789';
                        const simTextMetrics = ctx.measureText(currentSimText);
                        const simTextWidth = simTextMetrics.width;
                        const simCenterX = 300; // 600/2 (không đổi vì đã scale context)
                        const simTextX = simCenterX - simTextWidth / 2;

                        if (textConfig.simNumber.strokeWidth > 0) {
                            ctx.strokeText(currentSimText, simTextX, textConfig.simNumber.y);
                        }
                        ctx.fillText(currentSimText, simTextX, textConfig.simNumber.y);

                        // Vẽ text giá tiền - tự động căn giữa cho từng text
                        ctx.font = priceFont;
                        ctx.fillStyle = textConfig.price.color;
                        ctx.strokeStyle = textConfig.price.stroke;
                        ctx.lineWidth = textConfig.price.strokeWidth;
                        ctx.shadowColor = textConfig.price.shadowColor;
                        ctx.shadowBlur = textConfig.price.shadowBlur;
                        ctx.shadowOffsetX = textConfig.price.shadowOffset.x;
                        ctx.shadowOffsetY = textConfig.price.shadowOffset.y;
                        ctx.globalAlpha = textConfig.price.opacity;

                        // Tính toán vị trí căn giữa cho text giá tiền hiện tại
                        const priceText = (price || '500000') + ' Triệu';
                        const priceTextMetrics = ctx.measureText(priceText);
                        const priceTextWidth = priceTextMetrics.width;
                        const priceCenterX = 300; // 600/2 (không đổi vì đã scale context)
                        const priceTextX = priceCenterX - priceTextWidth / 2;

                        if (textConfig.price.strokeWidth > 0) {
                            ctx.strokeText(priceText, priceTextX, textConfig.price.y);
                        }
                        ctx.fillText(priceText, priceTextX, textConfig.price.y);

                        // Vẽ các text tùy chỉnh - tự động căn giữa cho từng text
                        customTexts.forEach(customText => {
                            ctx.font = `${customText.fontStyle} ${customText.fontWeight} ${customText.fontSize}px ${customText.fontFamily}`;
                            ctx.fillStyle = customText.color;
                            ctx.strokeStyle = customText.stroke;
                            ctx.lineWidth = customText.strokeWidth;
                            ctx.shadowColor = customText.shadowColor;
                            ctx.shadowBlur = customText.shadowBlur;
                            ctx.shadowOffsetX = customText.shadowOffset.x;
                            ctx.shadowOffsetY = customText.shadowOffset.y;
                            ctx.globalAlpha = customText.opacity;

                            // Tính toán vị trí căn giữa cho custom text hiện tại
                            const customTextMetrics = ctx.measureText(customText.content);
                            const customTextWidth = customTextMetrics.width;
                            const customCenterX = 300; // 600/2 (không đổi vì đã scale context)
                            const customTextX = customCenterX - customTextWidth / 2;

                            if (customText.strokeWidth > 0) {
                                ctx.strokeText(customText.content, customTextX, customText.y);
                            }
                            ctx.fillText(customText.content, customTextX, customText.y);
                        });

                        // Reset global alpha
                        ctx.globalAlpha = 1;

                        // Lấy data URL
                        const dataURL = canvas.toDataURL('image/png');
                        resolve(dataURL);
                        
                    } catch (renderError) {
                        console.error('Lỗi khi render ảnh:', renderError);
                        reject(renderError);
                    }
                };
                
                img.onerror = () => {
                    console.error('Lỗi khi load ảnh nền');
                    reject(new Error('Không thể load ảnh nền'));
                };
                
                // Load ảnh nền
                img.src = backgroundImage;
                
            } catch (error) {
                console.error('Lỗi khi tạo ảnh cho SIM:', simNumber, error);
                reject(error);
            }
        });
    };

    // Tải xuống từng file PNG riêng lẻ
    const downloadIndividualImages = async () => {
        if (!simData.length) {
            showAlert('Vui lòng nhập danh sách SIM!', 'warning');
            return;
        }

        if (!backgroundImage) {
            showAlert('Vui lòng upload ảnh nền trước!', 'warning');
            return;
        }

        setIsGenerating(true);
        setProgress(0);
        
        try {
            let successCount = 0;
            
            for (let i = 0; i < simData.length; i++) {
                const { simNumber, price } = simData[i];
                try {
                    const imageData = await generateImageForSim(simNumber, price);
                    
                    if (imageData) {
                        // Chuyển đổi base64 thành blob
                        const response = await fetch(imageData);
                        const blob = await response.blob();
                        
                        // Tạo tên file an toàn
                        const safeSimNumber = simNumber.replace(/[^a-zA-Z0-9]/g, '_');
                        const safePrice = price.replace(/[^a-zA-Z0-9]/g, '_');
                        const fileName = `sim_${safeSimNumber}_${safePrice || 'no_price'}.png`;
                        
                        // Tải xuống từng file với delay
                        saveAs(blob, fileName);
                        successCount++;
                        
                        // Delay lớn hơn để tránh browser block multiple downloads
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                } catch (error) {
                    console.error(`Lỗi khi tạo ảnh cho SIM ${simNumber}:`, error);
                }
                
                // Cập nhật progress
                setProgress(Math.round(((i + 1) / simData.length) * 100));
            }
            
            if (successCount > 0) {
                showAlert(`Đã tải xuống ${successCount}/${simData.length} file PNG thành công!`, 'success');
            } else {
                showAlert('Không có file nào được tải xuống!', 'error');
            }
        } catch (error) {
            console.error('Lỗi khi tải xuống:', error);
            showAlert('Có lỗi xảy ra khi tải xuống!', 'error');
        } finally {
            setIsGenerating(false);
            setProgress(0);
        }
    };

    // Tải xuống tất cả ảnh (ZIP)
    const downloadAllImages = async () => {
        if (!simData.length) {
            showAlert('Vui lòng nhập danh sách SIM!', 'warning');
            return;
        }

        if (!backgroundImage) {
            showAlert('Vui lòng upload ảnh nền trước!', 'warning');
            return;
        }

        setIsGenerating(true);
        setProgress(0);
        try {
            const zip = new JSZip();
            
            for (let i = 0; i < simData.length; i++) {
                const { simNumber, price } = simData[i];
                try {
                    const imageData = await generateImageForSim(simNumber, price);
                    
                    if (imageData) {
                        // Chuyển đổi base64 thành blob
                        const response = await fetch(imageData);
                        const blob = await response.blob();
                        
                        // Thêm vào zip
                        zip.file(`sim_${simNumber}_${price}.png`, blob);
                    }
                } catch (error) {
                    console.error(`Lỗi khi tạo ảnh cho SIM ${simNumber}:`, error);
                    // Tiếp tục với SIM tiếp theo thay vì dừng lại
                }
                
                // Cập nhật progress
                setProgress(Math.round(((i + 1) / simData.length) * 100));
            }

            // Tạo và tải xuống zip
            const content = await zip.generateAsync({ type: 'blob' });
            saveAs(content, 'sim_images.zip');
            
            showAlert('Tải xuống thành công!', 'success');
        } catch (error) {
            console.error('Lỗi khi tạo ảnh:', error);
            showAlert('Có lỗi xảy ra khi tạo ảnh! Vui lòng thử lại.', 'error');
        } finally {
            setIsGenerating(false);
            setProgress(0);
        }
    };

    // Tải xuống từng file một với xác nhận
    const downloadOneByOne = async () => {
        if (!simData.length) {
            showAlert('Vui lòng nhập danh sách SIM!', 'warning');
            return;
        }

        if (!backgroundImage) {
            showAlert('Vui lòng upload ảnh nền trước!', 'warning');
            return;
        }

        setIsGenerating(true);
        setProgress(0);
        
        try {
            for (let i = 0; i < simData.length; i++) {
                const { simNumber, price } = simData[i];
                try {
                    const imageData = await generateImageForSim(simNumber, price);
                    
                    if (imageData) {
                        // Tạo tên file an toàn
                        const safeSimNumber = simNumber.replace(/[^a-zA-Z0-9]/g, '_');
                        const safePrice = price.replace(/[^a-zA-Z0-9]/g, '_');
                        const fileName = `sim_${safeSimNumber}_${safePrice || 'no_price'}.png`;
                        
                        // Tạo link tải xuống và click tự động
                        const link = document.createElement('a');
                        link.href = imageData;
                        link.download = fileName;
                        link.style.display = 'none';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        
                        // Delay giữa các file
                        if (i < simData.length - 1) {
                            await new Promise(resolve => setTimeout(resolve, 500));
                        }
                    }
                } catch (error) {
                    console.error(`Lỗi khi tạo ảnh cho SIM ${simNumber}:`, error);
                }
                
                // Cập nhật progress
                setProgress(Math.round(((i + 1) / simData.length) * 100));
            }
            
            showAlert(`Đã tạo ${simData.length} file PNG! Kiểm tra thư mục Downloads.`, 'success');
        } catch (error) {
            console.error('Lỗi khi tải xuống:', error);
            showAlert('Có lỗi xảy ra khi tải xuống!', 'error');
        } finally {
            setIsGenerating(false);
            setProgress(0);
        }
    };

    // Hàm tải xuống chính
    const handleDownload = () => {
        if (downloadFormat === 'zip') {
            downloadAllImages();
        } else if (downloadFormat === 'individual') {
            downloadIndividualImages();
        } else {
            downloadOneByOne();
        }
    };

    return (
        <div className="container mt-3">
            <div className="row">
                <div className="col-md-12">
                    <div className="alert alert-info mt-2">
                        <h6>Hướng dẫn:</h6>
                        <p className="mb-0">Upload ảnh → Nhập SIM → Chỉnh text → Tải xuống</p>
                    </div>
                </div>
            </div>

            <div className="row">
                {/* Panel điều khiển */}
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Cài đặt</h5>
                            <button 
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => {
                                    const cardBody = document.querySelector('.card-body');
                                    if (cardBody) {
                                        cardBody.scrollTo({ top: 0, behavior: 'smooth' });
                                    }
                                }}
                                title="Lên đầu menu"
                            >
                                ↑
                            </button>
                        </div>
                        <div className="card-body" style={{ 
                            maxHeight: '80vh', 
                            overflowY: 'auto',
                            scrollbarWidth: 'thin',
                            scrollbarColor: '#6c757d #f8f9fa'
                        }}>
                            {/* Upload ảnh */}
                            <div className="mb-3">
                                <label className="form-label text-primary fw-bold">Upload ảnh</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                            </div>
                        <hr className='pb-1'/>
                            {/* Danh sách SIM */}
                            <div className="mb-3">
                                <label className="form-label text-primary fw-bold">Danh sách SIM:</label>
                                <textarea
                                    className="form-control"
                                    rows="4"
                                    placeholder="Dán list sim tại đây..."
                                    value={simList}
                                    onChange={handleSimListChange}
                                />
                                <small className="text-muted">
                                    Hỗ trợ: , = - tab
                                </small>
                                {simData.length > 0 && (
                                    <div className="mt-2">
                                        <small className="text-success">
                                            ✓ Đã nhận diện {simData.length} SIM
                                        </small>
                                    </div>
                                )}
                            </div>

                            {/* Công cụ kiểm tra SIM trùng lặp */}
                            <div className="mb-3">
                                <h6 className="text-warning border-bottom pb-2">🔍 Kiểm tra SIM trùng lặp</h6>
                                <div className="d-flex gap-2 mb-2">
                                    <button
                                        className="btn btn-warning btn-sm"
                                        onClick={checkDuplicateSims}
                                        disabled={!simData.length}
                                    >
                                        <i className="fas fa-search me-1"></i>
                                        Kiểm tra trùng lặp
                                    </button>
                                    {duplicateSims.length > 0 && (
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={removeDuplicateSims}
                                        >
                                            <i className="fas fa-trash me-1"></i>
                                            Xóa trùng lặp
                                        </button>
                                    )}
                                </div>
                                {duplicateSims.length > 0 && (
                                    <div className="alert alert-warning">
                                        <strong>Tìm thấy {duplicateSims.length} SIM trùng lặp:</strong>
                                        <div className="mt-2">
                                            {duplicateSims.map((dup, index) => (
                                                <div key={index} className="mb-1">
                                                    <code>{dup.simNumber}</code> 
                                                    <span className="badge bg-danger ms-1">{dup.count} lần</span>
                                                    <small className="text-muted ms-2">
                                                        (Dòng: {dup.occurrences.map(occ => occ.originalIndex).join(', ')})
                                                    </small>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>


                            {/* Add Custom Text */}
                            <div className="mb-3">
                                <h6 className="text-info border-bottom pb-2">➕ Thêm text mới</h6>
                                <div className="input-group mb-2">
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        placeholder="Nhập nội dung text..."
                                        value={newTextContent}
                                        onChange={(e) => setNewTextContent(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && addCustomText()}
                                    />
                                    <button 
                                        className="btn btn-primary btn-sm"
                                        onClick={addCustomText}
                                    >
                                        Thêm
                                    </button>
                                </div>
                            </div>

                            {/* Text Selection */}
                            <div className="mb-3">
                                <h6 className="text-warning border-bottom pb-2">
                                    📝 Text đang chọn: 
                                    <span className="badge bg-primary ms-2">
                                        {selectedTextId === 'simNumber' ? 'Số SIM' : 
                                         selectedTextId === 'price' ? 'Giá tiền' : 
                                         selectedTextId && selectedTextId.startsWith('custom_') ? 'Text tùy chỉnh' : 
                                         'Chưa chọn'}
                                    </span>
                                </h6>
                                {/* <h6 className="text-warning border-bottom pb-2">📝 Chọn text để chỉnh sửa</h6>
                                <div className="btn-group w-100 mb-2" role="group">
                                    <button 
                                        className={`btn ${selectedText === 'simNumber' ? 'btn-primary' : 'btn-outline-primary'} btn-sm`}
                                        onClick={() => setSelectedText('simNumber')}
                                    >
                                        📱 Số SIM
                                    </button>
                                    <button 
                                        className={`btn ${selectedText === 'price' ? 'btn-success' : 'btn-outline-success'} btn-sm`}
                                        onClick={() => setSelectedText('price')}
                                    >
                                        💰 Giá tiền
                                    </button>
                                </div> */}
                                
                                {/* Custom Texts List */}
                                {customTexts.length > 0 && (
                                    <div className="mb-2">
                                        <small className="text-muted">Text tùy chỉnh:</small>
                                        <div className="d-flex flex-wrap gap-1">
                                            {customTexts.map((customText) => (
                                                <div key={customText.id} className="d-flex align-items-center">
                                                    <button
                                                        className={`btn ${selectedText === `custom_${customText.id}` ? 'btn-info' : 'btn-outline-info'} btn-sm me-1`}
                                                        onClick={() => handleTextClick('custom', customText.id)}
                                                        style={{ fontSize: '12px' }}
                                                    >
                                                        {customText.content.length > 10 ? customText.content.substring(0, 10) + '...' : customText.content}
                                                    </button>
                                                    <button
                                                        className="btn btn-outline-danger btn-sm"
                                                        onClick={() => removeCustomText(customText.id)}
                                                        style={{ fontSize: '10px', padding: '2px 6px' }}
                                                        title="Xóa text"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                            </div>

                            {/* Preset Styles */}
                            {/* <div className="mb-3">
                                <h6 className="text-secondary border-bottom pb-2">🎨 Style Presets</h6>
                                <div className="btn-group w-100 mb-2" role="group">
                                    <button 
                                        className="btn btn-outline-primary btn-sm"
                                        onClick={() => {
                                            setTextConfig(prev => ({
                                                ...prev,
                                                [selectedText]: { 
                                                    ...prev[selectedText], 
                                                    color: '#000000', 
                                                    stroke: '#ffffff', 
                                                    strokeWidth: 2, 
                                                    fontWeight: 'bold' 
                                                }
                                            }));
                                        }}
                                    >
                                        Classic
                                    </button>
                                    <button 
                                        className="btn btn-outline-success btn-sm"
                                        onClick={() => {
                                            setTextConfig(prev => ({
                                                ...prev,
                                                [selectedText]: { 
                                                    ...prev[selectedText], 
                                                    color: '#ffffff', 
                                                    stroke: '#000000', 
                                                    strokeWidth: 3, 
                                                    fontWeight: 'bold' 
                                                }
                                            }));
                                        }}
                                    >
                                        Neon
                                    </button>
                                    <button 
                                        className="btn btn-outline-warning btn-sm"
                                        onClick={() => {
                                            setTextConfig(prev => ({
                                                ...prev,
                                                [selectedText]: { 
                                                    ...prev[selectedText], 
                                                    color: '#8B4513', 
                                                    stroke: '#DAA520', 
                                                    strokeWidth: 1, 
                                                    fontWeight: 'normal' 
                                                }
                                            }));
                                        }}
                                    >
                                        Vintage
                                    </button>
                                </div>
                            </div> */}

                            {/* Text Settings - Single Panel */}
                            <div className="mb-4">
                                <h6 className={
                                    selectedText === 'simNumber' ? 'text-primary' : 
                                    selectedText === 'price' ? 'text-success' : 
                                    'text-info'
                                }>
                                    {selectedText === 'simNumber' ? '📱 Số SIM' : 
                                     selectedText === 'price' ? '💰 Giá tiền' : 
                                     'Text tùy chỉnh'} - Setting
                                </h6>
                                
                                {/* Font & Size */}
                                <div className="row mb-2">
                                    <div className="col-6">
                                        <label className="form-label">Font Family:</label>
                                        <select
                                            className="form-control form-control-sm"
                                            value={getSelectedTextConfig().fontFamily}
                                            onChange={(e) => updateSelectedTextConfig('fontFamily', e.target.value)}
                                            style={{ fontFamily: getSelectedTextConfig().fontFamily }}
                                        >
                                            {/* Sans-serif Fonts */}
                                            <optgroup label="Sans-serif Fonts">
                                                <option value="Arial">Arial</option>
                                                <option value="Helvetica">Helvetica</option>
                                                <option value="Verdana">Verdana</option>
                                                <option value="Tahoma">Tahoma</option>
                                                <option value="Trebuchet MS">Trebuchet MS</option>
                                                <option value="Calibri">Calibri</option>
                                                <option value="Segoe UI">Segoe UI</option>
                                                <option value="Open Sans">Open Sans</option>
                                                <option value="Roboto">Roboto</option>
                                                <option value="Lato">Lato</option>
                                                <option value="Source Sans Pro">Source Sans Pro</option>
                                                <option value="Poppins">Poppins</option>
                                                <option value="Montserrat">Montserrat</option>
                                                <option value="Nunito">Nunito</option>
                                                <option value="Ubuntu">Ubuntu</option>
                                            </optgroup>
                                            
                                            {/* Serif Fonts */}
                                            <optgroup label="Serif Fonts">
                                                <option value="Times New Roman">Times New Roman</option>
                                                <option value="Georgia">Georgia</option>
                                                <option value="Times">Times</option>
                                                <option value="Palatino">Palatino</option>
                                                <option value="Garamond">Garamond</option>
                                                <option value="Book Antiqua">Book Antiqua</option>
                                                <option value="Baskerville">Baskerville</option>
                                                <option value="Playfair Display">Playfair Display</option>
                                                <option value="Merriweather">Merriweather</option>
                                                <option value="Crimson Text">Crimson Text</option>
                                                <option value="Libre Baskerville">Libre Baskerville</option>
                                            </optgroup>
                                            
                                            {/* Monospace Fonts */}
                                            <optgroup label="Monospace Fonts">
                                                <option value="Courier New">Courier New</option>
                                                <option value="Courier">Courier</option>
                                                <option value="Monaco">Monaco</option>
                                                <option value="Consolas">Consolas</option>
                                                <option value="Lucida Console">Lucida Console</option>
                                                <option value="Source Code Pro">Source Code Pro</option>
                                                <option value="Fira Code">Fira Code</option>
                                                <option value="JetBrains Mono">JetBrains Mono</option>
                                            </optgroup>
                                            
                                            {/* Display Fonts */}
                                            <optgroup label="Display Fonts">
                                                <option value="Impact">Impact</option>
                                                <option value="Arial Black">Arial Black</option>
                                                <option value="Comic Sans MS">Comic Sans MS</option>
                                                <option value="Papyrus">Papyrus</option>
                                                <option value="Chalkduster">Chalkduster</option>
                                                <option value="Marker Felt">Marker Felt</option>
                                                <option value="Brush Script MT">Brush Script MT</option>
                                                <option value="Lobster">Lobster</option>
                                                <option value="Pacifico">Pacifico</option>
                                                <option value="Righteous">Righteous</option>
                                                <option value="Bangers">Bangers</option>
                                                <option value="Fredoka One">Fredoka One</option>
                                                <option value="Bungee">Bungee</option>
                                                <option value="Orbitron">Orbitron</option>
                                                <option value="Russo One">Russo One</option>
                                            </optgroup>
                                            
                                            {/* Handwriting Fonts */}
                                            <optgroup label="Handwriting Fonts">
                                                <option value="Brush Script MT">Brush Script MT</option>
                                                <option value="Lucida Handwriting">Lucida Handwriting</option>
                                                <option value="Bradley Hand">Bradley Hand</option>
                                                <option value="Kalam">Kalam</option>
                                                <option value="Caveat">Caveat</option>
                                                <option value="Dancing Script">Dancing Script</option>
                                                <option value="Indie Flower">Indie Flower</option>
                                                <option value="Permanent Marker">Permanent Marker</option>
                                                <option value="Satisfy">Satisfy</option>
                                            </optgroup>
                                            
                                            {/* Vietnamese Fonts */}
                                            <optgroup label="Vietnamese Fonts">
                                                <option value="Be Vietnam Pro">Be Vietnam Pro</option>
                                                <option value="Inter">Inter</option>
                                                <option value="Lexend">Lexend</option>
                                                <option value="Work Sans">Work Sans</option>
                                                <option value="Quicksand">Quicksand</option>
                                                <option value="Comfortaa">Comfortaa</option>
                                                <option value="Varela Round">Varela Round</option>
                                                <option value="M PLUS Rounded 1c">M PLUS Rounded 1c</option>
                                            </optgroup>
                                        </select>
                                        
                                        <div className="mt-2">
                                            <div 
                                                className="border rounded p-2 bg-light"
                                                style={{ 
                                                    fontFamily: getSelectedTextConfig().fontFamily,
                                                    fontSize: '14px',
                                                    minHeight: '30px',
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                {getSelectedTextConfig().fontFamily} - Sample Text
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <label className="form-label">Font Size:</label>
                                        <input
                                            type="number"
                                            className="form-control form-control-sm"
                                            value={getSelectedTextConfig().fontSize}
                                            onChange={(e) => updateSelectedTextConfig('fontSize', parseInt(e.target.value))}
                                            min="8"
                                            max="72"
                                        />
                                    </div>
                                </div>

                                {/* Style & Weight */}
                                <div className="row mb-2">
                                    <div className="col-6">
                                        <label className="form-label">Style:</label>
                                        <select
                                            className="form-control form-control-sm"
                                            value={getSelectedTextConfig().fontStyle}
                                            onChange={(e) => updateSelectedTextConfig('fontStyle', e.target.value)}
                                        >
                                            <option value="normal">Normal</option>
                                            <option value="italic">Italic</option>
                                        </select>
                                    </div>
                                    <div className="col-6">
                                        <label className="form-label">Weight:</label>
                                        <select
                                            className="form-control form-control-sm"
                                            value={getSelectedTextConfig().fontWeight}
                                            onChange={(e) => updateSelectedTextConfig('fontWeight', e.target.value)}
                                        >
                                            <option value="normal">Normal</option>
                                            <option value="bold">Bold</option>
                                            <option value="bolder">Bolder</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Colors */}
                                <div className="row mb-2">
                                    <div className="col-6">
                                        <label className="form-label">Màu chữ:</label>
                                        <input
                                            type="color"
                                            className="form-control form-control-sm"
                                            value={getSelectedTextConfig().color}
                                            onChange={(e) => updateSelectedTextConfig('color', e.target.value)}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <label className="form-label">Màu viền:</label>
                                        <input
                                            type="color"
                                            className="form-control form-control-sm"
                                            value={getSelectedTextConfig().stroke}
                                            onChange={(e) => updateSelectedTextConfig('stroke', e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Stroke Width & Opacity */}
                                <div className="row mb-2">
                                    <div className="col-6">
                                        <label className="form-label">Độ dày viền:</label>
                                        <input
                                            type="range"
                                            className="form-range"
                                            min="0"
                                            max="5"
                                            value={getSelectedTextConfig().strokeWidth}
                                            onChange={(e) => updateSelectedTextConfig('strokeWidth', parseInt(e.target.value))}
                                        />
                                        <small className="text-muted">{getSelectedTextConfig().strokeWidth}px</small>
                                    </div>
                                    <div className="col-6">
                                        <label className="form-label">Độ mờ:</label>
                                        <input
                                            type="range"
                                            className="form-range"
                                            min="0.1"
                                            max="1"
                                            step="0.1"
                                            value={getSelectedTextConfig().opacity}
                                            onChange={(e) => updateSelectedTextConfig('opacity', parseFloat(e.target.value))}
                                        />
                                        <small className="text-muted">{Math.round(getSelectedTextConfig().opacity * 100)}%</small>
                                    </div>
                                </div>

                                {/* Shadow */}
                                <div className="mb-2">
                                    <label className="form-label">Bóng đổ:</label>
                                    <div className="row">
                                        <div className="col-4">
                                            <label className="form-label small">Màu:</label>
                                            <input
                                                type="color"
                                                className="form-control form-control-sm"
                                                value={getSelectedTextConfig().shadowColor}
                                                onChange={(e) => updateSelectedTextConfig('shadowColor', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-4">
                                            <label className="form-label small">Mờ:</label>
                                            <input
                                                type="range"
                                                className="form-range"
                                                min="0"
                                                max="10"
                                                value={getSelectedTextConfig().shadowBlur}
                                                onChange={(e) => updateSelectedTextConfig('shadowBlur', parseInt(e.target.value))}
                                            />
                                        </div>
                                        <div className="col-4">
                                            <label className="form-label small">X:</label>
                                            <input
                                                type="range"
                                                className="form-range"
                                                min="-5"
                                                max="5"
                                                value={getSelectedTextConfig().shadowOffset.x}
                                                onChange={(e) => updateSelectedTextConfig('shadowOffset', { ...getSelectedTextConfig().shadowOffset, x: parseInt(e.target.value) })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Progress bar */}
                            {isGenerating && (
                                <div className="mb-3">
                                    <div className="progress">
                                        <div 
                                            className="progress-bar" 
                                            role="progressbar" 
                                            style={{ width: `${progress}%` }}
                                            aria-valuenow={progress} 
                                            aria-valuemin="0" 
                                            aria-valuemax="100"
                                        >
                                            {progress}%
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Căn giữa thủ công */}
                            <div className="mb-3">
                                <h6 className="text-info border-bottom pb-2">🎯 Căn Chỉnh Text</h6>
                                <button
                                    className="btn btn-primary btn-sm w-100"
                                    onClick={() => {
                                        if (selectedTextId === 'simNumber') {
                                            const textContent = simData.length > 0 ? simData[0].simNumber : "0123456789";
                                            const { width: textWidth } = calculateTextSize(textConfig.simNumber, textContent);
                                            const centerX = 300;
                                            const newX = centerX - textWidth / 2;
                                            
                                            setTextConfig(prev => ({
                                                ...prev,
                                                simNumber: {
                                                    ...prev.simNumber,
                                                    x: Math.round(newX)
                                                }
                                            }));
                                        } else if (selectedTextId === 'price') {
                                            const textContent = simData.length > 0 ? simData[0].price + " Triệu" : "500,000 VNĐ";
                                            const { width: textWidth } = calculateTextSize(textConfig.price, textContent);
                                            const centerX = 300;
                                            const newX = centerX - textWidth / 2;
                                            
                                            setTextConfig(prev => ({
                                                ...prev,
                                                price: {
                                                    ...prev.price,
                                                    x: Math.round(newX)
                                                }
                                            }));
                                        } else if (selectedTextId && selectedTextId.startsWith('custom_')) {
                                            const textId = parseInt(selectedTextId.split('_')[1]);
                                            const customText = customTexts.find(text => text.id === textId);
                                            if (customText) {
                                                const { width: textWidth } = calculateTextSize(customText, customText.content);
                                                const centerX = 300;
                                                const newX = centerX - textWidth / 2;
                                                
                                                setCustomTexts(prev => prev.map(text => 
                                                    text.id === textId ? { 
                                                        ...text, 
                                                        x: Math.round(newX)
                                                    } : text
                                                ));
                                                showAlert('Đã căn giữa text tùy chỉnh!', 'success');
                                            }
                                        } else {
                                            showAlert('Vui lòng chọn text để căn giữa!', 'warning');
                                        }
                                    }}
                                    disabled={!selectedTextId}
                                >
                                    <i className="fas fa-align-center me-1"></i>
                                    Căn giữa text được chọn
                                </button>
                            </div>

                            {/* Chất lượng ảnh */}
                            <div className="mb-3">
                                <h6 className="text-success border-bottom pb-2">📸 Chất Lượng Ảnh</h6>
                                <select
                                    className="form-control form-control-sm"
                                    value={imageQuality}
                                    onChange={(e) => setImageQuality(parseInt(e.target.value))}
                                >
                                    <option value={1}>Thường (600x400px)</option>
                                    <option value={2}>Cao (1200x800px)</option>
                                    <option value={3}>Rất cao (1800x1200px)</option>
                                    <option value={4}>Siêu cao (2400x1600px)</option>
                                </select>
                            </div>

                            {/* Định dạng tải xuống */}
                            <div className="mb-3">
                                <h6 className="text-dark border-bottom pb-2">📥 Tải xuống</h6>
                                <div className="btn-group-vertical w-100" role="group">
                                    <button 
                                        className={`btn ${downloadFormat === 'zip' ? 'btn-primary' : 'btn-outline-primary'} btn-sm mb-1`}
                                        onClick={() => setDownloadFormat('zip')}
                                    >
                                        📦 ZIP
                                    </button>
                                    <button 
                                        className={`btn ${downloadFormat === 'onebyone' ? 'btn-success' : 'btn-outline-success'} btn-sm mb-1`}
                                        onClick={() => setDownloadFormat('onebyone')}
                                    >
                                        🖼️ Từng file
                                    </button>
                                    <button 
                                        className={`btn ${downloadFormat === 'individual' ? 'btn-warning' : 'btn-outline-warning'} btn-sm`}
                                        onClick={() => setDownloadFormat('individual')}
                                    >
                                        ⚡ Tất cả
                                    </button>
                                </div>
                            </div>

                            {/* Nút tải xuống */}
                            <button
                                className="btn btn-success w-100"
                                onClick={handleDownload}
                                disabled={!backgroundImage || !simData.length || isGenerating}
                            >
                                {isGenerating ? `Đang tạo... ${progress}%` : 
                                 downloadFormat === 'zip' ? `📦 ZIP (${simData.length})` : 
                                 downloadFormat === 'onebyone' ? `🖼️ Từng file (${simData.length})` :
                                 `⚡ Tất cả (${simData.length})`}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Canvas preview */}
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">
                            <h5>Preview</h5>
                        </div>
                        <div className="card-body">
                            {backgroundImage ? (
                                <div style={{ border: '1px solid #ccc', display: 'inline-block' }} className='img-thumbnail'>
                                    <Stage
                                        ref={stageRef}
                                        width={600}
                                        height={400}
                                        onClick={(e) => {
                                            // Bỏ chọn text khi click vào canvas trống
                                            if (e.target === e.target.getStage()) {
                                                setSelectedTextId(null);
                                                setSelectedText('simNumber');
                                            }
                                        }}
                                    >
                                        <Layer>
                                            <Image
                                                image={image}
                                                width={600}
                                                height={400}
                                            />
                                            {/* Snap Guide Lines */}
                                            {showSnapGuides && snapEnabled && (
                                                <>
                                                    {/* Vertical center line */}
                                                    <Line
                                                        points={[300, 0, 300, 400]}
                                                        stroke="#ff0000"
                                                        strokeWidth={1}
                                                        dash={[5, 5]}
                                                        opacity={0.5}
                                                    />
                                                    {/* Horizontal center line */}
                                                    <Line
                                                        points={[0, 200, 600, 200]}
                                                        stroke="#ff0000"
                                                        strokeWidth={1}
                                                        dash={[5, 5]}
                                                        opacity={0.5}
                                                    />
                                                    {/* Left edge line */}
                                                    <Line
                                                        points={[0, 0, 0, 400]}
                                                        stroke="#00ff00"
                                                        strokeWidth={1}
                                                        dash={[3, 3]}
                                                        opacity={0.3}
                                                    />
                                                    {/* Right edge line */}
                                                    <Line
                                                        points={[600, 0, 600, 400]}
                                                        stroke="#00ff00"
                                                        strokeWidth={1}
                                                        dash={[3, 3]}
                                                        opacity={0.3}
                                                    />
                                                    {/* Top edge line */}
                                                    <Line
                                                        points={[0, 0, 600, 0]}
                                                        stroke="#00ff00"
                                                        strokeWidth={1}
                                                        dash={[3, 3]}
                                                        opacity={0.3}
                                                    />
                                                    {/* Bottom edge line */}
                                                    <Line
                                                        points={[0, 400, 600, 400]}
                                                        stroke="#00ff00"
                                                        strokeWidth={1}
                                                        dash={[3, 3]}
                                                        opacity={0.3}
                                                    />
                                                </>
                                            )}
                                            {/* Selection Border */}
                                            {selectedTextId === 'simNumber' && (
                                                <Rect
                                                    {...createSelectionBorder(textConfig.simNumber, simData.length > 0 ? simData[0].simNumber : "0123456789")}
                                                />
                                            )}
                                            {selectedTextId === 'price' && (
                                                <Rect
                                                    {...createSelectionBorder(textConfig.price, simData.length > 0 ? simData[0].price + " Triệu" : "500,000 VNĐ")}
                                                />
                                            )}
                                            {selectedTextId && selectedTextId.startsWith('custom_') && (
                                                (() => {
                                                    const textId = parseInt(selectedTextId.split('_')[1]);
                                                    const customText = customTexts.find(text => text.id === textId);
                                                    if (customText) {
                                                        return (
                                                            <Rect
                                                                {...createSelectionBorder(customText, customText.content)}
                                                            />
                                                        );
                                                    }
                                                    return null;
                                                })()
                                            )}
                                            <Text
                                                name="simNumber"
                                                text={simData.length > 0 ? simData[0].simNumber : "0123456789"}
                                                x={textConfig.simNumber.x}
                                                y={textConfig.simNumber.y}
                                                fontSize={textConfig.simNumber.fontSize}
                                                fill={textConfig.simNumber.color}
                                                fontFamily={textConfig.simNumber.fontFamily}
                                                fontStyle={textConfig.simNumber.fontStyle}
                                                fontWeight={textConfig.simNumber.fontWeight}
                                                stroke={selectedText === 'simNumber' ? '#007bff' : textConfig.simNumber.stroke}
                                                strokeWidth={selectedText === 'simNumber' ? 3 : textConfig.simNumber.strokeWidth}
                                                shadowColor={textConfig.simNumber.shadowColor}
                                                shadowBlur={textConfig.simNumber.shadowBlur}
                                                shadowOffset={textConfig.simNumber.shadowOffset}
                                                opacity={textConfig.simNumber.opacity}
                                                draggable
                                                onClick={() => handleTextClick('simNumber')}
                                                onTap={() => handleTextClick('simNumber')}
                                                onDragEnd={(e) => handleTextDrag('simNumber', e.target.position())}
                                                onDragMove={(e) => {
                                                    // Cập nhật real-time khi kéo
                                                    const pos = e.target.position();
                                                    setTextConfig(prev => ({
                                                        ...prev,
                                                        simNumber: {
                                                            ...prev.simNumber,
                                                            x: Math.round(pos.x),
                                                            y: Math.round(pos.y)
                                                        }
                                                    }));
                                                }}
                                            />
                                            <Text
                                                name="price"
                                                text={simData.length > 0 ? simData[0].price + " Triệu" : "500,000 VNĐ"}
                                                x={textConfig.price.x}
                                                y={textConfig.price.y}
                                                fontSize={textConfig.price.fontSize}
                                                fill={textConfig.price.color}
                                                fontFamily={textConfig.price.fontFamily}
                                                fontStyle={textConfig.price.fontStyle}
                                                fontWeight={textConfig.price.fontWeight}
                                                stroke={selectedText === 'price' ? '#007bff' : textConfig.price.stroke}
                                                strokeWidth={selectedText === 'price' ? 3 : textConfig.price.strokeWidth}
                                                shadowColor={textConfig.price.shadowColor}
                                                shadowBlur={textConfig.price.shadowBlur}
                                                shadowOffset={textConfig.price.shadowOffset}
                                                opacity={textConfig.price.opacity}
                                                draggable
                                                onClick={() => handleTextClick('price')}
                                                onTap={() => handleTextClick('price')}
                                                onDragEnd={(e) => handleTextDrag('price', e.target.position())}
                                                onDragMove={(e) => {
                                                    // Cập nhật real-time khi kéo
                                                    const pos = e.target.position();
                                                    setTextConfig(prev => ({
                                                        ...prev,
                                                        price: {
                                                            ...prev.price,
                                                            x: Math.round(pos.x),
                                                            y: Math.round(pos.y)
                                                        }
                                                    }));
                                                }}
                                            />
                                            {/* Custom Texts */}
                                            {customTexts.map((customText, index) => (
                                                <Text
                                                    key={customText.id}
                                                    name={`custom_${customText.id}`}
                                                    text={customText.content}
                                                    x={customText.x}
                                                    y={customText.y}
                                                    fontSize={customText.fontSize}
                                                    fill={customText.color}
                                                    fontFamily={customText.fontFamily}
                                                    fontStyle={customText.fontStyle}
                                                    fontWeight={customText.fontWeight}
                                                    stroke={selectedText === `custom_${customText.id}` ? '#007bff' : customText.stroke}
                                                    strokeWidth={selectedText === `custom_${customText.id}` ? 3 : customText.strokeWidth}
                                                    shadowColor={customText.shadowColor}
                                                    shadowBlur={customText.shadowBlur}
                                                    shadowOffset={customText.shadowOffset}
                                                    opacity={customText.opacity}
                                                    draggable
                                                    onClick={() => handleTextClick('custom', customText.id)}
                                                    onTap={() => handleTextClick('custom', customText.id)}
                                                    onDragEnd={(e) => {
                                                        const pos = e.target.position();
                                                        updateCustomTextPosition(customText.id, pos);
                                                    }}
                                                    onDragMove={(e) => {
                                                        const pos = e.target.position();
                                                        setCustomTexts(prev => prev.map(text => 
                                                            text.id === customText.id ? { 
                                                                ...text, 
                                                                x: Math.round(pos.x), 
                                                                y: Math.round(pos.y) 
                                                            } : text
                                                        ));
                                                    }}
                                                />
                                            ))}
                                        </Layer>
                                    </Stage>
                                </div>
                            ) : (
                                <div className="text-center p-5" style={{ border: '2px dashed #ccc' }}>
                                    <p>Vui lòng upload ảnh demo để bắt đầu</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Hiển thị danh sách SIM đã parse */}
            {simData.length > 0 && (
                <div className="row mt-4">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h5>Danh sách SIM ({simData.length} SIM)</h5>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>STT</th>
                                                <th>Số SIM</th>
                                                <th>Giá tiền</th>
                                                <th>Dấu phân cách</th>
                                                <th>Trạng thái</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {simData.map((sim, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <code>{sim.simNumber}</code>
                                                    </td>
                                                    <td>
                                                        <code>{sim.price || 'Không có'}</code>
                                                    </td>
                                                    <td>
                                                        <span className="badge bg-secondary">
                                                            {sim.separator || 'Không có'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {sim.simNumber && sim.price ? 
                                                            <span className="badge bg-success">✓ OK</span> :
                                                            sim.simNumber ? 
                                                            <span className="badge bg-warning">⚠ Chỉ có số SIM</span> :
                                                            <span className="badge bg-danger">✗ Lỗi</span>
                                                        }
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal chi tiết SIM trùng lặp */}
            {showDuplicateChecker && duplicateSims.length > 0 && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header bg-warning">
                                <h5 className="modal-title">
                                    <i className="fas fa-exclamation-triangle me-2"></i>
                                    SIM Trùng Lặp
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowDuplicateChecker(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="alert alert-info">
                                    <strong>Tìm thấy {duplicateSims.length} SIM bị trùng lặp trong danh sách!</strong>
                                    <br />
                                    <small>Bạn có thể xóa các SIM trùng lặp để giữ lại chỉ SIM đầu tiên của mỗi số.</small>
                                </div>
                                
                                <div className="table-responsive">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>Số SIM</th>
                                                <th>Số lần xuất hiện</th>
                                                <th>Vị trí trong danh sách</th>
                                                <th>Giá tiền</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {duplicateSims.map((dup, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        <code className="text-primary">{dup.simNumber}</code>
                                                    </td>
                                                    <td>
                                                        <span className="badge bg-danger">{dup.count} lần</span>
                                                    </td>
                                                    <td>
                                                        <small className="text-muted">
                                                            Dòng: {dup.occurrences.map(occ => occ.originalIndex).join(', ')}
                                                        </small>
                                                    </td>
                                                    <td>
                                                        {dup.occurrences.map((occ, occIndex) => (
                                                            <div key={occIndex} className="small">
                                                                {occ.price || 'Không có'} 
                                                                {occIndex < dup.occurrences.length - 1 && <br />}
                                                            </div>
                                                        ))}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowDuplicateChecker(false)}
                                >
                                    Đóng
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={removeDuplicateSims}
                                >
                                    <i className="fas fa-trash me-1"></i>
                                    Xóa tất cả SIM trùng lặp
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal backdrop */}
            {showDuplicateChecker && (
                <div className="modal-backdrop fade show"></div>
            )}
        </div>
    );
};

export default SimImageGenerator;
