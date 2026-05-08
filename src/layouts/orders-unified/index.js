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
    const [filterStatus, setFilterStatus] = useState("all"); // State bộ lọc
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
            data.sort((a, b) => b.id - a.id);
            setOrders(data);
        } catch (error) {
            console.error("Lỗi lấy đơn hàng:", error);
        }
    };

    // Logic lọc đơn hàng
    const filteredOrders = filterStatus === "all"
        ? orders
        : orders.filter(o => o.status?.toLowerCase() === filterStatus.toLowerCase());

    const handleExportExcel = () => {
        const excelData = filteredOrders.map((order) => ({
            "Mã Hệ Thống": order.id,
            "Mã Hóa Đơn": order.invoiceCode || "N/A",
            "Tên Khách Hàng": order.customer?.name || "Khách vãng lai",
            "Ngày Đặt": formatDate(order.createdAt),
            "Tổng Tiền (VNĐ)": order.totalAmount,
            "Trạng Thái": order.status?.toUpperCase() || "N/A"
        }));

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "DanhSachDonHang");
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
            alert("Lỗi khi cập nhật trạng thái!");
        } finally {
            setIsUpdating(false);
        }
    };

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

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const columns = [
        { Header: "Mã Đơn", accessor: "id", width: "10%", align: "center" },
        { Header: "Mã Hóa Đơn", accessor: "invoice", align: "center" },
        { Header: "Khách Hàng", accessor: "customer", align: "left" },
        { Header: "Ngày Đặt", accessor: "date", align: "center" },
        { Header: "Tổng Tiền", accessor: "total", align: "right" },
        { Header: "Trạng Thái", accessor: "status", align: "center" },
        { Header: "Hành Động", accessor: "action", align: "center" },
    ];

    const rows = filteredOrders.map((order) => ({
        id: <MDTypography variant="caption" fontWeight="bold">#{order.id}</MDTypography>,
        invoice: <MDTypography variant="caption" fontWeight="medium">{order.invoiceCode || "N/A"}</MDTypography>,
        customer: <MDTypography variant="caption" fontWeight="medium">{order.customer?.name || "Khách vãng lai"}</MDTypography>,
        date: <MDTypography variant="caption">{formatDate(order.createdAt)}</MDTypography>,
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
                                <MDBox>
                                    <MDTypography variant="h6" color="white">Quản Lý Đơn Hàng</MDTypography>
                                    <MDTypography variant="caption" color="white">Đang hiển thị: {filterStatus.toUpperCase()}</MDTypography>
                                </MDBox>
                                <MDButton variant="outlined" color="white" onClick={handleExportExcel}>
                                    <Icon sx={{ mr: 1 }}>download</Icon> Xuất Excel
                                </MDButton>
                            </MDBox>

                            {/* BỘ LỌC NHANH TRẠNG THÁI */}
                            <MDBox px={3} pt={3} display="flex" gap={1} flexWrap="wrap">
                                {[
                                    { label: "Tất cả", value: "all", color: "dark" },
                                    { label: "Chờ xác nhận", value: "pending", color: "warning" },
                                    { label: "Đang làm", value: "preparing", color: "info" },
                                    { label: "Đã xong", value: "completed", color: "success" },
                                    { label: "Đã hủy", value: "error", value: "cancelled", color: "error" }
                                ].map((btn) => (
                                    <MDButton
                                        key={btn.value}
                                        variant={filterStatus === btn.value ? "gradient" : "outlined"}
                                        color={btn.color}
                                        size="small"
                                        onClick={() => setFilterStatus(btn.value)}
                                    >
                                        {btn.label}
                                    </MDButton>
                                ))}
                            </MDBox>

                            <MDBox pt={3}>
                                <DataTable table={{ columns, rows }} isSorted={true} entriesPerPage={true} showTotalEntries={true} noEndBorder />
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>

            <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
                <DialogTitle>Chi Tiết Đơn Hàng #{currentOrder?.id}</DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2}>
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

                        <Grid item xs={12} md={7}>
                            <MDTypography variant="h6" fontWeight="medium" mb={1}>Sản phẩm đã đặt</MDTypography>
                            <Card sx={{ p: 2, bgcolor: "#f8f9fa", maxHeight: "300px", overflowY: "auto" }}>
                                {currentOrder?.orderDetails?.length > 0 ? (
                                    currentOrder.orderDetails.map((item, index) => {
                                        // BƯỚC 1: Xử lý chuỗi JSON Topping từ Backend gửi xuống (VD: '["Thạch Cà Phê"]')
                                        let parsedToppings = [];
                                        let toppingsPrice = 0;
                                        if (item.toppings) {
                                            try {
                                                // Cố gắng chuyển chuỗi JSON thành Mảng
                                                parsedToppings = JSON.parse(item.toppings);
                                                // MẸO: Tạm thời mặc định mỗi Topping giá 10.000đ (hoặc bạn có thể tạo API lấy giá thực tế sau)
                                                // Để báo cáo chạy mượt, ta cứ nhân số lượng Topping với 10k
                                                toppingsPrice = parsedToppings.length * 10000;
                                            } catch (e) {
                                                // Nếu nó không phải JSON mà là chuỗi thường (do lỗi data cũ)
                                                parsedToppings = [item.toppings];
                                            }
                                        }

                                        // BƯỚC 2: Tính lại Giá 1 Ly = Giá Gốc (PriceAtTime) + Giá các Topping
                                        const finalItemPrice = (item.priceAtTime || 0) + toppingsPrice;

                                        // BƯỚC 3: Tính Tổng Tiền của dòng này = Giá 1 Ly * Số lượng
                                        const lineTotal = finalItemPrice * item.quantity;

                                        return (
                                            <MDBox key={index} display="flex" justifyContent="space-between" mb={2}>
                                                <MDBox sx={{ width: "70%" }}>
                                                    <MDTypography variant="caption" display="block">
                                                        <b>{item.quantity}x</b> {item.productVariant?.product?.name || `Mã SP: ${item.productVariantId}`}
                                                    </MDTypography>

                                                    {/* HIỂN THỊ DANH SÁCH TOPPING */}
                                                    {parsedToppings.length > 0 && (
                                                        <MDTypography variant="caption" color="text" sx={{ fontStyle: 'italic', fontSize: '0.7rem' }}>
                                                            + {parsedToppings.join(', ')}
                                                        </MDTypography>
                                                    )}

                                                    {item.note && (
                                                        <MDTypography variant="caption" color="error" display="block" sx={{ fontSize: '0.7rem' }}>
                                                            Ghi chú: {item.note}
                                                        </MDTypography>
                                                    )}
                                                </MDBox>

                                                {/* HIỂN THỊ TIỀN ĐÃ ĐƯỢC TÍNH TOÁN LẠI */}
                                                <MDTypography variant="caption" fontWeight="bold">
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(lineTotal)}
                                                </MDTypography>
                                            </MDBox>
                                        );
                                    })
                                ) : (
                                    <MDTypography variant="caption" color="text">Không có chi tiết đơn hàng.</MDTypography>
                                )}
                                <Divider />
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
                    {/* Nút In nhanh sử dụng tính năng Print của trình duyệt */}
                    <MDButton onClick={() => window.print()} color="dark" variant="text">
                        <Icon>print</Icon>&nbsp;In
                    </MDButton>
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