const API_BASE_URL = "https://asp-net-2.onrender.com/api/Toppings";

export const getAllToppings = async () => {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) throw new Error("Lỗi khi lấy danh sách topping");
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const addTopping = async (topping) => {
    try {
        const response = await fetch(API_BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(topping),
        });
        if (!response.ok) throw new Error("Lỗi khi thêm topping");
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateTopping = async (id, topping) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(topping),
        });
        if (!response.ok) throw new Error("Lỗi khi sửa topping");
        return true; // ASP.NET PUT trả về 204 NoContent
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const deleteTopping = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("Lỗi khi xóa topping");
        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
};