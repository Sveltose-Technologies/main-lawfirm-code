

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import AttorneyHeader from "./AttorneyHeader";
import { getImgUrl, getUserProfile } from "../../services/authService";

export default function AttorneyLayout({ children }) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [userName, setUserName] = useState("Attorney");
  const [profileImg, setProfileImg] = useState("");

  const [isFullyAccessible, setIsFullyAccessible] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [loading, setLoading] = useState(true);

  const menuItems = [
    { name: "Dashboard", icon: "bi-grid-fill", path: "/attorney-panel" },
    {
      name: "Appointments",
      icon: "bi-calendar-check",
      path: "/attorney-panel/appointments",
    },
    {
      name: "Client Management",
      icon: "bi-people-fill",
      path: "/attorney-panel/clients",
    },
    {
      name: "Case Details",
      icon: "bi-clock-history",
      path: "/attorney-panel/cases",
    },
    {
      name: "Messages",
      icon: "bi-chat-dots-fill",
      path: "/attorney-panel/messages",
    },
    {
      name: "Ticket Management",
      icon: "bi-ticket-perforated-fill",
      path: "/attorney-panel/tickets",
    },
    {
      name: "Edit Profile",
      icon: "bi-person-bounding-box",
      path: "/attorney-panel/profile",
    },
  ];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const syncAttorneyData = async () => {
    if (typeof window === "undefined") return;

    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/");
      return;
    }

    try {
      const localUser = JSON.parse(storedUser);
      const res = await getUserProfile(localUser.id || localUser._id);

      let serverUser = null;
      if (res && res.attorneys && Array.isArray(res.attorneys)) {
        serverUser = res.attorneys.find(
          (a) => Number(a.id) === Number(localUser.id),
        );
      } else {
        serverUser = res.attorney || res.data || res;
      }

      if (serverUser) {
        const currentStatus = (serverUser.status || "").toLowerCase().trim();
        const isActive = currentStatus === "verified";

        // Profile Completion Check
        const profileDone =
          serverUser.isProfileComplete === true ||
          serverUser.isProfileComplete === "true" ||
          (serverUser.experience && serverUser.experience.length > 10); // fallback check

        setIsUpdated(profileDone);
        setIsFullyAccessible(isActive);

        setUserName(
          `${serverUser.firstName || ""} ${serverUser.lastName || ""}`.trim(),
        );
        setProfileImg(
          serverUser.profileImage ? getImgUrl(serverUser.profileImage) : "",
        );

        // Sync LocalStorage
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...localUser,
            ...serverUser,
            isProfileComplete: profileDone,
            status: serverUser.status,
          }),
        );

        // First login redirection logic
        if (!profileDone && router.pathname !== "/attorney-panel/profile") {
          router.push("/attorney-panel/profile");
        }
      }
    } catch (error) {
      console.error("Layout Sync Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isMounted) syncAttorneyData();
    window.addEventListener("profileUpdated", syncAttorneyData);
    return () => window.removeEventListener("profileUpdated", syncAttorneyData);
  }, [isMounted, router.asPath]);

  const handleLogout = () => {
    if (confirm("Logout?")) {
      localStorage.clear();
      router.push("/");
    }
  };

  if (!isMounted || loading) return null;

  return (
    <div className="bg-light min-vh-100">
      <AttorneyHeader onToggleSidebar={() => setShowSidebar(!showSidebar)} />
      <div className="container-fluid py-4">
        <div className="row">
          <aside
            className={`col-lg-3 ${showSidebar ? "d-block position-fixed start-0 top-0 vh-100 z-3 bg-white" : "d-none d-lg-block"}`}>
            <div
              className="card border-0 shadow-sm rounded-4 sticky-top"
              style={{ top: "90px" }}>
             {/* --- UPDATE THIS SECTION IN YOUR ATTORNEYLAYOUT.JS --- */}
<div className="p-4 text-center border-bottom">
  <img
    src={
      profileImg || `https://ui-avatars.com/api/?name=${userName}`
    }
    
    className="rounded-circle mb-2 border border-2 border-warning d-block mx-auto"
    style={{ width: "80px", height: "80px", objectFit: "cover" }}
    alt="profile"
  />
  <h6 className="fw-bold mb-0 text-truncate">{userName}</h6>
  <div className="mt-2">
    {isFullyAccessible ? (
      <span className="badge bg-success small">
        ● Active Account
      </span>
    ) : (
      <span className="badge bg-danger small">
        ● Pending Activation
      </span>
    )}
  </div>
</div>

              <div className="p-3">
                <nav className="nav flex-column gap-1">
                  {menuItems.map((item, idx) => {
                    // Logic: Agar user active hai toh access do, varna sirf profile khulega
                    const isDisabled =
                      !isFullyAccessible &&
                      item.path !== "/attorney-panel/profile";

                    return (
                      <Link
                        key={idx}
                        href={isDisabled ? "#" : item.path}
                        legacyBehavior>
                        <a
                          className={`nav-link rounded-3 py-2 px-3 d-flex align-items-center ${router.pathname === item.path ? "bg-light text-warning fw-bold" : "text-dark"} ${isDisabled ? "opacity-50" : ""}`}
                          onClick={(e) => {
                            if (isDisabled) {
                              e.preventDefault();
                              alert(
                                "ACCESS DENIED: Your account is active on server but verification is still processing in your session. Please refresh or wait for Admin.",
                              );
                              return;
                            }
                            setShowSidebar(false);
                          }}
                          style={{
                            cursor: isDisabled ? "not-allowed" : "pointer",
                          }}>
                          <i
                            className={`bi ${item.icon} me-3 ${router.pathname === item.path ? "text-warning" : ""}`}></i>
                          <span style={{ fontSize: "14px" }}>{item.name}</span>
                          {isDisabled && (
                            <i className="bi bi-lock-fill ms-auto small text-danger"></i>
                          )}
                        </a>
                      </Link>
                    );
                  })}
                  <hr />
                  <button
                    className="btn btn-link nav-link text-danger fw-bold border-0 text-start"
                    onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-3"></i>Logout
                  </button>
                </nav>
              </div>
            </div>
          </aside>
          <main className="col-lg-9">{children}</main>
        </div>
      </div>
    </div>
  );
}