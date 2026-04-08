"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import {
  getAllEvents,
  getAllCapabilitySubCategories,
  getAllLocationCities,
  IMG_URL,
  getBanner,
  getImgUrl
} from "../../services/authService";

function EventsIndex() {
  const [banner, setBanner] = useState([]);
  const [eventsList, setEventsList] = useState([]);
  const [capabilities, setCapabilities] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Pagination state: show 3 items initially
  const [visibleCount, setVisibleCount] = useState(3);
const [bannerText, setBannerText] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilterTab, setActiveFilterTab] = useState(null);
  const [filters, setFilters] = useState({
    capability: "",
    location: "",
    date: "",
  });
  console.log("Banner IMage EVENT ", banner);

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

  const formatTime = (timeString) => {
    if (!timeString) return null;
    try {
      const [hours, minutes] = timeString.split(":");
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch (e) {
      return timeString;
    }
  };

useEffect(() => {
  setMounted(true);
  const fetchEventsData = async () => {
    setLoading(true);
    try {
      const [eventRes, capRes, locRes, bannerRes] = await Promise.all([
        getAllEvents(),
        getAllCapabilitySubCategories(),
        getAllLocationCities(),
        getBanner(),
      ]);

      // Fix: Ensure eventRes.data is strictly the array of events
      if (eventRes?.success) {
        setEventsList(eventRes.data || []);
      }


      if (bannerRes?.success && bannerRes.data && bannerRes.data.length > 0) {
        const firstBanner = bannerRes.data[0];
        const bannerPath = firstBanner.bannerImage || firstBanner.image;
        if (bannerPath) {
          setBanner(getImgUrl(bannerPath));
          setBannerText(firstBanner.textEditor || "");
        }
      }

      if (capRes?.success) {
        setCapabilities(capRes.data?.data || capRes.data || []);
      }

      if (locRes?.success) {
        setLocations(locRes.data || []);
      }
    } catch (error) {
      console.error("API Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };
  fetchEventsData();
}, []);
if (!mounted) return null;

const filteredEvents = eventsList.filter((item) => {
  const matchesSearch = (item.title || "")
    .toLowerCase()
    .includes(searchTerm.toLowerCase());
  let matchesCap = filters.capability
    ? Number(item.capabilityCategoryId) == Number(filters.capability)
    : true;

  let currentCityIds = [];
  try {
    currentCityIds =
      typeof item.cityIds === "string"
        ? JSON.parse(item.cityIds)
        : item.cityIds;
  } catch (e) {
    currentCityIds = [];
  }

  let matchesLoc = filters.location
    ? currentCityIds?.includes(Number(filters.location))
    : true;
  let itemDate = item.startDate ? item.startDate.split("T")[0] : "";
  let matchesDate = filters.date ? itemDate === filters.date : true;

  return matchesSearch && matchesCap && matchesLoc && matchesDate;
});

const displayedEvents = filteredEvents.slice(0, visibleCount);

const handleViewMore = () => {
  setVisibleCount((prev) => prev + 3);
};

return (
  <div className="bg-white">
    <Head>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
      />
    </Head>

    <section
      className="universal-banner d-flex align-items-center justify-content-center text-center text-white position-relative"
      style={{
        backgroundImage: banner ? `url(${banner})` : "none",
        backgroundColor: "#001a33",
        minHeight: "450px",
        marginTop: "-40px",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.6)", 
          zIndex: 1,
        }}></div>

      <div
        className="container banner-content position-relative"
        style={{ zIndex: 2 }}>
        
 

        
        {bannerText && (
          <h2
            className="fw-bold mx-auto mt-2"
            style={{
              maxWidth: "900px",
              fontSize: "2.5rem",
              lineHeight: "1.2",
              textShadow: "1px 1px 5px rgba(0,0,0,0.5)",
              color: "#ffffff",
            }}
            dangerouslySetInnerHTML={{ __html: bannerText }}
          />
        )}
      </div>
    </section>

    {/* Filter Section */}
    <section
      className="shadow-sm"
      style={{
        backgroundColor: "var(--dark-navy)",
        borderTop: "4px solid var(--primary-gold)",
      }}>
      <div className="container">
        <div className="row align-items-center py-3 g-3">
          <div className="col-lg-5">
            <div className="d-flex align-items-center border-bottom border-secondary border-opacity-50 pb-1">
              <input
                type="text"
                placeholder="Search Events..."
                className="bg-transparent border-0 text-white w-100 shadow-none"
                style={{
                  fontSize: "0.95rem",
                  padding: "5px 0",
                  outline: "none",
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="bi bi-search text-gold small"></i>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="d-flex flex-wrap justify-content-lg-end align-items-center gap-4 text-white">
              {["Date", "Location", "Capability"].map((label) => (
                <span
                  key={label}
                  onClick={() =>
                    setActiveFilterTab(
                      activeFilterTab === label.toLowerCase()
                        ? null
                        : label.toLowerCase(),
                    )
                  }
                  className="text-uppercase fw-bold"
                  style={{
                    color:
                      activeFilterTab === label.toLowerCase()
                        ? "var(--primary-gold)"
                        : "white",
                    cursor: "pointer",
                    fontSize: "0.75rem",
                    letterSpacing: "1px",
                  }}>
                  {label}{" "}
                  <i
                    className={`bi bi-chevron-${activeFilterTab === label.toLowerCase() ? "up" : "down"} ms-1`}
                    style={{ fontSize: "0.6rem" }}></i>
                </span>
              ))}
            </div>
          </div>
        </div>

        {activeFilterTab && (
          <div className="row pb-3 animate-fade-in">
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
                      {cap.subcategoryName || cap.categoryName}
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
                <div className="d-flex gap-2">
                  <input
                    type="date"
                    className="form-control rounded-0 w-auto"
                    value={filters.date}
                    onChange={(e) =>
                      setFilters({ ...filters, date: e.target.value })
                    }
                  />
                  <button
                    className="btn btn-gold btn-sm px-3"
                    onClick={() => {
                      setFilters({ ...filters, date: "" });
                      setActiveFilterTab(null);
                    }}>
                    RESET
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>

    {/* Events List */}
    <section className="container py-5 min-vh-100">
      <h2 className="fw-bold mb-5 font-serif border-bottom pb-2">
        Upcoming Events
      </h2>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-gold"></div>
        </div>
      ) : displayedEvents.length > 0 ? (
        <>
          {displayedEvents.map((item) => {
            let parsedCityIds = [];
            try {
              const data =
                typeof item.cityIds === "string"
                  ? JSON.parse(item.cityIds)
                  : item.cityIds;
              parsedCityIds = Array.isArray(data) ? data : []; // Ensure it's always an array
            } catch (e) {
              parsedCityIds = [];
            }
            const dynamicCityNames = parsedCityIds
              .map(
                (id) =>
                  locations.find((loc) => Number(loc.id) === Number(id))
                    ?.cityName,
              )
              .filter(Boolean)
              .join(", ");

            const eventSlug = createSlug(item.title);
            const displayStartTime = formatTime(item.startTime);
            const displayEndTime = formatTime(item.endTime);

            return (
              <div
                key={item.id}
                className="row border-bottom py-4 align-items-center mx-0 event-row-hover">
                <div className="col-md-10">
                  <div
                    className="d-flex align-items-center flex-wrap gap-2 mb-2 fw-bold text-uppercase"
                    style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                    <span className="text-primary">
                      {item.startDate
                        ? new Date(item.startDate).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Date TBD"}
                    </span>
                    {(displayStartTime || displayEndTime) && (
                      <>
                        <span className="text-muted opacity-50">|</span>
                        <span className="text-dark">
                          <i className="bi bi-clock me-1"></i>
                          {displayStartTime}
                          {displayEndTime && ` - ${displayEndTime}`}
                        </span>
                      </>
                    )}
                    <span className="text-muted opacity-50">•</span>
                    <span className="text-muted">EVENT</span>
                  </div>

                  <Link href={`/events/${eventSlug}`}>
                    <a className="text-decoration-none">
                      <h4
                        className="fw-bold mb-1 text-dark font-serif title-hover-gold"
                        style={{ transition: "0.3s" }}>
                        {item.title}
                      </h4>
                    </a>
                  </Link>
                  <p className="text-secondary mb-0 small">
                    <i className="bi bi-geo-alt-fill text-gold me-2"></i>
                    {dynamicCityNames ||
                      item.locationName ||
                      "Virtual / To Be Decided"}
                  </p>
                </div>
                <div className="col-md-2 text-md-end mt-3 mt-md-0">
                  <Link href={`/events/${eventSlug}`}>
                    <a
                      className="btn btn-outline-custom px-4 py-2 small fw-bold text-uppercase"
                      style={{ fontSize: "0.7rem", letterSpacing: "1px" }}>
                      DETAILS
                    </a>
                  </Link>
                </div>
              </div>
            );
          })}

          {visibleCount < filteredEvents.length && (
            <div className="text-center mt-5">
              <button
                onClick={handleViewMore}
                className="btn btn-link text-gold text-decoration-none fw-bold text-uppercase"
                style={{ letterSpacing: "1px" }}>
                View More +
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-5">
          <p className="text-muted">
            No upcoming events found matching your criteria.
          </p>
        </div>
      )}
    </section>

    <style jsx global>{`
      .title-hover-gold:hover {
        color: var(--primary-gold) !important;
      }
      .text-gold {
        color: var(--primary-gold) !important;
      }
      .event-row-hover {
        transition: all 0.3s ease;
      }
      .event-row-hover:hover {
        background-color: #fafafa;
        border-left: 4px solid var(--primary-gold);
        padding-left: 15px;
      }
      .animate-fade-in {
        animation: fadeIn 0.4s ease-in;
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
    `}</style>
  </div>
);
}

export default EventsIndex;
