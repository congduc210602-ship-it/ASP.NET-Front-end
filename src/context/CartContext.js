import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from './AuthContext'; // 1. IMPORT AUTH CONTEXT

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { currentUser } = useAuth(); // 2. LẤY THÔNG TIN USER HIỆN TẠI
    const [cartItems, setCartItems] = useState([]);

    // Xác định Key lưu trữ dựa trên User ID (Đảm bảo không bị undefined)
    const getStorageKey = () => {
        const userId = currentUser?.id || currentUser?.userId;
        return userId ? `cart_${userId}` : 'cart_guest';
    };

    // 3. EFFECT 1: Khi User thay đổi (Login/Logout), nạp giỏ hàng tương ứng từ máy
    useEffect(() => {
        const key = getStorageKey();
        const savedCart = localStorage.getItem(key);
        setCartItems(savedCart ? JSON.parse(savedCart) : []);
    }, [currentUser]);

    // 4. EFFECT 2: Mỗi khi giỏ hàng hoặc User thay đổi, tự động lưu lại vào đúng Key
    useEffect(() => {
        const key = getStorageKey();
        // Chỉ lưu nếu mảng có dữ liệu hoặc Key không phải là guest (tùy nhu cầu)
        localStorage.setItem(key, JSON.stringify(cartItems));
    }, [cartItems, currentUser]);

    const addToCart = (product, quantity = 1) => {
        setCartItems(prevItems => {
            const isExist = prevItems.find(item => item.id === product.id);
            if (isExist) {
                return prevItems.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
                );
            }
            return [...prevItems, { ...product, quantity }];
        });
        alert(`Đã thêm ${product.name} vào giỏ hàng!`);
    };

    const removeFromCart = (id) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems(prevItems =>
            prevItems.map(item => item.id === id ? { ...item, quantity: newQuantity } : item)
        );
    };

    // 5. HÀM DỌN SẠCH STATE (Dùng khi logout để UI về trống, nhưng không xóa localStorage)
    const clearCartState = () => {
        setCartItems([]);
    };

    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, totalItems, clearCartState }}>
            {children}
        </CartContext.Provider>
    );
};

CartProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useCart = () => useContext(CartContext);