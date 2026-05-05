import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";

import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import Breadcrumbs from "examples/Breadcrumbs";
import NotificationItem from "examples/Items/NotificationItem";

import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
} from "examples/Navbars/DashboardNavbar/styles";

import {
  useMaterialUIController,
  setTransparentNavbar,
  setOpenConfigurator,
} from "context";

// 1. IMPORT THÊM AUTH CONTEXT
import { useAuth } from "context/AuthContext";

function DashboardNavbar({ absolute, light, isMini }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { transparentNavbar, fixedNavbar, openConfigurator, darkMode } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const route = useLocation().pathname.split("/").slice(1);

  // 2. LẤY THÔNG TIN USER TỪ CONTEXT
  const { currentUser, logoutUser } = useAuth();

  useEffect(() => {
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }
    window.addEventListener("scroll", handleTransparentNavbar);
    handleTransparentNavbar();
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);

  // 3. ĐỒNG BỘ HÀM LOGOUT VỚI CONTEXT
  const handleLogout = () => {
    logoutUser();
    window.location.href = "/authentication/sign-in";
  };

  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      <NotificationItem icon={<Icon>email</Icon>} title="Check new messages" />
      <NotificationItem icon={<Icon>podcasts</Icon>} title="Manage Podcast sessions" />
      <NotificationItem icon={<Icon>shopping_cart</Icon>} title="Payment successfully completed" />
    </Menu>
  );

  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;
      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }
      return colorValue;
    },
  });

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} />
        </MDBox>
        {isMini ? null : (
          <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
            <MDBox pr={1}>
              <MDInput label="Search here" />
            </MDBox>
            <MDBox color={light ? "white" : "inherit"} display="flex" alignItems="center">

              {/* 4. HIỂN THỊ TÊN ADMIN NẾU ĐÃ ĐĂNG NHẬP */}
              {currentUser && (
                <MDBox mr={2} display="flex" alignItems="center" lineHeight={0}>
                  <Icon sx={{ ...iconsStyle, mr: 0.5 }}>account_circle</Icon>
                  <MDTypography variant="button" fontWeight="bold" color={light ? "white" : "dark"}>
                    {/* ĐỔI userName THÀNH name VÀ THÊM DẤU || ĐỂ TRÁNH UNDEFINED */}
                    {currentUser.name || currentUser.userName || "Quản trị viên"}
                  </MDTypography>
                </MDBox>
              )}

              <IconButton
                sx={navbarIconButton}
                size="small"
                disableRipple
                color="inherit"
                onClick={handleLogout}
              >
                <Icon sx={iconsStyle}>logout</Icon>
                <MDTypography variant="button" fontWeight="medium" color={light ? "white" : "dark"} ml={1}>
                  Đăng xuất
                </MDTypography>
              </IconButton>

              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                onClick={handleConfiguratorOpen}
              >
                <Icon sx={iconsStyle}>settings</Icon>
              </IconButton>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                onClick={handleOpenMenu}
              >
                <Icon sx={iconsStyle}>notifications</Icon>
              </IconButton>
              {renderMenu()}
            </MDBox>
          </MDBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

DashboardNavbar.defaultProps = { absolute: false, light: false, isMini: false };
DashboardNavbar.propTypes = { absolute: PropTypes.bool, light: PropTypes.bool, isMini: PropTypes.bool };

export default DashboardNavbar;