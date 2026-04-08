import React from "react";
import ClientLayout from "../../components/layout/ClientLayout";

export default function ClientDashboard() {
  return (
    <ClientLayout>
      <div className="animate-fade">
        <h4
          className="fw-bold mb-4"
          style={{ color: "#002147", fontSize: "20px" }}>
          Dashboard Overview
        </h4>

        <div className="row g-3">
          {/* Stats Cards - Stacked on Mobile, 3 in a row on Desktop */}
          {[
            { n: "34", l: "Appointments", c: "#28a745" },
            { n: "02", l: "Pending Cases", c: "#6c757d" },
            { n: "08", l: "Total Cases", c: "#002147" },
          ].map((s, idx) => (
            <div key={idx} className="col-12 col-md-4">
              <div className="card border-0 shadow-sm rounded-4 p-4 text-center bg-white h-100">
                <span className="text-muted small fw-bold text-uppercase">
                  {s.l}
                </span>
                <h1
                  className="fw-bold my-2"
                  style={{ color: s.c, fontSize: "36px" }}>
                  {s.n}
                </h1>
                <div
                  className="progress mx-auto"
                  style={{ height: "4px", width: "40px" }}>
                  <div
                    className="progress-bar"
                    style={{ backgroundColor: s.c, width: "100%" }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Section */}
        <div className="row mt-4 g-4">
          <div className="col-12 col-lg-7">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
              <h6 className="fw-bold text-navy mb-4">Upcoming Schedule</h6>
              <div className="p-5 text-center bg-light rounded-4">
                <i className="bi bi-calendar-x text-muted fs-1 opacity-25"></i>
                <p className="text-muted small mt-2">No Upcoming Dates Found</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-5">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
              <h6 className="fw-bold text-navy mb-3">Quick Actions</h6>
              <div className="row g-2">
                {["Upload Files", "View Bills", "Cases", "Help"].map((btn) => (
                  <div key={btn} className="col-6">
                    <button className="btn btn-outline-light text-dark border p-3 w-100 rounded-3 small fw-bold">
                      <span style={{ fontSize: "11px" }}>{btn}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
