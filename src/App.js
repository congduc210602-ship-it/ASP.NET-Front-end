import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Sidenav from "examples/Sidenav";
import theme from "assets/theme";
import themeDark from "assets/theme-dark";
import routes from "routes";
import { useMaterialUIController, setMiniSidenav } from "context";
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";

// Import AuthContext
import { useAuth } from "context/AuthContext";

// Trang khách hàng
import Home from "customer/pages/Home";
import ProductDetail from "customer/pages/ProductDetail";
import Cart from "customer/pages/Cart";
import Checkout from "customer/pages/Checkout";

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, sidenavColor, transparentSidenav, whiteSidenav, darkMode } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // 1. LẤY USER TỪ CONTEXT
  const { currentUser: user } = useAuth();

  // 2. LOGIC PHÂN BIỆT ĐƯỜNG DẪN (QUAN TRỌNG)
  // Kiểm tra xem có phải là trang Đăng nhập/Đăng ký không
  const isAuthPath = pathname.startsWith("/authentication");

  // Chỉ coi là Admin Path nếu nó nằm trong routes.js HOẶC bắt đầu bằng /admin 
  // NHƯNG phải loại trừ các trang Authentication
  const isAdminPath = (pathname.startsWith("/admin") || routes.some(r => r.route === pathname)) && !isAuthPath;

  useEffect(() => {
    // Tự động chuyển hướng /admin vào dashboard
    if (pathname === "/admin") {
      navigate("/admin/dashboard");
    }

    // CHỐT CHẶN BẢO VỆ TRANG ADMIN
    if (isAdminPath) {
      if (!user) {
        // Nếu chưa đăng nhập: Đẩy về Sign-in
        navigate("/authentication/sign-in");
      } else if (user.role !== "admin") {
        // Nếu đã đăng nhập nhưng không phải Admin (Staff/Customer): Đẩy về trang chủ
        alert("Khu vực này chỉ dành cho Quản trị viên!");
        navigate("/");
      }
    }
  }, [pathname, user, isAdminPath, navigate]);

  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) return getRoutes(route.collapse);
      if (route.route) return <Route exact path={route.route} element={route.component} key={route.key} />;
      return null;
    });

  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />

      {/* CHỈ HIỂN THỊ SIDENAV CHO ADMIN THẬT SỰ */}
      {isAdminPath && user?.role === "admin" && (
        <Sidenav
          color={sidenavColor}
          brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
          brandName="Coffee House Admin"
          routes={routes}
          onMouseEnter={handleOnMouseEnter}
          onMouseLeave={handleOnMouseLeave}
        />
      )}

      <Routes>
        {/* === CÁC TRANG KHÁCH HÀNG === */}
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* === CÁC ROUTE TỰ ĐỘNG TỪ ROUTES.JS (Admin + Auth) === */}
        {getRoutes(routes)}

        {/* === CÁC ĐƯỜNG DẪN LẠ SẼ VỀ TRANG CHỦ === */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </ThemeProvider>
  );
}