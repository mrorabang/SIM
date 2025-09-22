import React, { useState, useRef, useCallback } from 'react';
import { showAlert } from '../service/AlertServices';
import './DragDropFileUpload.css';

const DragDropFileUpload = ({ 
    onFileSelect, 
    accept = "image/*", 
    maxSize = 5 * 1024 * 1024, // 5MB default
    multiple = false,
    preview = true,
    className = "",
    children,
    onPreviewReorder = null, // Callback khi sắp xếp lại preview
    onPreviewDragToCanvas = null, // Callback khi kéo từ preview ra canvas
    enablePreviewDrag = true // Bật/tắt drag preview
}) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const [previewImages, setPreviewImages] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [draggedPreviewIndex, setDraggedPreviewIndex] = useState(null);
    const [dragOverPreviewIndex, setDragOverPreviewIndex] = useState(null);
    const fileInputRef = useRef(null);

    // Validate file
    const validateFile = (file) => {
        // Check file type
        if (accept && !file.type.match(accept.replace(/\*/g, '.*'))) {
            showAlert('Loại file không được hỗ trợ!', 'warning');
            return false;
        }

        // Check file size
        if (file.size > maxSize) {
            showAlert(`Kích thước file không được vượt quá ${Math.round(maxSize / 1024 / 1024)}MB!`, 'warning');
            return false;
        }

        return true;
    };

    // Process files
    const processFiles = useCallback(async (files) => {
        const fileArray = Array.from(files);
        const validFiles = fileArray.filter(validateFile);
        
        if (validFiles.length === 0) return;

        setIsUploading(true);

        try {
            // Create previews
            if (preview) {
                const previewPromises = validFiles.map(file => {
                    return new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            resolve({
                                file,
                                preview: e.target.result,
                                name: file.name,
                                size: file.size
                            });
                        };
                        reader.readAsDataURL(file);
                    });
                });

                const previews = await Promise.all(previewPromises);
                setPreviewImages(previews);
            }

            // Call parent callback
            if (multiple) {
                onFileSelect(validFiles);
            } else {
                onFileSelect(validFiles[0]);
            }

            showAlert(`Upload thành công ${validFiles.length} file!`, 'success');

        } catch (error) {
            console.error('Error processing files:', error);
            showAlert('Lỗi xử lý file!', 'error');
        } finally {
            setIsUploading(false);
        }
    }, [accept, maxSize, multiple, preview, onFileSelect]);

    // Handle drag events
    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            processFiles(files);
        }
    }, [processFiles]);

    // Handle file input change
    const handleFileInputChange = useCallback((e) => {
        const files = e.target.files;
        if (files.length > 0) {
            processFiles(files);
        }
    }, [processFiles]);

    // Handle click to open file dialog
    const handleClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    // Remove preview
    const removePreview = useCallback((index) => {
        setPreviewImages(prev => prev.filter((_, i) => i !== index));
    }, []);

    // Clear all previews
    const clearAllPreviews = useCallback(() => {
        setPreviewImages([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, []);

    // Format file size
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Handle preview drag start
    const handlePreviewDragStart = useCallback((e, index) => {
        if (!enablePreviewDrag) return;
        setDraggedPreviewIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.outerHTML);
        e.dataTransfer.setData('text/plain', index.toString());
        
        // Add drag image
        const dragImage = e.target.cloneNode(true);
        dragImage.style.transform = 'rotate(5deg)';
        dragImage.style.opacity = '0.8';
        document.body.appendChild(dragImage);
        e.dataTransfer.setDragImage(dragImage, 0, 0);
        setTimeout(() => document.body.removeChild(dragImage), 0);
    }, [enablePreviewDrag]);

    // Handle preview drag over
    const handlePreviewDragOver = useCallback((e, index) => {
        if (!enablePreviewDrag) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverPreviewIndex(index);
    }, [enablePreviewDrag]);

    // Handle preview drag leave
    const handlePreviewDragLeave = useCallback((e) => {
        if (!enablePreviewDrag) return;
        // Only clear if we're leaving the preview item entirely
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setDragOverPreviewIndex(null);
        }
    }, [enablePreviewDrag]);

    // Handle preview drop
    const handlePreviewDrop = useCallback((e, dropIndex) => {
        if (!enablePreviewDrag) return;
        e.preventDefault();
        
        const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
        
        if (dragIndex !== dropIndex) {
            // Reorder preview images
            setPreviewImages(prev => {
                const newImages = [...prev];
                const draggedItem = newImages[dragIndex];
                newImages.splice(dragIndex, 1);
                newImages.splice(dropIndex, 0, draggedItem);
                return newImages;
            });
            
            // Call parent callback if provided
            if (onPreviewReorder) {
                onPreviewReorder(dragIndex, dropIndex);
            }
        }
        
        setDraggedPreviewIndex(null);
        setDragOverPreviewIndex(null);
    }, [enablePreviewDrag, onPreviewReorder]);

    // Handle preview drag end
    const handlePreviewDragEnd = useCallback(() => {
        setDraggedPreviewIndex(null);
        setDragOverPreviewIndex(null);
    }, []);

    // Handle drag from preview to canvas
    const handlePreviewDragStartToCanvas = useCallback((e, index) => {
        if (!enablePreviewDrag || !onPreviewDragToCanvas) return;
        
        const imageData = previewImages[index];
        e.dataTransfer.effectAllowed = 'copy';
        e.dataTransfer.setData('application/json', JSON.stringify({
            type: 'image',
            file: imageData.file,
            preview: imageData.preview,
            index: index
        }));
        
        // Create custom drag image
        const dragImage = document.createElement('div');
        dragImage.innerHTML = `
            <div style="
                background: white;
                border: 2px solid #007bff;
                border-radius: 8px;
                padding: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                transform: rotate(5deg);
            ">
                <img src="${imageData.preview}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">
                <div style="font-size: 12px; margin-top: 4px; text-align: center;">Kéo vào canvas</div>
            </div>
        `;
        dragImage.style.position = 'absolute';
        dragImage.style.top = '-1000px';
        document.body.appendChild(dragImage);
        e.dataTransfer.setDragImage(dragImage, 30, 30);
        setTimeout(() => document.body.removeChild(dragImage), 0);
    }, [enablePreviewDrag, onPreviewDragToCanvas, previewImages]);

    return (
        <div className={`drag-drop-upload ${className}`}>
            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                multiple={multiple}
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
            />

            {/* Drop zone */}
            <div
                className={`drop-zone ${isDragOver ? 'drag-over' : ''} ${isUploading ? 'uploading' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
                style={{
                    border: `2px dashed ${isDragOver ? '#007bff' : '#dee2e6'}`,
                    borderRadius: '8px',
                    padding: '2rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    backgroundColor: isDragOver ? '#f8f9fa' : '#ffffff',
                    position: 'relative',
                    minHeight: '120px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                {isUploading ? (
                    <div className="uploading-content">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2 mb-0">Đang xử lý file...</p>
                    </div>
                ) : (
                    <div className="drop-content">
                        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                            📁
                        </div>
                        <h5 className="mb-2">
                            {isDragOver ? 'Thả file vào đây' : 'Kéo thả file hoặc click để chọn'}
                        </h5>
                        <p className="text-muted mb-0">
                            Hỗ trợ: {accept.replace(/\*/g, '')} (Tối đa {Math.round(maxSize / 1024 / 1024)}MB)
                        </p>
                        {children}
                    </div>
                )}
            </div>

            {/* Preview images */}
            {preview && previewImages.length > 0 && (
                <div className="preview-container mt-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="mb-0">Preview ({previewImages.length})</h6>
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={clearAllPreviews}
                        >
                            Xóa tất cả
                        </button>
                    </div>
                    <div className="row g-2">
                        {previewImages.map((item, index) => (
                            <div key={index} className="col-md-3 col-sm-4 col-6">
                                <div 
                                    className={`preview-item position-relative ${
                                        draggedPreviewIndex === index ? 'dragging' : ''
                                    } ${
                                        dragOverPreviewIndex === index ? 'drag-over' : ''
                                    }`}
                                    draggable={enablePreviewDrag}
                                    onDragStart={(e) => {
                                        // Handle both reordering and canvas drag
                                        if (onPreviewDragToCanvas) {
                                            handlePreviewDragStartToCanvas(e, index);
                                        } else {
                                            handlePreviewDragStart(e, index);
                                        }
                                    }}
                                    onDragOver={(e) => handlePreviewDragOver(e, index)}
                                    onDragLeave={handlePreviewDragLeave}
                                    onDrop={(e) => handlePreviewDrop(e, index)}
                                    onDragEnd={handlePreviewDragEnd}
                                    style={{
                                        cursor: enablePreviewDrag ? 'grab' : 'default',
                                        opacity: draggedPreviewIndex === index ? 0.5 : 1,
                                        transform: draggedPreviewIndex === index ? 'scale(0.95)' : 'scale(1)',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <img
                                        src={item.preview}
                                        alt={item.name}
                                        className="img-fluid rounded"
                                        style={{
                                            width: '100%',
                                            height: '120px',
                                            objectFit: 'cover',
                                            pointerEvents: 'none' // Prevent image from interfering with drag
                                        }}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removePreview(index);
                                        }}
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            padding: '0',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            zIndex: 10
                                        }}
                                    >
                                        ×
                                    </button>
                                    
                                    {/* Drag handle indicator */}
                                    {enablePreviewDrag && (
                                        <div 
                                            className="drag-handle position-absolute top-0 start-0 m-1"
                                            style={{
                                                width: '24px',
                                                height: '24px',
                                                background: 'rgba(0,0,0,0.6)',
                                                borderRadius: '4px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontSize: '12px',
                                                cursor: 'grab'
                                            }}
                                        >
                                            ⋮⋮
                                        </div>
                                    )}
                                    
                                    <div className="preview-info p-2">
                                        <small className="text-muted d-block text-truncate" title={item.name}>
                                            {item.name}
                                        </small>
                                        <small className="text-muted">
                                            {formatFileSize(item.size)}
                                        </small>
                                        {enablePreviewDrag && onPreviewDragToCanvas && (
                                            <small className="text-info d-block">
                                                Kéo vào canvas
                                            </small>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DragDropFileUpload;
