"use client";

import React, { useEffect, useState } from "react";
import { getAllPrivacyPolicy } from "../services/authService";

const PrivacyNotice = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrivacyPolicy();
  }, []);

  const fetchPrivacyPolicy = async () => {
    try {
      const response = await getAllPrivacyPolicy();
      if (response?.success && response?.data) {
        // Agar data array nahi hai toh use array mein convert karein
        setSections(
          Array.isArray(response.data) ? response.data : [response.data],
        );
      }
    } catch (error) {
      console.error("Error fetching privacy policy:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-vh-100 py-5">
      <main className="container" style={{ maxWidth: "1000px" }}>
        {/* --- PAGE HEADER --- */}
        <div className="mb-5 border-bottom pb-3"></div>

        {/* --- CONTENT AREA --- */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status"></div>
            <p className="mt-2 text-muted">Loading Information...</p>
          </div>
        ) : sections.length > 0 ? (
          sections.map((section) => (
            <div key={section.id} className="mb-5">
              {/* SECTION TITLE */}
              <h3
                className="fw-bold mb-3"
                style={{ color: "#002147", fontSize: "1.5rem" }}>
                {section.title}
              </h3>

              {/* HTML CONTENT RENDER WITH WRAPPING FIX */}
              <div
                className="privacy-content-wrapper"
                style={{
                  fontSize: "16px",
                  lineHeight: "1.8",
                  color: "#444",
                  textAlign: "justify",
                  wordWrap: "break-word", // 👈 Text wrapping fix
                  overflowWrap: "break-word", // 👈 Text wrapping fix
                  wordBreak: "normal",
                }}
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            </div>
          ))
        ) : (
          <div className="text-center py-5 bg-light rounded">
            <p className="text-muted">
              No Privacy Policy details available at the moment.
            </p>
          </div>
        )}
      </main>

      {/* --- INLINE STYLES TO FORCE WRAPPING --- */}
      <style jsx>{`
        .privacy-content-wrapper :global(p) {
          margin-bottom: 1.2rem;
          white-space: normal !important;
        }
        .privacy-content-wrapper :global(ul),
        .privacy-content-wrapper :global(ol) {
          margin-bottom: 1.5rem;
          padding-left: 1.2rem;
        }
        .privacy-content-wrapper :global(li) {
          margin-bottom: 0.5rem;
        }
        @media (max-width: 768px) {
          .privacy-content-wrapper {
            font-size: 15px !important;
            text-align: left !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PrivacyNotice;
