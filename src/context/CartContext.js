import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { currentUser } = useAuth();
    const [cartItems, setCartItems] = useState([]);

    const getStorageKey = () => {
        const userId = currentUser?.id || currentUser?.userId;
        return userId ? `cart_${userId}` : 'cart_guest';
    };

    useEffect(() => {
        const key = getStorageKey();
        const savedCart = localStorage.getItem(key);
        setCartItems(savedCart ? JSON.parse(savedCart) : []);
    }, [currentUser]);

    useEffect(() => {
        const key = getStorageKey();
        localStorage.setItem(key, JSON.stringify(cartItems));
    }, [cartItems, currentUser]);

    // HÀM TẠO KEY TOPPING ĐỂ SO SÁNH
    const getToppingKey = (toppings) => {
        if (!toppings || toppings.length === 0) return "no-topping";
        // Lấy ID topping, sắp xếp lại để đảm bảo thứ tự chọn không ảnh hưởng
        return toppings.map(t => t.id).sort().join('-');
    };

    const addToCart = (product, quantity = 1) => {
        setCartItems(prevItems => {
            const newToppingKey = getToppingKey(product.toppings);
            // THỦ THUẬT: Tạo ID duy nhất cho dòng giỏ hàng = Mã SP + Mã Topping
            const uniqueCartId = `${product.id}_${newToppingKey}`;

            const existingItemIndex = prevItems.findIndex(item => {
                const itemToppingKey = getToppingKey(item.toppings);
                return item.id === product.id && itemToppingKey === newToppingKey;
            });

            if (existingItemIndex >= 0) {
                // Trùng y hệt món & Topping -> Gộp số lượng
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex].quantity += quantity;
                return updatedItems;
            } else {
                // Khác món hoặc khác Topping -> Thêm dòng mới (kèm uniqueCartId)
                return [...prevItems, { ...product, uniqueCartId, quantity }];
            }
        });
        alert(`Đã thêm ${product.name} vào giỏ hàng!`);
    };

    // SỬA LẠI: Xóa và Cập nhật số lượng dựa trên uniqueCartId thay vì id gốc
    const removeFromCart = (identifier) => {
        setCartItems(prevItems => prevItems.filter(item => (item.uniqueCartId || item.id) !== identifier));
    };

    const updateQuantity = (identifier, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems(prevItems =>
            prevItems.map(item => (item.uniqueCartId || item.id) === identifier ? { ...item, quantity: newQuantity } : item)
        );
    };

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