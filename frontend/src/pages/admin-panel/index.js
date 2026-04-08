import React from "react";
import { Row, Col, Card, CardBody } from "reactstrap";
import ProfitChart from "../../components/admin/ProfitChart";

// Statistics Data
const statsData = [
  {
    title: "Total Attorneys",
    count: "6",
    icon: "bi bi-people-fill",
    color: "warning",
    bgColor: "#fff4e5",
  },
  {
    title: "Total Clients",
    count: "51",
    icon: "bi bi-people",
    color: "info",
    bgColor: "#e0f7fa",
  },
  {
    title: "Total Cases",
    count: "9",
    icon: "bi bi-briefcase-fill",
    color: "success",
    bgColor: "#e8f5e9",
  },
  {
    title: "Ongoing Cases",
    count: "1",
    icon: "bi bi-journal-text",
    color: "primary",
    bgColor: "#e3f2fd",
  },
  {
    title: "Success Cases",
    count: "2",
    icon: "bi bi-check-circle-fill",
    color: "danger",
    bgColor: "#ffebee",
  },
  {
    title: "Wallet Balance",
    count: "$11,133",
    icon: "bi bi-wallet-fill",
    color: "secondary",
    bgColor: "#f3e5f5",
  },
];

export default function AdminDashboard() {
  return (
    <div className="container-fluid p-0">
      {/* Welcome Header */}
      <div className="mb-4">
        <h3 className="fw-bold" style={{ color: "#002147" }}>
          Dashboard Overview
        </h3>
        <p className="text-muted small">
          Welcome back, Admin! Here is the latest summary of your law firm.
        </p>
      </div>

      {/* Statistics Cards Row */}
      <Row className="g-3 mb-4">
        {statsData.map((item, index) => (
          <Col sm="6" lg="4" key={index}>
            <Card className="border-0 shadow-sm rounded-4 h-100">
              <CardBody className="d-flex align-items-center gap-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: "55px",
                    height: "55px",
                    backgroundColor: item.bgColor,
                  }}>
                  <i className={`${item.icon} fs-4 text-${item.color}`}></i>
                </div>
                <div>
                  <p
                    className="text-muted mb-0 small fw-bold text-uppercase"
                    style={{ letterSpacing: "0.5px" }}>
                    {item.title}
                  </p>
                  <h3 className="fw-bold mb-0" style={{ color: "#002147" }}>
                    {item.count}
                  </h3>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Analytics Section */}
      <Row className="g-4">
        {/* Main Performance Chart Placeholder */}
        <Col lg="8">
          <Card
            className="border-0 shadow-sm p-4 bg-white rounded-4 h-100"
            style={{ minHeight: "380px" }}>
            <h5
              className="fw-bold mb-4"
              style={{
                borderLeft: "4px solid #002147",
                paddingLeft: "15px",
              }}>
              Firm Performance Analytics
            </h5>
            <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1 bg-light rounded-4 border border-dashed py-5">
              <i className="bi bi-graph-up-arrow fs-1 text-muted opacity-50"></i>
              <p className="text-muted mt-3 fw-medium">
                Detailed performance statistics and case trends will appear
                here.
              </p>
            </div>
          </Card>
        </Col>

        {/* Profit Chart Component */}
        <Col lg="4">
          <ProfitChart />
        </Col>
      </Row>

    </div>
  );
}
