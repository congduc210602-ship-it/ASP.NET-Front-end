import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// SỬ DỤNG ICON CỦA MATERIAL UI
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SendIcon from '@mui/icons-material/Send';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 pt-20 pb-10 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* Cột 1: Giới thiệu */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-800 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                                <span className="text-white font-black text-xl">C</span>
                            </div>
                            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-800 tracking-tight">
                                The Coffee
                            </h1>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Chúng tôi tự hào mang đến những ly cà phê nguyên bản và đậm vị nhất, khơi dậy nguồn cảm hứng cho một ngày mới tràn đầy năng lượng của bạn.
                        </p>
                        <div className="flex space-x-4">
                            <SocialIcon icon={<FacebookIcon fontSize="small" />} />
                            <SocialIcon icon={<InstagramIcon fontSize="small" />} />
                            <SocialIcon icon={<TwitterIcon fontSize="small" />} />
                        </div>
                    </div>

                    {/* Cột 2: Liên kết nhanh */}
                    <div>
                        <h4 className="text-gray-900 font-bold mb-6">Thực Đơn</h4>
                        <ul className="space-y-4">
                            <FooterLink to="/" text="Tất cả sản phẩm" />
                            <FooterLink to="/" text="Cà Phê Pha Phin" />
                            <FooterLink to="/" text="Cà Phê Pha Máy" />
                            <FooterLink to="/" text="Trà Trái Cây" />
                            <FooterLink to="/" text="Bánh Ngọt" />
                        </ul>
                    </div>

                    {/* Cột 3: Hỗ trợ khách hàng */}
                    <div>
                        <h4 className="text-gray-900 font-bold mb-6">Hỗ Trợ</h4>
                        <ul className="space-y-4">
                            <FooterLink to="/" text="Chính sách tích điểm" />
                            <FooterLink to="/" text="Vận chuyển & Giao hàng" />
                            <FooterLink to="/" text="Hình thức thanh toán" />
                            <FooterLink to="/" text="Câu hỏi thường gặp" />
                        </ul>
                    </div>

                    {/* Cột 4: Liên hệ */}
                    <div className="space-y-6">
                        <h4 className="text-gray-900 font-bold">Liên Hệ</h4>
                        <div className="space-y-3">
                            <ContactItem icon={<PhoneIcon sx={{ fontSize: 18 }} />} text="0123 456 789" />
                            <ContactItem icon={<EmailIcon sx={{ fontSize: 18 }} />} text="contact@thecoffee.com" />
                            <ContactItem icon={<LocationOnIcon sx={{ fontSize: 18 }} />} text="Thủ Đức, TP. Hồ Chí Minh" />
                        </div>
                        <div className="relative mt-6">
                            <input
                                type="email"
                                placeholder="Email nhận ưu đãi..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-full py-3 px-5 pr-12 text-sm outline-none focus:border-blue-500 transition-all"
                            />
                            <button className="absolute right-1.5 top-1.5 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-all flex items-center justify-center">
                                <SendIcon sx={{ fontSize: 16 }} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-xs">
                        © 2026 The Coffee House. All rights reserved. Design by Duc Tran.
                    </p>
                    <div className="flex space-x-6 text-xs text-gray-400">
                        <span className="hover:text-blue-600 cursor-pointer transition-colors">Điều khoản dịch vụ</span>
                        <span className="hover:text-blue-600 cursor-pointer transition-colors">Chính sách bảo mật</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

// --- CÁC COMPONENT PHỤ (ĐÃ FIX LỖI PROPTYPES) ---

const FooterLink = ({ to, text }) => (
    <li>
        <Link to={to} className="text-gray-500 text-sm hover:text-blue-600 hover:translate-x-1 transition-all inline-block">
            {text}
        </Link>
    </li>
);
FooterLink.propTypes = {
    to: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
};

const SocialIcon = ({ icon }) => (
    <div className="w-10 h-10 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white hover:shadow-lg transition-all cursor-pointer">
        {icon}
    </div>
);
SocialIcon.propTypes = {
    icon: PropTypes.node.isRequired,
};

const ContactItem = ({ icon, text }) => (
    <div className="flex items-center gap-3 text-gray-500 text-sm">
        <div className="text-blue-600 flex items-center">{icon}</div>
        <span>{text}</span>
    </div>
);
ContactItem.propTypes = {
    icon: PropTypes.node.isRequired,
    text: PropTypes.string.isRequired,
};

export default Footer;