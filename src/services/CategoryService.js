const API_BASE_URL = "https://asp-net-2.onrender.com/api/Categories";

export const getAllCategories = async () => {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) throw new Error("Lỗi khi lấy danh sách danh mục");
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const createCategory = async (category) => {
    try {
        const response = await fetch(API_BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(category),
        });
        if (!response.ok) throw new Error("Lỗi khi tạo danh mục");
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateCategory = async (id, category) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(category),
        });
        if (!response.ok) throw new Error("Lỗi khi cập nhật danh mục");
        return true; // ASP.NET PUT trả về 204 NoContent
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const deleteCategory = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("Lỗi khi xóa danh mục");
        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
};