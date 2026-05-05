import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { createOrder, createVNPayPayment } from '../../services/OrderService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowLeft, CheckCircle, MapPin, CreditCard, ShoppingBag } from 'lucide-react';

const Checkout = () => {
    const { cartItems, clearCartState } = useCart();
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [address, setAddress] = useState('');
    const [note, setNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);

    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const [paymentMethod, setPaymentMethod] = useState('cod'); // Backend dùng chữ thường: cod, vnpay

    const BACKEND_URL = "https://asp-net-2.onrender.com";

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!currentUser) {
            alert("Vui lòng đăng nhập để thanh toán!");
            navigate('/authentication/sign-in');
        }
        if (cartItems.length === 0 && !orderSuccess) navigate('/cart');
    }, [currentUser, cartItems.length, navigate, orderSuccess]);

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (!address.trim()) return alert('Vui lòng nhập địa chỉ giao hàng!');

        setIsSubmitting(true);
        try {
            // 1. Chuẩn bị danh sách món ăn đúng theo OrderDetailRequestDTO
            const items = cartItems.map(item => ({
                productVariantId: item.id, // Phải là ID của Variant
                quantity: item.quantity,
                toppings: JSON.stringify([]), // Backend của bạn cần chuỗi JSON list string
                note: note || ""
            }));

            // 2. Chuẩn bị object OrderRequestDTO
            const orderPayload = {
                customerId: currentUser.id || currentUser.userId,
                storeId: 1, // Bạn đang bắt buộc StoreId trong DTO, nên để mặc định là 1
                orderType: "delivery",
                deliveryAddress: address,
                paymentMethod: paymentMethod.toLowerCase(), // 'cod' hoặc 'vnpay'
                items: items // Phải trùng tên "Items" trong DTO
            };

            // 3. Gọi API qua Service
            const result = await createOrder(orderPayload);

            console.log("Kết quả từ Server:", result);
            clearCartState();

            if (paymentMethod === 'VNPAY') {
                // ... logic VNPay
            } else {
                setOrderSuccess(true);
            }
        } catch (error) {
            console.error("Lỗi đặt hàng:", error);
            alert(error.message || 'Có lỗi xảy ra!');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (orderSuccess) {
        return (
            <div className="bg-[#f8fafc] min-h-screen flex flex-col font-sans">
                <Navbar />
                <div className="flex-grow flex items-center justify-center p-4">
                    <div className="bg-white p-12 rounded-3xl shadow-lg max-w-lg w-full text-center border border-gray-100">
                        <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={48} />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-4">Đặt Hàng Thành Công!</h2>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            Cảm ơn bạn đã tin tưởng. Đơn hàng của bạn đang được chúng tôi xử lý.
                        </p>
                        <button onClick={() => navigate('/')} className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all flex items-center justify-center gap-2 mx-auto">
                            <ShoppingBag size={20} /> Tiếp Tục Mua Sắm
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="bg-[#f8fafc] min-h-screen flex flex-col font-sans">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full">
                <button onClick={() => navigate('/cart')} className="flex items-center text-gray-500 hover:text-gray-900 font-medium mb-8">
                    <ArrowLeft size={20} className="mr-2" /> Quay lại giỏ hàng
                </button>

                <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-10">Thanh Toán</h1>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    <div className="w-full lg:w-2/3">
                        <form onSubmit={handlePlaceOrder} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <MapPin size={24} className="text-blue-600" /> Thông tin giao hàng
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Người nhận</label>
                                    <input type="text" value={currentUser?.name || 'Khách hàng'} disabled className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                                    <input type="text" value={currentUser?.email || ''} disabled className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-500" />
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Địa chỉ nhận hàng (*)</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Số nhà, tên đường, phường/xã..."
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div className="mb-8">
                                <label className="block text-sm font-bold text-gray-700 mb-4">Phương thức thanh toán</label>
                                <div className="space-y-3">
                                    <label className={`flex items-center p-4 border rounded-xl cursor-pointer ${paymentMethod === 'cod' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}>
                                        <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="w-5 h-5" />
                                        <span className="ml-3 font-medium">Thanh toán khi nhận hàng (COD)</span>
                                    </label>
                                    <label className={`flex items-center p-4 border rounded-xl cursor-pointer ${paymentMethod === 'vnpay' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}>
                                        <input type="radio" name="paymentMethod" value="vnpay" checked={paymentMethod === 'vnpay'} onChange={() => setPaymentMethod('vnpay')} className="w-5 h-5" />
                                        <span className="ml-3 font-medium">Thanh toán qua VNPAY</span>
                                    </label>
                                </div>
                            </div>

                            <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-blue-700 disabled:bg-gray-400">
                                <CreditCard size={20} /> {isSubmitting ? 'Đang xử lý...' : 'Xác Nhận Đặt Hàng'}
                            </button>
                        </form>
                    </div>

                    <div className="w-full lg:w-1/3">
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-28">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Đơn hàng của bạn ({cartItems.length})</h3>
                            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                                {cartItems.map(item => (
                                    <div key={item.id} className="flex items-center gap-4 border-b border-gray-50 pb-4">
                                        <div className="w-16 h-16 bg-gray-50 rounded-xl flex-shrink-0 flex items-center justify-center p-1">
                                            <img
                                                src={item.avatar ? (item.avatar.startsWith("http") ? item.avatar : `${BACKEND_URL}${item.avatar}`) : 'https://placehold.co/100'}
                                                alt={item.name}
                                                className="w-full h-full object-contain mix-blend-multiply"
                                            />
                                        </div>
                                        <div className="flex-grow">
                                            <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{item.name}</h4>
                                            <p className="text-xs text-gray-500">SL: x{item.quantity}</p>
                                        </div>
                                        <div className="text-sm font-bold text-red-600">
                                            {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-3 pt-4 border-t border-gray-100">
                                <div className="flex justify-between items-end">
                                    <span className="text-base font-bold text-gray-900">Tổng cộng</span>
                                    <span className="text-2xl font-black text-red-600">{totalPrice.toLocaleString('vi-VN')} đ</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Checkout;