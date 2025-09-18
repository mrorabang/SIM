# Tính năng Tạo ảnh SIM hàng loạt

## Mô tả
Tính năng này cho phép bạn tạo ảnh quảng cáo SIM hàng loạt một cách tự động bằng cách:
1. Upload 1 ảnh demo làm nền
2. Nhập danh sách SIM kèm giá tiền
3. Chỉnh sửa vị trí và style của text trên ảnh
4. Tải xuống tất cả ảnh dưới dạng file ZIP

## Cách sử dụng

### 1. Truy cập tính năng
- Đăng nhập vào hệ thống
- Chọn "Tạo ảnh SIM" từ menu chính

### 2. Upload ảnh demo
- Nhấn "Choose File" để chọn ảnh nền
- Hỗ trợ các định dạng: JPG, PNG, GIF, WebP
- Kích thước khuyến nghị: 600x400px

### 3. Nhập danh sách SIM
- Nhập danh sách SIM theo format: `Số SIM, Giá tiền`
- Mỗi dòng một SIM
- Ví dụ:
  ```
  0123456789, 500000
  0987654321, 300000
  0912345678, 700000
  ```

### 4. Chỉnh sửa vị trí text
- **Kéo thả**: Kéo text trực tiếp trên ảnh để thay đổi vị trí
- **Tọa độ**: Nhập chính xác tọa độ X, Y
- **Font size**: Điều chỉnh kích thước chữ
- **Màu sắc**: Chọn màu cho text

### 5. Tải xuống
- Nhấn "Tải xuống" để tạo file ZIP
- File ZIP sẽ chứa tất cả ảnh với tên: `sim_[SốSIM]_[Giá].png`

## Tính năng nổi bật

### ✨ Giao diện trực quan
- Preview real-time khi chỉnh sửa
- Kéo thả text dễ dàng
- Progress bar khi tạo ảnh

### ⚡ Tạo ảnh hàng loạt
- Tạo hàng trăm ảnh cùng lúc
- Tự động đóng gói thành file ZIP
- Tên file có cấu trúc rõ ràng

### 🎨 Tùy chỉnh linh hoạt
- Điều chỉnh vị trí text chính xác
- Thay đổi font size và màu sắc
- Preview ngay lập tức

### 📱 Responsive
- Giao diện thân thiện trên mọi thiết bị
- Layout tối ưu cho desktop và mobile

## Lưu ý kỹ thuật

### Yêu cầu hệ thống
- Trình duyệt hỗ trợ HTML5 Canvas
- JavaScript enabled
- Kết nối internet ổn định

### Giới hạn
- Kích thước ảnh tối đa: 10MB
- Số lượng SIM tối đa: 1000 SIM/lần
- Định dạng ảnh đầu ra: PNG

### Troubleshooting
- **Lỗi upload ảnh**: Kiểm tra định dạng và kích thước file
- **Text không hiển thị**: Đảm bảo tọa độ X, Y hợp lệ
- **Lỗi tải xuống**: Kiểm tra kết nối internet và thử lại

## Hỗ trợ
Nếu gặp vấn đề, vui lòng liên hệ admin hoặc tạo ticket hỗ trợ.

