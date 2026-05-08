const API_BASE_URL = "https://asp-net-2.onrender.com/api/Admin";

export const getCustomersStats = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/customers/stats`);
        if (!response.ok) throw new Error("Lỗi khi lấy thống kê khách hàng");
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};