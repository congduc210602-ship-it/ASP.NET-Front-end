import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

function Dashboard() {
  const [stats, setStats] = useState({
    productsCount: 0,
    usersCount: 0,
    ordersCount: 0,
    totalRevenue: 0,
  });

  const [chartData, setChartData] = useState({
    visits: { labels: ["M", "T", "W", "T", "F", "S", "S"], datasets: { label: "Truy cập", data: [50, 40, 300, 220, 500, 250, 400] } },
    sales: { labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], datasets: { label: "Doanh số", data: [0, 0, 0, 0, 0, 0, 0, 0, 0] } },
    completedOrders: { labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], datasets: { label: "Đơn hàng", data: [0, 0, 0, 0, 0, 0, 0, 0, 0] } },
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const API_URL = "https://asp-net-2.onrender.com/api";
      // LẤY TOKEN ĐỂ GỌI API BẢO MẬT
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;

      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      // 1. Gọi đồng thời các API thống kê
      const [prodRes, userRes, revenueRes, ordersRes] = await Promise.all([
        fetch(`${API_URL}/Products`),
        fetch(`${API_URL}/Users`, { headers }), // Cần token để xem ds User
        fetch(`${API_URL}/Admin/reports/revenue`, { headers }), // Cần token
        fetch(`${API_URL}/customer/orders`, { headers }) // API lấy tất cả đơn hàng
      ]);

      const prodData = await prodRes.json();
      const userData = await userRes.json();
      const revenueData = revenueRes.ok ? await revenueRes.json() : { totalOrders: 0, totalRevenue: 0 };
      const ordersData = ordersRes.ok ? await ordersRes.json() : [];

      // Cập nhật thẻ thống kê (Kiểm tra cả viết hoa và viết thường)
      setStats({
        productsCount: prodData.length || 0,
        usersCount: userData.length || 0,
        ordersCount: revenueData.totalOrders || revenueData.TotalOrders || ordersData.length || 0,
        totalRevenue: revenueData.totalRevenue || revenueData.TotalRevenue || 0,
      });

      // 2. XỬ LÝ DỮ LIỆU BIỂU ĐỒ TỪ DANH SÁCH ĐƠN HÀNG THẬT
      if (ordersData.length > 0) {
        // Mảng 12 tháng khởi tạo bằng 0
        const monthlySales = Array(9).fill(0); // Từ tháng 4 (Apr) đến tháng 12 (Dec)
        const monthlyOrders = Array(9).fill(0);

        ordersData.forEach(order => {
          const date = new Date(order.createdAt || order.CreatedAt);
          const monthIndex = date.getMonth(); // 0 = Jan, 3 = Apr

          if (monthIndex >= 3) { // Chỉ lấy từ tháng 4 trở đi theo Labels của biểu đồ
            const indexInArray = monthIndex - 3;
            monthlyOrders[indexInArray] += 1;
            monthlySales[indexInArray] += (order.totalAmount || order.TotalAmount || 0);
          }
        });

        setChartData(prev => ({
          ...prev,
          sales: { ...prev.sales, datasets: { ...prev.sales.datasets, data: monthlySales } },
          completedOrders: { ...prev.completedOrders, datasets: { ...prev.completedOrders.datasets, data: monthlyOrders } }
        }));
      }

    } catch (error) {
      console.error("Lỗi Dashboard:", error);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard color="dark" icon="store" title="Tổng Sản Phẩm" count={stats.productsCount} />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard icon="leaderboard" title="Người Dùng" count={stats.usersCount} />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard color="success" icon="shopping_cart" title="Đơn Hàng" count={stats.ordersCount} />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="info"
                icon="attach_money"
                title="Doanh Thu"
                count={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.totalRevenue)}
              />
            </MDBox>
          </Grid>
        </Grid>

        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart color="info" title="Lượt truy cập" chart={chartData.visits} date="Cập nhật real-time" />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart color="success" title="Doanh số hằng tháng" chart={chartData.sales} date="Dữ liệu từ đơn hàng" />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart color="dark" title="Đơn hàng thành công" chart={chartData.completedOrders} date="Dữ liệu từ đơn hàng" />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;