"use client";
import React, { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import * as authService from "../../services/authService";

function LocationDetail() {
  const router = useRouter();
  const { slug } = router.query;

  const [city, setCity] = useState(null);
  const [cms, setCms] = useState(null);
  const [filteredNews, setFilteredNews] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("News");
  const [loading, setLoading] = useState(true);

  const createItemSlug = (text) =>
    text
      ?.toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-");

  const fetchData = useCallback(async () => {
    if (!slug) return;
    try {
      setLoading(true);
      const [cityRes, cmsRes, newsRes, eventRes] = await Promise.all([
        authService.getAllLocationCities(),
        authService.getAllLocationCMS(),
        authService.getAllNews(),
        authService.getAllEvents(),
      ]);

      const allCities = cityRes?.data || cityRes || [];
      const foundCity = allCities.find((c) => createItemSlug(c.cityName) === slug);

      if (foundCity) {
        setCity(foundCity);
        const currentCityId = Number(foundCity.id);

        const parseToNumbers = (data) => {
          if (!data) return [];
          try {
            const arr = typeof data === "string" ? JSON.parse(data) : data;
            return Array.isArray(arr) ? arr.map(Number) : [Number(arr)];
          } catch (e) { return [Number(data)]; }
        };

        const rawCms = cmsRes?.data || cmsRes;
        const foundCMS = (Array.isArray(rawCms) ? rawCms : []).find(
          (c) => Number(c.cityId) === currentCityId
        );
        setCms(foundCMS);

        setFilteredNews((newsRes?.data || newsRes || []).filter(n => parseToNumbers(n.cityId).includes(currentCityId)));
        setFilteredEvents((eventRes?.data || eventRes || []).filter(e => parseToNumbers(e.cityIds || e.cityId).includes(currentCityId)));
      }
    } catch (error) {
      console.error("Error fetching details:", error);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading || !city) return <div className="text-center py-5">Loading Office Details...</div>;

  const displayData = activeTab === "News" ? filteredNews : filteredEvents;

  return (
    <>
      <Head>
        <title>{city.cityName} Office | Global Reach</title>
      </Head>

      {/* --- IMPROVED HERO SECTION --- */}
      <div
        className="hero-section"
        style={{
          backgroundImage: `url(${authService.getImgUrl(city.image)})`,
        }}>
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h1 className="hero-title text-white">{city.cityName}</h1>
              <div className="hero-info text-white">
                <p className="lead fw-bold mb-2">Our Office Location</p>
                <p
                  className="address-text mb-3"
                  style={{ whiteSpace: "pre-line" }}>
                  {city.address}
                </p>
                <div className="d-flex justify-content-center gap-4 mb-4 contact-links">
                  <span>
                    <strong>Phone:</strong> {city.phoneNo}
                  </span>
                  {city.faxNo && (
                    <span>
                      <strong>Fax:</strong> {city.faxNo}
                    </span>
                  )}
                </div>
              </div>
              <Link
                href="/attorneys"
                className="btn btn-light btn-lg rounded-0 px-5 fw-bold">
                <a className="btn btn-light btn-lg rounded-0 px-5 fw-bold">
                  Meet The Team
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="container py-5 mt-4">
        <div className="row justify-content-center">
          <div className="col-lg-12">
            <div
              className="cms-rich-text p-4 p-md-5 "
              dangerouslySetInnerHTML={{
                __html:
                  city?.content ||
                  cms?.content ||
                  `<p>Professional legal services in ${city.cityName}.</p>`,
              }}
            />
          </div>
        </div>
      </div>

      {/* --- NEWS & EVENTS SECTION --- */}
      <div className="dark-news-section mt-5">
        <div className="container">
          <h2 className="section-title-white mb-5">Location News & Events</h2>
          <div className="news-tabs mb-4 d-flex gap-4 border-bottom border-secondary">
            {["News", "Events"].map((tab) => (
              <span
                key={tab}
                className={`tab-item ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}>
                {tab.toUpperCase()}
              </span>
            ))}
          </div>

          <div className="news-list">
            {displayData.length > 0 ? (
              displayData.map((item, idx) => (
                <div
                  key={idx}
                  className="news-row py-4 border-bottom border-secondary-subtle">
                  <div className="row align-items-center">
                    <div className="col-md-9">
                      <p className="news-date-type mb-1">
                        {new Date(
                          item.date || item.startDate || item.createdAt,
                        ).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                        <span className="ms-3 text-gold">
                          | {activeTab.toUpperCase()}
                        </span>
                      </p>
                      <Link
                        href={`/${activeTab.toLowerCase()}/${createItemSlug(item.title)}`}
                        className="text-decoration-none">
                        <h4 className="news-heading">{item.title}</h4>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted py-5">
                No {activeTab.toLowerCase()} available for this location.
              </p>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero-section {
          min-height: 500px; /* Better than fixed height */
          background-size: cover;
          background-position: center;
          position: relative;
          display: flex;
          align-items: center;
          padding: 80px 0;
        }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.7),
            rgba(0, 0, 0, 0.5)
          );
          z-index: 1;
        }
        .hero-content {
          position: relative;
          z-index: 2;
        }
        .hero-title {
          font-size: clamp(2.5rem, 5vw, 4.5rem);
          font-family: "Georgia", serif;
          margin-bottom: 20px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }
        .address-text {
          font-size: 1.2rem;
          opacity: 0.95;
          line-height: 1.6;
        }
        .contact-links span {
          font-size: 1rem;
        }
        .btn-gold-outline {
          display: inline-block;
          border: 2px solid #de9f57;
          color: #fff;
          padding: 12px 30px;
          font-weight: bold;
          font-size: 0.9rem;
          transition: 0.3s;
          margin-top: 20px;
        }
        .btn-gold-outline:hover {
          background: #de9f57;
          color: #000;
        }
        .cms-rich-text {
          font-size: 1.15rem;
          line-height: 1.9;
          color: #333;
          border-radius: 8px;
        }
        .dark-news-section {
          background: #111;
          padding: 80px 0;
          color: white;
        }
        .text-gold {
          color: #de9f57 !important;
        }
        .tab-item {
          cursor: pointer;
          color: #888;
          font-weight: bold;
          padding-bottom: 10px;
          transition: 0.3s;
        }
        .tab-item.active {
          color: #de9f57;
          border-bottom: 3px solid #de9f57;
        }
        .news-heading {
          color: #fff;
          font-family: "Georgia", serif;
          margin: 10px 0;
          transition: 0.2s;
        }
        .news-heading:hover {
          color: #de9f57;
        }
        @media (max-width: 768px) {
          .contact-links {
            flex-direction: column;
            gap: 5px !important;
          }
        }
      `}</style>
    </>
  );
}

export default LocationDetail;