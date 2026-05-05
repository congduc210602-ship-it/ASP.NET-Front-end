const API_BASE_URL = "https://asp-net-2.onrender.com/api";

export const login = async (email, password) => {
    try {
        // Vì Backend chưa có API Login riêng cho Admin, ta gọi API lấy danh sách User để so sánh
        const response = await fetch(`${API_BASE_URL}/Users`);
        if (!response.ok) throw new Error("Không thể kết nối đến máy chủ");
        
        const users = await response.json();
        
        // Tìm user có email và password khớp nhau
        const user = users.find(u => u.email === userName && u.password === userPassword);

        if (!user) {
            throw new Error("Tài khoản hoặc mật khẩu không đúng!");
        }

        // Kiểm tra quyền Admin (ASP.NET lưu chữ thường "admin")
        if (user.role.toLowerCase() === "admin") {
            const userData = { 
                ...user, 
                token: "fake-jwt-token-for-admin-session" // Giả lập token để UI không báo lỗi
            };
            localStorage.setItem("user", JSON.stringify(userData));
            return userData;
        } else {
            throw new Error("Bạn không có quyền truy cập vào trang quản trị!");
        }
    } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/authentication/sign-in";
};

export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};