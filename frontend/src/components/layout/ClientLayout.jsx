// "use client";

// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import { useRouter } from "next/router";
// import ClientHeader from "./ClientHeader";
// import { getImgUrl, getClientById } from "../../services/authService";

// export default function ClientLayout({ children }) {
//   const router = useRouter();
//   const [isMounted, setIsMounted] = useState(false);
//   const [showSidebar, setShowSidebar] = useState(false);
//   const [loading, setLoading] = useState(true);

//   const [clientData, setClientData] = useState({ name: "User", image: "" });
//   const [isProfileDone, setIsProfileDone] = useState(false);
//   const [isFullyAccessible, setIsFullyAccessible] = useState(false);

//   const menuItems = [
//     { name: "Dashboard", icon: "bi-grid-fill", path: "/client-panel" },
//     {
//       name: "Find Attorney",
//       icon: "bi-person-badge-fill",
//       path: "/client-panel/attorneys",
//     },
//     { name: "My Cases", icon: "bi-clock-history", path: "/client-panel/cases" },
//     {
//       name: "Appointments",
//       icon: "bi-calendar-check",
//       path: "/client-panel/appointments",
//     },
//     {
//       name: "Documents",
//       icon: "bi-file-earmark-pdf-fill",
//       path: "/client-panel/document-management",
//     },
//     {
//       name: "Transactions",
//       icon: "bi-credit-card-fill",
//       path: "/client-panel/transaction-management",
//     },
//     {
//       name: "Messages",
//       icon: "bi-chat-dots-fill",
//       path: "/client-panel/messages",
//     },
//     {
//       name: "Edit Profile",
//       icon: "bi-person-bounding-box",
//       path: "/client-panel/edit-profile",
//     },
//   ];

//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   const syncData = async () => {
//     if (typeof window === "undefined") return;
//     const stored = localStorage.getItem("user");
//     if (!stored) {
//       router.push("/");
//       return;
//     }

//     try {
//       const localUser = JSON.parse(stored);
//       const userId = localUser.id || localUser._id;

//       // Using getClientById to ensure we get Client data, NOT Attorney data
//       const res = await getClientById(userId);
//       const user = res.client || res.data || res;

//       if (user) {
//         // 1. Status Check (Unlocks tabs)
//         const status = (user.status || "").toLowerCase().trim();
//         // const activeState = status === "active" || status === "verified";

//                 const activeState =  status === "verified";

//         // 2. Profile Completion Check (Based on your JSON fields)
//         const profileComplete = !!(user.mobile && user.city && user.country);

//         setIsProfileDone(profileComplete);
//         setIsFullyAccessible(activeState);

//         // 3. Name & Image Sync
//         const fullName =
//           `${user.firstName || ""} ${user.lastName || ""}`.trim();
//         let finalImg = `https://ui-avatars.com/api/?name=${fullName.replace(" ", "+")}&background=de9f57&color=fff`;
//         if (user.profileImage && user.profileImage !== "null") {
//           finalImg = getImgUrl(user.profileImage);
//         }

//         setClientData({ name: fullName || "User", image: finalImg });

//         // Update LocalStorage
//         localStorage.setItem(
//           "user",
//           JSON.stringify({
//             ...localUser,
//             ...user,
//             isProfileComplete: profileComplete,
//           }),
//         );

//         if (
//           !profileComplete &&
//           router.pathname !== "/client-panel/edit-profile"
//         ) {
//           router.push("/client-panel/edit-profile");
//         }
//       }
//     } catch (error) {
//       console.error("Layout Sync Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (isMounted) syncData();
//     window.addEventListener("profileUpdated", syncData);
//     return () => window.removeEventListener("profileUpdated", syncData);
//   }, [isMounted, router.asPath]);

//   if (!isMounted || loading) return null;

//   return (
//     <div className="bg-light min-vh-100">
//       <ClientHeader onToggleSidebar={() => setShowSidebar(!showSidebar)} />
//       <div className="container-fluid py-4">
//         <div className="row g-4">
//           <aside
//             className={`col-lg-3 ${showSidebar ? "d-block position-fixed start-0 top-0 vh-100 z-3 bg-white w-75 p-3 shadow" : "d-none d-lg-block"}`}>
//             <div
//               className="card border-0 shadow-sm rounded-4 sticky-top"
//               style={{ top: "90px" }}>
//              <div className="p-4 text-center border-bottom">
//   <img
//     src={clientData.image}

