import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Nav, NavItem, Collapse, Button } from "reactstrap";

const COLOR = "#EEBB5D";

const navigation = [
  { title: "Dashboard", href: "/admin-panel", icon: "bi bi-speedometer2" },

  { header: "USER MANAGEMENT" },
  { title: "Clients", href: "/admin-panel/client", icon: "bi bi-people" },
  {
    title: "Attorney",
    href: "/admin-panel/attorney",
    icon: "bi bi-person-workspace",
  },
  { title: "Services", href: "/admin-panel/services", icon: "bi bi-gear" },
  {
    title: "Users",
    href: "/admin-panel/user-role",
    icon: "bi bi-person-circle",
  },
  { title: "Roles", href: "/admin-panel/roles", icon: "bi bi-ui-checks" },
  {
    title: "Role Permission",
    href: "/admin-panel/role-permission",
    icon: "bi bi-shield-lock",
  },
  { header: "CASE MANAGEMENT" },

  { title: "Our Cases", href: "/our-cases", icon: "bi bi-briefcase" },
  {
    title: "Case Category",
    href: "/admin-panel/case-category",
    icon: "bi bi-grid",
  },
  { title: "Case Type", href: "/case-type", icon: "bi bi-tags" },

  {
    title: "Case Documents",
    href: "/case-documents",
    icon: "bi bi-file-earmark-text",
  },
  {
    title: "Case Activity Logs",
    href: "/case-activity-logs",
    icon: "bi bi-clock-history",
  },
  { title: "Daily Hearing", href: "/daily-hearing", icon: "bi bi-hammer" },
  { title: "Courtroom Mapping", href: "/courtroom-mapping", icon: "bi bi-map" },
  { title: "Case Load", href: "/case-load", icon: "bi bi-bar-chart-steps" },
  { title: "Case Study", href: "/case-study", icon: "bi bi-journal-text" },
  { header: "TASK & SCHEDULE" },
  { title: "Assign Task", href: "/assign-task", icon: "bi bi-list-task" },
  { title: "Task Calendar", href: "/task-calendar", icon: "bi bi-calendar3" },
  { title: "Timesheet", href: "/timesheet", icon: "bi bi-stopwatch" },
  {
    title: "Lawyer Availability",
    href: "/lawyer-availability",
    icon: "bi bi-calendar-check",
  },
  { header: "FINANCE & PAYMENT" },
  { title: "Case Bill", href: "/case-bill", icon: "bi bi-receipt" },
  { title: "Expenses", href: "/expenses", icon: "bi bi-cash-coin" },
  {
    title: "Transactions",
    href: "/transactions",
    icon: "bi bi-currency-exchange",
  },
  { title: "Platform Fees", href: "/platform-fees", icon: "bi bi-wallet2" },
  {
    title: "Payment Report",
    href: "/payment-report",
    icon: "bi bi-file-earmark-bar-graph",
  },
  { header: "CONTENT & CMS" },
  { title: "Media", href: "/media", icon: "bi bi-images" },
  {
    title: "Communications",
    href: "/client-communication",
    icon: "bi bi-chat-dots",
  },
  { title: "Review & Rating", href: "/review-rating", icon: "bi bi-stars" },
  { header: "OTHER" },

  { title: "Newsletter", href: "/newsletter", icon: "bi bi-envelope-paper" },
  { title: "Testimonial", href: "/testimonial", icon: "bi bi-chat-quote" },
  { title: "Contact Leads", href: "/contact", icon: "bi bi-person-lines-fill" },
  {
    title: "Messages",
    href: "/admin-panel/messages",
    icon: "bi bi-chat-left-dots",
  },
  { header: "SETTINGS" },
  {
    title: "General Settings",
    href: "/settings",
    icon: "bi bi-wrench-adjustable",
  },
  { title: "Languages", href: "/languages", icon: "bi bi-translate" },
  { title: "Email Config", href: "/email-settings", icon: "bi bi-envelope-at" },
  { title: "FAQ", href: "/faq", icon: "bi bi-question-circle" },
  {
    title: "Page Settings",
    icon: "bi bi-file-earmark-code",

    children: [
      {
        title: "Home",
        href: "/admin-panel/home",
        icon: "bi bi-question-circle",
      },

      {
        title: "About Us",
        icon: "bi bi-info-circle",
        children: [
          {
            title: "Our Firm",
            href: "/admin-panel/ourfirm",
            icon: "bi bi-building",
          },
          { title: "Award", href: "/admin-panel/award", icon: "bi bi-trophy" },
          {
            title: "Promoter",
            href: "/admin-panel/promoter",
            icon: "bi bi-person-badge",
          },
        ],
      },
      {
        title: "Professionals",
        href: "/admin-panel/professionals",
        icon: "bi bi-person-badge",
      },
      {
        title: "Capabilities",
        icon: "bi bi-layers",
        children: [
          {
            title: "Capabilities",
            href: "/admin-panel/capabilities",
            icon: "bi bi-list-check",
          },
          {
            title: "Capabilities Category",
            href: "/admin-panel/capabilities-category",
            icon: "bi bi-list-check",
          },
          {
            title: "Capabilities Subcategory",
            href: "/admin-panel/capabilities-subcategory",
            icon: "bi bi-list-nested",
          },
          {
            title: "CMS Category",
            href: "/admin-panel/cms-category",
            icon: "bi bi-clock-history",
          },
          {
            title: "CMS SubCategory",
            href: "/admin-panel/cms-subcategory",
            icon: "bi bi-clock-history",
          },
        ],
      },
      { title: "News", href: "/admin-panel/news", icon: "bi bi-newspaper" },
      {
        title: "Event",
        href: "/admin-panel/event",
        icon: "bi bi-calendar-event",
      },
      { title: "Career", href: "/admin-panel/career", icon: "bi bi-briefcase" },
      {
        title: "Term & Condition",
        href: "/admin-panel/terms-condition",
        icon: "bi bi-file-lock2",
      },
      {
        title: "Privacy Policy",
        href: "/admin-panel/privacy-policy",
        icon: "bi bi-shield-check",
      },
      {
        title: "Location",
        href: "/admin-panel/location",
        icon: "bi bi-window-sidebar",
      },
      {
        title: "Location cms",
        href: "/admin-panel/cms-location",
        icon: "bi bi-window-sidebar",
      },
      {
        title: "Contact Us",
        href: "/admin-panel/contact",
        icon: "bi bi-window-sidebar",
      },

      {
        title: "SocialMedia",
        href: "/admin-panel/socialmedia",
        icon: "bi bi-window-sidebar",
      },
    ],
  },
  { title: "Log Report", href: "/login", icon: "bi bi-journal-code" },
];

