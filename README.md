# Watch Store - Mobile E-commerce Application ⌚🛍️

Một ứng dụng di động e-commerce hiện đại để bán đồng hồ, được xây dựng bằng **Expo** và **React Native** với **TypeScript** ở phía frontend. Backend được phát triển bằng **Java** với **Spring Boot** framework. Ứng dụng cung cấp trải nghiệm mua sắm trực tuyến toàn diện với các tính năng như giỏ hàng, quản lý đơn hàng, danh sách yêu thích, và hỗ trợ chat trực tiếp.

## 🚀 Tính Năng Chính

- 🔐 **Xác thực & Bảo mật**: Đăng nhập, đăng ký, quên mật khẩu, xác minh OTP
- 🛒 **Quản lý Giỏ Hàng**: Thêm/xóa sản phẩm, cập nhật số lượng
- 📦 **Quản lý Đơn Hàng**: Xem danh sách đơn hàng, chi tiết đơn hàng, trạng thái đơn
- ❤️ **Danh Sách Yêu Thích**: Lưu sản phẩm yêu thích
- 💳 **Thanh Toán**: Tích hợp quy trình thanh toán an toàn
- 💬 **Chat Hỗ Trợ**: Hỗ trợ khách hàng thông qua chat trực tiếp
- ⭐ **Đánh Giá & Bình Luận**: Người dùng có thể đánh giá sản phẩm
- 👤 **Quản lý Tài Khoản**: Cài đặt tài khoản, thông tin cá nhân

## 📁 Cấu Trúc Dự Án

```
MyApp/
├── app/                        # Các trang ứng dụng (Expo Router)
│   ├── (auth)/                 # Các màn hình xác thực
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   ├── forgot-password.tsx
│   │   └── verify-otp.tsx
│   ├── (tabs)/                 # Các tab chính
│   │   ├── home.tsx            # Trang chủ
│   │   ├── cart.tsx            # Giỏ hàng
│   │   ├── orders.tsx          # Đơn hàng
│   │   ├── wishlist.tsx        # Danh sách yêu thích
│   │   └── user.tsx            # Tài khoản người dùng
│   ├── product/[id].tsx        # Chi tiết sản phẩm
│   ├── orders/[orderCode].tsx  # Chi tiết đơn hàng
│   └── ...
├── components/                 # Các component tái sử dụng
│   ├── ProductCard.tsx
│   ├── CartIcon.tsx
│   ├── AppHeader.tsx
│   ├── ChatBox.tsx
│   └── ui/                     # UI components
├── services/                   # API services
│   ├── authService.ts
│   ├── cartService.ts
│   ├── orderService.ts
│   ├── checkoutService.ts
│   ├── reviewService.ts
│   └── chatService.ts
├── contexts/                   # React Context API
│   ├── AuthContext.tsx
│   ├── CartContext.tsx
│   └── WishlistContext.tsx
├── hooks/                      # Custom hooks
├── constants/                  # Hằng số và cấu hình
├── assets/                     # Hình ảnh và tài nguyên
└── package.json
```

## 🛠️ Công Nghệ Sử Dụng

### Frontend (Mobile)

- **React Native** - Framework phát triển ứng dụng mobile
- **Expo** - Nền tảng phát triển React Native
- **TypeScript** - Ngôn ngữ lập trình được gõ tĩnh
- **Expo Router** - Định tuyến dựa trên tệp
- **React Context API** - Quản lý trạng thái ứng dụng
- **ESLint** - Kiểm tra chất lượng mã

### Backend (Server)

- **Java** - Ngôn ngữ lập trình
- **Spring Boot** - Framework ứng dụng Java
- **Spring MVC** - Xây dựng RESTful API
- **Spring Data JPA** - Truy cập cơ sở dữ liệu
- **Spring Security** - Xác thực & phân quyền
- **MySQL** - Cơ sở dữ liệu quan hệ

