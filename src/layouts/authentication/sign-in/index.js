import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

// Context
import { useAuth } from "context/AuthContext";

function Basic() {
  const [rememberMe, setRememberMe] = useState(false);
  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // Gọi hàm login đã được đồng bộ hóa
      const user = await loginUser(userName, userPassword);

      // PHÂN QUYỀN ĐIỀU HƯỚNG
      if (user.role === "admin") {
        alert("Chào mừng Quản trị viên!");
        navigate("/admin/dashboard");
      } else if (user.role === "staff") {
        alert("Đăng nhập Nhân viên thành công!");
        navigate("/"); // Staff không vào Dashboard, về trang chủ
      } else {
        alert("Đăng nhập thành công!");
        navigate("/"); // Khách hàng về trang chủ
      }
    } catch (err) {
      setError(err.message || "Tài khoản hoặc mật khẩu không chính xác!");
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Đăng Nhập
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleLogin}>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                fullWidth
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Mật khẩu"
                fullWidth
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Ghi nhớ đăng nhập
              </MDTypography>
            </MDBox>

            {error && (
              <MDBox mt={2}>
                <MDTypography variant="caption" color="error" fontWeight="medium">
                  {error}
                </MDTypography>
              </MDBox>
            )}

            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit">
                Đăng nhập
              </MDButton>
            </MDBox>

            {/* === ĐÂY LÀ NÚT ĐĂNG KÝ CỦA BẠN === */}
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Bạn chưa có tài khoản?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-up"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Đăng ký ngay
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;