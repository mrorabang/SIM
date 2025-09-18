# Hướng dẫn cấu hình Cloudinary

## Bước 1: Tạo tài khoản Cloudinary
1. Truy cập [cloudinary.com](https://cloudinary.com)
2. Đăng ký tài khoản miễn phí
3. Xác nhận email

## Bước 2: Lấy thông tin cấu hình
1. Đăng nhập vào Cloudinary Dashboard
2. Vào phần **Settings** > **Security**
3. Copy các thông tin sau:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

## Bước 3: Tạo Upload Preset
1. Vào **Settings** > **Upload**
2. Click **Add upload preset**
3. Đặt tên preset (ví dụ: `sim-avatar-upload`)
4. Chọn **Signing Mode**: **Unsigned** (để upload từ frontend)
5. Trong **Transformation**:
   - **Width**: 400
   - **Height**: 400
   - **Crop**: Fill
   - **Gravity**: Face
   - **Format**: Auto
6. Click **Save**

## Bước 4: Cập nhật file config
Mở file `src/config/cloudinary.js` và thay thế các giá trị:

```javascript
export const cloudinaryConfig = {
    cloudName: 'sim', // Cloud name của bạn
    uploadPreset: 'sim-avatar-upload' // Upload preset cho avatar (cần tạo trước)
};
```

**Lưu ý:** Với unsigned upload, bạn chỉ cần Cloud Name và Upload Preset, không cần API Key và API Secret.

## Bước 5: Test upload
1. Chạy ứng dụng: `npm start`
2. Đăng nhập và vào trang Profile
3. Click "Upload Avatar" để test

## Lưu ý bảo mật
- **KHÔNG** commit file config với API Secret thật
- Sử dụng biến môi trường cho production
- Có thể tạo file `.env` để lưu config:

```env
REACT_APP_CLOUDINARY_CLOUD_NAME=your-cloud-name
REACT_APP_CLOUDINARY_API_KEY=your-api-key
REACT_APP_CLOUDINARY_UPLOAD_PRESET=sim-avatar-upload
```

Và cập nhật config:
```javascript
export const cloudinaryConfig = {
    cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.REACT_APP_CLOUDINARY_API_KEY,
    uploadPreset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
};
```
