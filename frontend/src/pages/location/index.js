"use client";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import * as authService from "../../services/authService";

function Locations() {
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [bannerData, setBannerData] = useState(null);
  const [openSections, setOpenSections] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [countryRes, cityRes, bannerRes] = await Promise.all([
          authService.getAllLocationCountries(),
          authService.getAllLocationCities(),
          authService.getAllLocations(), // Banner API
        ]);

        setCountries(countryRes?.data || []);
        setCities(cityRes?.data || []);

        const locations = bannerRes?.data || bannerRes || [];
        if (locations.length > 0) {
          setBannerData(locations[0]);
        }
      } catch (err) {
        console.error("Error fetching locations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleSection = (id) => {
    setOpenSections((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleExpandAll = () =>
    setOpenSections(countries.map((c) => c.id || c._id));
  const handleCollapseAll = () => setOpenSections([]);

  if (loading)
    return <div className="text-center py-5">Loading Locations...</div>;

  const bannerBg = bannerData?.bannerImage
    ? {
        backgroundImage: `url(${authService.getImgUrl(bannerData.bannerImage)})`,
      }
    : {};

  return (
    <>
      <Head>
        <title>Our Locations | Global Offices</title>
      </Head>

      {/* Dynamic Banner Section */}
      <div
        className="location-banner d-flex align-items-center justify-content-center text-center px-3"
        style={bannerBg}>
        <div className="overlay"></div>
        <div className="container position-relative" style={{ zIndex: 2 }}>
          {bannerData?.content ? (
            <div
              className="dynamic-banner-content text-white"
              dangerouslySetInnerHTML={{ __html: bannerData.content }}
            />
          ) : (
            <>
              <h5 className="text-gold fw-bold text-uppercase mb-3">
                Global Reach
              </h5>
              <h1 className="font-serif display-3 fw-bold text-white mb-3">
                Our Locations
              </h1>
            </>
          )}
        </div>
      </div>
      <div className="container py-5">
        <div className="row mb-4 align-items-center">
          <div className="col-md-6">
            <h3 className="font-serif fw-bold text-navy mb-0">
              Office Directory
            </h3>
          </div>
          <div className="col-md-6 text-md-end">
            <div className="btn-group shadow-sm">
              <button
                className="btn btn-outline-dark btn-sm"
                onClick={handleExpandAll}>
                Expand All
              </button>
              <button
                className="btn btn-outline-dark btn-sm"
                onClick={handleCollapseAll}>
                Collapse All
              </button>
            </div>
          </div>
        </div>

        {countries.map((country) => {
          const countryId = country.id || country._id;
          const countryCities = cities.filter(
            (city) => city.countryId === countryId,
          );
          const isOpen = openSections.includes(countryId);

          return (
            <div key={countryId} className=" border-bottom ">
              {/* Accordion Header */}
              <div
                className="py-3 d-flex justify-content-between align-items-center cursor-pointer"
                onClick={() => toggleSection(countryId)}
                style={{ cursor: "pointer" }}>
                <h4 className="fw-bold mb-0 text-gold font-serif ">
                  {country.countryName}
                </h4>
                <span className="fs-5 fw-bold text-navy">
                  {isOpen ? "−" : "+"}
                </span>
              </div>

              {/* Accordion Body */}
              {isOpen && (
                <div className="pt-1 animate-fade-in">
                  {/* DYNAMIC COUNTRY CONTENT (Paragraph text from API) */}
                  {country.content && (
                    <div
                      className="mb-3 text-dark lead-text"
                      style={{ lineHeight: "1.8", textAlign: "justify" }}
                      dangerouslySetInnerHTML={{ __html: country.content }}
                    />
                  )}

                  {/* CITIES GRID */}
                  <div className="row g-4">
                    {countryCities.length > 0 ? (
                      countryCities.map((city) => {
                        const citySlug = city.cityName
                          .toLowerCase()
                          .replace(/\s+/g, "-");
                        return (
                          <div key={city.id} className="col-lg-4 col-md-6">
                            <Link
                              href={`/location/${citySlug}`}
                              className="text-decoration-none">
                              <div className="card h-100 shadow-sm border-0 location-card bg-light-creme">
                                <div className="img-container">
                                  <div className="img-container">
                                    <img
                                      src={authService.getImgUrl(city.image)}
                                      className="card-img-top"
                                      alt={city.cityName}
                                    />
                                  </div>
                                </div>
                                <div className="card-body p-4">
                                  <h4
                                    className="fw-bold text-dark text-uppercase mb-3"
                                    style={{ letterSpacing: "1px" }}>
                                    {city.cityName}
                                  </h4>
                                  <div className="address-box mb-3">
                                    <p
                                      className="small text-muted mb-0"
                                      style={{ whiteSpace: "pre-line" }}>
                                      {city.address}
                                    </p>
                                  </div>
                                  <p className="fw-bold text-navy mb-0">
                                    {city.phoneNo}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          </div>
                        );
                      })
                    ) : (
                      <div className="col-12">
                        <p className="text-muted">
                          No offices currently listed for this region.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .location-banner {
          min-height: 400px;
          /* These 3 lines fix the multiple image issue */
          background-size: cover !important;
          background-repeat: no-repeat !important;

          position: relative;
          width: 100%;
          display: flex;
        }
        .overlay {
          position: absolute;
          inset: 0;
          background: rgba(10, 28, 56, 0.7);
        }
        .font-serif {
          font-family: "Georgia", serif;
        }
        .text-gold {
          color: #de9f57 !important;
        }
        .text-navy {
          color: #0a1c38 !important;
        }
        .bg-light-creme {
          background-color: #fdfaf5;
        }

        .location-card {
          transition: 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          border-radius: 0;
        }
        .location-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1) !important;
        }

        .img-container {
          height: 220px;
          overflow: hidden;
          position: relative;
        }
        .img-container img {
          height: 100%;
          width: 100%;
          object-fit: cover;
          transition: 0.5s;
        }
        .location-card:hover .img-container img {
          transform: scale(1.1);
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-in;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .lead-text {
          font-size: 1.1rem;
          color: #333;
        }

        :global(.lead-text p) {
          margin-bottom: 1.5rem;
        }
      `}</style>
    </>
  );
}

export default Locations;
