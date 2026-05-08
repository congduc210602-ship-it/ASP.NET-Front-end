import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Rating from "@mui/material/Rating";
// import { getAverageRating } from 'services/ReviewService'; // TẠM ẨN VÌ CHƯA CÓ BACKEND

const ProductCard = ({ product }) => {
    const [avgRating, setAvgRating] = useState(0);
    const { addToCart } = useCart();

    // ĐỒNG BỘ: Nối URL Backend Render cho ảnh
    const BACKEND_URL = "https://asp-net-2.onrender.com";
    const name = product.name; // Khai báo biến name từ product.name
    const finalImageUrl = product.avatar
        ? (product.avatar.startsWith("http") ? product.avatar : `${BACKEND_URL}${product.avatar}`)
        : 'https://placehold.co/300x400?text=No+Image';

    /* TẠM ẨN LOGIC RATING ĐỂ TRÁNH LỖI 404
    useEffect(() => {
        const fetchRating = async () => {
            if (product.name) {
                const rating = await getAverageRating(product.name);
                setAvgRating(Number(rating));
            }
        };
        fetchRating();
    }, [product.name]);
    */

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1);
    };

    return (
        <Link to={`/product/${product.id}`} className="block h-full">
            <div className="group bg-white rounded-2xl overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 border border-gray-100 flex flex-col h-full relative cursor-pointer">

                {/* Vùng hình ảnh */}
                <div className="relative aspect-[4/5] overflow-hidden bg-gray-50 flex items-center justify-center p-4">
                    <img
                        src={finalImageUrl}
                        alt={name}
                        className="w-full h-full object-contain mix-blend-multiply transform group-hover:scale-110 transition-transform duration-700 ease-out"
                        onError={(e) => { e.target.src = 'https://placehold.co/300x400?text=No+Image'; }}
                    />

                    <div className="absolute top-4 left-4 bg-gray-900 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest z-10">
                        Hot
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex justify-center gap-2">
                        <button
                            onClick={handleAddToCart}
                            disabled={product.availability === 0}
                            className="bg-white text-gray-900 flex-1 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-gray-50 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ShoppingBag size={18} /> Thêm vào giỏ
                        </button>
                    </div>
                </div>

                {/* Vùng thông tin sản phẩm */}
                <div className="p-5 flex flex-col flex-grow">
                    <p className="text-[11px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-2">
                        {product.category?.name || "The Coffee House"}
                    </p>

                    {/* TẠM ẨN HIỂN THỊ SAO ĐỂ TRÁNH LỖI 404
                    <div className="flex items-center mb-2">
                        <Rating value={avgRating} readOnly size="small" precision={0.5} />
                        {avgRating > 0 && <span className="text-[10px] text-gray-400 ml-1">({avgRating})</span>}
                    </div>
                    */}

                    <h3 className="text-base font-bold text-gray-900 line-clamp-2 mb-3 leading-snug group-hover:text-blue-600 transition-colors">
                        {name}
                    </h3>

                    <div className="mt-auto flex items-end justify-between">
                        <div>
                            <span className="text-lg font-black text-gray-900">
                                {product.price?.toLocaleString('vi-VN')} <span className="text-sm text-gray-500 font-medium underline">đ</span>
                            </span>
                        </div>

                        {(!product.availability || product.availability <= 0) && (
                            <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                Hết hàng
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};

ProductCard.propTypes = {
    product: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        name: PropTypes.string,
        price: PropTypes.number,
        avatar: PropTypes.string,
        category: PropTypes.shape({
            name: PropTypes.string
        }),
        availability: PropTypes.number
    }).isRequired,
};

export default ProductCard;