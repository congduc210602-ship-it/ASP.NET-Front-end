const API_BASE_URL = "https://asp-net-2.onrender.com/api/review";

// Lấy tất cả đánh giá cho Admin
export const getAllReviews = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/recommendations`);
        if (!response.ok) throw new Error("Lỗi khi lấy danh sách đánh giá");
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

// --- CÁC HÀM MỚI CHO NGƯỜI DÙNG ---

// 1. Lấy đánh giá của một sản phẩm cụ thể
export const getReviewsByProductName = async (name) => {
    try {
        const response = await fetch(`${API_BASE_URL}/recommendations?name=${encodeURIComponent(name)}`);
        if (response.status === 404) return []; // Không có đánh giá thì trả về mảng rỗng
        if (!response.ok) throw new Error("Lỗi khi lấy đánh giá sản phẩm");
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

// 2. Gửi đánh giá mới
export const saveReview = async (userId, productId, rating, comment) => {
    if (!userId) {
        console.error("Lỗi: userId bị undefined!");
        throw new Error("Bạn cần đăng nhập lại để thực hiện chức năng này.");
    }
    const response = await fetch(
        `${API_BASE_URL}/${userId}/recommendations/${productId}?rating=${rating}&comment=${encodeURIComponent(comment)}`,
        { method: "POST" }
    );
    if (!response.ok) throw new Error("Không thể gửi đánh giá");
    return await response.json();
};

// 2. Thêm hàm lấy trung bình sao (Dùng cho ProductCard)
export const getAverageRating = async (productName) => {
    try {
        const response = await fetch(`${API_BASE_URL}/recommendations?name=${encodeURIComponent(productName)}`);
        if (!response.ok) return 0;
        const reviews = await response.json();
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, rev) => acc + rev.rating, 0);
        return (sum / reviews.length).toFixed(1);
    } catch (error) {
        return 0;
    }
};

// Xóa đánh giá (Admin)
export const deleteReview = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/recommendations/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Lỗi khi xóa đánh giá");
    } catch (error) {
        console.error(error);
        throw error;
    }
};

