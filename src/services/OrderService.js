const API_BASE_URL = "https://asp-net-2.onrender.com/api";

export const getAllOrders = async () => {
    try {
        // Sử dụng AdminController của ASP.NET để lấy kèm thông tin Customer và Store
        const response = await fetch(`${API_BASE_URL}/Admin/orders`);
        if (!response.ok) throw new Error("Lỗi khi lấy danh sách đơn hàng");
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const getOrderById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Orders/${id}`);
        if (!response.ok) throw new Error("Lỗi khi lấy chi tiết đơn hàng");
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateOrderStatus = async (id, status) => {
    try {
        // Backend ASP.NET dùng phương thức PUT và Body JSON cho chức năng này
        const response = await fetch(`${API_BASE_URL}/Admin/orders/${id}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: status }),
        });
        if (!response.ok) throw new Error("Lỗi khi cập nhật trạng thái");
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// ==========================================
// CÁC HÀM DÀNH CHO CUSTOMER (KHÁCH ĐẶT HÀNG)
// ==========================================

// 1. Hàm tạo đơn hàng mới
export const createOrder = async (orderData) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    const response = await fetch("https://asp-net-2.onrender.com/api/customer/orders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(orderData),
    });

    if (!response.ok) {
        // Xử lý thông minh: Đọc lỗi dạng Text để không bị crash JSON
        const errorText = await response.text();
        let errorMessage = errorText;
        try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.message || JSON.stringify(errorJson);
        } catch (e) {
            // Nếu lỗi là chữ thuần túy (VD: "Lỗi: Món ăn...") thì giữ nguyên
        }
        throw new Error(errorMessage);
    }

    return await response.json();
};

// 2. Hàm tạo thanh toán VNPay
export const createVNPayPayment = async (amount, orderInfo) => {
    try {
        // LƯU Ý: Hiện tại Backend ASP.NET của bạn có vẻ chưa có API tích hợp VNPay.
        // Tạm thời mình sẽ viết giả lập (mock) trả về link trang chủ hoặc trang thành công
        // để giao diện React biên dịch qua được lỗi này và bạn có thể test luồng đặt hàng (COD) trước.

        console.warn("API VNPay trên ASP.NET chưa hoàn thiện, đang dùng luồng giả lập...");

        // Giả lập trả về đường dẫn thành công
        return { paymentUrl: "/thanh-cong" };

        /* // Khi nào bạn viết xong API VNPay bên ASP.NET, hãy bỏ comment đoạn code dưới này:
        const response = await fetch(`${API_BASE_URL}/Payment/vnpay`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount, orderInfo })
        });
        if (!response.ok) throw new Error("Lỗi khi kết nối VNPay");
        return await response.json(); // ASP.NET sẽ trả về { paymentUrl: "https://sandbox.vnpayment.vn/..." }
        */
    } catch (error) {
        console.error("Lỗi gọi VNPay:", error);
        throw error;
    }
};