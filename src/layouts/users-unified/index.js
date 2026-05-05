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
import { getAllUsers, addUser, updateUser, toggleUserStatus } from "../../services/UserService";

function UsersUnified() {
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state đồng bộ 100% với Backend User.cs
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "staff", // Mặc định là staff
        isActive: true, // true là Hoạt động, false là Khóa
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error("Lỗi lấy danh sách user:", error);
        }
    };

    const handleOpenAddModal = () => {
        setIsEditing(false);
        setCurrentUserId(null);
        setFormData({ name: "", email: "", password: "", role: "staff", isActive: true });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (user) => {
        setIsEditing(true);
        setCurrentUserId(user.id);
        setFormData({
            name: user.name || "",
            email: user.email || "",
            password: user.password || "", // Giữ nguyên password cũ để update không bị lỗi
            role: user.role || "staff",
            isActive: user.isActive,
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ràng buộc kiểm tra trùng Email (Chỉ kiểm tra khi Thêm mới)
        if (!isEditing) {
            const isDuplicate = users.some(
                (user) => user.email.toLowerCase() === formData.email.toLowerCase()
            );
            if (isDuplicate) {
                alert("Lỗi: Email này đã tồn tại! Vui lòng chọn email khác.");
                return;
            }
        }

        setIsSubmitting(true);

        // Payload gửi xuống Backend (Khớp chính xác với User.cs)
        const payload = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role,
            isActive: formData.isActive
        };

        try {
            if (isEditing) {
                payload.id = currentUserId;
                await updateUser(currentUserId, payload);
                alert("Cập nhật thành công!");
            } else {
                await addUser(payload);
                alert("Thêm người dùng thành công!");
            }
            handleCloseModal();
            fetchUsers();
        } catch (error) {
            alert("Có lỗi xảy ra, vui lòng kiểm tra lại F12!");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Đổi trạng thái true/false
    const handleToggleStatus = async (user) => {
        const newStatus = !user.isActive; // Đảo ngược trạng thái
        const confirmMsg = !newStatus ? "Bạn muốn KHÓA tài khoản này?" : "Bạn muốn MỞ KHÓA tài khoản này?";

        if (window.confirm(confirmMsg)) {
            try {
                // Tạo một bản sao của user và cập nhật IsActive
                const payload = { ...user, isActive: newStatus };
                await updateUser(user.id, payload);
                fetchUsers(); // Tải lại danh sách
            } catch (error) {
                alert("Lỗi khi đổi trạng thái!");
            }
        }
    };

    // Cấu hình DataTable gọn gàng hơn
    const columns = [
        { Header: "ID", accessor: "id", width: "10%", align: "center" },
        { Header: "Họ Tên", accessor: "name", width: "25%", align: "left" },
        { Header: "Email", accessor: "email", width: "25%", align: "left" },
        { Header: "Phân quyền", accessor: "role", align: "center" },
        { Header: "Trạng thái", accessor: "status", align: "center" },
        { Header: "Hành động", accessor: "action", align: "center" },
    ];

    const rows = users.map((user) => ({
        id: <MDTypography variant="caption" color="text" fontWeight="medium">#{user.id}</MDTypography>,
        name: <MDTypography variant="button" fontWeight="medium">{user.name}</MDTypography>,
        email: <MDTypography variant="caption" color="text" fontWeight="medium">{user.email}</MDTypography>,
        role: (
            <MDBox ml={-1}>
                <Chip
                    label={user.role ? user.role.toUpperCase() : "STAFF"}
                    color={user.role && user.role.toLowerCase() === "admin" ? "info" : "secondary"}
                    size="small"
                />
            </MDBox>
        ),
        status: (
            <MDBox ml={-1}>
                <Chip
                    label={user.isActive ? "Hoạt động" : "Đã Khóa"}
                    color={user.isActive ? "success" : "error"}
                    size="small"
                />
            </MDBox>
        ),
        action: (
            <MDBox display="flex" alignItems="center">
                <MDButton variant="text" color="info" onClick={() => handleOpenEditModal(user)}>
                    <Icon>edit</Icon>&nbsp;Sửa
                </MDButton>
                <MDButton
                    variant="text"
                    color={user.isActive ? "warning" : "success"}
                    onClick={() => handleToggleStatus(user)}
                >
                    <Icon>{user.isActive ? "lock" : "lock_open"}</Icon>&nbsp;
                    {user.isActive ? "Khóa" : "Mở Khóa"}
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
                                <MDTypography variant="h6" color="white">
                                    Quản Lý Người Dùng
                                </MDTypography>
                                <MDButton variant="gradient" color="success" onClick={handleOpenAddModal}>
                                    <Icon fontSize="small">person_add</Icon>&nbsp;Thêm Tài Khoản
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
                <DialogTitle>{isEditing ? "Cập Nhật Tài Khoản" : "Tạo Tài Khoản Mới"}</DialogTitle>
                <MDBox component="form" role="form" onSubmit={handleSubmit}>
                    <DialogContent dividers>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <MDInput type="text" label="Họ Tên (Name)" name="name" value={formData.name} onChange={handleChange} fullWidth required />
                            </Grid>
                            <Grid item xs={12}>
                                <MDInput type="email" label="Email đăng nhập" name="email" value={formData.email} onChange={handleChange} fullWidth required />
                            </Grid>
                            <Grid item xs={12}>
                                <MDInput
                                    type="password"
                                    label="Mật khẩu"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    fullWidth
                                    required={!isEditing}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <MDTypography variant="caption" color="text" fontWeight="regular">Phân quyền</MDTypography>
                                <Select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{ height: 45 }}
                                >
                                    <MenuItem value="staff">Nhân viên (Staff)</MenuItem>
                                    <MenuItem value="admin">Quản trị viên (Admin)</MenuItem>
                                </Select>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <MDButton onClick={handleCloseModal} color="secondary">Hủy</MDButton>
                        <MDButton variant="gradient" color="info" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Đang xử lý..." : isEditing ? "Cập Nhật" : "Tạo Tài Khoản"}
                        </MDButton>
                    </DialogActions>
                </MDBox>
            </Dialog>
        </DashboardLayout>
    );
}

export default UsersUnified;