export default function Sidebar({ showMobilemenu }) {
  const router = useRouter();
  const pathname = router.pathname;
  const [collapseState, setCollapseState] = useState({});

  const toggleCollapse = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    setCollapseState((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleLinkClick = () => {
    if (typeof window !== "undefined" && window.innerWidth < 992) {
      showMobilemenu();
    }
  };

  const renderMenuItems = (items, isChild = false, parentIndex = "") => {
    if (!Array.isArray(items)) return null;

    return items.map((item, index) => {
      const currentIndex = `${parentIndex}-${index}`;
      const isActive = pathname === item.href;

      if (item.header) {
        return (
          <div
            key={currentIndex}
            className="text-uppercase text-muted fw-bold mt-4 mb-2 px-3 small"
            style={{ letterSpacing: "1px" }}>
            {item.header}
          </div>
        );
      }

      if (item.children) {
        const isOpen = collapseState[currentIndex];
        return (
          <NavItem key={currentIndex} className="mb-1">
            <div className="d-flex align-items-center justify-content-between rounded">
              <Link href={item.href || "#"}>
                <a
                  onClick={
                    item.href
                      ? handleLinkClick
                      : (e) => toggleCollapse(e, currentIndex)
                  }
                  className={`d-flex align-items-center px-3 py-2 text-decoration-none flex-grow-1 ${isActive ? "bg-warning text-white shadow-sm" : "text-dark"}`}
                  style={{
                    borderRadius: "8px",
                    fontSize: isChild ? "13px" : "14px",
                    fontWeight: "500",
                  }}>
                  <i
                    className={`${item.icon} me-3 ${isActive ? "text-white" : "text-warning"}`}></i>
                  <span>{item.title}</span>
                </a>
              </Link>
              <div
                onClick={(e) => toggleCollapse(e, currentIndex)}
                className="px-3 py-2 cursor-pointer">
                <i
                  className={`bi bi-chevron-${isOpen ? "up" : "down"} small text-muted`}></i>
              </div>
            </div>
            <Collapse isOpen={isOpen}>
              <Nav vertical className="ms-3 mt-1 border-start ps-2">
                {renderMenuItems(item.children, true, currentIndex)}
              </Nav>
            </Collapse>
          </NavItem>
        );
      }

      return (
        <NavItem key={currentIndex} className="mb-1">
          <Link href={item.href || "#"}>
            <a
              onClick={handleLinkClick}
              className={`d-flex align-items-center px-3 py-2 text-decoration-none ${isActive ? "bg-warning text-white shadow-sm rounded" : "text-dark"}`}
              style={{
                fontSize: isChild ? "13px" : "14px",
                fontWeight: "500",
                borderRadius: "8px",
              }}>
              <i
                className={`${item.icon} me-3 ${isActive ? "text-white" : "text-warning"}`}></i>
              {item.title}
            </a>
          </Link>
        </NavItem>
      );
    });
  };

  return (
    <div className="bg-white h-100 d-flex flex-column border-end shadow-sm overflow-auto">
      <div className="d-flex align-items-center justify-content-between p-4 bg-white sticky-top ">
    
      </div>

      <div className="flex-grow-1 px-3 pt-3">
        <Nav vertical>{renderMenuItems(navigation)}</Nav>
        <div style={{ height: "40px" }}></div>
      </div>
    </div>
  );
}
