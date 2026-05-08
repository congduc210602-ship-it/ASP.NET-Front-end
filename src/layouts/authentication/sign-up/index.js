import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";

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
  const [isSubmitting, setIsSubmitting] = useState(false); // Tránh người dùng bấm 2 lần

  const handleInputChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    // 1. Validate cơ bản
    if (!formData.name || !formData.email || !formData.password || !formData.phone) {
      return setError("Vui lòng điền đầy đủ các trường bắt buộc!");
    }

    // 2. Validate Ràng buộc số điện thoại (Bắt đầu bằng 0, có đúng 10 số)
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      return setError("Số điện thoại không hợp lệ! Vui lòng nhập đúng 10 số và bắt đầu bằng số 0.");
    }

    setIsSubmitting(true);
    try {
      await registerUser(formData);
      alert("Đăng ký thành công! Hãy đăng nhập để mua sắm.");
      navigate("/authentication/sign-in"); // Chuyển sang trang đăng nhập
    } catch (err) {
      // 3. Xử lý lỗi trùng Email từ Backend
      const errorMessage = err.message.toLowerCase();
      if (errorMessage.includes("exist") || errorMessage.includes("tồn tại") || errorMessage.includes("đã có")) {
        setError("Email đã có người đăng ký. Vui lòng sử dụng email khác!");
      } else {
        setError(err.message || "Đã xảy ra lỗi kết nối. Vui lòng thử lại sau!");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CoverLayout image={bgImage}>
      <Card>
        <MDBox variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="success" mx={2} mt={-3} p={3} mb={1} textAlign="center">
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>Đăng Ký</MDTypography>
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
              {/* Thêm dấu (*) vào SĐT để nhắc khách hàng */}
              <MDInput type="text" label="Số điện thoại (*)" variant="standard" fullWidth value={formData.phone} onChange={(e) => handleInputChange(e, "phone")} />
            </MDBox>
            <MDBox mb={2}>
              <MDInput type="text" label="Địa chỉ" variant="standard" fullWidth value={formData.address} onChange={(e) => handleInputChange(e, "address")} />
            </MDBox>

            {/* Khung hiển thị lỗi nổi bật hơn */}
            {error && (
              <MDBox mt={2} mb={1} p={1} bgColor="error" borderRadius="md">
                <MDTypography variant="caption" color="white" fontWeight="bold">
                  ⚠️ {error}
                </MDTypography>
              </MDBox>
            )}

            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang xử lý..." : "Đăng ký ngay"}
              </MDButton>
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