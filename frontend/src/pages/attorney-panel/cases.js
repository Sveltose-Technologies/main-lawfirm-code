import React, { useState } from "react";
import Head from "next/head";
import AttorneyLayout from "../../components/layout/AttorneyLayout";
// Global Pagination import kiya
import { PaginationBar } from "../../common/GlobalComponents";

export default function CaseDetails() {
  const [activeTab, setActiveTab] = useState("open");

  // --- Pagination States ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Expanded Sample Data
  const caseData = [
    {
      type: "Criminal",
      no: "CR-2024-001",
      p1: "John Doe",
      p2: "State Authority",
      state: "New York",
      city: "NYC",
      court: "Court 12",
      stage: "Hearing",
      date: "2024-06-15",
      notes: "Urgent",
      docs: "📁",
    },
    {
      type: "Civil",
      no: "CV-2024-089",
      p1: "Jane Smith",
      p2: "Robert Wilson",
      state: "California",
      city: "LA",
      court: "Court 05",
      stage: "Mediation",
      date: "2024-07-10",
      notes: "Pending",
      docs: "📁",
    },
    {
      type: "Family",
      no: "FM-2024-102",
      p1: "Alice Brown",
      p2: "Mark Brown",
      state: "Texas",
      city: "Houston",
      court: "Court 03",
      stage: "Evidence",
      date: "2024-06-25",
      notes: "Ongoing",
      docs: "📁",
    },
    {
      type: "Criminal",
      no: "CR-2024-004",
      p1: "Suresh Kumar",
      p2: "Govt",
      state: "Delhi",
      city: "Delhi",
      court: "Court 01",
      stage: "Hearing",
      date: "2024-06-20",
      notes: "Normal",
      docs: "📁",
    },
    {
      type: "Civil",
      no: "CV-2024-005",
      p1: "Amit Shah",
      p2: "Rahul G",
      state: "Gujarat",
      city: "Surat",
      court: "Court 09",
      stage: "Final",
      date: "2024-06-22",
      notes: "Important",
      docs: "📁",
    },
    {
      type: "Family",
      no: "FM-2024-006",
      p1: "Priya Rai",
      p2: "Vikram Rai",
      state: "UP",
      city: "Lucknow",
      court: "Court 02",
      stage: "Notice",
      date: "2024-06-28",
      notes: "New",
      docs: "📁",
    },
    {
      type: "Criminal",
      no: "CR-2024-007",
      p1: "Zoya Khan",
      p2: "Police",
      state: "Mumbai",
      city: "Mumbai",
      court: "Court 04",
      stage: "Bail",
      date: "2024-06-30",
      notes: "Urgent",
      docs: "📁",
    },
  ];

  // --- Pagination Logic ---
  const totalPages = Math.ceil(caseData.length / itemsPerPage);
  const currentItems = caseData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <AttorneyLayout>
      

      <div className="container-fluid px-0">
        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
            <h4
              className="fw-bold m-0"
              style={{ color: "#002147", fontSize: "22px" }}>
              Case Details
            </h4>
          </div>
          {/* 1. Open and Closed Tabs */}
          <div className="d-flex gap-2 mb-4 overflow-auto pb-2 scroll-hide">
            {["open", "closed"].map((tab) => (
              <button
                key={tab}
                className={`btn rounded-pill px-4 fw-bold text-nowrap text-capitalize ${activeTab === tab ? "btn-navy shadow-sm" : "btn-light border text-muted"}`}
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(1);
                }}
                style={{ fontSize: "14px" }}>
                {tab} Cases
              </button>
            ))}
          </div>

          {/* 2. Search Dropdowns */}
          <div
            className="card border-0 rounded-4 p-4 mb-5"
            style={{ backgroundColor: "#f8f9fa" }}>
            <div className="row g-3">
              <div className="col-lg-3 col-md-6">
                <label className="label-custom">Case Number</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search #"
                  style={{ fontSize: "14px" }}
                />
              </div>
              <div className="col-lg-3 col-md-6">
                <label className="label-custom">Practice Area</label>
                <select className="form-select" style={{ fontSize: "14px" }}>
                  <option>All Areas</option>
                </select>
              </div>
              <div className="col-lg-3 col-md-6">
                <label className="label-custom">Attorney Name</label>
                <input
                  type="text"
                  className="form-control"
                  style={{ fontSize: "14px" }}
                />
              </div>
              <div className="col-lg-3 col-md-6">
                <label className="label-custom">Case Stage</label>
                <select className="form-select" style={{ fontSize: "14px" }}>
                  <option>All Stages</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. Search Results Table */}
          <div className="table-responsive border rounded-3 overflow-hidden mb-3">
            <table className="table table-hover align-middle mb-0">
              <thead style={{ backgroundColor: "#fcf6ef" }}>
                <tr style={{ color: "#002147", fontSize: "13px" }}>
                  <th className="py-3 px-3">CASE TYPE</th>
                  <th>CASE NUMBER</th>
                  <th>FIRST PARTY</th>
                  <th>OPPOSITE PARTY</th>
                  <th>STATE</th>
                  <th>CITY</th>
                  <th>COURT NO.</th>
                  <th>STAGE</th>
                  <th>NEXT DATE</th>
                  <th>DOCS</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: "14px", color: "#444" }}>
                {currentItems.map((val, idx) => (
                  <tr key={idx} className="border-bottom">
                    <td className="py-3 px-3 fw-bold">{val.type}</td>
                    <td>
                      <span className="badge bg-light text-dark border px-2">
                        {val.no}
                      </span>
                    </td>
                    <td>{val.p1}</td>
                    <td>{val.p2}</td>
                    <td>{val.state}</td>
                    <td>{val.city}</td>
                    <td>{val.court}</td>
                    <td>
                      <span className="text-primary fw-bold">{val.stage}</span>
                    </td>
                    <td>{val.date}</td>
                    <td className="text-center" style={{ cursor: "pointer" }}>
                      {val.docs}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Global Pagination Bar */}
            <PaginationBar
              current={currentPage}
              total={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>

          {/* 4. Case Transfer Section */}
          <div
            className="mb-5 p-4 border rounded-4 bg-light"
            style={{ borderStyle: "dashed !important" }}>
            <h6
              className="fw-bold mb-2"
              style={{ color: "#002147", fontSize: "16px" }}>
              Case Transfer Details
            </h6>
            <p className="text-muted mb-3" style={{ fontSize: "13px" }}>
              If case transferred from previous lawyer/court name, please enter
              the details below.
            </p>
            <div className="row g-3">
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Previous Lawyer Name"
                  style={{ fontSize: "14px" }}
                />
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Previous Court Name"
                  style={{ fontSize: "14px" }}
                />
              </div>
            </div>
          </div>

          {/* 5. Case Documents Upload */}
          <div>
            <h6
              className="fw-bold mb-4"
              style={{ color: "#002147", fontSize: "16px" }}>
              Case Documents Upload Section
            </h6>
            <div className="row g-4 text-center">
              {["Attorney", "Client", "Office Staff"].map((user, idx) => (
                <div className="col-md-4" key={idx}>
                  <div className="p-4 border rounded-4 bg-white shadow-sm h-100">
                    <i
                      className="bi bi-cloud-arrow-up fs-2 mb-2 d-block"
                      style={{ color: "#de9f57" }}></i>
                    <p
                      className="fw-bold mb-3"
                      style={{ fontSize: "14px", color: "#002147" }}>
                      {user} Upload
                    </p>
                    <input
                      type="file"
                      className="form-control form-control-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .btn-navy {
          background-color: #002147;
          color: white;
          border: none;
        }
        .btn-navy:hover {
          background-color: #001630;
          color: white;
        }
        .label-custom {
          font-weight: bold;
          color: #6c757d;
          font-size: 13px;
          margin-bottom: 5px;
          display: block;
        }
        .scroll-hide::-webkit-scrollbar {
          display: none;
        }
        .form-control:focus,
        .form-select:focus {
          border-color: #de9f57;
          box-shadow: none;
        }
        :global(.container-fluid) {
          max-width: 100% !important;
        }
      `}</style>
    </AttorneyLayout>
  );
}
