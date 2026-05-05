const API_BASE_URL = "https://asp-net-2.onrender.com/api/Users";

export const getAllUsers = async () => {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) throw new Error("Lỗi khi lấy danh sách người dùng");
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const addUser = async (userData) => {
    try {
        const response = await fetch(API_BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });
        if (!response.ok) throw new Error("Lỗi khi thêm người dùng");
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateUser = async (id, userData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });
        if (!response.ok) throw new Error("Lỗi khi cập nhật người dùng");
        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const toggleUserStatus = async (id, activeStatus) => {
    try {
        // ASP.NET không có API Patch riêng, nên phải GET user về, đổi trạng thái rồi PUT lên lại
        const getRes = await fetch(`${API_BASE_URL}/${id}`);
        const user = await getRes.json();
        
        user.isActive = activeStatus;
        
        const putRes = await fetch(`${API_BASE_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        });
        
        if (!putRes.ok) throw new Error("Lỗi khi thay đổi trạng thái");
        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
};