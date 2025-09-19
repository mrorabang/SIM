# Hướng dẫn setup Formspree cho Contact Form

## Bước 1: Tạo tài khoản Formspree

1. Truy cập [https://formspree.io/](https://formspree.io/)
2. Click "Get Started" hoặc "Sign Up"
3. Đăng ký tài khoản miễn phí
4. Xác thực email

## Bước 2: Tạo form mới

1. Đăng nhập vào Formspree Dashboard
2. Click "New Form"
3. Đặt tên form: "Contact Form"
4. Click "Create Form"

## Bước 3: Lấy Form Endpoint

1. Sau khi tạo form, bạn sẽ thấy endpoint dạng:
   ```
   https://formspree.io/f/xpwgkqkp
   ```
2. Copy endpoint này

## Bước 4: Cập nhật trong code

1. Mở file `src/service/SendMail.jsx`
2. Thay thế dòng:
   ```javascript
   const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xpwgkqkp';
   ```
3. Bằng endpoint của bạn:
   ```javascript
   const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';
   ```

## Bước 5: Cấu hình email nhận

1. Vào Formspree Dashboard
2. Chọn form vừa tạo
3. Vào tab "Settings"
4. Thêm email của bạn vào "Email Notifications"
5. Lưu cấu hình

## Bước 6: Test chức năng

1. Mở trang Contact trong ứng dụng
2. Điền form liên hệ
3. Click "Gửi tin nhắn"
4. Kiểm tra email của bạn

## Lưu ý quan trọng

- **Miễn phí**: 50 submissions/tháng
- **Không cần cấu hình phức tạp**: Chỉ cần endpoint
- **Tự động**: Gửi email ngay lập tức
- **Spam protection**: Có sẵn

## Troubleshooting

### Lỗi 404 Not Found
- Kiểm tra endpoint có đúng không
- Đảm bảo form đã được tạo

### Lỗi 422 Unprocessable Entity
- Kiểm tra dữ liệu gửi có đúng format không
- Đảm bảo các field bắt buộc đã được điền

### Email không được gửi
- Kiểm tra email trong Formspree Settings
- Xem log trong Formspree Dashboard

## Template email mẫu

Formspree sẽ gửi email với format:
```
Subject: New submission from Contact Form

Name: [Tên người gửi]
Email: [Email người gửi]
Phone: [Số điện thoại]
Subject: [Tiêu đề]
Message: [Nội dung tin nhắn]

---
Submitted on: [Thời gian]
IP Address: [Địa chỉ IP]
```