## 📋 Yêu Cầu Hệ Thống

- Node.js (v14 hoặc cao hơn)
- npm hoặc yarn
- Expo CLI
- iOS Simulator hoặc Android Emulator (hoặc Expo Go app)

## 🚀 Hướng Dẫn Cài Đặt

### 1. Clone dự án

```bash
git clone <repository-url>
cd MyApp
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Khởi chạy ứng dụng

```bash
npx expo start
```

Sau khi chạy lệnh trên, bạn sẽ thấy các tùy chọn để mở ứng dụng:

- **i** - Mở trên iOS Simulator
- **a** - Mở trên Android Emulator
- **w** - Mở trên Web
- **j** - Mở Expo DevTools
- **r** - Tải lại ứng dụng
- **Ctrl+C** - Dừng server

## 📱 Phát Triển

### Cấu Trúc Tệp

Dự án sử dụng **Expo Router** cho định tuyến dựa trên tệp. Các tệp `.tsx` trong thư mục `app/` tự động trở thành các tuyến đường:

- `app/index.tsx` → Trang chủ
- `app/(auth)/login.tsx` → Đăng nhập
- `app/(tabs)/home.tsx` → Tab Trang chủ
- `app/product/[id].tsx` → Chi tiết sản phẩm (với ID động)

### Chỉnh Sửa Mã

Bạn có thể bắt đầu chỉnh sửa các tệp trong thư mục `app/`. Ứng dụng sẽ tự động tải lại khi bạn lưu các thay đổi.

### Hot Reload

Nhấn **r** trong terminal để tải lại ứng dụng khi bạn thay đổi mã.

## 🧹 Reset Dự Án (Tuỳ Chọn)

Để reset dự án về trạng thái ban đầu:

```bash
npm run reset-project
```

Lệnh này sẽ di chuyển mã khởi động đến thư mục `app-example` và tạo một thư mục `app` trống.

## 🔗 API Integration

Ứng dụng tích hợp với API backend Spring Boot thông qua các service trong thư mục `services/`:

- **authService.ts** - Quản lý xác thực người dùng (Đăng nhập, Đăng ký, Token refresh)
- **cartService.ts** - Quản lý giỏ hàng (thêm, xóa, cập nhật sản phẩm)
- **orderService.ts** - Quản lý đơn hàng (Lấy danh sách, chi tiết đơn hàng)
- **checkoutService.ts** - Xử lý quy trình thanh toán
- **reviewService.ts** - Quản lý đánh giá sản phẩm
- **chatService.ts** - Hỗ trợ khách hàng qua chat

### Backend Endpoints Chính

Cấu hình URL API trong file `constants/api.ts`:

```
Base URL: http://your-backend-server:port/api

Ví dụ endpoints:
- POST   /api/auth/login           - Đăng nhập
- POST   /api/auth/register        - Đăng ký
- GET    /api/products             - Danh sách sản phẩm đồng hồ
- GET    /api/products/{id}        - Chi tiết sản phẩm
- POST   /api/cart                 - Thêm vào giỏ hàng
- GET    /api/orders               - Danh sách đơn hàng
- POST   /api/orders               - Tạo đơn hàng mới
- POST   /api/reviews              - Gửi đánh giá sản phẩm
```

## 📚 Tài Liệu Tham Khảo

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router Guide](https://docs.expo.dev/router/introduction/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Data JPA Guide](https://spring.io/projects/spring-data-jpa)
- [RESTful API Best Practices](https://restfulapi.net/)

## 👥 Đóng Góp

Hãy fork dự án, tạo branch cho tính năng của bạn, và gửi pull request.

## 📝 License

Dự án này được cấp phép dưới [MIT License](LICENSE).

## 💬 Hỗ Trợ

Nếu bạn gặp bất kỳ vấn đề nào, vui lòng tạo một issue hoặc liên hệ với đội hỗ trợ.
