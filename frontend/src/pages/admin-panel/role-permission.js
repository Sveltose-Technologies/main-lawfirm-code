"use client";

import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Input,
  Badge,
  Button,
  CardHeader,
  CardBody,
} from "reactstrap";

const PermissionPage = () => {
  const [selectedRole, setSelectedRole] = useState("Client");

  // Static Data Structure
  const permissionsList = [
    {
      module: "User Control",
      actions: ["Create User", "Edit User", "Delete User", "View User List"],
    },
    {
      module: "Profile Features",
      actions: [
        "View Profile",
        "Edit Profile",
        "Change Password",
        "Delete Account",
      ],
    },
    {
      module: "Reports",
      actions: ["Download CSV", "View Analytics", "Print Invoice"],
    },
  ];

  return (
    <Container fluid className="py-4">
      <Row>
        <Col md={3}>
          <Card className="shadow-sm border-0">
            <CardHeader className="bg-white fw-bold">Select Role</CardHeader>
            <CardBody className="p-2">
              {["Super Admin", "Client", "Career Professional"].map((role) => (
                <Button
                  key={role}
                  block
                  color={selectedRole === role ? "primary" : "link"}
                  className={`text-start mb-1 ${selectedRole === role ? "" : "text-decoration-none text-dark"}`}
                  onClick={() => setSelectedRole(role)}>
                  {selectedRole === role ? "● " : ""} {role}
                </Button>
              ))}
            </CardBody>
          </Card>
          <div className="mt-3">
            <Button color="success" block className="fw-bold shadow-sm">
              SAVE CHANGES
            </Button>
          </div>
        </Col>

        <Col md={9}>
          <Card className="shadow-sm border-0">
            <CardHeader className="bg-primary text-white d-flex justify-content-between">
              <span className="fw-bold">Access Rights: {selectedRole}</span>
              <Badge color="light" text="dark">
                Permissions Matrix
              </Badge>
            </CardHeader>
            <CardBody className="p-0">
              <Table responsive hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="ps-4">Feature / Module Name</th>
                    <th className="text-center">Grant Access (Tick)</th>
                  </tr>
                </thead>
                <tbody>
                  {permissionsList.map((group, i) => (
                    <React.Fragment key={i}>
                      <tr className="table-secondary">
                        <td
                          colSpan="2"
                          className="ps-4 fw-bold small text-uppercase text-muted">
                          {group.module}
                        </td>
                      </tr>
                      {group.actions.map((action, j) => (
                        <tr key={j}>
                          <td className="ps-5 text-dark">{action}</td>
                          <td className="text-center">
                            <div className="form-check form-switch d-flex justify-content-center">
                              <Input
                                type="switch"
                                style={{
                                  width: "40px",
                                  height: "20px",
                                  cursor: "pointer",
                                }}
                                defaultChecked={selectedRole === "Super Admin"} // Defaulting Admin to fully ticked
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PermissionPage;
