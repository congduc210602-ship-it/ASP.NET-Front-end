// src/services/ProductService.js

// ĐƯỜNG DẪN MỚI TRỎ VỀ RENDER ASP.NET BACKEND
const API_BASE_URL = "https://asp-net-2.onrender.com/api";

// 1. Hàm lấy danh sách
export const getAllProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/Products`, { method: "GET" });
    if (!response.ok) throw new Error(`Lỗi gọi API: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi:", error);
    return [];
  }
};

export const getProductById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Products/${id}`);
    if (!response.ok) throw new Error("Lỗi khi lấy chi tiết sản phẩm");
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

// 2. Hàm upload ảnh (Gọi qua AdminController.cs)
export const uploadProductImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await fetch(`${API_BASE_URL}/Admin/upload`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw new Error(`Lỗi upload: ${response.status}`);
    const data = await response.json();
    return data.url; // Backend ASP.NET trả về { message, url }
  } catch (error) {
    console.error("Lỗi upload ảnh:", error);
    throw error;
  }
};

// 3. Hàm thêm sản phẩm
export const addProduct = async (productData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error(`Lỗi API: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Lỗi thêm sản phẩm:", error);
    throw error;
  }
};

// Hàm xóa sản phẩm
export const deleteProduct = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Products/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error(`Lỗi gọi API xóa: ${response.status}`);
    return true;
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error);
    throw error;
  }
};

// Hàm cập nhật sản phẩm
export const updateProduct = async (id, productData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error(`Lỗi gọi API sửa: ${response.status}`);
    // Phản hồi của PUT thường là 204 No Content
    return true;
  } catch (error) {
    console.error("Lỗi khi sửa sản phẩm:", error);
    throw error;
  }
};

// Hàm lấy tổng số lượng sản phẩm
export const getTotalProductsCount = async () => {
  try {
    const data = await getAllProducts();
    return data.length;
  } catch (error) {
    console.error("Lỗi khi đếm sản phẩm:", error);
    return 0;
  }
};