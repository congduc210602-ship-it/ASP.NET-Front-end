import React, { useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import Navbar from '../components/Navbar';
import { Trash2, Minus, Plus, ArrowLeft, CreditCard, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity } = useCart();
    const navigate = useNavigate();
    const BACKEND_URL = "https://asp-net-2.onrender.com";

    // HÀM TÍNH TỔNG TIỀN MỚI (Đã bao gồm tiền Topping)
    const totalPrice = cartItems.reduce((sum, item) => {
        // Tính tổng giá Topping của sản phẩm này (nếu có)
        const itemToppingsPrice = item.toppings ? item.toppings.reduce((tSum, topping) => tSum + topping.price, 0) : 0;
        // Tổng giá = (Giá sản phẩm + Giá các Topping) * Số lượng
        return sum + ((item.price + itemToppingsPrice) * item.quantity);
    }, 0);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleCheckout = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            alert("Vui lòng đăng nhập để tiến hành thanh toán!");
            navigate("/authentication/sign-in");
            return;
        }
        navigate("/checkout");
    };

    return (
        <div className="bg-[#f8fafc] min-h-screen pb-20 font-sans">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex items-center gap-3 mb-10">
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Giỏ hàng của bạn</h1>
                    {cartItems.length > 0 && (
                        <span className="bg-blue-100 text-blue-700 text-sm font-bold px-3 py-1 rounded-full">
                            {cartItems.length} món
                        </span>
                    )}
                </div>

                {cartItems.length === 0 ? (
                    <div className="bg-white rounded-3xl p-16 md:p-24 text-center shadow-sm border border-gray-100 flex flex-col items-center">
                        <div className="bg-gray-50 w-32 h-32 rounded-full flex items-center justify-center mb-8 border-4 border-gray-100">
                            <span className="text-6xl">🛍️</span>
                        </div>
                        <h2 className="text-2xl font-black text-gray-800 mb-4">Giỏ hàng đang trống!</h2>
                        <Link to="/" className="inline-flex items-center bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all">
                            <ArrowLeft size={20} className="mr-2" /> Tiếp tục mua sắm
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                        <div className="w-full lg:w-2/3 space-y-4">
                            {cartItems.map((item, index) => {
                                const imageUrl = item.avatar
                                    ? (item.avatar.startsWith("http") ? item.avatar : `${BACKEND_URL}${item.avatar}`)
                                    : 'https://placehold.co/150x150?text=No+Image';

                                // TÍNH LẠI GIÁ HIỂN THỊ CỦA SẢN PHẨM NÀY
                                const itemToppingsPrice = item.toppings ? item.toppings.reduce((sum, t) => sum + t.price, 0) : 0;
                                const currentItemPrice = item.price + itemToppingsPrice;

                                // LẤY ID ĐỊNH DANH (Dùng uniqueCartId nếu có, không thì fallback về id)
                                const itemIdentifier = item.uniqueCartId || item.id;

                                return (
                                    <div key={itemIdentifier} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-6 hover:shadow-md transition-shadow relative">
                                        <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 bg-gray-50 rounded-2xl p-2 flex items-center justify-center">
                                            <img src={imageUrl} className="w-full h-full object-contain mix-blend-multiply" alt={item.name} />
                                        </div>

                                        <div className="flex-grow w-full">
                                            <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">
                                                {item.category?.name || "Sản phẩm"}
                                            </p>
                                            <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1">{item.name}</h3>

                                            {/* HIỂN THỊ DANH SÁCH TOPPING NẾU CÓ */}
                                            {item.toppings && item.toppings.length > 0 && (
                                                <p className="text-sm text-gray-500 mb-2 italic">
                                                    + Topping: {item.toppings.map(t => t.name).join(', ')}
                                                </p>
                                            )}

                                            <p className="text-lg font-black text-red-600">
                                                {currentItemPrice.toLocaleString('vi-VN')} <span className="text-sm underline text-gray-500">đ</span>
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:flex-col sm:items-end sm:gap-4 mt-4 sm:mt-0">
                                            <div className="flex items-center bg-gray-50 rounded-full border border-gray-200 p-1">
                                                <button onClick={() => updateQuantity(itemIdentifier, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white text-gray-600">
                                                    <Minus size={14} />
                                                </button>
                                                <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(itemIdentifier, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white text-gray-600">
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                            <button onClick={() => removeFromCart(itemIdentifier)} className="text-gray-400 hover:text-red-500 p-2 absolute sm:relative top-2 right-2 sm:top-0 sm:right-0">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="w-full lg:w-1/3">
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-28">
                                <h3 className="text-xl font-black text-gray-900 mb-6">Tóm tắt đơn hàng</h3>
                                <div className="space-y-4 mb-6 pb-6 border-b border-gray-100">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tổng số lượng:</span>
                                        <span className="font-bold text-gray-900">{cartItems.reduce((acc, item) => acc + item.quantity, 0)} món</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-end mb-8">
                                    <span className="text-lg font-bold text-gray-900">Tổng cộng:</span>
                                    <span className="text-3xl font-black text-red-600">
                                        {totalPrice.toLocaleString('vi-VN')} <span className="text-xl text-gray-500 underline">đ</span>
                                    </span>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-gray-900 text-white py-4 px-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-blue-600 hover:shadow-lg transition-all mb-4"
                                >
                                    <CreditCard size={20} /> Tiến Hành Thanh Toán
                                </button>

                                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-6">
                                    <ShieldCheck size={16} className="text-emerald-500" /> Thanh toán an toàn & bảo mật 100%
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;