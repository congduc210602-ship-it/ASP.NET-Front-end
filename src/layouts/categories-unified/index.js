import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";

// Layout components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";

// API
import { getAllCategories, createCategory, updateCategory, deleteCategory } from "../../services/CategoryService";

function CategoriesUnified() {
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Đã loại bỏ hoàn toàn trường description
    const [formData, setFormData] = useState({ id: null, name: "" });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const data = await getAllCategories();
        setCategories(data);
    };

    // Mở popup Thêm mới
    const handleOpenAdd = () => {
        setFormData({ id: null, name: "" });
        setIsEditing(false);
        setIsModalOpen(true);
    };

    // Mở popup Chỉnh sửa
    const handleOpenEdit = (category) => {
        setFormData({
            id: category.id,
            name: category.name
        });
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Xử lý Lưu (Thêm hoặc Sửa)
    const handleSave = async () => {
        if (!formData.name.trim()) {
            alert("Vui lòng nhập tên danh mục!");
            return;
        }
        setIsSaving(true);
        try {
            // Payload chuẩn chỉ gửi Name lên API
            const payloadToSave = {
                name: formData.name
            };

            if (isEditing) {
                payloadToSave.id = formData.id;
                await updateCategory(formData.id, payloadToSave);
                alert("Cập nhật thành công!");
            } else {
                await createCategory(payloadToSave);
                alert("Thêm danh mục thành công!");
            }
            fetchCategories();
            handleCloseModal();
        } catch (error) {
            console.error("Lỗi:", error);
            alert("Có lỗi xảy ra, vui lòng thử lại! Mở F12 để xem chi tiết.");
        } finally {
            setIsSaving(false);
        }
    };

    // Xử lý Xóa
    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
            try {
                await deleteCategory(id);
                alert("Xóa thành công!");
                fetchCategories();
            } catch (error) {
                alert("Lỗi khi xóa! Có thể danh mục này đang chứa sản phẩm.");
            }
        }
    };

    // Bỏ cột Mô Tả ra khỏi bảng và điều chỉnh lại độ rộng cột
    const columns = [
        { Header: "ID", accessor: "id", width: "15%", align: "center" },
        { Header: "Tên Danh Mục", accessor: "name", width: "45%", align: "left" },
        { Header: "Hành Động", accessor: "action", width: "40%", align: "center" },
    ];

    // Đổ dữ liệu vào hàng (Đã bỏ desc)
    const rows = categories.map((cat) => ({
        id: <MDTypography variant="caption" fontWeight="bold">{cat.id}</MDTypography>,
        name: <MDTypography variant="subtitle2" fontWeight="medium">{cat.name}</MDTypography>,
        action: (
            <MDBox display="flex" justifyContent="center" alignItems="center">
                <MDButton variant="text" color="info" onClick={() => handleOpenEdit(cat)}>
                    <Icon>edit</Icon>&nbsp;Sửa
                </MDButton>
                <MDButton variant="text" color="error" onClick={() => handleDelete(cat.id)}>
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
                                <MDTypography variant="h6" color="white">Quản Lý Danh Mục</MDTypography>
                                <MDButton variant="gradient" color="dark" onClick={handleOpenAdd}>
                                    <Icon sx={{ fontWeight: "bold" }}>add</Icon>&nbsp;THÊM DANH MỤC
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
            <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="sm">
                <DialogTitle>{isEditing ? "Chỉnh Sửa Danh Mục" : "Thêm Danh Mục Mới"}</DialogTitle>
                <DialogContent dividers>
                    <MDBox component="form" role="form">
                        <MDBox mb={2}>
                            <MDInput type="text" label="Tên danh mục *" name="name" value={formData.name} onChange={handleInputChange} fullWidth />
                        </MDBox>
                        {/* Đã xóa field nhập mô tả */}
                    </MDBox>
                </DialogContent>
                <DialogActions>
                    <MDButton onClick={handleCloseModal} color="secondary">Hủy</MDButton>
                    <MDButton onClick={handleSave} variant="gradient" color="info" disabled={isSaving}>
                        {isSaving ? "Đang lưu..." : "Lưu Thay Đổi"}
                    </MDButton>
                </DialogActions>
            </Dialog>
        </DashboardLayout>
    );
}

export default CategoriesUnified;   