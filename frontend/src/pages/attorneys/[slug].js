

"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import {
  getAllAttorneys,
  getImgUrl,
  getAllNews,
  getAllEvents,
  getAllCapabilityCategories,
} from "../../services/authService";

export default function AttorneyProfilePage() {
  const router = useRouter();
  const { slug } = router.query;
  const profileRef = useRef();

  const [attorney, setAttorney] = useState(null);
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState("News");
  const [showShare, setShowShare] = useState(false);

  // Accordion logic: Closed by default on screen
  const [expOpen, setExpOpen] = useState(false);
  const [recOpen, setRecOpen] = useState(false);

  const gtGold = "#c5a059";

const createSlug = (text) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .trim()
    .replace(/&/g, "and") 
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

  const createNameSlug = (f, l) => createSlug(`${f} ${l || ""}`);

useEffect(() => {
  if (!slug) return;
  const loadData = async () => {
    setLoading(true);
    try {
      const [attRes, newsRes, eventRes, catRes] = await Promise.all([
        getAllAttorneys(),
        getAllNews(),
        getAllEvents(),
        getAllCapabilityCategories(),
      ]);

      const list = attRes?.attorneys || attRes?.data || [];
      const found = list.find(
        (attr) => createNameSlug(attr.firstName, attr.lastName) === slug,
      );

      if (found) {
        setAttorney(found);

        // Helper function to parse IDs (since backend might send JSON string or Array)
        const parseIds = (val) => {
          try {
            if (!val) return [];
            return (typeof val === "string" ? JSON.parse(val) : val).map(
              String,
            );
          } catch (e) {
            return [];
          }
        };

        // Filter News that include this attorney's ID
        const filteredNews = (newsRes?.data || []).filter((item) =>
          parseIds(item.attorneyId).includes(String(found.id)),
        );
        setNews(filteredNews);

        // Filter Events that include this attorney's ID
        const filteredEvents = (eventRes?.data || []).filter((item) =>
          parseIds(item.attorneyIds).includes(String(found.id)),
        );
        setEvents(filteredEvents);
      }

      setCategories(catRes?.data || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };
  loadData();
}, [slug]);
  const handleDownloadPDF = async () => {
    const html2pdf = (await import("html2pdf.js")).default;
    const element = profileRef.current;
    element.classList.add("pdf-capture-mode");

    const opt = {
      margin: [0, 0, 0, 0],
      filename: `${attorney?.lastName}_Profile.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    try {
      await html2pdf().from(element).set(opt).save();
    } finally {
      element.classList.remove("pdf-capture-mode");
    }
  };

  if (loading)
    return (
      <div className="vh-100 d-flex align-items-center justify-content-center">
        Loading...
      </div>
    );
  if (!attorney)
    return <div className="text-center py-5">Attorney not found.</div>;

  const currentList = activeTab === "News" ? news : events;
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const attorneyCategory = categories.find(
    (c) => String(c.id) === String(attorney.categoryId),
  );

  return (
    <main className="bg-white" style={{ paddingTop: "20px" }}>
      <div ref={profileRef} className="profile-container-main">
        <Head>
          <title>
            {attorney.firstName} {attorney.lastName} | Profile
          </title>
        </Head>

        {/* --- HERO SECTION --- */}
        <section
          className="hero-section pt-5"
          style={{ backgroundColor: "#1a1a1a" }}>
          <div className="container-fluid p-0">
            <div className="row g-0 align-items-stretch flex-nowrap-print">
              {/* Left Side: Image */}
              {/* --- HERO SECTION --- */}
              <section
                className="hero-section"
                style={{ backgroundColor: "#1a1a1a", overflow: "hidden" }}>
                <div className="container" style={{ maxWidth: "1000px" }}>
                  {" "}
                  {/* Centering the whole block */}
                  <div className="row g-0 align-items-center flex-nowrap-print">
                    {/* Left Side: Image (Content ke paas lane ke liye padding-end add ki hai) */}
                    <div className="col-4 col-md-5 d-flex justify-content-center print-col-img">
                      <img
                        src={
                          attorney.profileImage
                            ? getImgUrl(attorney.profileImage)
                            : "/assets/images/profile.png"
                        }
                        alt={attorney.firstName}
                        className="img-fluid profile-img"
                        style={{
                          width: "100%",
                          maxWidth: "380px",
                          height: "auto",
                          objectFit: "contain",
                          display: "block",
                          marginBottom: "-1px",
                        }}
                        onError={(e) => {
                          e.target.src = "/assets/images/profilepic.png";
                        }}
                      />
                    </div>

                    {/* Right Side: Content */}
                    <div className="col-7 py-5 ps-3 d-flex flex-column justify-content-center text-white info-box">
                      <h1
                        className="display-3 serif-font mb-3 fw-normal name-title"
                        style={{ lineHeight: "1.1" }}>
                        {attorney.firstName} {attorney.lastName}
                      </h1>
                      <div className="d-flex align-items-center mb-3">
                        <div
                          className="no-print"
                          style={{
                            width: "40px",
                            height: "1px",
                            backgroundColor: gtGold,
                            marginRight: "15px",
                          }}></div>
                        <span
                          className="text-uppercase small fw-bold role-subtitle"
                          style={{ letterSpacing: "2px", color: "#ccc" }}>
                          {attorney.servicesOffered || "SHAREHOLDER"}
                        </span>
                      </div>
                      <a
                        href={`mailto:${attorney.email}`}
                        className="d-block mb-3 h4 fw-light text-decoration-none serif-font email-link"
                        style={{ color: gtGold }}>
                        {attorney.email}
                      </a>
                      <div className="contact-info">
                        <p className="mb-0 opacity-75 fs-5">
                          D {attorney.phoneOffice || "+1 312.476.5125"}
                        </p>
                        <p className="mb-0 opacity-75 fs-5">
                          T {attorney.phoneCell || "+1 678.553.2232"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </section>

        {/* --- BODY CONTENT --- */}
        <div
          className="container py-4 content-body"
          style={{ maxWidth: "850px" }}>
          <div
            className="mb-4 profile-bio text-secondary lh-lg fs-"
            dangerouslySetInnerHTML={{ __html: attorney.aboutus }}
          />

          {/* CAPABILITIES */}
          <div className="border-top pt-3 mb-3 pdf-avoid-break">
            <h3 className="serif-font mb-2">Capabilities</h3>
            <Link
              href={`/capability/${createSlug(attorneyCategory?.categoryName)}`}>
              <a className="text-dark text-decoration-underline fw-bold">
                {attorneyCategory?.categoryName || "Corporate"}
              </a>
            </Link>
          </div>

          {/* EXPERIENCE */}
          <div className="border-top pt-3 mb-3 pdf-avoid-break">
            <h3 className="serif-font mb-2">Experience</h3>
            <div
              className="d-flex justify-content-between align-items-center border-bottom pb-1 cursor-pointer no-print"
              onClick={() => setExpOpen(!expOpen)}>
              <span className="fw-bold fs-5" style={{ color: gtGold }}>
                Professional Experience
              </span>
              <span className="fw-bold fs-4" style={{ color: gtGold }}>
                {expOpen ? "−" : "+"}
              </span>
            </div>
            <div
              className={`accordion-content py-2 text-secondary fs-5 ${expOpen ? "d-block" : "d-none d-print-block"}`}>
              <ul className="ms-3 mb-0">
                {Array.isArray(attorney.experience)
                  ? attorney.experience.map((item, idx) => (
                      <li key={idx} className="mb-2">
                        {typeof item === "string"
                          ? item.trim()
                          : JSON.stringify(item)}
                      </li>
                    ))
                  : (attorney.experience || "")
                      .toString()
                      .split("°")
                      .filter((i) => i && i.trim())
                      .map((item, idx) => (
                        <li key={idx} className="mb-2">
                          {item.trim()}
                        </li>
                      ))}
              </ul>
            </div>
          </div>

          {/* RECOGNITION */}
          <div className="border-top pt-3 mb-3 pdf-avoid-break">
            <h3 className="serif-font mb-2">Recognition & Leadership</h3>
            <div
              className="d-flex justify-content-between align-items-center border-bottom pb-1 cursor-pointer no-print"
              onClick={() => setRecOpen(!recOpen)}>
              <span className="fw-bold fs-5" style={{ color: gtGold }}>
                Professional & Community Involvement
              </span>
              <span className="fw-bold fs-4" style={{ color: gtGold }}>
                {recOpen ? "−" : "+"}
              </span>
            </div>
            <div
              className={`accordion-content py-2 text-secondary fs-5 ${recOpen ? "d-block" : "d-none d-print-block"}`}>
              <ul className="list-unstyled ms-3 mb-0">
                <li className="mb-1">• American Bar Association</li>
                <li className="mb-1">• Notre Dame Alumni Association</li>
              </ul>
            </div>
          </div>

          {/* CREDENTIALS */}
          <div className="border-top pt-3 mb-4 pdf-avoid-break">
            <h3 className="serif-font mb-3">Credentials</h3>
            <div className="row g-4">
              <div className="col-6">
                <h6 className="text-uppercase fw-bold text-muted mb-2 small">
                  Education
                </h6>
                <div
                  className="small text-secondary"
                  dangerouslySetInnerHTML={{ __html: attorney.education }}
                />
              </div>
              <div className="col-6">
                <h6 className="text-uppercase fw-bold text-muted mb-2 small">
                  Admissions
                </h6>
                <div
                  className="small text-secondary"
                  dangerouslySetInnerHTML={{ __html: attorney.admission }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- NEWS SECTION --- */}
        <section
          className="py-5 news-events-section"
          style={{ backgroundColor: "#1a1a1a" }}>
          <div className="container" style={{ maxWidth: "850px" }}>
            <h3
              className="serif-font text-white mb-4"
              style={{ fontSize: "2.8rem" }}>
              News & Events
            </h3>
            <div className="mb-4 d-flex gap-4 border-bottom border-secondary news-tabs no-print">
              <span
                className={`cursor-pointer pb-2 fw-bold text-white ${activeTab === "News" ? "border-bottom border-white" : "opacity-50"}`}
                onClick={() => setActiveTab("News")}>
                News
              </span>
              <span
                className={`cursor-pointer pb-2 fw-bold text-white ${activeTab === "Events" ? "border-bottom border-white" : "opacity-50"}`}
                onClick={() => setActiveTab("Events")}>
                Events
              </span>
            </div>
            <div className="list-group list-group-flush bg-transparent">
              {currentList.slice(0, 3).map((item, idx) => (
                <div
                  key={idx}
                  className="bg-transparent border-bottom border-secondary py-3 news-item">
                  <div className="small text-uppercase opacity-50 mb-1 text-muted">
                    {new Date(
                      item.createdAt || item.startDate,
                    ).toLocaleDateString()}{" "}
                    | {activeTab.toUpperCase()}
                  </div>
                  <Link
                    href={`/${activeTab.toLowerCase()}/${createSlug(item.title)}`}>
                    <a
                      className="h4 text-decoration-none d-block serif-font"
                      style={{ color: gtGold }}>
                      {item.title}
                    </a>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <style jsx global>{`
        .serif-font {
          font-family: "Georgia", serif;
        }
        .cursor-pointer {
          cursor: pointer;
        }
        .pdf-avoid-break {
          page-break-inside: avoid !important;
        }

        /* PRINT & PDF SETTINGS */
        @media print, .pdf-capture-mode {
          /* 1. Hide unwanted elements */
          header,
          footer,
          nav,
          .navbar,
          .no-print {
            display: none !important;
          }

          /* 2. Reset backgrounds to white */
          body,
          main,
          .profile-container-main,
          .hero-section,
          .news-events-section {
            background: white !important;
            color: black !important;
            padding: 0 !important;
            margin: 0 !important;
          }

          /* 3. Layout: Image Left, Content Right */
          .flex-nowrap-print {
            display: flex !important;
            flex-wrap: nowrap !important;
          }
          .col-5 {
            width: 35% !important;
            flex: 0 0 35% !important;
          }
          .col-7 {
            width: 65% !important;
            flex: 0 0 65% !important;
            padding-left: 30px !important;
          }

          /* 4. Text color for Print */
          .text-white,
          .name-title,
          .role-subtitle,
          .contact-info,
          h3,
          .serif-font,
          .text-secondary {
            color: black !important;
          }
          .email-link {
            color: black !important;
            text-decoration: underline !important;
          }

          /* 5. Tighten Gaps */
          .py-5,
          .py-4 {
            padding-top: 10px !important;
            padding-bottom: 10px !important;
          }
          .mb-4,
          .mb-5 {
            margin-bottom: 10px !important;
          }
          .mt-5 {
            margin-top: 10px !important;
          }
          .border-top {
            border-color: #eee !important;
            padding-top: 10px !important;
            margin-top: 10px !important;
          }
          .news-item {
            padding-top: 5px !important;
            padding-bottom: 5px !important;
            border-color: #eee !important;
          }

          /* 6. Accordions always open in PDF */
          .accordion-content {
            display: block !important;
          }

          /* 7. Image sizing */
          img {
            max-height: 320px !important;
            width: 100% !important;
            object-fit: cover !important;
          }
        }
      `}</style>
    </main>
  );
}