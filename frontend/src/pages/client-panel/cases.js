import React, { useState, useEffect } from "react";
import Head from "next/head";
import ClientLayout from "../../components/layout/ClientLayout";
// Global component import kiya
import { PaginationBar } from "../../common/GlobalComponents";

export default function CaseManagement() {
  const [view, setView] = useState("list");
  const [activeFilter, setActiveFilter] = useState("Running");
  const [showModal, setShowModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  // --- PAGINATION STATE (Jaisa appointment me hai) ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // --- DATA STATE ---
  const [cases, setCases] = useState([
    {
      id: "LW-8821",
      type: "Civil",
      title: "Property Dispute",
      attorney: "Adv. Tasnia Sharin",
      stage: "Evidence",
      firstParty: "John Doe",
      oppositeParty: "Jane Smith",
      state: "Maharashtra",
      city: "Mumbai",
      court: "HC-05",
      openedDate: "2025-01-10",
      status: "Running",
    },
  ]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    type: "Civil",
    id: "",
    firstParty: "",
    oppositeParty: "",
    state: "",
    city: "",
    court: "",
    stage: "Filed",
  });

  const handleRowClick = (item) => {
    setSelectedCase(item);
    setView("overview");
  };

  const handleCreateCase = (e) => {
    e.preventDefault();
    const newCase = {
      ...formData,
      id: `LW-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "Running",
    };
    setCases([newCase, ...cases]);
    setShowModal(false);
  };

  // --- PAGINATION LOGIC ---
  const filteredCases = cases.filter((c) => c.status === activeFilter);
  const currentCases = filteredCases.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const tabs = [
    "Case Information",
    "Activity Timeline",
    "Orders & Judgments",
    "Documents - KYC",
    "Notes",
    "Opposing Party & Counsel",
    "Team Members",
    "Evidence Checklist",
  ];

  return (
    <ClientLayout>
      <Head>
        <title>Case Details | Lawstick</title>
      </Head>

      <div className="container-fluid px-0">
        {view === "list" ? (
          /* ================== LIST VIEW ================== */
          <div className="animate-fade">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
              <h4
                className="fw-bold m-0"
                style={{ color: "#002147", fontSize: "22px" }}>
                Case Details
              </h4>
              <button
                className="btn btn-navy rounded-pill px-4 fw-bold"
                onClick={() => setShowModal(true)}>
                <i className="bi bi-plus-lg me-2"></i> Create Case
              </button>
            </div>

            {/* 1. STATUS TABS */}
            <div className="d-flex gap-2 mb-4 overflow-auto pb-2 scroll-hide">
              {["Running", "Completed", "Rejected"].map((s) => (
                <button
                  key={s}
                  onClick={() => setActiveFilter(s)}
                  className={`btn rounded-pill px-4 btn-sm fw-bold text-nowrap ${activeFilter === s ? "btn-gold shadow-sm" : "btn-light border text-muted"}`}>
                  {s} Case
                </button>
              ))}
            </div>

            {/* 2. SEARCH DROPDOWNS */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
              <div className="row g-3">
                <div className="col-12 col-md-3">
                  <label className="label-custom">Case Number</label>
                  <select className="form-select select-custom">
                    <option>Select Number</option>
                  </select>
                </div>
                <div className="col-12 col-md-3">
                  <label className="label-custom">Practice Area</label>
                  <select className="form-select select-custom">
                    <option>Select Area</option>
                  </select>
                </div>
                <div className="col-12 col-md-3">
                  <label className="label-custom">Attorney Name</label>
                  <select className="form-select select-custom">
                    <option>Select Attorney</option>
                  </select>
                </div>
                <div className="col-12 col-md-3">
                  <label className="label-custom">Case Stage</label>
                  <select className="form-select select-custom">
                    <option>Select Stage</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 3. RESULTS TABLE */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead style={{ backgroundColor: "#fcf6ef" }}>
                    <tr style={{ fontSize: "13px", color: "#002147" }}>
                      <th className="py-3 px-4">CASE TYPE</th>
                      <th>CASE NUMBER</th>
                      <th>FIRST PARTY</th>
                      <th>OPPOSITE PARTY</th>
                      <th>STATE</th>
                      <th>CITY</th>
                      <th>COURT NO.</th>
                      <th>CASE STAGE</th>
                    </tr>
                  </thead>
                  <tbody style={{ fontSize: "14px" }}>
                    {currentCases.map((item, i) => (
                      <tr
                        key={i}
                        onClick={() => handleRowClick(item)}
                        style={{ cursor: "pointer" }}>
                        <td className="px-4 fw-bold">{item.type}</td>
                        <td className="fw-bold">{item.id}</td>
                        <td>{item.firstParty}</td>
                        <td>{item.oppositeParty}</td>
                        <td>{item.state}</td>
                        <td>{item.city}</td>
                        <td>{item.court}</td>
                        {/* Yahan text color ko dark brown kiya gaya hai taaki wo yellow background par clear dikhe */}
                        <td>
                          <span
                            className="badge bg-warning-subtle rounded-pill px-3"
                            style={{ color: "#856404" }}>
                            {item.stage}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination Bar from global component */}
              <PaginationBar
                current={currentPage}
                total={Math.ceil(filteredCases.length / itemsPerPage)}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        ) : (
          /* ================== OVERVIEW VIEW (TABBED) ================== */
          <div className="animate-fade">
            <div className="d-flex align-items-center mb-4">
              <button
                className="btn btn-light rounded-circle me-3 border shadow-sm"
                onClick={() => setView("list")}>
                <i className="bi bi-arrow-left"></i>
              </button>
              <h4
                className="fw-bold m-0"
                style={{ color: "#002147", fontSize: "22px" }}>
                Case Overview
              </h4>
            </div>

            {/* TABS HEADER */}
            <div className="card border-0 shadow-sm rounded-4 bg-white mb-4 overflow-hidden">
              <div className="d-flex overflow-auto p-2 scroll-hide">
                {tabs.map((tab, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(idx)}
                    className={`btn text-nowrap rounded-pill px-4 py-2 me-2 fw-bold small ${activeTab === idx ? "btn-navy shadow" : "text-muted"}`}>
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* TAB CONTENT */}
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white min-vh-50">
              {activeTab === 0 && (
                <div className="row g-4">
                  {[
                    { l: "Case Type", v: selectedCase.type },
                    { l: "Case Number", v: selectedCase.id },
                    { l: "Case Opened Date", v: selectedCase.openedDate },
                    { l: "First Party Name", v: selectedCase.firstParty },
                    { l: "First Party Attorney", v: selectedCase.attorney },
                    { l: "Opposite Party Name", v: selectedCase.oppositeParty },
                    { l: "Opposite Party Attorney", v: "Adv. Robert Smith" },
                    { l: "State Name", v: selectedCase.state },
                    { l: "City Name", v: selectedCase.city },
                    { l: "Court Number", v: selectedCase.court },
                    { l: "Case Stage", v: selectedCase.stage },
                  ].map((info, i) => (
                    <div className="col-12 col-sm-6 col-md-4" key={i}>
                      <label className="text-muted fw-bold d-block small mb-1">
                        {info.l}
                      </label>
                      <h6
                        className="fw-bold text-navy mb-0"
                        style={{ fontSize: "15px" }}>
                        {info.v}
                      </h6>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 1 && (
                <div className="py-5">
                  <div className="d-flex justify-content-between position-relative timeline-container">
                    <div className="timeline-line"></div>
                    {[
                      "Filed",
                      "Admitted",
                      "Evidence",
                      "Arguments",
                      "Order",
                    ].map((s, i) => (
                      <div
                        key={i}
                        className="text-center position-relative z-1">
                        <div
                          className={`circle-step mx-auto mb-2 ${i <= 2 ? "active" : ""}`}>
                          {i <= 2 ? <i className="bi bi-check-lg"></i> : i + 1}
                        </div>
                        <span className="fw-bold small">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === 2 && (
                <div className="p-5 text-center text-muted fw-bold">
                  <i className="bi bi-file-earmark-lock fs-1 d-block mb-3"></i>
                  No Court Orders available yet.
                </div>
              )}
              {activeTab === 3 && (
                <div className="row g-3">
                  <div className="col-md-3">
                    <div className="p-3 border rounded-3 text-center">
                      <i className="bi bi-file-earmark-pdf fs-3 text-danger"></i>
                      <p className="mt-2 mb-0 small fw-bold">ID_Proof.pdf</p>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 4 && (
                <div className="w-100">
                  <textarea
                    className="form-control mb-3"
                    rows="4"
                    placeholder="Add a case note..."></textarea>
                  <button className="btn btn-navy btn-sm px-4">
                    Save Note
                  </button>
                </div>
              )}
              {activeTab === 5 && (
                <div className="row">
                  <div className="col-md-6 border-end">
                    <h6 className="fw-bold text-muted small">Opposing Party</h6>
                    <p className="fw-bold">{selectedCase.oppositeParty}</p>
                  </div>
                  <div className="col-md-6 ps-md-4">
                    <h6 className="fw-bold text-muted small">Counsel Detail</h6>
                    <p className="fw-bold mb-0">Adv. Robert Smith</p>
                    <small>Mob: +91 9988776655</small>
                  </div>
                </div>
              )}
              {activeTab === 6 && (
                <div className="d-flex gap-4">
                  <div className="text-center">
                    <img
                      src="/assets/images/attorney1.png"
                      className="rounded-circle mb-2"
                      width="50"
                      height="50"
                    />
                    <p className="small fw-bold mb-0">Tasnia (Lead)</p>
                  </div>
                </div>
              )}
              {activeTab === 7 && (
                <div className="w-50">
                  <h6 className="fw-bold mb-3">Completion Status (60%)</h6>
                  <div
                    className="progress rounded-pill mb-3"
                    style={{ height: "10px" }}>
                    <div
                      className="progress-bar bg-gold"
                      style={{ width: "60%" }}></div>
                  </div>
                  <div className="form-check small fw-bold">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked
                      readOnly
                    />
                    <label className="form-check-label">Verified KYC</label>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ================== CREATE CASE MODAL ================== */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card animate-slide">
            <div
              className="p-4 text-white d-flex justify-content-between align-items-center"
              style={{ backgroundColor: "#002147" }}>
              <h5 className="mb-0 fw-bold" style={{ fontSize: "18px" }}>
                Create New Case
              </h5>
              <button
                className="btn-close btn-close-white"
                onClick={() => setShowModal(false)}></button>
            </div>
            <form
              onSubmit={handleCreateCase}
              className="p-4 bg-white overflow-auto"
              style={{ maxHeight: "75vh" }}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="label-custom">Case Type</label>
                  <select
                    className="form-select"
                    name="type"
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }>
                    <option>Civil</option>
                    <option>Criminal</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="label-custom">First Party Name</label>
                  <input
                    type="text"
                    className="form-control"
                    onChange={(e) =>
                      setFormData({ ...formData, firstParty: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="label-custom">Opposite Party Name</label>
                  <input
                    type="text"
                    className="form-control"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        oppositeParty: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="label-custom">State Name</label>
                  <input
                    type="text"
                    className="form-control"
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="label-custom">City Name</label>
                  <input
                    type="text"
                    className="form-control"
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="label-custom">Court Number</label>
                  <input
                    type="text"
                    className="form-control"
                    onChange={(e) =>
                      setFormData({ ...formData, court: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="mt-4 d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-navy w-100 fw-bold py-2">
                  Save Case Record
                </button>
                <button
                  type="button"
                  className="btn btn-light border w-100"
                  onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .text-navy {
          color: #002147;
        }
        .btn-navy {
          background: #002147;
          color: white;
          border: none;
          font-size: 15px;
        }
        .btn-gold {
          background: #de9f57;
          color: white;
          border: none;
        }
        .label-custom {
          font-weight: bold;
          color: #6c757d;
          font-size: 13px;
          margin-bottom: 5px;
          display: block;
        }
        .select-custom {
          font-size: 14px;
          border-color: #eee;
          shadow: none;
        }
        .scroll-hide::-webkit-scrollbar {
          display: none;
        }
        .timeline-container {
          padding: 0 5%;
        }
        .timeline-line {
          position: absolute;
          top: 17px;
          left: 5%;
          width: 90%;
          height: 2px;
          background: #eee;
          z-index: 0;
        }
        .circle-step {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          background: #f8f9fa;
          border: 2px solid #eee;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: #adb5bd;
          transition: 0.3s;
        }
        .circle-step.active {
          background: #002147;
          border-color: #002147;
          color: white;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          z-index: 1050;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 15px;
        }
        .modal-card {
          background: white;
          width: 100%;
          max-width: 650px;
          border-radius: 20px;
          overflow: hidden;
        }
        .animate-fade {
          animation: fadeIn 0.4s ease-in-out;
        }
        .animate-slide {
          animation: slideUp 0.3s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .min-vh-50 {
          min-height: 350px;
        }
        .bg-gold {
          background-color: #002147;
        }
      `}</style>
    </ClientLayout>
  );
}
