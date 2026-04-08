"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Navbar,
  Nav,
  NavbarBrand,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  NavItem,
  NavLink,
} from "reactstrap";
import * as authService from "../../services/authService";
import { toast } from "react-toastify";

const Header = ({ showMobmenu }) => {
  const router = useRouter();
  const [adminData, setAdminData] = useState(null);
  const [role, setRole] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null); // State for dynamic logo

  // 1. Fetch Profile Data
  useEffect(() => {
    const fetchAdmin = async () => {
      const storedRole = localStorage.getItem("role");
      setRole(storedRole);

      try {
        const response = await authService.getAdminProfile();
        // Mapping based on API structure
        const data = response?.admin || response?.data?.admin || response;
        if (data) {
          setAdminData(data);
        }
      } catch (error) {
        console.error("Header Profile Fetch Error:", error);
      }
    };
    fetchAdmin();
  }, []);

  // 2. Fetch Dynamic Logo (Same logic as Attorney Header)
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const [typesRes, bannersRes] = await Promise.all([
          authService.getAllLogoTypes(),
          authService.getAllHomeBanners(),
        ]);
        const types = typesRes?.data?.data || [];
        const banners = bannersRes?.data?.data || [];
        const logoType = types.find((t) => t.type?.toLowerCase() === "logo");
        if (logoType) {
          const logo = banners.find(
            (b) => String(b.typeId) === String(logoType.id),
          );
          if (logo) setLogoUrl(logo.image);
        }
      } catch (err) {
        console.error("Logo fetch error:", err);
      }
    };
    fetchLogo();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logout Successful!", {
      position: "top-right",
      autoClose: 3000,
      theme: "colored",
    });
    router.push("/login-signup");
  };

  const getProfilePath = () => {
    if (role === "admin") return "/admin-panel/profile";
    if (role === "attorney") return "/attorney-panel/profile";
    return "/client-panel/profile";
  };

  const profileImg = adminData?.profileImage
    ? authService.getImgUrl(adminData.profileImage)
    : `https://ui-avatars.com/api/?name=${adminData?.firstName || "Admin"}&background=eebb5d&color=fff`;

  return (
    <>
      <style jsx global>{`
        .admin-navbar .dropdown-menu {
          border-radius: 12px;
          padding: 8px;
          min-width: 160px;
          border: none;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        .admin-navbar .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.2s ease-in-out;
        }
        .admin-navbar .dropdown-item:hover {
          background-color: #f8f9fa;
          color: #eebb5d !important;
        }
      `}</style>

      <Navbar
        color="white"
        light
        expand="md"
        className="shadow-sm bg-white m-3 rounded-4 px-4 sticky-top admin-navbar border-0">
        <div className="d-flex align-items-center justify-content-between w-100">
          <div className="d-flex align-items-center">
            <Button
              color="light"
              className="d-lg-none border-0 p-1 me-2 bg-transparent"
              onClick={showMobmenu}>
              <i className="bi bi-list fs-3"></i>
            </Button>

            {/* LOGO REPLACED "Lawfirm" TEXT */}
            <Link href="/">
              <a className="navbar-brand p-0 d-flex align-items-center">
                <img
                  src={
                    logoUrl
                      ? authService.getImgUrl(logoUrl)
                      : "/assets/images/brand-logo.png"
                  }
                  alt="Logo"
                  className="img-fluid"
                  style={{ maxHeight: "45px", width: "auto" }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/assets/images/brand-logo.png";
                  }}
                />
              </a>
            </Link>
          </div>

          <Nav
            className="ms-auto align-items-center flex-row gap-2 gap-md-4"
            navbar>
            {/* Messages */}
            <NavItem className="d-flex align-items-center">
              <Link href="/admin-panel/messages" passHref legacyBehavior>
                <NavLink className="text-dark p-0">
                  <i className="bi bi-chat-left-dots-fill fs-5"></i>
                </NavLink>
              </Link>
            </NavItem>

            {/* Live Site */}
            <NavItem className="d-none d-md-flex align-items-center">
              <Link href="/" passHref legacyBehavior>
                <NavLink className="text-dark d-flex align-items-center gap-2 p-0 fw-medium small">
                  <i className="bi bi-box-arrow-up-right fs-6"></i>
                  <span>Live Site</span>
                </NavLink>
              </Link>
            </NavItem>

            {/* Profile Dropdown */}
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle
                nav
                className="d-flex align-items-center gap-2 p-0 border-0 bg-transparent shadow-none">
                <div className="d-none d-sm-block text-end">
                  <div
                    className="fw-bold text-dark small text-capitalize"
                    style={{ lineHeight: "1" }}>
                    {adminData
                      ? `${adminData.firstName} ${adminData.lastName}`
                      : "Admin"}
                  </div>
                  <small
                    className="text-muted text-uppercase fw-bold"
                    style={{ fontSize: "10px", letterSpacing: "0.5px" }}>
                    {role || "Super Admin"}
                  </small>
                </div>

                <img
                  src={profileImg}
                  className="rounded-circle border border-2 border-warning shadow-sm"
                  width="40"
                  height="40"
                  style={{ objectFit: "cover", aspectRatio: "1/1" }}
                  alt="profile"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=Admin&background=eebb5d&color=fff`;
                  }}
                />
              </DropdownToggle>

              <DropdownMenu end className="shadow border-0 mt-2">
                <Link href={getProfilePath()} passHref legacyBehavior>
                  <DropdownItem tag="a">
                    <i className="bi bi-person fs-5 text-warning"></i>
                    <span>Profile</span>
                  </DropdownItem>
                </Link>

                <DropdownItem divider className="my-1" />

                <DropdownItem onClick={handleLogout} className="text-danger">
                  <i className="bi bi-power fs-5"></i>
                  <span>Logout</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </div>
      </Navbar>
    </>
  );
};

export default Header;
