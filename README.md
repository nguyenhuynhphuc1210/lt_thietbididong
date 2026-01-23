Watch App – Ứng dụng bán đồng hồ (Đồ án)

Đây là đồ án môn học xây dựng ứng dụng bán đồng hồ trên nền tảng Mobile sử dụng Expo (React Native) kết hợp Backend Spring Boot.

Ứng dụng hỗ trợ:

Đăng ký / đăng nhập

Quên mật khẩu bằng OTP gửi qua Email

Xác thực người dùng bằng JWT

Quản lý và hiển thị sản phẩm

Upload hình ảnh bằng Cloudinary

🚀 Get started (Mobile App)
1. Cài đặt dependencies
npm install

2. Chạy ứng dụng
npx expo start


Sau khi chạy, bạn có thể mở ứng dụng bằng:

Expo Go

Android Emulator

iOS Simulator

Web preview

Ứng dụng sử dụng file-based routing của Expo Router.
Bạn có thể bắt đầu phát triển bằng cách chỉnh sửa các file trong thư mục app.

📂 Project structure
app/
 ├── (auth)/
 │   ├── login.tsx
 │   ├── register.tsx
 │   ├── forgot-password.tsx
 │   └── verify-otp.tsx
 ├── (tabs)/
 │   └── home.tsx
 └── _layout.tsx

🔐 Authentication & Security

Xác thực bằng JWT

Quên mật khẩu bằng OTP (6 chữ số)

OTP có thời hạn 5 phút, chỉ sử dụng 1 lần

Mật khẩu được mã hóa bằng BCrypt

JWT secret và API key được lưu bằng biến môi trường (.env)

⚙️ Environment Variables
Frontend (.env)
EXPO_PUBLIC_API_URL=http://localhost:8080/api

Backend (.env)
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=86400000

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_gmail_app_password


⚠️ Không commit file .env lên GitHub

📡 Backend API
Login
POST /api/auth/login

Forgot Password (OTP)
POST /api/auth/forgot-password

Reset Password with OTP
POST /api/auth/reset-password-otp

🛠️ Công nghệ sử dụng
Mobile App

Expo (React Native)

Expo Router

Axios

React Hook Form + Zod

AsyncStorage

Backend

Spring Boot

Spring Security

JWT

JPA / Hibernate

MySQL

JavaMailSender (Gmail SMTP)

Cloudinary

🧪 Learn more

Để tìm hiểu thêm về Expo và React Native:

Expo documentation

Expo Router

React Native

🎯 Kết quả đạt được

Xây dựng thành công ứng dụng mobile bán đồng hồ

Hoàn thiện hệ thống backend REST API

Áp dụng xác thực JWT và OTP Email

Giao diện thân thiện, dễ sử dụng

Áp dụng kiến thức đã học vào thực tế
