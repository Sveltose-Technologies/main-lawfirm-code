// "use client";
// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import { useRouter } from "next/router";
// import {
//   Navbar,
//   Nav,
//   UncontrolledDropdown,
//   DropdownToggle,
//   DropdownMenu,
//   DropdownItem,
//   Button,
//   NavItem,
//   NavLink,
// } from "reactstrap";
// import * as authService from "../../services/authService";
// import { toast } from "react-toastify";

// export default function AttorneyHeader({ onToggleSidebar }) {
//   const router = useRouter();
//   const [userData, setUserData] = useState(null);
//   const [role, setRole] = useState(null);
//   const [logoUrl, setLogoUrl] = useState(null);

//   const fallbackImg =
//     "https://ui-avatars.com/api/?name=User&background=cfab4a&color=fff";

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         // 1. Get User ID from the "user" object in localStorage
//         const storedUser = localStorage.getItem("user");
//         const storedRole = localStorage.getItem("role");
//         setRole(storedRole);

//         if (!storedUser) return;
//         const parsedUser = JSON.parse(storedUser);
//         const userId = parsedUser?.id;

//         if (!userId) return;

//         // 2. Fetch Profile
//         const response = await authService.getUserProfile(userId);

//         // 3. FIX: Accessing response.attorney based on your console log
//         const attorneyData = response?.attorney || response?.data?.attorney;

//         if (attorneyData) {
//           setUserData(attorneyData);
//         }
//       } catch (error) {
//         console.error("Header Profile Load Error:", error);
//       }
//     };
//     fetchUserData();
//   }, []);

//   useEffect(() => {
//     const fetchLogo = async () => {
//       try {
//         const [typesRes, bannersRes] = await Promise.all([
//           authService.getAllLogoTypes(),
//           authService.getAllHomeBanners(),
//         ]);
//         const logoType = (typesRes?.data?.data || []).find(
//           (t) => t.type?.toLowerCase() === "logo",
//         );
//         if (logoType) {
//           const logo = (bannersRes?.data?.data || []).find(
//             (b) => String(b.typeId) === String(logoType.id),
//           );
//           if (logo) setLogoUrl(logo.image);
//         }
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchLogo();
//   }, []);

//   const handleLogout = () => {
//     localStorage.clear();
//     toast.success("Logout Successful!");
//     router.push("/login-signup");
//   };

//   return (
//     <Navbar
//       color="white"
//       light
//       expand="md"
//       className="shadow-sm bg-white m-lg-3 m-2 rounded-3 px-3 sticky-top border-0">
//       <div className="container-fluid d-flex align-items-center justify-content-between">
//         <div className="d-flex align-items-center">
//           <Button
//             color="light"
//             className="d-lg-none border-0 me-2 p-1 bg-transparent"
//             onClick={onToggleSidebar}>
//             <i className="bi bi-list fs-2 text-dark"></i>
//           </Button>

//           <Link href="/">
//             <a className="navbar-brand p-0">
//               <img
//                 src={
//                   logoUrl
//                     ? authService.getImgUrl(logoUrl)
//                     : "/assets/images/brand-logo.png"
//                 }
//                 alt="Logo"
//                 style={{ maxHeight: "45px", width: "auto" }}
//               />
//             </a>
//           </Link>
//         </div>

//         <Nav
//           className="ms-auto align-items-center flex-row gap-2 gap-md-3"
//           navbar>
//           <UncontrolledDropdown nav inNavbar>
//             <DropdownToggle
//               nav
//               className="d-flex align-items-center p-0 border-0 bg-transparent shadow-none">
//               {/* DISPLAY NAME: Davil Acosta */}
//               <div className="text-end me-2 d-none d-md-block">
//                 <p className="mb-0 fw-bold text-dark small text-capitalize">
//                   {userData
//                     ? `${userData.firstName} ${userData.lastName}`
//                     : "Loading..."}
//                 </p>
//                 <small
//                   className="text-muted text-uppercase fw-bold"
//                   style={{ fontSize: "10px", letterSpacing: "0.5px" }}>
//                   {role || "Attorney"}
//                 </small>
//               </div>

//               {/* DISPLAY IMAGE: Perfectly centered and rounded */}
//               <div className="position-relative">
//                 <img
//                   src={
//                     userData?.profileImage
//                       ? authService.getImgUrl(userData.profileImage)
//                       : fallbackImg
//                   }
//                   className="rounded-circle border border-2 border-warning shadow-sm"
//                   width="42"
//                   height="42"
//                   alt="profile"
//                   style={{
//                     objectFit: "cover",
//                     aspectRatio: "1/1",
//                     display: "block",
//                   }}
//                   onError={(e) => {
//                     e.target.onerror = null;
//                     e.target.src = fallbackImg;
//                   }}
//                 />
//               </div>
//             </DropdownToggle>

