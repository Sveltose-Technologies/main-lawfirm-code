import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AdminLayout({ children }) {
  const [showMobilemenu, setShowMobilemenu] = useState(false);

  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* Sidebar */}
      <aside
        className={`sidebar-container border-end bg-white shadow-sm transition-all ${showMobilemenu ? "mobile-show" : "mobile-hide"}`}>
        <Sidebar showMobilemenu={() => setShowMobilemenu(false)} />
      </aside>

      {/* Main Content */}
      <main className="flex-grow-1 d-flex flex-column min-vh-100 overflow-hidden">
        <Header showMobmenu={() => setShowMobilemenu(!showMobilemenu)} />
        <div className="p-3 p-lg-4 flex-grow-1 overflow-auto">
          {children} 
        </div>
      </main>

      {showMobilemenu && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-lg-none"
          style={{ background: "rgba(0,0,0,0.3)", zIndex: 1040 }}
          onClick={() => setShowMobilemenu(false)}></div>
      )}

      <style jsx global>{`
        .sidebar-container {
          width: 260px;
          min-width: 260px;
          height: 100vh;
          position: sticky;
          top: 0;
          z-index: 1050;
        }
        @media (max-width: 991px) {
          .sidebar-container {
            position: fixed;
            left: -260px;
            transition: 0.3s ease-in-out;
          }
          .mobile-show {
            left: 0;
          }
        }
      `}</style>
    </div>
  );
}