//     className="rounded-circle mb-2 border border-2 border-warning shadow-sm d-block mx-auto"
//     style={{ width: "80px", height: "80px", objectFit: "cover" }}
//     alt="profile"
//   />
//   <h6 className="fw-bold mb-0 text-truncate text-capitalize">
//     {clientData.name}
//   </h6>
//                 <div className="mt-3">
//                   {isFullyAccessible ? (
//                     <span className="badge bg-success-subtle text-success py-2 border border-success small w-100">
//                       ● Active Account
//                     </span>
//                   ) : (
//                     <span className="badge bg-danger-subtle text-danger py-2 border border-danger small w-100">
//                       ● Pending Approval
//                     </span>
//                   )}
//                 </div>
//               </div>
//               <div className="p-3">
//                 <nav className="nav flex-column gap-1">
//                   {menuItems.map((item, idx) => {
//                     // Logic: If profile is complete AND status is active, REMOVE LOCKS
//                     const isDisabled =
//                       (!isProfileDone &&
//                         item.path !== "/client-panel/edit-profile") ||
//                       (isProfileDone &&
//                         !isFullyAccessible &&
//                         item.path !== "/client-panel/edit-profile" &&
//                         item.path !== "/client-panel");

//                     return (
//                       <Link
//                         key={idx}
//                         href={isDisabled ? "#" : item.path}
//                         legacyBehavior>
//                         <a
//                           className={`nav-link rounded-3 py-2 px-3 d-flex align-items-center ${router.pathname === item.path ? "bg-light text-warning fw-bold shadow-sm" : "text-dark"} ${isDisabled ? "opacity-50" : ""}`}
//                           onClick={(e) => {
//                             if (isDisabled) {
//                               e.preventDefault();
//                               alert(
//                                 isProfileDone
//                                   ? "Waiting for Admin Approval"
//                                   : "Please update Profile",
//                               );
//                               return;
//                             }
//                             setShowSidebar(false);
//                           }}>
//                           <i
//                             className={`bi ${item.icon} me-3 fs-5 ${router.pathname === item.path ? "text-warning" : "text-muted"}`}></i>
//                           <span style={{ fontSize: "14px" }}>{item.name}</span>
//                           {isDisabled && (
//                             <i className="bi bi-lock-fill ms-auto text-danger small"></i>
//                           )}
//                         </a>
//                       </Link>
//                     );
//                   })}
//                 </nav>
//               </div>
//             </div>
//           </aside>
//           <main className="col-lg-9">{children}</main>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import ClientHeader from "./ClientHeader";
import { getImgUrl, getClientById } from "../../services/authService";

