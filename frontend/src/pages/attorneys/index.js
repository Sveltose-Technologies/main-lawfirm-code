

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  getAttorneylanguages,
  getAllAttorneys,
  getAllCapabilityCategories,
  getAllLocationCities,
  getAllAdmissions,
  getAllEducations,
  getImgUrl,
  getAllProfessionals,
} from "../../services/authService";

export default function AttorneysPage() {
  const router = useRouter();
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // --- Data States ---
  const [attorneys, setAttorneys] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [educations, setEducations] = useState([]);
  const [bannerData, setBannerData] = useState(null);

  // --- Filter States ---
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [activeFilter, setActiveFilter] = useState(null);
  const [filterValue, setFilterValue] = useState("");
  const [limit, setLimit] = useState(5);

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

  const createNameSlug = (fname, lname) => {
    if (!fname) return "";
    const name = `${fname} ${lname || ""}`;
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [attRes, catRes, cityRes, langRes, admRes, eduRes, profRes] =
          await Promise.all([
            getAllAttorneys(),
            getAllCapabilityCategories(),
            getAllLocationCities(),
            getAttorneylanguages(),
            getAllAdmissions(),
            getAllEducations(),
            getAllProfessionals(),
          ]);
        setAttorneys(attRes?.attorneys || attRes?.data || []);
        setCategories(catRes?.data || []);
        setCities(cityRes?.data || []);
        setLanguages(langRes?.data?.data || langRes?.data || []);
        setAdmissions(
          (admRes?.data || admRes || []).filter((a) => a.admission !== null),
        );
        setEducations(
          (eduRes?.data || eduRes || []).filter((e) => e.education !== null),
        );
        const profData = profRes?.data || profRes || [];
        if (profData.length > 0) setBannerData(profData[0]);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    fetchData();
  }, []);

  // Logic to display Category Name or City Name instead of ID in Search Criteria
  const getFilterDisplayValue = () => {
    if (selectedLetter) return selectedLetter;
    if (searchQuery) return searchQuery;
    if (!filterValue) return "All";

    if (activeFilter === "Capability") {
      const category = categories.find(
        (c) => String(c.id) === String(filterValue),
      );
      return category ? category.categoryName : filterValue;
    }

    if (activeFilter === "Location") {
      const city = cities.find((c) => String(c.id) === String(filterValue));
      return city ? city.cityName : filterValue;
    }

    return filterValue;
  };

  const filteredAttorneys = useMemo(() => {
    return attorneys.filter((attr) => {
      const firstName = attr?.firstName?.trim() || "";
      const lastName = attr?.lastName?.trim() || "";
      const fullName = `${firstName} ${lastName}`.toLowerCase();

      const matchesLetter =
        !selectedLetter ||
        firstName.toUpperCase().startsWith(selectedLetter.toUpperCase());

      const matchesSearch =
        searchQuery === "" ||
        (searchType === "name"
          ? fullName.includes(searchQuery.toLowerCase())
          : fullName.includes(searchQuery.toLowerCase()) ||
            (
              cities.find((c) => String(c.id) === String(attr.city))
                ?.cityName || ""
            )
              .toLowerCase()
              .includes(searchQuery.toLowerCase()));

      const matchesDropdown =
        !filterValue ||
        (activeFilter === "Capability" &&
          String(attr.categoryId) === String(filterValue)) ||
        (activeFilter === "Location" &&
          String(attr.city) === String(filterValue)) ||
        (activeFilter === "Language" && attr.language === filterValue) ||
        (activeFilter === "Admission" && attr.admission === filterValue) ||
        (activeFilter === "Education" && attr.education === filterValue);

      return matchesLetter && matchesSearch && matchesDropdown;
    });
  }, [
    attorneys,
    selectedLetter,
    searchQuery,
    searchType,
    activeFilter,
    filterValue,
    cities,
  ]);

  return (
    <main className="bg-white min-vh-100 mt-5 pt-3">
      {/* 1. HERO SECTION */}
      <section
        className="universal-banner"
        style={{
          backgroundImage: `url(${getImgUrl(bannerData?.bannerImage) || ""})`,
        }}>
        <div className="banner-overlay"></div>
        <div className="container banner-content text-center">
          <div
            className="font-serif text-white display-2 fw-bold"
            dangerouslySetInnerHTML={{
              __html: bannerData?.textEditor || bannerData?.texteditor,
            }}
          />
        </div>
      </section>

      {/* 2. SEARCH & FILTERS SECTION */}
      <section className="bg-dark overflow-hidden">
        <div className="row g-0">
          <div className="col-lg-6 py-5 px-4 px-md-5 capability-search-bar">
            <div className="mx-auto" style={{ maxWidth: "500px" }}>
              <div className="d-flex align-items-center border-bottom border-dark border-2 pb-1 mb-4">
                <input
                  type="text"
                  className="form-control bg-transparent border-0 fs-3 p-0 shadow-none font-serif text-black"
                  placeholder="Search Professionals"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <i className="bi bi-search fs-3 text-dark ms-2"></i>
              </div>
              <div className="d-flex gap-4">
                <label className="d-flex align-items-center cursor-pointer small fw-bold text-dark">
                  <input
                    type="radio"
                    className="me-2"
                    checked={searchType === "name"}
                    onChange={() => setSearchType("name")}
                  />{" "}
                  Search By Name
                </label>
                <label className="d-flex align-items-center cursor-pointer small fw-bold text-dark">
                  <input
                    type="radio"
                    className="me-2"
                    checked={searchType === "keyword"}
                    onChange={() => setSearchType("keyword")}
                  />{" "}
                  Search By Keyword
                </label>
              </div>
            </div>
          </div>

          <div className="col-lg-6 py-5 px-4 px-md-5 text-white bg-dark d-flex align-items-center">
            <div className="w-100 ps-lg-4">
              <p className="fw-normal mb-4 opacity-75 fs-5">
                Filter Professionals by:
              </p>
              <div className="d-flex flex-wrap gap-4">
                {[
                  "Capability",
                  "Location",
                  "Admission",
                  "Education",
                  "Language",
                ].map((f) => (
                  <div
                    key={f}
                    className={`cursor-pointer d-flex align-items-center fs-5 fw-bold transition-all ${
                      activeFilter === f
                        ? "text-gold"
                        : "text-white opacity-75 hover-opacity-100"
                    }`}
                    onClick={() => {
                      setActiveFilter(f);
                      setFilterValue("");
                    }}>
                    <span>{f}</span>
                    <i
                      className={`bi bi-chevron-right small ms-2 ${activeFilter === f ? "text-gold" : "text-white"}`}></i>
                  </div>
                ))}
              </div>

              {activeFilter && (
                <div
                  className="mt-4 animate-fade-in"
                  style={{ maxWidth: "400px" }}>
                  <select
                    className="form-select bg-white text-dark border-0 rounded-0 shadow-lg py-3 fw-bold fs-6"
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}>
                    <option value="">Select {activeFilter}</option>
                    {activeFilter === "Capability" &&
                      categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.categoryName}
                        </option>
                      ))}
                    {activeFilter === "Location" &&
                      cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.cityName}
                        </option>
                      ))}
                    {activeFilter === "Language" &&
                      languages.map((l, i) => (
                        <option key={i} value={l.name || l}>
                          {l.name || l}
                        </option>
                      ))}
                    {activeFilter === "Admission" &&
                      admissions.map((a, i) => (
                        <option key={i} value={a.admission}>
                          {a.admission}
                        </option>
                      ))}
                    {activeFilter === "Education" &&
                      educations.map((e, i) => (
                        <option key={i} value={e.education}>
                          {e.education}
                        </option>
                      ))}
                  </select>
                  <button
                    className="btn btn-link text-white text-decoration-none small mt-2 p-0 opacity-50"
                    onClick={() => {
                      setActiveFilter(null);
                      setFilterValue("");
                    }}>
                    <i className="bi bi-x-circle me-1"></i> Clear Filter
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. ALPHABET BAR */}
      <div
        className="bg-white border-bottom sticky-top shadow-sm"
        style={{ zIndex: 1000, top: "60px" }}>
        <div className="container py-3 d-flex justify-content-center overflow-auto">
          {alphabet.map((char) => (
            <button
              key={char}
              onClick={() => {
                setSelectedLetter(char);
                setLimit(5);
              }}
              className={`btn btn-link text-decoration-none fw-bold fs-4 px-2 font-serif ${selectedLetter === char ? "text-gold" : "text-dark"}`}>
              {char}
            </button>
          ))}
        </div>
      </div>

      {/* 4. RESULTS LIST */}
      {(selectedLetter || searchQuery || filterValue) && (
        <section className="py-5" style={{ backgroundColor: "#1a1a1a" }}>
          <div className="container">
            <div className="row align-items-end border-bottom border-secondary border-opacity-50 pb-3 mb-5">
              <div className="col-12 col-md-4 mb-3 mb-md-0">
                <h1 className="text-white font-serif mb-0 d-flex align-items-baseline">
                  <span className="fs-2">Results</span>
                  <span className="mx-3 opacity-50">—</span>
                  <span className="display-3 fw-bold">
                    {filteredAttorneys.length}
                  </span>
                </h1>
              </div>
              <div className="col-12 col-md-4 text-md-center mb-3 mb-md-0">
                <p className="text-uppercase text-white small mb-1 fw-bold tracking-wider opacity-50">
                  Search Criteria:
                </p>
                <p className="text-gold mb-0 fw-bold fs-5 d-flex align-items-center justify-content-center">
                  {getFilterDisplayValue()}
                  <span
                    className="ms-2 cursor-pointer text-white small"
                    onClick={() => {
                      setSelectedLetter(null);
                      setSearchQuery("");
                      setFilterValue("");
                      setActiveFilter(null);
                    }}>
                    x
                  </span>
                </p>
              </div>
              <div className="col-12 col-md-4 text-md-end text-white">
                <p className="text-uppercase small mb-1 fw-bold tracking-wider opacity-50">
                  Sort By:
                </p>
                <p className="mb-0 small">
                  Position |{" "}
                  <span className="text-gold cursor-pointer fw-bold">
                    Alphabetical
                  </span>
                </p>
              </div>
            </div>

            <div className="row">
              {filteredAttorneys.slice(0, limit).map((attr) => {
                const cityObj = cities.find(
                  (c) => String(c.id) === String(attr.city),
                );
                const catObj = categories.find(
                  (c) => String(c.id) === String(attr.categoryId),
                );
                const attorneySlug = createNameSlug(
                  attr.firstName,
                  attr.lastName,
                );

                return (
                  <div
                    key={attr.id}
                    className="col-12 mb-5 border-bottom border-secondary border-opacity-25 pb-5">
                    <div className="row g-4 align-items-stretch">
                      <div className="col-12 col-md-4 col-lg-3">
                        <Link
                          href={`/attorneys/${attorneySlug}`}
                          className="d-block overflow-hidden">
                          <img
                            src={getImgUrl(attr.profileImage)}
                            className="img-fluid pointer-img w-100"
                            alt={attr.firstName}
                            style={{
                              height: "320px",
                              objectFit: "cover",
                              objectPosition: "top",
                            }}
                          />
                        </Link>
                      </div>

                      <div className="col-12 col-md-5 col-lg-6 d-flex flex-column justify-content-center ps-md-4">
                        <Link
                          href={`/attorneys/${attorneySlug}`}
                          className="text-decoration-none">
                          <h2 className="text-gold font-serif display-5 fw-bold mb-2 pointer-link">
                            {attr.firstName} {attr.lastName}
                          </h2>
                        </Link>
                        <p className="text-white text-uppercase small fw-bold mb-3 tracking-widest opacity-75">
                          {attr.servicesOffered || "SHAREHOLDER"}
                        </p>
                        <a
                          href={`mailto:${attr.email}`}
                          className="text-blue text-decoration-none d-block mb-2 fs-5">
                          {attr.email}
                        </a>
                        <p className="text-blue mb-0 fs-5 fw-medium">
                          {attr.phoneCell || "+1 000.000.0000"}
                        </p>
                      </div>

                      <div className="col-12 col-md-3 d-flex flex-column justify-content-between text-md-end py-2">
                        <div className="mb-3">
                          <Link
                            href={`/location/${createSlug(cityObj?.cityName || "")}`}
                            className="text-decoration-none">
                            <span className="text-blue small pointer-link fw-bold text-uppercase tracking-wider">
                              {cityObj?.cityName || "Location"}
                            </span>
                          </Link>
                        </div>
                        <div className="mt-auto">
                          <Link
                            href={`/capability/${createSlug(catObj?.categoryName || "")}`}
                            className="text-decoration-none">
                            <div className="d-inline-block border border-white border-opacity-50 p-2 px-4 text-white text-uppercase fw-bold small tracking-widest pointer-box hover-effect">
                              {catObj?.categoryName || "Expertise"}
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {limit < filteredAttorneys.length && (
              <div className="text-center mt-5">
                <button
                  className="btn btn-outline-gold px-5 py-3 text-uppercase fw-bold tracking-widest"
                  onClick={() => setLimit(limit + 5)}>
                  Load More Professionals
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      <style jsx>{`
        .text-gold {
          color: #c4a052 !important;
        }
        .text-blue {
          color: #6fb1d8 !important;
        }
        .font-serif {
          font-family: "Playfair Display", serif;
        }
        .pointer-img {
          cursor: pointer;
          transition: all 0.4s ease;
          filter: grayscale(10%);
        }
        .pointer-img:hover {
          transform: scale(1.03);
          filter: grayscale(0%);
        }
        .tracking-widest {
          letter-spacing: 0.2em;
        }
        .hover-effect {
          transition: all 0.3s ease;
        }
        .hover-effect:hover {
          background: white;
          color: black !important;
        }
        .btn-outline-gold {
          border: 2px solid #c4a052;
          color: #c4a052;
          background: transparent;
          border-radius: 0;
        }
        .btn-outline-gold:hover {
          background: #c4a052;
          color: #000;
        }
        @media (max-width: 768px) {
          .text-md-end {
            text-align: left !important;
          }
        }
      `}</style>
    </main>
  );
}