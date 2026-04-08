//news/[slug].js

"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  getAllNews,
  getAllCapabilityCategories,
  getAllLocationCities,
  getAllAttorneys, // Added this
  getImgUrl,
} from "../../services/authService";

export default function NewsDetail() {
  const router = useRouter();
  const { slug } = router.query;

  const [newsItem, setNewsItem] = useState(null);
  const [socialLinks, setSocialLinks] = useState({});
  const [capabilities, setCapabilities] = useState([]);
  const [offices, setOffices] = useState([]);
  const [professionals, setProfessionals] = useState([]); // Dynamic Professionals
  const [relatedNews, setRelatedNews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Slug Creator matching attorney page logic
  const createSlug = (text) =>
    text
      ?.toLowerCase()
      .trim()
      .replace(/&/g, "and")
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-");

  const createNameSlug = (fname, lname) =>
    createSlug(`${fname} ${lname || ""}`);

  const cleanHTML = (html) => (html ? html.replace(/&nbsp;/g, " ") : "");

  useEffect(() => {
    async function fetchPageData() {
      if (!slug) return;
      setLoading(true);

      try {
        const [newsRes, catRes, cityRes, attRes] = await Promise.all([
          getAllNews(),
          getAllCapabilityCategories(),
          getAllLocationCities(),
          getAllAttorneys(), // Fetching Attorneys
        ]);

        const allNews = newsRes?.data || [];
        const matched = allNews.find((item) => createSlug(item.title) === slug);

        if (matched) {
          setNewsItem(matched);
          try {
            const parsedLinks = matched?.socialLinks
              ? JSON.parse(matched.socialLinks)
              : {};
            setSocialLinks(parsedLinks);
          } catch (error) {
            setSocialLinks({});
          }
          setRelatedNews(
            allNews.filter((n) => n.id !== matched.id).slice(0, 3),
          );
        }

        setCapabilities(catRes?.data || []);
        setOffices(cityRes?.data || cityRes || []);

        // Dynamic Professionals: Slicing first 5 for display in header
        const attorneyList = attRes?.attorneys || attRes?.data || [];
        setProfessionals(attorneyList.slice(0, 5));
      } catch (err) {
        console.error("Error fetching news detail data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPageData();
  }, [slug]);

  if (loading)
    return (
      <div className="p-5 text-center">
        <div className="spinner-border text-dark"></div>
      </div>
    );
  if (!newsItem)
    return (
      <div className="p-5 text-center">
        <h3>Article not found.</h3>
      </div>
    );

  return (
    <>
      <Head>
        <title>{newsItem.title} | Law Firm News</title>
      </Head>

      <div className="bg-white min-vh-100">
        {/* --- HEADER SECTION --- */}
        <div
          className="py-5"
          style={{ backgroundColor: "#2d2d2d", color: "#fff" }}>
          <div className="container">
            <div
              className="small text-uppercase mb-3 opacity-75 fw-bold"
              style={{ fontSize: "0.75rem", letterSpacing: "1px" }}>
              {new Date(newsItem.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}{" "}
              | MEDIA COVERAGE
            </div>
            <h1
              className="display-5 fw-bold mb-5 font-serif"
              style={{ lineHeight: "1.2" }}>
              {newsItem.title}
            </h1>

            <div className="row g-4 mt-2">
              {/* Dynamic Related Professionals */}
              <div className="col-lg-4">
                <span
                  className="text-uppercase fw-bold d-block mb-2"
                  style={{ fontSize: "0.65rem", color: "#999" }}>
                  Related Professionals
                </span>
                <div className="header-list-container">
                  {professionals.map((p, i) => (
                    <React.Fragment key={p.id}>
                      <Link
                        href={`/attorneys/${createNameSlug(p.firstName, p.lastName)}`}>
                        <a className="text-decoration-none list-link">
                          {p.firstName} {p.lastName}
                        </a>
                      </Link>
                      {i < professionals.length - 1 && (
                        <span className="mx-1 text-muted">|</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Dynamic Capabilities */}
              <div className="col-lg-4 border-start border-secondary border-opacity-25">
                <span
                  className="text-uppercase fw-bold d-block mb-2"
                  style={{ fontSize: "0.65rem", color: "#999" }}>
                  Capabilities
                </span>
                <div className="header-list-container">
                  {capabilities.slice(0, 3).map((c, i) => (
                    <React.Fragment key={c.id}>
                      <Link href={`/capability/${createSlug(c.categoryName)}`}>
                        <a className="text-decoration-none list-link">
                          {c.categoryName}
                        </a>
                      </Link>
                      {i < capabilities.slice(0, 3).length - 1 && (
                        <span className="mx-1 text-muted">|</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Dynamic Offices */}
              <div className="col-lg-4 border-start border-secondary border-opacity-25">
                <span
                  className="text-uppercase fw-bold d-block mb-2"
                  style={{ fontSize: "0.65rem", color: "#999" }}>
                  Offices
                </span>
                <div className="header-list-container">
                  {offices.slice(0, 3).map((o, i) => (
                    <React.Fragment key={o.id}>
                      <Link href={`/location/${createSlug(o.cityName)}`}>
                        <a className="text-decoration-none list-link">
                          {o.cityName}
                        </a>
                      </Link>
                      {i < offices.slice(0, 3).length - 1 && (
                        <span className="mx-1 text-muted">|</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- MAIN CONTENT --- */}
        <div className="container py-5 mt-4">
          <div className="row">
            <div className="col-lg-1 d-none d-lg-block">
              <div className="sticky-top" style={{ top: "120px" }}>
                <p
                  className="small fw-bold text-uppercase text-muted mb-3"
                  style={{ fontSize: "0.6rem" }}>
                  Share
                </p>
                <div
                  className="d-flex flex-column gap-4 fs-5"
                  style={{ color: "#0077b5" }}>
                  <i
                    className="bi bi-linkedin icon-hover"
                    onClick={() =>
                      window.open(socialLinks?.linkedin, "_blank")
                    }></i>
                  <i
                    className="bi bi-twitter-x icon-hover text-dark"
                    onClick={() =>
                      window.open(socialLinks?.twitter, "_blank")
                    }></i>
                  <i
                    className="bi bi-facebook icon-hover text-primary"
                    onClick={() =>
                      window.open(socialLinks?.facebook, "_blank")
                    }></i>
                  <i
                    className="bi bi-envelope icon-hover text-warning"
                    onClick={() =>
                      (window.location.href = `mailto:?subject=${newsItem.title}`)
                    }></i>
                  <i
                    className="bi bi-printer icon-hover text-secondary"
                    onClick={() => window.print()}></i>
                </div>
              </div>
            </div>

            <div className="col-lg-8 offset-lg-1">
              <div className="article-main-text">
                <div
                  className="content-render"
                  style={{
                    fontSize: "1.1rem",
                    lineHeight: "1.8",
                    color: "#333",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: cleanHTML(newsItem.textEditor || newsItem.content),
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- BOTTOM SECTION (INTERESTED IN) --- */}
        <div className="py-5" style={{ backgroundColor: "#1a1a1a" }}>
          <div className="container py-4">
            <h2 className="display-6 mb-5 font-serif fw-bold text-white">
              You May Also Be Interested In:
            </h2>
            <div className="row">
              {relatedNews.map((item) => (
                <div
                  key={item.id}
                  className="col-12 border-bottom border-secondary border-opacity-25 py-2">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span
                      className="small text-uppercase fw-bold text-white"
                      style={{ fontSize: "0.8rem", letterSpacing: "1px" }}>
                      {new Date(item.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}{" "}
                      | PRESS RELEASE
                    </span>
                  
                  </div>
                  <Link href={`/news/${createSlug(item.title)}`}>
                    <a className="text-decoration-none">
                      <h3
                        className="fw-bold font-serif item-title-hover display-6"
                        style={{ color: "#c5a059", cursor: "pointer" }}>
                        {item.title}
                      </h3>
                    </a>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap");
        .font-serif {
          font-family: "Playfair Display", serif;
        }
        .header-list-container {
          font-size: 0.9rem;
          color: #c5a059;
        }
        .list-link {
          color: #c5a059;
          transition: 0.3s;
        }
        .list-link:hover {
          color: #fff !important;
          text-decoration: underline !important;
        }
        .icon-hover {
          cursor: pointer;
          transition: 0.2s;
        }
        .icon-hover:hover {
          opacity: 0.7;
        }
        .item-title-hover:hover {
          color: #fff !important;
          text-decoration: none !important;
        }
        .content-render p {
          margin-bottom: 1.5rem;
        }
      `}</style>
    </>
  );
}