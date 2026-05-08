import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";

import {
    getAllToppings,
    addTopping,
    updateTopping,
    deleteTopping,
} from "../../services/ToppingService";

function ToppingsUnified() {
    const [toppings, setToppings] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({ name: "", price: 0 });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchToppings();
    }, []);

    const fetchToppings = async () => {
        try {
            const data = await getAllToppings();
            setToppings(data);
        } catch (error) {
            console.error("Lỗi lấy danh sách topping:", error);
        }
    };

    const handleOpenAddModal = () => {
        setIsEditing(false);
        setCurrentId(null);
        setFormData({ name: "", price: 0 });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (item) => {
        setIsEditing(true);
        setCurrentId(item.id);
        setFormData({ name: item.name, price: item.price });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = {
                name: formData.name,
                price: parseFloat(formData.price),
            };

            if (isEditing) {
                payload.id = currentId;
                await updateTopping(currentId, payload);
                alert("Cập nhật Topping thành công!");
            } else {
                await addTopping(payload);
                alert("Thêm Topping thành công!");
            }
            handleCloseModal();
            fetchToppings();
        } catch (error) {
            alert("Có lỗi xảy ra, vui lòng thử lại!");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa Topping này?")) {
            try {
                await deleteTopping(id);
                alert("Đã xóa Topping!");
                fetchToppings();
            } catch (error) {
                alert("Lỗi khi xóa Topping.");
            }
        }
    };

    const columns = [
        { Header: "ID", accessor: "id", width: "10%", align: "center" },
        { Header: "Tên Topping", accessor: "name", width: "40%", align: "left" },
        { Header: "Giá (VNĐ)", accessor: "price", align: "center" },
        { Header: "Hành động", accessor: "action", align: "center" },
    ];

    const rows = toppings.map((item) => ({
        id: <MDTypography variant="caption" color="text" fontWeight="medium">#{item.id}</MDTypography>,
        name: <MDTypography variant="button" fontWeight="medium">{item.name}</MDTypography>,
        price: <MDTypography variant="caption" color="text" fontWeight="medium">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
        </MDTypography>,
        action: (
            <MDBox display="flex" alignItems="center">
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
                            <MDBox mx={2} mt={-3} py={3} px={2} variant="gradient" bgColor="warning" borderRadius="lg" coloredShadow="warning" display="flex" justifyContent="space-between" alignItems="center">
                                <MDTypography variant="h6" color="white">Quản Lý Topping (Món Thêm)</MDTypography>
                                <MDButton variant="gradient" color="dark" onClick={handleOpenAddModal}>
                                    <Icon fontSize="small">add</Icon>&nbsp;Thêm Topping
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
                <DialogTitle>{isEditing ? "Cập Nhật Topping" : "Thêm Topping Mới"}</DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent dividers>
                        <MDBox mb={2}>
                            <MDInput type="text" label="Tên Topping (VD: Trân châu trắng)" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} fullWidth required />
                        </MDBox>
                        <MDBox mb={2}>
                            <MDInput type="number" label="Giá Tiền (VNĐ)" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} fullWidth required />
                        </MDBox>
                    </DialogContent>
                    <DialogActions>
                        <MDButton onClick={handleCloseModal} color="secondary">Hủy</MDButton>
                        <MDButton type="submit" variant="gradient" color="info" disabled={isSubmitting}>
                            {isSubmitting ? "Đang xử lý..." : "Lưu"}
                        </MDButton>
                    </DialogActions>
                </form>
            </Dialog>
        </DashboardLayout>
    );
}

export default ToppingsUnified;