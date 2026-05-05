const API_BASE_URL = "https://asp-net-2.onrender.com/api/promotions";

// Lấy danh sách mã giảm giá cho Admin
export const getAllPromotions = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/promotions`);
        if (!response.ok) throw new Error("Lỗi khi lấy danh sách khuyến mãi");
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

// Tạo mã giảm giá mới
export const createPromotion = async (promotionData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/promotions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(promotionData),
        });
        if (!response.ok) throw new Error("Lỗi khi tạo khuyến mãi");
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};