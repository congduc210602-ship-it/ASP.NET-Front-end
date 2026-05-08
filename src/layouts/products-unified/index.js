import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Divider from "@mui/material/Divider";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";

import {
  getAllProducts,
  addProduct,
  uploadProductImage,
  deleteProduct,
  updateProduct,
} from "../../services/ProductService";

import { getAllCategories } from "../../services/CategoryService";

function ProductsUnified() {
  const [products, setProducts] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [formData, setFormData] = useState({
    productName: "", price: 0, description: "", categoryId: "", availability: 0, imageUrl: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategoriesList(data);
    } catch (error) {
      console.error("Lỗi lấy danh mục:", error);
    }
  };

  const handleOpenViewModal = (item) => {
    setViewProduct(item);
    setIsViewModalOpen(true);
  };
  const handleCloseViewModal = () => setIsViewModalOpen(false);

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setCurrentProductId(null);
    setFormData({ productName: "", price: 0, description: "", categoryId: "", availability: 0, imageUrl: "" });
    setSelectedFile(null);
    setPreviewUrl("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setIsEditing(true);
    setCurrentProductId(item.id);
    setFormData({
      productName: item.name, // Đồng bộ: backend trả 'name'
      price: item.price || 0,
      description: item.description || "",
      categoryId: item.category?.id || item.categoryId || "",
      availability: item.availability || 0,
      imageUrl: item.avatar || "", // Đồng bộ: backend trả 'avatar'
    });
    setSelectedFile(null);
    // --- PHẦN SỬA LỖI ẢNH PREVIEW KHI MỞ MODAL SỬA ---
    const BACKEND_URL = "https://asp-net-2.onrender.com";
    let fullPreviewUrl = "";
    if (item.avatar) {
      fullPreviewUrl = item.avatar.startsWith("http")
        ? item.avatar
        : `${BACKEND_URL}${item.avatar}`;
    }
    setPreviewUrl(fullPreviewUrl);
    // ------------------------------------------------

    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.categoryId) {
      alert("Vui lòng chọn danh mục cho sản phẩm!");
      return;
    }

    setIsSubmitting(true);
    try {
      let finalImageUrl = formData.imageUrl;
      if (selectedFile) {
        finalImageUrl = await uploadProductImage(selectedFile);
      }

      // Đồng bộ chuẩn payload gửi lên Backend
      const productDataToSave = {
        name: formData.productName,
        categoryId: parseInt(formData.categoryId),
        description: formData.description,
        avatar: finalImageUrl,
        price: parseFloat(formData.price),       // Đã thêm gửi Giá
        availability: parseInt(formData.availability), // Đã thêm gửi Tồn kho
        isActive: true
      };

      if (isEditing) {
        productDataToSave.id = currentProductId;
        await updateProduct(currentProductId, productDataToSave);
        alert("Cập nhật sản phẩm thành công!");
      } else {
        await addProduct(productDataToSave);
        alert("Thêm sản phẩm thành công!");
      }
      handleCloseModal();
      fetchProducts();
    } catch (error) {
      alert("Thao tác thất bại. Vui lòng kiểm tra lại F12!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      try {
        await deleteProduct(id);
        alert("Đã xóa sản phẩm thành công!");
        fetchProducts();
      } catch (error) {
        alert("Có lỗi xảy ra khi xóa sản phẩm.");
      }
    }
  };

  const columns = [
    { Header: "Hình ảnh", accessor: "image", width: "10%", align: "center" },
    { Header: "Tên sản phẩm", accessor: "name", width: "25%", align: "left" },
    { Header: "Danh mục", accessor: "category", align: "left" },
    { Header: "Giá", accessor: "price", align: "center" },
    { Header: "Tồn kho", accessor: "availability", align: "center" },
    { Header: "Hành động", accessor: "action", align: "center" },
  ];

  // ĐỒNG BỘ: Sử dụng item.name, item.avatar thay vì productName, imageUrl
  const BACKEND_URL = "https://asp-net-2.onrender.com";

  const rows = products.map((item) => ({
    image: (
      <MDAvatar
        // ĐỒNG BỘ ẢNH: Nếu link ảnh bắt đầu bằng http (link ngoài) thì giữ nguyên
        // Nếu bắt đầu bằng / (link cục bộ), phải ghép với BACKEND_URL
        src={
          item.avatar
            ? (item.avatar.startsWith("http") ? item.avatar : `${BACKEND_URL}${item.avatar}`)
            : "https://placehold.co/150"
        }
        alt={item.name}
        size="sm"
        variant="rounded"
      />
    ),
    name: <MDTypography display="block" variant="button" fontWeight="medium">{item.name}</MDTypography>,
    category: <MDTypography variant="caption" color="text" fontWeight="medium">
      {/* Đảm bảo fallback cuối cùng là một chuỗi chữ, không phải biến item.category */}
      {item.category?.name || "Chưa phân loại"}
    </MDTypography>,
    price: <MDTypography variant="caption" color="text" fontWeight="medium">${item.price || 0}</MDTypography>,
    availability: <MDTypography variant="caption" color="text" fontWeight="medium">{item.availability || 0}</MDTypography>,
    action: (
      <MDBox display="flex" alignItems="center">
        <MDButton variant="text" color="success" onClick={() => handleOpenViewModal(item)}>
          <Icon>visibility</Icon>&nbsp;Xem
        </MDButton>
        <MDButton variant="text" color="info" onClick={() => handleOpenEditModal(item)}>
          <Icon>edit</Icon>&nbsp;Sửa
        </MDButton>
        <MDButton variant="text" color="error" onClick={() => handleDelete(item.id)}>
          <Icon>delete</Icon>&nbsp;Xóa
        </MDButton>
      </MDBox>
    ),
  }));

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox mx={2} mt={-3} py={3} px={2} variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info" display="flex" justifyContent="space-between" alignItems="center">
                <MDTypography variant="h6" color="white">Quản Lý Sản Phẩm</MDTypography>
                <MDButton variant="gradient" color="success" onClick={handleOpenAddModal}>
                  <Icon fontSize="small">add</Icon>&nbsp;Thêm sản phẩm mới
                </MDButton>
              </MDBox>
              <MDBox pt={3}>
                <DataTable table={{ columns, rows }} isSorted={true} entriesPerPage={true} showTotalEntries={true} noEndBorder />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* POPUP THÊM / SỬA */}
      <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? "Cập Nhật Sản Phẩm" : "Tạo Sản Phẩm Mới"}</DialogTitle>
        <MDBox component="form" role="form" onSubmit={handleSubmit}>
          <DialogContent>
            <MDBox mb={2}>
              <MDTypography variant="button" fontWeight="medium" color="text">Hình ảnh sản phẩm</MDTypography>
              <MDBox mt={1} display="flex" alignItems="center">
                <MDButton variant="outlined" color="info" component="label">
                  {isEditing ? "Đổi Ảnh Mới" : "Chọn Ảnh"}
                  <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                </MDButton>
              </MDBox>
              {previewUrl && (
                <MDBox mt={2}>
                  <img src={previewUrl} alt="Preview" style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px", border: "1px solid #ddd" }} />
                </MDBox>
              )}
            </MDBox>
            <MDBox mb={2}><MDInput type="text" label="Tên sản phẩm" name="productName" value={formData.productName} onChange={handleChange} fullWidth required /></MDBox>
            <MDBox mb={2}><MDInput type="number" label="Giá (Price)" name="price" value={formData.price} onChange={handleChange} fullWidth required /></MDBox>
            <MDBox mb={2}><MDInput type="text" label="Mô tả (description)" name="description" value={formData.description} onChange={handleChange} fullWidth /></MDBox>

            <MDBox mb={2}>
              <MDTypography variant="caption" color="text" fontWeight="regular">Danh mục (Category) *</MDTypography>
              <Select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                fullWidth
                displayEmpty
                sx={{ height: 45 }}
                required
              >
                <MenuItem value="" disabled>-- Chọn Danh Mục --</MenuItem>
                {categoriesList.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </MDBox>

            <MDBox mb={2}><MDInput type="number" label="Tồn kho (Availability)" name="availability" value={formData.availability} onChange={handleChange} fullWidth required /></MDBox>
          </DialogContent>
          <DialogActions>
            <MDButton onClick={handleCloseModal} color="secondary">Hủy</MDButton>
            <MDButton variant="gradient" color="info" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang xử lý..." : isEditing ? "Cập Nhật" : "Lưu Sản Phẩm"}
            </MDButton>
          </DialogActions>
        </MDBox>
      </Dialog>

      {/* POPUP XEM CHI TIẾT */}
      <Dialog open={isViewModalOpen} onClose={handleCloseViewModal} maxWidth="sm" fullWidth>
        <DialogTitle>Chi Tiết Sản Phẩm</DialogTitle>
        <DialogContent dividers>
          {viewProduct && (
            <MDBox>
              <MDBox display="flex" justifyContent="center" mb={3}>
                <img
                  src={
                    viewProduct.avatar
                      ? (viewProduct.avatar.startsWith("http") ? viewProduct.avatar : `${BACKEND_URL}${viewProduct.avatar}`)
                      : "https://placehold.co/150"
                  }
                  alt={viewProduct.name}
                  style={{ width: "200px", height: "200px", objectFit: "cover", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
                />
              </MDBox>

              <MDTypography variant="h5" fontWeight="medium" textAlign="center" mb={3} color="info">
                {viewProduct.name}
              </MDTypography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <MDTypography variant="button" color="text" fontWeight="bold">Danh mục:</MDTypography>
                  <MDTypography variant="button" color="text" ml={1}>
                    {viewProduct.category?.name || viewProduct.category?.categoryName || "Trống"}
                  </MDTypography>
                </Grid>
                <Grid item xs={6}>
                  <MDTypography variant="button" color="text" fontWeight="bold">Giá bán:</MDTypography>
                  <MDTypography variant="button" color="text" ml={1}>${viewProduct.price || 0}</MDTypography>
                </Grid>
                <Grid item xs={6}>
                  <MDTypography variant="button" color="text" fontWeight="bold">Tồn kho:</MDTypography>
                  <MDTypography variant="button" color="text" ml={1}>{viewProduct.availability || 0}</MDTypography>
                </Grid>
                <Grid item xs={6}>
                  <MDTypography variant="button" color="text" fontWeight="bold">Mã ID:</MDTypography>
                  <MDTypography variant="button" color="text" ml={1}>#{viewProduct.id}</MDTypography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <MDBox>
                <MDTypography variant="button" color="text" fontWeight="bold">Mô tả chi tiết:</MDTypography>
                <MDBox p={2} mt={1} bgColor="grey-100" borderRadius="md">
                  <MDTypography variant="button" color="text" fontWeight="regular">
                    {viewProduct.description || "Sản phẩm này hiện chưa có mô tả chi tiết."}
                  </MDTypography>
                </MDBox>
              </MDBox>
            </MDBox>
          )}
        </DialogContent>
        <DialogActions>
          <MDButton onClick={handleCloseViewModal} variant="outlined" color="dark">Đóng</MDButton>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default ProductsUnified;