//             <DropdownMenu end className="shadow border-0 mt-2 rounded-3">
//               <Link href="/attorney-panel/" passHref legacyBehavior>
//                 <DropdownItem tag="a" className="py-2">
//                   <i className="bi bi-grid-fill me-2 text-warning"></i>{" "}
//                   Dashboard
//                 </DropdownItem>
//               </Link>
//               <DropdownItem divider />
//               <DropdownItem
//                 onClick={handleLogout}
//                 className="text-danger py-2 w-100 border-0 bg-transparent">
//                 <i className="bi bi-box-arrow-left me-2"></i> Logout
//               </DropdownItem>
//             </DropdownMenu>
//           </UncontrolledDropdown>
//         </Nav>
//       </div>
//     </Navbar>
//   );
// }
"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Navbar,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
} from "reactstrap";
import * as authService from "../../services/authService";
import { toast } from "react-toastify";

export default function AttorneyHeader({ onToggleSidebar }) {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [role, setRole] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);

  const fallbackImg =
    "https://ui-avatars.com/api/?name=User&background=cfab4a&color=fff";

  const syncUser = useCallback(async () => {
    const storedRole = localStorage.getItem("role");
    const storedUser = localStorage.getItem("user");
    setRole(storedRole || "Attorney");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);
        const response = await authService.getUserProfile(
          parsedUser?.id || parsedUser?._id,
        );
        const data =
          response?.attorney ||
          response?.data?.attorney ||
          response?.data ||
          response;
        if (data) {
          setUserData(data);
          localStorage.setItem(
            "user",
            JSON.stringify({ ...parsedUser, ...data }),
          );
        }
      } catch (error) {
        console.error(error);
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
        console.error(err);
      }
    };
    fetchLogo();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logout Successful!");
    router.push("/login-signup");
  };

  return (
    <Navbar
      color="white"
      light
      expand="md"
      className="shadow-sm bg-white m-lg-3 m-2 rounded-3 px-3 sticky-top border-0">
      <div className="container-fluid d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <Button
            color="light"
            className="d-lg-none border-0 me-2 p-1 bg-transparent"
            onClick={onToggleSidebar}>
            <i className="bi bi-list fs-2 text-dark"></i>
          </Button>
          <Link href="/">
            <a className="navbar-brand p-0">
              <img
                src={
                  logoUrl
                    ? authService.getImgUrl(logoUrl)
                    : ''
                }
                alt="Logo"
                style={{ maxHeight: "45px", width: "auto" }}
              />
            </a>
          </Link>
        </div>
        <Nav
          className="ms-auto align-items-center flex-row gap-2 gap-md-3"
          navbar>
          {/* Message Icon Added Here */}
          <Link href="/attorney-panel/messages">
            <a className="text-dark fs-4 pt-1 d-none d-md-block">
              <i className="bi bi-chat-dots"></i>
            </a>
          </Link>

          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle
              nav
              className="d-flex align-items-center p-0 border-0 bg-transparent shadow-none">
              <div className="text-end me-2 d-none d-md-block">
                <p className="mb-0 fw-bold text-dark small text-capitalize">
                  {userData
                    ? `${userData.firstName} ${userData.lastName}`
                    : "Loading..."}
                </p>
                <small
                  className="text-muted text-uppercase fw-bold"
                  style={{ fontSize: "10px" }}>
                  {role}
                </small>
              </div>
              <img
                src={
                  userData?.profileImage
                    ? authService.getImgUrl(userData.profileImage)
                    : fallbackImg
                }
                className="rounded-circle border border-2 border-warning shadow-sm"
                width="42"
                height="42"
                alt="profile"
                style={{ objectFit: "cover", aspectRatio: "1/1" }}
              />
            </DropdownToggle>
            <DropdownMenu end className="shadow border-0 mt-2 rounded-3">
              <Link href="/attorney-panel/" passHref legacyBehavior>
                <DropdownItem tag="a" className="py-2">
                  <i className="bi bi-grid-fill me-2 text-warning"></i>{" "}
                  Dashboard
                </DropdownItem>
              </Link>
              <DropdownItem divider />
              <DropdownItem
                onClick={handleLogout}
                className="text-danger py-2 w-100 border-0 bg-transparent">
                <i className="bi bi-box-arrow-left me-2"></i> Logout
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </div>
    </Navbar>
  );
}