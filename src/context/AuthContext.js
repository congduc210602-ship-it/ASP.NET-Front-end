// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    useEffect(() => {
        if (currentUser) {
            localStorage.setItem('user', JSON.stringify(currentUser));
        } else {
            localStorage.removeItem('user');
        }
    }, [currentUser]);

    const loginUser = async (userName, password) => {
        try {
            // 1. THỬ ADMIN/STAFF TRƯỚC
            const adminRes = await fetch("https://asp-net-2.onrender.com/api/Users");
            if (adminRes.ok) {
                const users = await adminRes.json();
                const adminUser = users.find(u =>
                    u.email === userName &&
                    u.password === password &&
                    (u.role?.toLowerCase() === "admin" || u.role?.toLowerCase() === "staff")
                );

                if (adminUser) {
                    const userData = { ...adminUser, token: "fake-token-admin", role: adminUser.role.toLowerCase() };
                    setCurrentUser(userData);
                    return userData;
                }
            }

            // 2. THỬ CUSTOMER (ĐỂ LẤY TOKEN THẬT)
            const customerRes = await fetch("https://asp-net-2.onrender.com/api/customer/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: userName, password: password })
            });

            if (customerRes.ok) {
                const data = await customerRes.json();
                const userData = { ...data.customer, token: data.token, role: "customer" };
                setCurrentUser(userData);
                return userData;
            }

            // XỬ LÝ LỖI 500 VÀ 401
            if (customerRes.status === 500) {
                throw new Error("Lỗi Server (500): Có thể do mật khẩu trong Database chưa được mã hóa Bcrypt!");
            } else if (customerRes.status === 401) {
                throw new Error("Tài khoản hoặc mật khẩu khách hàng không chính xác!");
            }

            throw new Error("Tài khoản không hợp lệ!");
        } catch (error) {
            throw error;
        }
    };

    const logoutUser = () => {
        setCurrentUser(null);
        localStorage.removeItem('user');
        window.location.href = "/"; // Đăng xuất xong về trang chủ
    };

    const registerUser = async (userData) => {
        try {
            const response = await fetch("https://asp-net-2.onrender.com/api/customer/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                return await response.json();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || "Đăng ký thất bại, vui lòng thử lại!");
            }
        } catch (error) {
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ currentUser, loginUser, logoutUser, registerUser }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = { children: PropTypes.node.isRequired };
export const useAuth = () => useContext(AuthContext);