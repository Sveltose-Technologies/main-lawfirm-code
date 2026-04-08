"use client";

import React, { useState } from "react";
import {
  Container,
  Table,
  Button,
  Card,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  Label,
  FormGroup,
} from "reactstrap";

const UserPage = () => {
  const [modal, setModal] = useState(false);
  const [users] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Client",
      status: "Active",
    },
    {
      id: 2,
      name: "Sarah Smith",
      email: "sarah@pro.com",
      role: "Career Professional",
      status: "Active",
    },
  ]);

  return (
    <Container className="py-4">
      <Card className="p-4 shadow-sm border-0">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold">User Management</h4>
          <Button color="success" onClick={() => setModal(true)}>
            + Add New User
          </Button>
        </div>
        <Table hover responsive className="align-middle">
          <thead className="bg-light">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role Assigned</th>
              <th>Status</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="fw-bold">{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <Badge color="info" pill>
                    {u.role}
                  </Badge>
                </td>
                <td>
                  <Badge color="success">{u.status}</Badge>
                </td>
                <td className="text-end">
                  <Button color="light" size="sm" border>
                    Manage Profile
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      <Modal isOpen={modal} toggle={() => setModal(false)} size="lg" centered>
        <ModalHeader toggle={() => setModal(false)}>
          Register New User
        </ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-md-6 mb-3">
              <FormGroup>
                <Label>Full Name</Label>
                <Input placeholder="Enter Name" />
              </FormGroup>
            </div>
            <div className="col-md-6 mb-3">
              <FormGroup>
                <Label>Email Address</Label>
                <Input type="email" placeholder="email@domain.com" />
              </FormGroup>
            </div>
            <div className="col-md-12 mb-3">
              <FormGroup>
                <Label>Assign System Role</Label>
                <Input type="select">
                  <option>Select a Role</option>
                  <option>Super Admin</option>
                  <option>Client</option>
                  <option>Career Professional</option>
                </Input>
              </FormGroup>
            </div>
          </div>
          <Button color="success" block className="mt-2">
            Create User Account
          </Button>
        </ModalBody>
      </Modal>
    </Container>
  );
};

export default UserPage;
