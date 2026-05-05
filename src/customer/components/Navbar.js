import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
// IMPORT SERVICE LẤY SẢN PHẨM
import { getAllProducts } from '../../services/ProductService';

const Navbar = () => {
    const { totalItems, clearCartState } = useCart();
    const { currentUser, logoutUser } = useAuth();
    const navigate = useNavigate();

    // CÁC STATE CHO TÌM KIẾM
    const [searchTerm, setSearchTerm] = useState('');
    const [allProducts, setAllProducts] = useState([]); // Chứa toàn bộ sản phẩm
    const [suggestions, setSuggestions] = useState([]); // Chứa 3 sản phẩm gợi ý
    const [isFocused, setIsFocused] = useState(false);  // Ẩn/hiện dropdown

    // LẤY DỮ LIỆU SẢN PHẨM KHI NAVBAR LOAD (Để phục vụ cho gợi ý nhanh)
    useEffect(() => {
        const fetchProductsForSearch = async () => {
            try {
                const data = await getAllProducts();
                setAllProducts(data);
            } catch (error) {
                console.error("Lỗi lấy sản phẩm cho Navbar:", error);
            }
        };
        fetchProductsForSearch();
    }, []);

    const handleLogout = () => {
        logoutUser();
        clearCartState();
        navigate('/');
    };

    // HÀM CHẠY KHI NGƯỜI DÙNG GÕ PHÍM
    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.trim() !== '') {
            // Lọc ra các sản phẩm khớp với từ khóa (không phân biệt hoa thường)
            const filtered = allProducts.filter(p =>
                p.name.toLowerCase().includes(value.toLowerCase())
            );
            // Chỉ lấy tối đa 3 sản phẩm
            setSuggestions(filtered.slice(0, 3));
        } else {
            setSuggestions([]); // Rỗng thì ẩn gợi ý
        }
    };

    // HÀM CHẠY KHI NHẤN ENTER (TÌM TẤT CẢ)
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim() !== '') {
            navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
            setIsFocused(false); // Ẩn menu gợi ý
        } else {
            navigate('/');
        }
    };

    return (
        <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-100 shadow-sm transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo (Mình đổi lại chữ Coffee cho hợp dự án nhé, nếu bạn thích Perfume cứ đổi lại) */}
                    <Link to="/" className="flex-shrink-0 flex items-center cursor-pointer">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-800 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                            <span className="text-white font-black text-xl">C</span>
                        </div>
                        <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-800 tracking-tight">
                            The Coffee
                        </h1>
                    </Link>

                    {/* Search Bar */}
                    <div className="hidden md:flex flex-1 mx-12">
                        <form onSubmit={handleSearch} className="relative w-full max-w-xl group">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleInputChange}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setTimeout(() => setIsFocused(false), 200)} // Trì hoãn một chút để click ăn vào suggestion
                                className="w-full bg-gray-100/50 border border-transparent rounded-full py-2.5 px-5 pl-12 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-sm font-medium"
                                placeholder="Tìm kiếm cà phê, đồ uống..."
                            />
                            <button type="submit" className="absolute left-4 top-3 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                <Search size={18} />
                            </button>

                            {/* DROPDOWN GỢI Ý TÌM KIẾM */}
                            {isFocused && suggestions.length > 0 && (
                                <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                                    <div className="px-4 py-2 bg-gray-50/80 border-b border-gray-100">
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sản phẩm gợi ý</span>
                                    </div>
                                    {suggestions.map((item) => (
                                        <div
                                            key={item.id}
                                            onClick={() => {
                                                setSearchTerm(''); // Xóa text trên thanh search
                                                setIsFocused(false);
                                                navigate(`/product/${item.id}`); // Chuyển thẳng tới trang chi tiết món
                                            }}
                                            className="flex items-center px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors border-b last:border-0 border-gray-50"
                                        >
                                            {/* Ảnh sản phẩm (có ảnh mặc định nếu lỗi) */}
                                            <img
                                                src={
                                                    item.avatar
                                                        ? (item.avatar.startsWith("http") ? item.avatar : `https://asp-net-2.onrender.com${item.avatar}`)
                                                        : "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=100&auto=format&fit=crop"
                                                }
                                                alt={item.name}
                                                className="w-12 h-12 object-cover rounded-lg mr-4 shadow-sm"
                                                onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=No+Image'; }}
                                            />
                                            <div>
                                                <p className="text-sm font-bold text-gray-800">{item.name}</p>
                                                <p className="text-xs text-blue-600 font-medium">
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price || 0)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Nút xem tất cả kết quả */}
                                    <div
                                        onClick={handleSearch}
                                        className="text-center py-3 bg-gray-50 text-sm text-blue-600 font-semibold hover:bg-gray-100 cursor-pointer transition-colors"
                                    >
                                        Xem tất cả kết quả cho &quot;{searchTerm}&quot;                                    </div>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Icons */}
                    <div className="flex items-center space-x-6 md:space-x-8">
                        {currentUser ? (
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-full"><User size={20} /></div>
                                    <span className="text-sm font-bold hidden sm:block truncate max-w-[100px]">
                                        Chào, {currentUser.userName || currentUser.name}
                                    </span>
                                </div>
                                <button onClick={handleLogout} className="text-gray-400 hover:text-red-600 transition-colors" title="Đăng xuất">
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <Link to="/authentication/sign-in">
                                <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                                    <div className="p-2 bg-gray-50 rounded-full"><User size={20} /></div>
                                    <span className="text-sm font-bold hidden sm:block">Đăng nhập</span>
                                </button>
                            </Link>
                        )}

                        <Link to="/cart">
                            <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors relative group">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <ShoppingCart size={20} />
                                </div>
                                {totalItems > 0 && (
                                    <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 border-2 border-white flex items-center justify-center shadow-sm">
                                        {totalItems}
                                    </span>
                                )}
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;