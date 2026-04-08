"use client"

import React, { useEffect, useState, useCallback } from "react";
import {
  Container,
  Card,
  CardBody,
  Table,
  Input,
  Button,
  Badge,
} from "reactstrap";
import * as authService from "../services/authService";
import PaginationComponent from "../context/Pagination";

const Clients = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchUsers = useCallback(async () => {
    try {
      const res = await authService.getAllClients();
      setUsers(res?.clients || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this client?")) {
      await authService.deleteClient(id);
      fetchUsers();
    }
  };

  const filteredData = users.filter((u) =>
    `${u.firstName} ${u.lastName} ${u.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <Container
      fluid
      className="p-3 p-md-4 min-vh-100"
      style={{ backgroundColor: "#f9f9f9" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold">Client Management</h4>
        <Badge color="warning" className="px-3 py-2">
          Total: {filteredData.length}
        </Badge>
      </div>
      <Card className="border-0 shadow-sm rounded-4">
        <CardBody className="p-0">
          <div className="p-3 border-bottom">
            <Input
              placeholder="Search..."
              className="rounded-pill bg-light border-0 px-4"
              style={{ maxWidth: "350px" }}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="table-responsive">
            <Table
              hover
              className="align-middle mb-0"
              style={{ fontSize: "13px" }}>
              <thead style={{ backgroundColor: "#fdf8ef" }}>
                <tr>
                  <th className="px-4">SR.</th>
                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th className="text-center">STATUS</th>
                  <th className="text-end px-4">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((u, index) => (
                  <tr key={u.id}>
                    <td className="px-4">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="fw-bold">
                      {u.firstName} {u.lastName}
                    </td>
                    <td>{u.email}</td>
                    <td className="text-center">
                      <Badge color={u.isActive ? "success" : "secondary"}>
                        {u.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="text-end px-4">
                      <Button
                        size="sm"
                        color="white"
                        className="text-danger border"
                        onClick={() => handleDelete(u.id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </CardBody>
      </Card>
      <div className="mt-3">
        <PaginationComponent
          totalItems={filteredData.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </Container>
  );
};
export default Clients;