export default function ClientLayout({ children }) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [loading, setLoading] = useState(true);

  const [clientData, setClientData] = useState({ name: "User", image: "" });
  const [isProfileDone, setIsProfileDone] = useState(false);
  const [isFullyAccessible, setIsFullyAccessible] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: "bi-grid-fill", path: "/client-panel" },
    {
      name: "Find Attorney",
      icon: "bi-person-badge-fill",
      path: "/client-panel/attorneys",
    },
    { name: "My Cases", icon: "bi-clock-history", path: "/client-panel/cases" },
    {
      name: "Appointments",
      icon: "bi-calendar-check",
      path: "/client-panel/appointments",
    },
    {
      name: "Documents",
      icon: "bi-file-earmark-pdf-fill",
      path: "/client-panel/document-management",
    },
    {
      name: "Transactions",
      icon: "bi-credit-card-fill",
      path: "/client-panel/transaction-management",
    },
    {
      name: "Messages",
      icon: "bi-chat-dots-fill",
      path: "/client-panel/messages",
    },
    {
      name: "Edit Profile",
      icon: "bi-person-bounding-box",
      path: "/client-panel/edit-profile",
    },
  ];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const syncData = async () => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("user");
    if (!stored) {
      router.push("/");
      return;
    }

    try {
      const localUser = JSON.parse(stored);
      const userId = localUser.id || localUser._id;

      const res = await getClientById(userId);
      const user = res.client || res.data || res;

      if (user) {
        // 1. Verification Check
        const status = (user.status || "").toLowerCase().trim();
        const activeState = status === "verified";

        // 2. Profile Completion Check
        const profileComplete = !!(user.mobile && user.city && user.country);

        setIsProfileDone(profileComplete);
        setIsFullyAccessible(activeState);

        // 3. Name & Image Sync
        const fullName =
          `${user.firstName || ""} ${user.lastName || ""}`.trim();
        let finalImg = `https://ui-avatars.com/api/?name=${fullName.replace(" ", "+")}&background=de9f57&color=fff`;

        if (user.profileImage && user.profileImage !== "null") {
          finalImg = getImgUrl(user.profileImage);
        }

        setClientData({ name: fullName || "User", image: finalImg });

        // Update LocalStorage
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...localUser,
            ...user,
            isProfileComplete: profileComplete,
          }),
        );

        // If not verified, force user to stay on Edit Profile page
        if (!activeState && router.pathname !== "/client-panel/edit-profile") {
          router.push("/client-panel/edit-profile");
        }
      }
    } catch (error) {
      console.error("Layout Sync Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isMounted) syncData();
    window.addEventListener("profileUpdated", syncData);
    return () => window.removeEventListener("profileUpdated", syncData);
  }, [isMounted, router.asPath]);

  if (!isMounted || loading) return null;

  return (
    <div className="bg-light min-vh-100">
      <ClientHeader onToggleSidebar={() => setShowSidebar(!showSidebar)} />
      <div className="container-fluid py-4">
        <div className="row g-4">
          <aside
            className={`col-lg-3 ${showSidebar ? "d-block position-fixed start-0 top-0 vh-100 z-3 bg-white w-75 p-3 shadow" : "d-none d-lg-block"}`}>
            <div
              className="card border-0 shadow-sm rounded-4 sticky-top"
              style={{ top: "90px" }}>
              <div className="p-4 text-center border-bottom">
                <img
                  src={clientData.image}
                  className="rounded-circle mb-2 border border-2 border-warning shadow-sm d-block mx-auto"
                  style={{ width: "80px", height: "80px", objectFit: "cover" }}
                  alt="profile"
                />
                <h6 className="fw-bold mb-0 text-truncate text-capitalize">
                  {clientData.name}
                </h6>
                <div className="mt-3">
                  {isFullyAccessible ? (
                    <span className="badge bg-success-subtle text-success py-2 border border-success small w-100">
                      ● Active Account
                    </span>
                  ) : (
                    <span className="badge bg-danger-subtle text-danger py-2 border border-danger small w-100">
                      ● Pending Approval
                    </span>
                  )}
                </div>
              </div>
              <div className="p-3">
                <nav className="nav flex-column gap-1">
                  {menuItems.map((item, idx) => {
                    // Logic: Lock everything except Edit Profile if user is not verified
                    const isDisabled =
                      !isFullyAccessible &&
                      item.path !== "/client-panel/edit-profile";

                    return (
                      <Link
                        key={idx}
                        href={isDisabled ? "#" : item.path}
                        legacyBehavior>
                        <a
                          className={`nav-link rounded-3 py-2 px-3 d-flex align-items-center ${router.pathname === item.path ? "bg-light text-warning fw-bold shadow-sm" : "text-dark"} ${isDisabled ? "opacity-50" : ""}`}
                          onClick={(e) => {
                            if (isDisabled) {
                              e.preventDefault();
                              alert(
                                "Your account is pending approval. Please update your profile and wait for admin verification.",
                              );
                              return;
                            }
                            setShowSidebar(false);
                          }}>
                          <i
                            className={`bi ${item.icon} me-3 fs-5 ${router.pathname === item.path ? "text-warning" : "text-muted"}`}></i>
                          <span style={{ fontSize: "14px" }}>{item.name}</span>
                          {isDisabled && (
                            <i className="bi bi-lock-fill ms-auto text-danger small"></i>
                          )}
                        </a>
                      </Link>
                    );
                  })}
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