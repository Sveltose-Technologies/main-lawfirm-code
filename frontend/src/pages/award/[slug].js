import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { getAllAwards, getImgUrl } from "../../services/authService";

export default function AwardDetail() {
  const router = useRouter();
  const { slug } = router.query;

  const [award, setAward] = useState(null);
  const [loading, setLoading] = useState(true);

  const createSlug = (text) => {
    if (!text) return "";
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
  };

  useEffect(() => {
    if (!router.isReady) return;

    const fetchData = async () => {
      try {
        const res = await getAllAwards();
        if (res?.success) {
          const found = res.data.find(
            (item) => createSlug(item.awardTitle) === slug,
          );
          setAward(found);
        }
      } catch (error) {
        console.error("Error fetching award details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, router.isReady]);

  if (loading)
    return <div className="text-center py-5 fw-bold">Loading...</div>;

  if (!award)
    return (
      <div className="container py-5 text-center">
        <h2 className="display-6">Award not found</h2>
        <button
          className="btn btn-dark mt-3"
          onClick={() => router.push("/award")}>
          Back to List
        </button>
      </div>
    );

  // Logic: Use peopleImage for the main left slot
  const profileImg = getImgUrl(award.peopleImage) || "";

  return (
    <div className="bg-light w-100 min-vh-100 pb-5">
      <div className="container pt-5 mt-5">
        {/* Navigation */}
        <div className="row mb-3">
          <div className="col-12">
            <button
              onClick={() => router.push("/award")}
              className="btn btn-sm btn-outline-secondary px-3 shadow-sm">
              &larr; BACK TO LIST
            </button>
          </div>
        </div>

        {/* Title Header */}
        <div className="row mb-4">
          <div className="col-12 text-md-start">
            <h1 className="fw-bold display-5 mb-1" style={{ color: "#002d5b" }}>
              {award.awardTitle}
            </h1>
            <p className="text-muted fs-5">
              {award.organization} — {award.year}
            </p>
          </div>
        </div>

        <div className="row g-4 align-items-stretch">
          {/* Left Column: Profile Image (formerly Banner slot) */}
          <div className="col-md-6 col-lg-7">
            <div className="h-100 shadow-sm rounded overflow-hidden bg-white">
              <img
                src={profileImg}
                alt={award.personName}
                className="w-100 h-100 border-0"
                style={{ objectFit: "cover", minHeight: "450px" }}
              />
            </div>
          </div>

          {/* Right Column: Information Box */}
          <div className="col-md-6 col-lg-5">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body p-4 d-flex flex-column justify-content-center">
                <h6 className="text-uppercase fw-bold text-muted border-bottom pb-2 mb-4">
                  Information
                </h6>

                <div className="mb-4">
                  <small className="text-muted d-block fw-bold text-uppercase">
                    Recipient
                  </small>
                  <p className="h4 fw-bold mb-0" style={{ color: "#002d5b" }}>
                    {award.personName}
                  </p>
                </div>

                <div className="mb-4">
                  <small className="text-muted d-block fw-bold text-uppercase">
                    Organization
                  </small>
                  <p className="h5 fw-semibold mb-0">{award.organization}</p>
                </div>

                <div className="mb-0">
                  <small className="text-muted d-block fw-bold text-uppercase">
                    Year
                  </small>
                  <p className="h5 mb-0">{award.year}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Description */}
        <div className="row justify-content-center mt-5">
          <div className="col-lg-10 col-md-11">
            <div
              className="bg-white p-4 p-md-5 shadow-sm rounded position-relative"
              style={{ borderTop: "6px solid #002d5b" }}>
              <h2
                className="fw-bold text-center mb-4 display-6"
                style={{ fontFamily: "serif" }}>
                Award Overview
              </h2>
              <hr className="mb-4 opacity-75" />

              <div
                className="fs-5 text-break"
                style={{
                  textAlign: "justify",
                  lineHeight: "1.8",
                  color: "#333",
                }}
                dangerouslySetInnerHTML={{ __html: award.details }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
