import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { getAllPromoters, getImgUrl } from "../../services/authService";

export default function PromoterDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);

  const createSlug = (text) =>
    text
      ?.toLowerCase()
      .trim()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");

  useEffect(() => {
    if (!router.isReady) return;
    getAllPromoters().then((res) => {
      if (res?.success) {
        const found = res.data.find(
          (item) => createSlug(item.personName) === slug,
        );
        setPerson(found);
      }
      setLoading(false);
    });
  }, [slug, router.isReady]);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-white">
        <div className="spinner-border text-muted" role="status"></div>
      </div>
    );

  if (!person)
    return (
      <div className="container py-5 text-center vh-100 d-flex flex-column justify-content-center">
        <h2 className="fw-bold">Profile Not Found</h2>
        <button
          className="btn btn-dark mt-3 rounded-0 px-4 mx-auto"
          onClick={() => router.push("/promoters")}>
          BACK TO PROMOTERS
        </button>
      </div>
    );

  // getImgUrl handle karega absolute vs relative paths
  const bannerImg = person.bannerImage ? getImgUrl(person.bannerImage) : "";

  return (
    <div className="bg-white min-vh-100">
      <div
        className="universal-banner"
        style={{ backgroundImage: `url(${bannerImg})` }}>
        <div className="banner-overlay"></div>
        <div className="container banner-content text-center">
          <h1 className="display-4 fw-bold text-uppercase">
            {person.personName}
          </h1>
          <p className="lead text-uppercase tracking-wider opacity-75">
            {person.designation}
          </p>
        </div>
      </div>

      <div className="container py-5">
        <div className="row g-5">
          <div className="col-lg-4 col-md-5">
            <div className="profile-detail-img-box shadow-sm mb-4">
              {/* getImgUrl ka use karein */}
              <img
                src={getImgUrl(person.personImage)}
                alt={person.personName}
                className="img-fluid w-100"
              />
            </div>

            <div className="contact-details-box border-top pt-3">
              <h5
                className="fw-bold text-uppercase mb-3 small"
                style={{ letterSpacing: "1px" }}>
                Professional Info
              </h5>

              <div className="mb-3">
                <label
                  className="text-uppercase fw-bold text-muted d-block mb-0"
                  style={{ fontSize: "0.7rem" }}>
                  Designation
                </label>
                <div className="text-dark fw-bold">{person.designation}</div>
              </div>

              {person.email && (
                <div className="mb-2">
                  <label
                    className="text-uppercase fw-bold text-muted d-block mb-0"
                    style={{ fontSize: "0.7rem" }}>
                    Email
                  </label>
                  <div className="text-muted">{person.email}</div>
                </div>
              )}

              {person.mobileNo && (
                <div className="mb-3">
                  <label
                    className="text-uppercase fw-bold text-muted d-block mb-0"
                    style={{ fontSize: "0.7rem" }}>
                    Phone
                  </label>
                  <div className="text-muted">{person.mobileNo}</div>
                </div>
              )}
            </div>

            <div className="mt-4">
              <button
                className="btn btn-outline-custom w-100 py-2 text-uppercase small"
                onClick={() => router.push("/promoters")}>
                &larr; Back to Team
              </button>
            </div>
          </div>

          <div className="col-lg-8 col-md-7">
            <div className="biography-section">
              <h3 className="biography-heading">Biography</h3>
              <div
                className="rich-text-content fs-6"
                style={{ lineHeight: "1.7", color: "#444" }}
                dangerouslySetInnerHTML={{ __html: person.specialization }}
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .rich-text-content :global(p) {
          margin-bottom: 1.5rem;
        }
      `}</style>
    </div>
  );
}
