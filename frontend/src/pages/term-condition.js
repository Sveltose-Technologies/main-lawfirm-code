"use client";

import React, { useEffect, useState } from "react";
import { getAllTermsConditions } from "../services/authService";

const TermsPage = () => {
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    try {
      const response = await getAllTermsConditions();
      if (response?.success && response?.data) {
        // Ensure data is an array
        setTerms(
          Array.isArray(response.data) ? response.data : [response.data],
        );
      }
    } catch (error) {
      console.error("Error fetching terms:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-vh-100">
      {/* Content starts with padding-top to ensure it's not hidden behind the Navbar */}
      <main className="container pt-5 pb-5" style={{ maxWidth: "1000px" }}>
        {/* Simple Page Title - Starts directly below header */}
        <div className="mb-5 border-bottom pb-2"></div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2 text-muted">Loading Terms...</p>
          </div>
        ) : terms.length > 0 ? (
          terms.map((item) => (
            <div key={item.id} className="mb-5">
              {/* SECTION TITLE */}
              <h3
                className="fw-bold mb-3"
                style={{
                  color: "#002147",
                  borderLeft: "4px solid #EEBB5D",
                  paddingLeft: "15px",
                }}>
                {item.title}
              </h3>

              {/* HTML CONTENT WITH WRAPPING FIX */}
              <div
                className="legal-content-wrapper"
                style={{
                  fontSize: "16px",
                  lineHeight: "1.8",
                  color: "#333",
                  textAlign: "justify",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                  whiteSpace: "normal",
                }}
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
            </div>
          ))
        ) : (
          <div className="text-center py-5">
            <p className="text-muted">No Terms and Conditions found.</p>
          </div>
        )}
      </main>

      {/* --- CSS TO FIX RIGHT-SIDE OVERFLOW --- */}
      <style jsx>{`
        .legal-content-wrapper :global(p) {
          margin-bottom: 1.2rem;
          white-space: normal !important; /* Forces text to wrap correctly */
          word-break: normal;
        }
        .legal-content-wrapper :global(ul),
        .legal-content-wrapper :global(ol) {
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
        }
        .legal-content-wrapper :global(li) {
          margin-bottom: 0.5rem;
        }
        @media (max-width: 768px) {
          .container {
            padding-left: 20px;
            padding-right: 20px;
          }
          .legal-content-wrapper {
            font-size: 15px !important;
            text-align: left !important;
          }
        }
      `}</style>
    </div>
  );
};

export default TermsPage;
