"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  getImgUrl,
  getUserProfile,
  getAllLogoTypes,
  getAllHomeBanners,
} from "../../services/authService";
import * as authService from "../../services/authService";
import { toast } from "react-toastify";

export default function ClientHeader({ onToggleSidebar }) {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [role, setRole] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);

  const fallbackImg =
    "https://ui-avatars.com/api/?name=User&background=cfab4a&color=fff";

  // --- START: IMPROVED SYNC LOGIC ---
  const syncUser = useCallback(async () => {
    const storedRole = localStorage.getItem("role");
    const storedUser = localStorage.getItem("user");
    setRole(storedRole || "Client");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const userId = parsedUser?.id || parsedUser?._id;

        // 1. Initial set from local storage for speed
        setUserData(parsedUser);

        // 2. Fetch fresh data from API
        const response = await getUserProfile(userId);

        // 3. Robust Data Extraction (Handles Attorney/Client/Array response)
        let data = null;
        if (response?.client) data = response.client;
        else if (response?.attorney) data = response.attorney;
        else if (response?.clients && Array.isArray(response.clients)) {
          data = response.clients.find((c) => Number(c.id) === Number(userId));
        } else {
          data = response?.data || response;
        }

        if (data) {
          setUserData(data);
          // Keep local storage synchronized
          localStorage.setItem(
            "user",
            JSON.stringify({ ...parsedUser, ...data }),
          );
        }
      } catch (error) {
        console.error("Client Header Sync Error:", error);
      }
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
  // --- END: IMPROVED SYNC LOGIC ---

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const [typesRes, bannersRes] = await Promise.all([
          authService.getAllLogoTypes(),
          authService.getAllHomeBanners(),
        ]);
        const logoType = (typesRes?.data?.data || []).find(
          (t) => t.type?.toLowerCase() === "logo",
        );
        if (logoType) {
          const logo = (bannersRes?.data?.data || []).find(
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
    if (confirm("Are you sure?")) {
      localStorage.clear();
      toast.success("Logout Successful!");
      router.push("/");
    }
  };

  // Safe Name and Image calculation
  const fullName = userData
    ? `${userData.firstName || ""} ${userData.lastName || ""}`.trim()
    : "Loading...";

  const profileImg =
    userData?.profileImage && userData.profileImage !== "null"
      ? getImgUrl(userData.profileImage)
      : `https://ui-avatars.com/api/?name=${fullName.replace(" ", "+")}&background=cfab4a&color=fff`;

  return (
    <header
      className="bg-white border-bottom sticky-top shadow-sm"
      style={{ zIndex: 1040, height: "70px" }}>
      <div className="container h-100">
        <div className="d-flex justify-content-between align-items-center h-100">
          <div className="d-flex align-items-center">
            <button
              className="btn btn-light d-lg-none me-2 border-0 bg-transparent"
              onClick={onToggleSidebar}>
              <i className="bi bi-list fs-2 text-dark"></i>
            </button>
            <Link href="/">
              <a className="navbar-brand p-0 m-0 d-flex align-items-center">
                <img
                  src={
                    logoUrl
                      ? getImgUrl(logoUrl)
                      : ''
                  }
                  alt="Logo"
                  style={{
                    width: "160px",
                    height: "45px",
                    objectFit: "contain",
                  }}
                />
              </a>
            </Link>
          </div>

          <div className="d-flex align-items-center gap-2 gap-md-4">
            <Link href="/client-panel/messages">
              <a className="text-dark fs-4 pt-1 d-none d-md-block">
                <i className="bi bi-chat-dots"></i>
              </a>
            </Link>

            <div className="profile-dropdown-container">
              <div
                className="profile-trigger d-flex align-items-center gap-2"
                style={{ cursor: "pointer" }}>
                <div className="text-end d-none d-sm-block">
                  <p
                    className="mb-0 fw-bold text-dark small text-capitalize"
                    style={{ lineHeight: "1" }}>
                    {fullName}
                  </p>
                  <small
                    className="text-muted text-uppercase fw-bold"
                    style={{ fontSize: "10px" }}>
                    {role || "Client"}
                  </small>
                </div>
                <img
                  src={profileImg}
                  className="rounded-circle border shadow-sm"
                  style={{ width: "42px", height: "42px", objectFit: "cover" }}
                  alt="user"
                  onError={(e) => {
                    e.target.src = fallbackImg;
                  }}
                />
              </div>

              <div className="profile-hover-menu shadow-lg border-0 rounded-3 overflow-hidden">
                <div className="p-3 border-bottom bg-light">
                  <span className="small fw-bold text-muted">User Menu</span>
                  <div className="d-sm-none mt-1">
                    <p className="mb-0 fw-bold text-dark small">{fullName}</p>
                  </div>
                </div>
                <Link href="/client-panel/">
                  <a className="dropdown-item py-2 px-3">
                    <i className="bi bi-speedometer2 me-2 text-primary"></i>{" "}
                    Dashboard
                  </a>
                </Link>
                <Link href="/client-panel/edit-profile">
                  <a className="dropdown-item py-2 px-3">
                    <i className="bi bi-person-gear me-2 text-primary"></i> Edit
                    Profile
                  </a>
                </Link>
                <div className="dropdown-divider m-0"></div>
                <button
                  className="dropdown-item py-2 px-3 text-danger fw-bold border-0 bg-transparent w-100 text-start"
                  onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i> Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .profile-dropdown-container {
          position: relative;
          padding: 15px 0;
        }
        .profile-hover-menu {
          position: absolute;
          top: 100%;
          right: 0;
          width: 200px;
          background: white;
          display: none;
          z-index: 1050;
        }
        .profile-dropdown-container:hover .profile-hover-menu {
          display: block;
        }
        .dropdown-item {
          display: block;
          width: 100%;
          padding: 0.6rem 1rem;
          text-decoration: none;
          color: #212529;
          font-size: 14px;
          transition: 0.2s;
        }
        .dropdown-item:hover {
          background-color: #f8f9fa;
          color: #de9f57;
        }
      `}</style>
    </header>
  );
}
