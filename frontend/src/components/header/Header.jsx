
"use client";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState, useCallback } from "react";
import {
  getAllHomeBanners,
  getAllLogoTypes,
  getImgUrl,
} from "../../services/authService";
import * as authService from "../../services/authService";
import { DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { toast } from "react-toastify";
import { SUPPORTED_LANGUAGES } from "../../i18n";
import { useTranslation } from "../../hooks/useTranslation";

function Header() {
  const [isSticky, setIsSticky] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [logoUrl, setLogoUrl] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [role, setRole] = useState(null);

  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  // --- START: DYNAMIC PROFILE SYNC LOGIC ---
  const syncUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    const storedUser = localStorage.getItem("user");

    setRole(storedRole);

    // Agar token hai, tabhi logged in mano
    if (token || storedUser) {
      setIsLoggedIn(true);
      try {
        if (storedUser) {
          setUserData(JSON.parse(storedUser));
        }

        let response;
        if (storedRole === "admin") {
          response = await authService.getAdminProfile();
        } else {
          const parsedUser = storedUser ? JSON.parse(storedUser) : null;
          const userId = parsedUser?.id || parsedUser?._id;
          if (userId) {
            response = await authService.getUserProfile(userId);
          }
        }

        const data =
          response?.admin ||
          response?.attorney ||
          response?.user ||
          response?.data?.admin ||
          response?.data?.attorney ||
          response?.data?.user ||
          response?.data ||
          response;

        if (data) {
          setUserData(data);
          const updatedUser = { ...JSON.parse(storedUser || "{}"), ...data };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      } catch (error) {
        console.error("Profile Fetch Error:", error);
      }
    } else {
      setIsLoggedIn(false);
      setUserData(null);
    }
  }, []);

  useEffect(() => {
    syncUser();
    window.addEventListener("profileUpdated", syncUser);
    window.addEventListener("storage", syncUser);
    return () => {
      window.removeEventListener("profileUpdated", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, [syncUser]);
  // --- END: DYNAMIC PROFILE SYNC LOGIC ---

  useEffect(() => {
    setIsOpen(false);
    setMobileDropdownOpen(false);
    setLanguageDropdownOpen(false);
  }, [router.pathname]);

  const isActive = (path) => (router.pathname === path ? "active-link" : "");
  const isAboutActive = ["/our-firm", "/award", "/promoters"].includes(
    router.pathname,
  )
    ? "active-link"
    : "";

  useEffect(() => {
    setMounted(true);
    const fetchDynamicLogo = async () => {
      try {
        const [typesRes, bannersRes] = await Promise.all([
          getAllLogoTypes(),
          getAllHomeBanners(),
        ]);
        const logoTypeObj = (typesRes.data?.data || []).find(
          (t) => t.type.toLowerCase() === "logo",
        );
        if (logoTypeObj) {
          const logoData = (bannersRes.data?.data || [])
            .filter((b) => Number(b.typeId) === Number(logoTypeObj.id))
            .sort((a, b) => b.id - a.id)[0];
          if (logoData) setLogoUrl(logoData.image);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchDynamicLogo();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logout Successful!");
    setIsLoggedIn(false);
    setUserData(null);
    router.push("/login-signup");
  };

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY >= 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) return null;

  return (
    <header
      className={`fixed-top w-100 bg-black ${isSticky ? "shadow-lg" : ""}`}
      style={{ transition: "0.3s" }}>
      <nav className="navbar navbar-expand-xl navbar-dark p-2">
        <div className="container-fluid px-3 px-lg-4">
          <Link href="/">
            <a className="navbar-brand">
              <img
                src={
                  logoUrl ? getImgUrl(logoUrl) : ''
                }
                alt="Logo"
                style={{ width: "160px", height: "50px", objectFit: "contain" }}
              />
            </a>
          </Link>

          <button
            className="navbar-toggler border-0 shadow-none"
            type="button"
            onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <span
                className="text-white fs-1"
                style={{ lineHeight: 0, display: "block", marginTop: "-5px" }}>
                &times;
              </span>
            ) : (
              <span className="navbar-toggler-icon"></span>
            )}
          </button>

          <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
            <ul className="navbar-nav ms-auto align-items-center text-center text-xl-start">
              {/* Menu items exactly as provided... */}
              <li className="nav-item">
                <Link href="/">
                  <a className={`nav-link ${isActive("/")}`}>{t("nav.home")}</a>
                </Link>
              </li>
              <li
                className="nav-item dropdown w-100 w-xl-auto"
                onMouseEnter={() =>
                  window.innerWidth > 1199 && setMobileDropdownOpen(true)
                }
                onMouseLeave={() =>
                  window.innerWidth > 1199 && setMobileDropdownOpen(false)
                }>
                <a
                  className={`nav-link dropdown-toggle ${isAboutActive}`}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileDropdownOpen(!mobileDropdownOpen);
                  }}>
                  {t("nav.about")}
                </a>
                <ul
                  className={`dropdown-menu dropdown-menu-dark border-0 shadow ${mobileDropdownOpen ? "show" : ""}`}>
                  <li>
                    <Link href="/our-firm">
                      <a className={`dropdown-item ${isActive("/our-firm")}`}>
                        {t("nav.ourFirm")}
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/award">
                      <a className={`dropdown-item ${isActive("/award")}`}>
                        {t("nav.awards")}
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/promoters">
                      <a className={`dropdown-item ${isActive("/promoters")}`}>
                        {t("nav.promoters")}
                      </a>
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <Link href="/attorneys">
                  <a className={`nav-link ${isActive("/attorneys")}`}>
                    {t("nav.professionals")}
                  </a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/capability">
                  <a className={`nav-link ${isActive("/capability")}`}>
                    {t("nav.capabilities")}
                  </a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/news">
                  <a className={`nav-link ${isActive("/news")}`}>
                    {t("nav.news")}
                  </a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/careers">
                  <a className={`nav-link ${isActive("/careers")}`}>
                    {t("nav.careers")}
                  </a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/events">
                  <a className={`nav-link ${isActive("/events")}`}>
                    {t("nav.events")}
                  </a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/location">
                  <a className={`nav-link ${isActive("/location")}`}>
                    {t("nav.locations")}
                  </a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/contact-us">
                  <a className={`nav-link ${isActive("/contact-us")}`}>
                    {t("nav.contactUs")}
                  </a>
                </Link>
              </li>

              <li
                className="nav-item dropdown w-100 w-xl-auto"
                onMouseEnter={() =>
                  window.innerWidth > 1199 && setLanguageDropdownOpen(true)
                }
                onMouseLeave={() =>
                  window.innerWidth > 1199 && setLanguageDropdownOpen(false)
                }>
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setLanguageDropdownOpen(!languageDropdownOpen);
                  }}>
                  <i className="fas fa-globe me-1"></i> EN
                </a>
                <ul
                  className={`dropdown-menu ${languageDropdownOpen ? "show" : ""}`}
                  style={{ right: 0, left: "auto" }}>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <li key={lang.code}>
                      <button
                        className="dropdown-item"
                        onClick={() => changeLanguage(lang.code)}
                        type="button">
                        {lang.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </li>

              {isLoggedIn ? (
                <UncontrolledDropdown
                  nav
                  inNavbar
                  className="nav-item ms-xl-3 py-2 py-xl-0">
                  <DropdownToggle nav className="p-0 border-0 bg-transparent">
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        display: "inline-block",
                      }}>
                      <img
                        src={
                          userData?.profileImage
                            ? authService.getImgUrl(userData.profileImage)
                            : `https://ui-avatars.com/api/?name=${userData?.firstName || role || "User"}&background=eebb5d&color=fff`
                        }
                        className="rounded-circle border border-2 border-warning shadow-sm"
                        alt="profile"
                        style={{
                          width: "40px",
                          height: "40px",
                          objectFit: "cover",
                          display: "block",
                        }}
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${userData?.firstName || "User"}&background=eebb5d&color=fff`;
                        }}
                      />
                    </div>
                  </DropdownToggle>
                  <DropdownMenu
                    end
                    className="dropdown-menu-dark border-0 shadow mt-2">
                    <Link
                      href={
                        role === "admin"
                          ? "/admin-panel/"
                          : role === "attorney"
                            ? "/attorney-panel/"
                            : "/client-panel/"
                      }>
                      <a className="dropdown-item py-2 text-center text-xl-start">
                        <span>{t("admin.dashboard")}</span>
                      </a>
                    </Link>
                    <div className="dropdown-divider border-secondary"></div>
                    <button
                      onClick={handleLogout}
                      className="dropdown-item text-danger py-2 border-0 bg-transparent w-100 text-center text-xl-start">
                      <span>{t("auth.logout")}</span>
                    </button>
                  </DropdownMenu>
                </UncontrolledDropdown>
              ) : (
                <li className="nav-item ms-xl-3 mt-2 mt-xl-0 pb-3 pb-xl-0 w-100 w-xl-auto">
                  <Link href="/login-signup">
                    <a className="btn btn-warning px-4 py-2 w-100 fw-bold">
                      {t("auth.loginSignup")}
                    </a>
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;