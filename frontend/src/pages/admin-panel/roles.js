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
} from "reactstrap";

const PermissionsPage = () => {
  const [selectedRole, setSelectedRole] = useState("Client");

  const modules = [
    { name: "Dashboard", actions: ["View Stats", "Export Report"] },
    {
      name: "User Module",
      actions: ["Add User", "Edit User", "Delete User", "View List"],
    },
    {
      name: "Profile Section",
      actions: ["View Profile", "Edit Profile", "Change Password"],
    },
  ];

  return (
    <Container className="py-4">
      <h4 className="mb-4">Permission Matrix</h4>
      <Row>
        {/* Left Side: Role Selection */}
        <Col md={3}>
          <Card className="p-3 border-0 shadow-sm">
            <h6>Select Role to Set Rights</h6>
            <hr />
            {["Super Admin", "Client", "Career Professional"].map((role) => (
              <Button
                key={role}
                block
                color={selectedRole === role ? "primary" : "light"}
                className="mb-2 text-start"
                onClick={() => setSelectedRole(role)}>
                {role}
              </Button>
            ))}
          </Card>
        </Col>

        {/* Right Side: Permission Ticks */}
        <Col md={9}>
          <Card className="p-0 border-0 shadow-sm">
            <div className="bg-primary p-3 text-white rounded-top">
              Configuring Rights for: <strong>{selectedRole}</strong>
            </div>
            <Table bordered hover className="mb-0">
              <thead className="bg-light text-center">
                <tr>
                  <th className="text-start">Module / Feature</th>
                  <th>Right Tick (Allow)</th>
                </tr>
              </thead>
              <tbody>
                {modules.map((mod, i) => (
                  <React.Fragment key={i}>
                    <tr className="table-secondary">
                      <td colSpan="2" className="fw-bold">
                        {mod.name}
                      </td>
                    </tr>
                    {mod.actions.map((action, j) => (
                      <tr key={j}>
                        <td className="ps-4">{action}</td>
                        <td className="text-center">
                          <Input
                            type="checkbox"
                            style={{
                              width: "20px",
                              height: "20px",
                              cursor: "pointer",
                            }}
                            defaultChecked={selectedRole === "Super Admin"} // Admin ko saare tick dikhenge
                          />
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </Table>
            <div className="p-3 text-end bg-light">
              <Button color="success" className="px-5">
                Save Permissions for {selectedRole}
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
export default PermissionsPage;
