# Hướng dẫn cấu hình OpenAI API

## 1. Tạo file .env

Tạo file `.env` trong thư mục gốc của dự án (cùng cấp với package.json):

```bash
# Trong terminal, chạy lệnh:
touch .env
```

## 2. Thêm API key vào file .env

Mở file `.env` và thêm nội dung sau:

```env
# OpenAI Configuration
REACT_APP_OPENAI_API_KEY=sk-your-actual-api-key-here

# Optional: OpenAI Organization ID (if you have one)
# REACT_APP_OPENAI_ORG_ID=your_org_id_here

# Optional: Default model
REACT_APP_OPENAI_MODEL=gpt-3.5-turbo
```

**Lưu ý quan trọng:**
- Thay `sk-your-actual-api-key-here` bằng API key thật của bạn
- File `.env` đã được thêm vào `.gitignore` nên sẽ không bị push lên Git
- Không bao giờ commit file `.env` lên repository

## 3. Lấy API key từ OpenAI

1. Truy cập [OpenAI Platform](https://platform.openai.com/)
2. Đăng nhập hoặc tạo tài khoản
3. Vào [API Keys](https://platform.openai.com/api-keys)
4. Click "Create new secret key"
5. Copy API key và paste vào file `.env`

## 4. Sử dụng trong code

```javascript
import { useOpenAI } from './service/OpenAIService';

function MyComponent() {
    const { sendMessage, isLoading, error } = useOpenAI();
    
    const handleSendMessage = async () => {
        try {
            const response = await sendMessage("Xin chào!");
            console.log(response);
        } catch (err) {
            console.error("Error:", err);
        }
    };
    
    return (
        <div>
            <button onClick={handleSendMessage} disabled={isLoading}>
                {isLoading ? 'Đang gửi...' : 'Gửi tin nhắn'}
            </button>
            {error && <p>Lỗi: {error}</p>}
        </div>
    );
}
```

## 5. Deploy lên server

Khi deploy lên server (Vercel, Netlify, etc.), thêm environment variable:

- **Vercel**: Vào Settings > Environment Variables
- **Netlify**: Vào Site settings > Environment variables
- **Heroku**: Sử dụng `heroku config:set`

Thêm biến: `REACT_APP_OPENAI_API_KEY` với giá trị API key của bạn.

## 6. Bảo mật

- ✅ File `.env` đã được thêm vào `.gitignore`
- ✅ API key không bao giờ được hard-code trong source code
- ✅ Sử dụng environment variables để quản lý cấu hình
- ✅ Có thể sử dụng trên nhiều thiết bị khác nhau

## 7. Troubleshooting

### Lỗi "OpenAI API key chưa được cấu hình"
- Kiểm tra file `.env` có tồn tại không
- Kiểm tra tên biến có đúng `REACT_APP_OPENAI_API_KEY` không
- Restart development server sau khi thêm file `.env`

### Lỗi "Invalid API key"
- Kiểm tra API key có đúng không
- Kiểm tra API key có còn hoạt động không
- Kiểm tra có đủ credit trong tài khoản OpenAI không

### Lỗi CORS
- API key được sử dụng từ frontend, có thể gặp lỗi CORS
- Cân nhắc tạo backend proxy hoặc sử dụng server-side rendering
