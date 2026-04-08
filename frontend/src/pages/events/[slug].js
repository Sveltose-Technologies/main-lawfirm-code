"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import {
  getAllEvents,
  getAllCapabilityCategories,
  getAllLocationCities,
  getImgUrl,
} from "../../services/authService";

export default function EventDetail() {
  const router = useRouter();
  const { slug } = router.query;

  const [event, setEvent] = useState(null);
  const [allEvents, setAllEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination state for related events
  const [visibleRelated, setVisibleRelated] = useState(3);

  const parseIds = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data.map(Number);
    if (typeof data === "string") {
      try {
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed.map(Number) : [Number(data)];
      } catch (e) {
        return [Number(data)];
      }
    }
    return [Number(data)];
  };

  const createSlug = (text) =>
    text
      ?.toLowerCase()
      .trim()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  const formatDateRange = (start, end) => {
    if (!start) return "Date TBD";
    const options = { month: "long", day: "numeric", year: "numeric" };
    const s = new Date(start).toLocaleDateString("en-US", options);
    if (!end) return s;
    const e = new Date(end).toLocaleDateString("en-US", options);
    return s === e ? s : `${s} - ${e}`;
  };

  const formatTimeRange = (start, end) => {
    if (!start) return "";
    const formatTime = (timeStr) => {
      if (!timeStr) return "";
      const [hours, minutes] = timeStr.split(":");
      const h = parseInt(hours);
      const ampm = h >= 12 ? "PM" : "AM";
      const formattedHours = h % 12 || 12;
      return `${formattedHours}:${minutes} ${ampm}`;
    };

    const s = formatTime(start);
    const e = formatTime(end);
    return e ? `${s} - ${e}` : s;
  };

  const getEventLocation = (item) => {
    const cityIdArray = parseIds(item.cityIds || item.cityId);
    const matchedCity = cities.find((c) => cityIdArray.includes(Number(c.id)));

    if (matchedCity) {
      const cityName = matchedCity.cityName;
      const countryName = matchedCity.countryName || "";
      return countryName ? `${cityName}, ${countryName}` : cityName;
    }
    return "";
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const [eventRes, cityRes, catRes] = await Promise.allSettled([
          getAllEvents(),
          getAllLocationCities(),
          getAllCapabilityCategories(),
        ]);

        const fetchedCities =
          cityRes.status === "fulfilled"
            ? cityRes.value?.data || cityRes.value || []
            : [];
        const fetchedCats =
          catRes.status === "fulfilled"
            ? catRes.value?.data || catRes.value || []
            : [];

        setCities(fetchedCities);
        setCategories(fetchedCats);

        if (eventRes.status === "fulfilled") {
          const eventsData = eventRes.value?.data || eventRes.value || [];
          let foundEvent = eventsData.find(
            (e) => createSlug(e.title) === slug || String(e.id) === slug,
          );
          setEvent(foundEvent);
          setAllEvents(
            eventsData.filter((e) => e.id !== (foundEvent?.id || 0)),
          );
        }
      } catch (error) {
        console.error("Error fetching event details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  const handleViewMore = () => {
    setVisibleRelated((prev) => prev + 3);
  };

  if (loading)
    return (
      <div className="text-center py-5 mt-5">
        <div className="spinner-border text-warning"></div>
      </div>
    );

  if (!event)
    return (
      <div className="text-center py-5 mt-5">
        <h3>Event Not Found</h3>
      </div>
    );

  const matchedCities = cities.filter((c) =>
    parseIds(event.cityIds || event.cityId).includes(Number(c.id)),
  );
  const matchedCategories = categories.filter((cat) =>
    parseIds(event.capabilityCategoryId).includes(Number(cat.id)),
  );

  return (
    <div className="bg-white">
      <Head>
        <title>{event.title} | Lawstick</title>
      </Head>

      <header
        className="text-white pt-5 pb-5 position-relative"
        style={{
          background: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${getImgUrl(
            event.bannerImage,
          )})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "400px",
        }}>
        <div
          className="container pt-5 mt-4 position-relative"
          style={{ zIndex: 2 }}>
          <div className="mb-2 opacity-75">
            <span className="text-uppercase fw-bold small tracking-widest">
              {formatDateRange(event.startDate, event.endDate)}
              {event.startTime && (
                <>
                  <span className="mx-2">•</span>
                  {formatTimeRange(event.startTime, event.endTime)}
                </>
              )}
            </span>
            <span className="mx-2">|</span>
            <span className="text-uppercase fw-bold small">Event</span>
          </div>
          <h1 className="display-4 fw-bold mb-5 lh-sm font-serif">
            {event.title}
          </h1>

          <div className="row g-3 border-top border-secondary pt-4">
            <div className="col-md-2 text-uppercase small fw-bold">
              Capabilities
            </div>
            <div className="col-md-10 fw-bold">
              {matchedCategories.map((cat, index) => (
                <span key={cat.id}>
                  <Link href={`/capability/${createSlug(cat.categoryName)}`}>
                    <a className="gold-text text-decoration-none hover-white">
                      {cat.categoryName}
                    </a>
                  </Link>
                  {index < matchedCategories.length - 1 && ", "}
                </span>
              ))}
            </div>

            <div className="col-md-2 text-uppercase small fw-bold">Offices</div>
            <div className="col-md-10 fw-bold">
              {matchedCities.map((c, index) => (
                <span key={c.id}>
                  <Link href={`/location/${createSlug(c.cityName)}`}>
                    <a className="gold-text text-decoration-none hover-white">
                      {c.cityName}
                    </a>
                  </Link>
                  {index < matchedCities.length - 1 && " | "}
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="container py-5 mt-4">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="row g-0 pt-4">
              <div className="col-md-1">
                <div className="sticky-top" style={{ top: "110px" }}>
                  <p className="text-uppercase fw-bold text-muted small">
                    Share
                  </p>
                  <div className="d-flex flex-column gap-4 fs-4 text-muted">
                    {event?.linkedin && (
                      <a
                        href={event.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover-gold text-secondary">
                        <i className="bi bi-linkedin"></i>
                      </a>
                    )}
                    {event?.twitter && (
                      <a
                        href={event.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover-gold text-secondary">
                        <i className="bi bi-twitter-x"></i>
                      </a>
                    )}
                    {event?.facebook && (
                      <a
                        href={event.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover-gold text-secondary">
                        <i className="bi bi-facebook"></i>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-md-11 ps-md-5">
                <div className="description-body">
                  <div
                    dangerouslySetInnerHTML={{ __html: event.description }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className="bg-dark text-white py-5">
        <div className="container py-5">
          <h3 className="pb-4 border-bottom border-secondary mb-5 font-serif">
            You May Also Be Interested In:
          </h3>
          <div className="row g-4">
            {allEvents.slice(0, visibleRelated).map((item) => {
              const locationInfo = getEventLocation(item);
              return (
                <div key={item.id} className="col-md-4">
                  <div className="card bg-transparent border-0 h-100 text-white">
                    <div className="card-body px-0">
                      <p className="small fw-bold text-uppercase text-white mb-2">
                        {formatDateRange(item.startDate, item.endDate)}
                        {item.startTime && (
                          <>
                            {" "}
                            | {formatTimeRange(item.startTime, item.endTime)}
                          </>
                        )}{" "}
                        | Event
                      </p>
                      <Link href={`/events/${createSlug(item.title)}`}>
                        <a className="h5 gold-text text-decoration-none fw-bold d-block mb-2 font-serif">
                          {item.title}
                        </a>
                      </Link>
                      {locationInfo && (
                        <>
                          {" "}
                          |{" "}
                          <span className="small fw-bold text-uppercase text-white mb-2">
                            {locationInfo}
                          </span>
                        </>
                      )}
                      <hr className="border-secondary opacity-50 my-3" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {visibleRelated < allEvents.length && (
            <div className="text-center mt-5">
              <button
                className="btn btn-link gold-text text-decoration-none fw-bold text-uppercase p-0"
                style={{ letterSpacing: "1px", fontSize: "0.9rem" }}
                onClick={handleViewMore}>
                View More +
              </button>
            </div>
          )}
        </div>
      </section>

      <style jsx global>{`
        .font-serif {
          font-family: "Georgia", serif;
        }
        .gold-text {
          color: #c5a059 !important;
        }
        .hover-gold:hover {
          color: #c5a059 !important;
        }
        .hover-white:hover {
          color: #fff !important;
          text-decoration: underline !important;
        }
        .description-body {
          font-size: 1.15rem;
          line-height: 1.8;
          color: #333;
        }
        .description-body p {
          margin-bottom: 1.5rem;
        }
      `}</style>
    </div>
  );
}
