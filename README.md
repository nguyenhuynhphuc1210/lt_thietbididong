# MyApp - E-Commerce Mobile Application

Ứng dụng mua sắm di động được xây dựng với [Expo](https://expo.dev) và React Native. Ứng dụng cung cấp trải nghiệm mua sắm liền mạch với nhiều tính năng nâng cao.

## 📋 Mục Lục
- [Tính Năng](#tính-năng)
- [Yêu Cầu Hệ Thống](#yêu-cầu-hệ-thống)
- [Cài Đặt](#cài-đặt)
- [Cấu Trúc Dự Án](#cấu-trúc-dự-án)
- [Công Nghệ Sử Dụng](#công-nghệ-sử-dụng)
- [Hướng Dẫn Sử Dụng](#hướng-dẫn-sử-dụng)
- [Đóng Góp](#đóng-góp)

## ✨ Tính Năng

### Xác Thực & Tài Khoản
- Đăng ký tài khoản mới
- Đăng nhập với email/mật khẩu
- Quên mật khẩu / Đặt lại mật khẩu
- Xác minh OTP
- Quản lý cài đặt tài khoản

### Mua Sắm
- Duyệt danh sách sản phẩm
- Xem chi tiết sản phẩm
- Tìm kiếm và lọc sản phẩm
- Giỏ hàng (thêm/xóa/cập nhật số lượng)
- Danh sách yêu thích

### Thanh Toán & Đơn Hàng
- Quy trình thanh toán an toàn
- Xem lịch sử đơn hàng
- Theo dõi trạng thái đơn hàng
- Xem chi tiết từng đơn hàng

### Tương Tác
- Viết và đọc đánh giá sản phẩm
- Chat trực tiếp (FloatingChat)
- Hỗ trợ khách hàng 24/7

## 💻 Yêu Cầu Hệ Thống

- **Node.js**: v18 hoặc cao hơn
- **npm** hoặc **yarn**
- **Expo CLI**: `npm install -g expo-cli`
- **Android Studio** (cho phát triển Android) hoặc **Xcode** (cho phát triển iOS)

## 🚀 Cài Đặt

### 1. Clone Dự Án
```bash
git clone <repository-url>
cd MyApp
```

### 2. Cài Đặt Dependencies
```bash
npm install
```

### 3. Khởi Động Ứng Dụng
```bash
npm start
# hoặc
npx expo start
```

### 4. Chạy Trên Các Nền Tảng Khác Nhau

**Android:**
```bash
npm run android
```

**iOS:**
```bash
npm run ios
```

**Web:**
```bash
npm run web
```

**Expo Go:**
```bash
npx expo start
# Quét mã QR bằng Expo Go trên điện thoại
```

## 📁 Cấu Trúc Dự Án

```
MyApp/
├── app/                          # Màn hình chính (sử dụng Expo Router)
│   ├── _layout.tsx              # Layout chính
│   ├── (auth)/                  # Nhóm routes xác thực
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   ├── forgot-password.tsx
│   │   └── verify-otp.tsx
│   ├── (tabs)/                  # Nhóm tabs chính
│   │   ├── home.tsx
│   │   ├── cart.tsx
│   │   ├── orders.tsx
│   │   ├── wishlist.tsx
│   │   └── user.tsx
│   ├── product/                 # Chi tiết sản phẩm
│   ├── orders/                  # Chi tiết đơn hàng
│   └── payment.tsx              # Quy trình thanh toán
├── components/                  # Các component tái sử dụng
│   ├── AppHeader.tsx
│   ├── ProductCard.tsx
│   ├── CartIcon.tsx
│   ├── ChatBox.tsx
│   └── ui/                      # UI components
├── services/                    # API services
│   ├── authService.ts
│   ├── cartService.ts
│   ├── orderService.ts
│   ├── checkoutService.ts
│   ├── reviewService.ts
│   └── chatService.ts
├── contexts/                    # React Contexts
│   ├── AuthContext.tsx
│   ├── CartContext.tsx
│   └── WishlistContext.tsx
├── constants/                   # Hằng số
│   ├── api.ts
│   ├── theme.ts
│   └── orderStatus.ts
├── hooks/                       # Custom hooks
│   ├── use-color-scheme.ts
│   └── use-theme-color.ts
├── assets/                      # Hình ảnh và tài nguyên
│   └── images/
├── package.json
├── app.json
├── tsconfig.json
└── README.md
```

## 🛠️ Công Nghệ Sử Dụng

### Framework & Library
- **React Native** - Framework phát triển ứng dụng di động
- **Expo** - Nền tảng xây dựng ứng dụng React Native
- **Expo Router** - Định tuyến file-based cho React Native
- **TypeScript** - Ngôn ngữ lập trình có kiểu tĩnh

### State Management & Form
- **React Context API** - Quản lý trạng thái toàn cục
- **React Hook Form** - Quản lý form hiệu quả
- **Zod** - Xác thực schema

### UI & Navigation
- **React Navigation** - Thư viện điều hướng
- **@expo/vector-icons** - Icon SVG
- **React Native Reanimated** - Hoạt ảnh hiệu suất cao

### HTTP & Async Storage
- **Axios** - HTTP client
- **AsyncStorage** - Lưu trữ cục bộ

### Các Thư Viện Khác
- **React Native Toast Message** - Thông báo
- **React Native Gesture Handler** - Xử lý cử chỉ
- **React Native WebView** - Hiển thị web content
- **Google Places Autocomplete** - Tự động hoàn thành địa chỉ

## 📖 Hướng Dẫn Sử Dụng

### Phát Triển
```bash
# Khởi động dev server
npm start

# Lint code
npm run lint

# Reset dự án (xóa tất cả thay đổi)
npm run reset-project
```

### Xây Dựng
```bash
# Build cho Android
expo build:android

# Build cho iOS
expo build:ios

# Build cho Web
npm run web
```

## 📝 Hướng Dẫn Phát Triển

### Thêm Trang Mới
1. Tạo file `.tsx` trong thư mục `app/`
2. Sử dụng Expo Router để điều hướng tự động

### Thêm Component Mới
1. Tạo file trong `components/`
2. Export component và sử dụng ở các màn hình

### Tạo Service Mới
1. Tạo file trong `services/`
2. Sử dụng axios để gọi API
3. Xử lý lỗi và response

### Thêm Context Mới
1. Tạo file trong `contexts/`
2. Wrap ứng dụng với provider
3. Sử dụng custom hook để truy cập context

## 🤝 Đóng Góp

Chúng tôi hoan nghênh các đóng góp! Vui lòng:
1. Fork dự án
2. Tạo branch cho feature (`git checkout -b feature/AmazingFeature`)
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📞 Liên Hệ & Hỗ Trợ

Nếu bạn có câu hỏi hoặc cần hỗ trợ, vui lòng liên hệ:
- Email: support@myapp.com
- Chat: Sử dụng tính năng FloatingChat trong ứng dụng

## 📄 Giấy Phép

Dự án này được cấp phép dưới [MIT License](LICENSE).

---

**Phiên bản:** 1.0.0  
**Cập nhật lần cuối:** Tháng 1 năm 2026
