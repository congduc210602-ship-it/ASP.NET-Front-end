import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import bgImage from "assets/images/bg-sign-up-cover.jpeg";

// Import AuthContext
import { useAuth } from "context/AuthContext";

function Cover() {
  const navigate = useNavigate();
  const { registerUser } = useAuth();

  // State lưu thông tin form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const [error, setError] = useState("");

  const handleInputChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    // Validate cơ bản
    if (!formData.name || !formData.email || !formData.password) {
      return setError("Vui lòng điền đầy đủ các trường bắt buộc!");
    }

    try {
      await registerUser(formData);
      alert("Đăng ký thành công! Hãy đăng nhập để mua sắm.");
      navigate("/authentication/sign-in"); // Chuyển sang trang đăng nhập
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <CoverLayout image={bgImage}>
      <Card>
        <MDBox variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="success" mx={2} mt={-3} p={3} mb={1} textAlign="center">
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>Tham gia cùng chúng tôi</MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>Nhập thông tin để tạo tài khoản</MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSignUp}>
            <MDBox mb={2}>
              <MDInput type="text" label="Họ và tên (*)" variant="standard" fullWidth value={formData.name} onChange={(e) => handleInputChange(e, "name")} />
            </MDBox>
            <MDBox mb={2}>
              <MDInput type="email" label="Email (*)" variant="standard" fullWidth value={formData.email} onChange={(e) => handleInputChange(e, "email")} />
            </MDBox>
            <MDBox mb={2}>
              <MDInput type="password" label="Mật khẩu (*)" variant="standard" fullWidth value={formData.password} onChange={(e) => handleInputChange(e, "password")} />
            </MDBox>
            <MDBox mb={2}>
              <MDInput type="text" label="Số điện thoại" variant="standard" fullWidth value={formData.phone} onChange={(e) => handleInputChange(e, "phone")} />
            </MDBox>
            <MDBox mb={2}>
              <MDInput type="text" label="Địa chỉ" variant="standard" fullWidth value={formData.address} onChange={(e) => handleInputChange(e, "address")} />
            </MDBox>

            {error && (
              <MDTypography variant="caption" color="error" fontWeight="light">{error}</MDTypography>
            )}

            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit">Đăng ký ngay</MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">Bạn đã có tài khoản?{" "}
                <MDTypography component={Link} to="/authentication/sign-in" variant="button" color="info" fontWeight="medium" textGradient>Đăng nhập</MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Cover;