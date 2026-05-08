import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";

import { getCustomersStats } from "../../services/CustomerService";

function CustomersUnified() {
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const data = await getCustomersStats();
        setCustomers(data);
    };

    const columns = [
        { Header: "Tên Khách Hàng", accessor: "name", width: "25%", align: "left" },
        { Header: "Liên Hệ", accessor: "contact", width: "25%", align: "left" },
        { Header: "Điểm", accessor: "points", align: "center" },
        { Header: "Số Đơn", accessor: "orders", align: "center" },
        { Header: "Tổng Chi Tiêu", accessor: "spent", align: "right" },
    ];

    const rows = customers.map((c) => ({
        name: <MDTypography variant="button" fontWeight="bold">{c.name}</MDTypography>,
        contact: (
            <MDBox>
                <MDTypography variant="caption" display="block" fontWeight="medium">{c.email}</MDTypography>
                <MDTypography variant="caption" color="text">{c.phone || "Chưa có SĐT"}</MDTypography>
            </MDBox>
        ),
        points: (
            <Chip label={`${c.points} Pts`} color="warning" size="small" variant="outlined" />
        ),
        orders: (
            <MDTypography variant="caption" fontWeight="bold">{c.totalOrders} đơn hàng</MDTypography>
        ),
        spent: (
            <MDTypography variant="button" color="error" fontWeight="bold">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(c.totalSpent)}
            </MDTypography>
        ),
    }));

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <Card>
                            <MDBox mx={2} mt={-3} py={3} px={2} variant="gradient" bgColor="success" borderRadius="lg" coloredShadow="success">
                                <MDTypography variant="h6" color="white">Thống Kê Khách Hàng Thân Thiết</MDTypography>
                            </MDBox>
                            <MDBox pt={3}>
                                <DataTable table={{ columns, rows }} isSorted={true} entriesPerPage={true} showTotalEntries={true} noEndBorder />
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
        </DashboardLayout>
    );
}

export default CustomersUnified;