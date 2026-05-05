import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Chip from "@mui/material/Chip";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import * as XLSX from "xlsx";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Layout components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";

// API
import { getAllOrders, updateOrderStatus } from "../../services/OrderService";

function OrdersUnified() {
    const [orders, setOrders] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [newStatus, setNewStatus] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await getAllOrders();
            // Sắp xếp đơn mới nhất lên đầu
            data.sort((a, b) => b.id - a.id);
            setOrders(data);
        } catch (error) {
            console.error("Lỗi lấy đơn hàng:", error);
        }
    };

    const handleExportExcel = () => {
        // 1. Chuẩn bị dữ liệu: Lọc những thông tin cần thiết từ danh sách đơn hàng
        const excelData = orders.map((order) => ({
            "Mã Hệ Thống": order.id,
            "Mã Hóa Đơn": order.invoiceCode || "N/A",
            "Tên Khách Hàng": order.customer?.name || "Khách vãng lai",
            "Ngày Đặt": formatDate(order.createdAt),
            "Tổng Tiền (VNĐ)": order.totalAmount,
            "Trạng Thái": order.status?.toUpperCase() || "N/A"
        }));

        // 2. Tạo sheet và xuất file
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "DanhSachDonHang");

        // Tên file tải về (có gắn thêm thời gian để không bị trùng)
        XLSX.writeFile(workbook, `BaoCao_DonHang_${new Date().getTime()}.xlsx`);
    };

    const handleOpenModal = (order) => {
        setCurrentOrder(order);
        setNewStatus(order.status);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleStatusChange = async () => {
        setIsUpdating(true);
        try {
            await updateOrderStatus(currentOrder.id, newStatus);
            alert("Cập nhật trạng thái thành công!");
            fetchOrders();
            handleCloseModal();
        } catch (error) {
            alert("Lỗi khi cập nhật trạng thái! (Vui lòng kiểm tra Console F12)");
        } finally {
            setIsUpdating(false);
        }
    };

    // ĐỒNG BỘ: Chuyển đổi màu Chip theo đúng file C# (pending, preparing, delivering, completed, cancelled)
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "pending": return "warning";
            case "preparing": return "info";
            case "delivering": return "primary";
            case "completed": return "success";
            case "cancelled": return "error";
            default: return "secondary";
        }
    };

    // Hàm phụ trợ format ngày tháng đẹp hơn
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    // Cấu hình bảng
    const columns = [
        { Header: "Mã Đơn", accessor: "id", width: "10%", align: "center" },
        { Header: "Mã Hóa Đơn", accessor: "invoice", align: "center" },
        { Header: "Khách Hàng", accessor: "customer", align: "left" },
        { Header: "Ngày Đặt", accessor: "date", align: "center" },
        { Header: "Tổng Tiền", accessor: "total", align: "right" },
        { Header: "Trạng Thái", accessor: "status", align: "center" },
        { Header: "Hành Động", accessor: "action", align: "center" },
    ];

    const rows = orders.map((order) => ({
        id: <MDTypography variant="caption" fontWeight="bold">#{order.id}</MDTypography>,
        // ĐỒNG BỘ InvoiceCode
        invoice: <MDTypography variant="caption" fontWeight="medium">{order.invoiceCode || "N/A"}</MDTypography>,
        // ĐỒNG BỘ Customer (Backend trả customer.name)
        customer: <MDTypography variant="caption" fontWeight="medium">{order.customer?.name || "Khách vãng lai"}</MDTypography>,
        // ĐỒNG BỘ CreatedAt
        date: <MDTypography variant="caption">{formatDate(order.createdAt)}</MDTypography>,
        // ĐỒNG BỘ TotalAmount
        total: <MDTypography variant="button" fontWeight="medium">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount || 0)}</MDTypography>,
        status: (
            <MDBox ml={-1}>
                <Chip label={order.status?.toUpperCase() || "N/A"} color={getStatusColor(order.status)} size="small" />
            </MDBox>
        ),
        action: (
            <MDButton variant="text" color="info" onClick={() => handleOpenModal(order)}>
                <Icon>visibility</Icon>&nbsp;Chi Tiết
            </MDButton>
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
                                <MDTypography variant="h6" color="white">Quản Lý Đơn Hàng</MDTypography>
                                <MDButton variant="outlined" color="white" onClick={handleExportExcel}>
                                    <Icon sx={{ mr: 1 }}>download</Icon> Xuất Excel
                                </MDButton>
                            </MDBox>
                            <MDBox pt={3}>
                                <DataTable table={{ columns, rows }} isSorted={true} entriesPerPage={true} showTotalEntries={true} noEndBorder />
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>

            {/* POPUP CHI TIẾT ĐƠN HÀNG */}
            <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
                <DialogTitle>Chi Tiết Đơn Hàng #{currentOrder?.id}</DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        {/* Cột trái: Thông tin khách & trạng thái */}
                        <Grid item xs={12} md={5}>
                            <MDTypography variant="h6" fontWeight="medium">Thông tin giao hàng</MDTypography>
                            <MDTypography variant="caption" display="block">Khách hàng: <b>{currentOrder?.customer?.name || "Khách vãng lai"}</b></MDTypography>
                            <MDTypography variant="caption" display="block">Ngày đặt: {formatDate(currentOrder?.createdAt)}</MDTypography>
                            <MDTypography variant="caption" display="block">Loại đơn: {currentOrder?.orderType === "delivery" ? "Giao hàng" : "Đến lấy"}</MDTypography>
                            {currentOrder?.orderType === "delivery" && (
                                <MDTypography variant="caption" display="block">Địa chỉ: {currentOrder?.deliveryAddress || "N/A"}</MDTypography>
                            )}

                            <Divider sx={{ my: 2 }} />

                            <MDTypography variant="h6" fontWeight="medium" mb={1}>Cập nhật trạng thái</MDTypography>
                            {/* ĐỒNG BỘ: Danh sách các Option khớp với file Order.cs */}
                            <Select
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                fullWidth
                                sx={{ height: 45 }}
                            >
                                <MenuItem value="pending">Chờ xác nhận (Pending)</MenuItem>
                                <MenuItem value="preparing">Đang chuẩn bị (Preparing)</MenuItem>
                                <MenuItem value="delivering">Đang giao hàng (Delivering)</MenuItem>
                                <MenuItem value="completed">Hoàn thành (Completed)</MenuItem>
                                <MenuItem value="cancelled">Đã hủy (Cancelled)</MenuItem>
                            </Select>
                        </Grid>

                        {/* Cột phải: Danh sách sản phẩm */}
                        <Grid item xs={12} md={7}>
                            <MDTypography variant="h6" fontWeight="medium" mb={1}>Sản phẩm đã đặt</MDTypography>
                            <Card sx={{ p: 2, bgcolor: "#f8f9fa", maxHeight: "300px", overflowY: "auto" }}>
                                {/* ĐỒNG BỘ: Duyệt mảng orderDetails thay vì items */}
                                {currentOrder?.orderDetails?.length > 0 ? (
                                    currentOrder.orderDetails.map((item, index) => (
                                        <MDBox key={index} display="flex" justifyContent="space-between" mb={2}>
                                            <MDTypography variant="caption" sx={{ width: "70%" }}>
                                                <b>{item.quantity}x</b> {item.productVariant?.product?.name || `Sản phẩm ID: ${item.productVariantId}`}
                                                {item.toppings && <span style={{ display: 'block', fontSize: '0.75rem', color: '#666' }}>+ {item.toppings}</span>}
                                                {item.note && <span style={{ display: 'block', fontSize: '0.75rem', color: '#d32f2f' }}>Ghi chú: {item.note}</span>}
                                            </MDTypography>

                                            {/* ĐỒNG BỘ: Tính subtotal = quantity * priceAtTime */}
                                            <MDTypography variant="caption" fontWeight="bold">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.quantity * (item.priceAtTime || 0))}
                                            </MDTypography>
                                        </MDBox>
                                    ))
                                ) : (
                                    <MDTypography variant="caption" color="text">Không có chi tiết món hoặc API chưa Include bảng OrderDetails.</MDTypography>
                                )}
                                <Divider />
                                <MDBox display="flex" justifyContent="space-between">
                                    <MDTypography variant="button" color="text">Giảm giá:</MDTypography>
                                    <MDTypography variant="button" color="text">
                                        - {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentOrder?.discountAmount || 0)}
                                    </MDTypography>
                                </MDBox>
                                <MDBox display="flex" justifyContent="space-between" mt={1}>
                                    <MDTypography variant="button" fontWeight="bold">TỔNG THU:</MDTypography>
                                    <MDTypography variant="button" color="error" fontWeight="bold">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentOrder?.totalAmount || 0)}
                                    </MDTypography>
                                </MDBox>
                            </Card>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <MDButton onClick={handleCloseModal} color="secondary">Đóng</MDButton>
                    <MDButton variant="gradient" color="info" onClick={handleStatusChange} disabled={isUpdating}>
                        {isUpdating ? "Đang lưu..." : "Lưu Trạng Thái"}
                    </MDButton>
                </DialogActions>
            </Dialog>
        </DashboardLayout>
    );
}

export default OrdersUnified;