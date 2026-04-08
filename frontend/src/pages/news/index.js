"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  getAllNews,
  getAllLocationCities,
  getImgUrl,
  getAllCapabilityCategories,
} from "../../services/authService";

function NewsIndex() {
  const router = useRouter();
  const [newsList, setNewsList] = useState([]);
  const [capabilities, setCapabilities] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [visibleCount, setVisibleCount] = useState(3);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilterTab, setActiveFilterTab] = useState(null);

  const [filters, setFilters] = useState({
    capability: "",
    location: "",
    date: "",
  });

  const getNewsImg = (path) => {
    if (!path)
      return "https://via.placeholder.com/1200x600?text=Core+Law+Updates";

    // Using the robust getImgUrl method to handle any path format
    return getImgUrl(path);
  };

  const createSlug = (text) => {
    return text
      ?.toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-");
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [newsRes, capRes, locRes] = await Promise.all([
          getAllNews(),
          getAllCapabilityCategories(),
          getAllLocationCities(),
        ]);

        const newsData = newsRes?.data || newsRes || [];
        setNewsList(Array.isArray(newsData) ? newsData : []);

        if (capRes?.success) setCapabilities(capRes.data || []);
        if (locRes?.success) setLocations(locRes.data || []);
      } catch (error) {
        console.error("Error fetching news index data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const safeParseIds = (value) => {
    try {
      if (!value) return [];
      if (Array.isArray(value)) return value.map(Number);
      if (typeof value === "string" && value.includes("["))
        return JSON.parse(value).map(Number);
      return [Number(value)];
    } catch {
      return [];
    }
  };

  const filteredNews = newsList.filter((item) => {
    const titleMatch = (item.title || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const capIds = safeParseIds(item.capabilityCategoryId);
    const locIds = safeParseIds(item.cityId);

    const matchesCap = filters.capability
      ? capIds.includes(Number(filters.capability))
      : true;

    const matchesLoc = filters.location
      ? locIds.includes(Number(filters.location))
      : true;

    let itemDate = "";
    if (item.date) {
      const d = new Date(item.date);
      itemDate = d.toISOString().split("T")[0];
    }

    const matchesDate = filters.date ? itemDate === filters.date : true;

    return titleMatch && matchesCap && matchesLoc && matchesDate;
  });

  const displayedNews = filteredNews.slice(0, visibleCount);

  const handleViewMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  const bannerImg =
    newsList.length > 0
      ? getNewsImg(newsList[0].bannerImage || newsList[0].newsImage)
      : null;

  return (
    <div style={{ backgroundColor: "#212121", minHeight: "100vh" }}>
      <Head>
        <title>News | Core Law</title>
      </Head>

      <section
        className="universal-banner d-flex align-items-center justify-content-center text-center position-relative"
        style={{
          height: "450px",
          marginTop: "-80px",
          backgroundImage: bannerImg ? `url("${bannerImg}")` : "none",
          backgroundColor: bannerImg ? "transparent" : "#ffffff",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}>
        <div
          className="banner-content container pt-5 mt-5"
          style={{ zIndex: 1 }}>
          <h1 className="display-3 fw-bold mb-3 font-serif text-white">News</h1>
          <p className="lead text-white opacity-75 mb-4">
            Insights & Updates from Core Law
          </p>

          {/* Added Media Contacts Button */}
          <Link href="/media-contacts">
            <a
              className="btn text-uppercase fw-bold px-4 py-3"
              style={{
                backgroundColor: "white",
                color: "black",
                borderRadius: "0",
                fontSize: "0.85rem",
                letterSpacing: "1px",
                border: "none",
                transition: "0.3s",
              }}>
              Media Contacts
            </a>
          </Link>
        </div>
      </section>

      <section
        className="py-4 shadow-sm"
        style={{
          backgroundColor: "#1a1a1a",
          borderTop: "4px solid #c5a059",
        }}>
        <div className="container">
          <div className="row align-items-center g-3">
            <div className="col-lg-4">
              <div className="input-group border-bottom border-secondary text-white">
                <input
                  type="text"
                  placeholder="Search news..."
                  className="form-control bg-transparent border-0 text-white shadow-none placeholder-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="input-group-text bg-transparent border-0 text-white">
                  <i className="bi bi-search"></i>
                </span>
              </div>
            </div>

            <div className="col-lg-8 text-white text-lg-end">
              {["capability", "location", "date"].map((tab) => (
                <button
                  key={tab}
                  onClick={() =>
                    setActiveFilterTab(activeFilterTab === tab ? null : tab)
                  }
                  className={`btn btn-link text-decoration-none text-uppercase fw-bold px-3 ${
                    activeFilterTab === tab ? "text-gold" : "text-white"
                  }`}
                  style={{
                    fontSize: "0.85rem",
                    letterSpacing: "1px",
                    color: activeFilterTab === tab ? "#c5a059" : "white",
                  }}>
                  {tab}{" "}
                  <i
                    className={`bi bi-chevron-${activeFilterTab === tab ? "up" : "down"} ms-1`}></i>
                </button>
              ))}
            </div>
          </div>

          {activeFilterTab && (
            <div className="row mt-3 animate-fade-in">
              <div className="col-12">
                {activeFilterTab === "capability" && (
                  <select
                    className="form-select rounded-0"
                    value={filters.capability}
                    onChange={(e) => {
                      setFilters({ ...filters, capability: e.target.value });
                      setActiveFilterTab(null);
                    }}>
                    <option value="">All Capabilities</option>
                    {capabilities.map((cap) => (
                      <option key={cap.id} value={cap.id}>
                        {cap.categoryName || cap.subcategoryName}
                      </option>
                    ))}
                  </select>
                )}

                {activeFilterTab === "location" && (
                  <select
                    className="form-select rounded-0"
                    value={filters.location}
                    onChange={(e) => {
                      setFilters({ ...filters, location: e.target.value });
                      setActiveFilterTab(null);
                    }}>
                    <option value="">All Locations</option>
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.cityName}
                      </option>
                    ))}
                  </select>
                )}

                {activeFilterTab === "date" && (
                  <input
                    type="date"
                    className="form-control rounded-0"
                    value={filters.date}
                    onChange={(e) => {
                      setFilters({ ...filters, date: e.target.value });
                      setActiveFilterTab(null);
                    }}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="py-5">
        <div className="container py-4">
          <h2
            className="font-serif text-white mb-5"
            style={{ fontSize: "2.5rem" }}>
            Recent News
          </h2>

          {loading ? (
            <div className="text-center py-5">
              <div
                className="spinner-border"
                style={{ color: "#c5a059" }}></div>
            </div>
          ) : displayedNews.length > 0 ? (
            <div className="news-stack">
              {displayedNews.map((item) => (
                <div
                  key={item.id}
                  className="py-4"
                  style={{
                    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                  }}>
                  <div className="d-flex gap-2 align-items-center mb-1">
                    <span
                      className="text-white fw-bold"
                      style={{ fontSize: "0.75rem" }}>
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                    <span
                      className="text-white fw-bold text-uppercase"
                      style={{ fontSize: "0.75rem" }}>
                      Press Release
                    </span>
                  </div>

                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                    <Link href={`/news/${createSlug(item.title)}`}>
                      <a className="text-decoration-none flex-grow-1">
                        <h4
                          className="font-serif m-0"
                          style={{ color: "#c5a059" }}>
                          {item.title}
                        </h4>
                        {item.subtitle && (
                          <p className="text-muted mt-1 fst-italic">
                            {item.subtitle}
                          </p>
                        )}
                      </a>
                    </Link>
                  </div>
                </div>
              ))}

              {visibleCount < filteredNews.length && (
                <div className="text-center mt-5">
                  <button
                    onClick={handleViewMore}
                    className="btn btn-link text-decoration-none fw-bold text-uppercase p-0"
                    style={{ color: "#c5a059" }}>
                    View More +
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-5 text-white">
              <h3>No articles match your search.</h3>
            </div>
          )}
        </div>
      </section>

      <style jsx>{`
        .placeholder-white::placeholder {
          color: white;
          opacity: 1;
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-in;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        h4:hover {
          color: white !important;
        }
        .banner-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
}

export default NewsIndex;
