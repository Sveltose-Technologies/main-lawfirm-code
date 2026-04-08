"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Container,
  Table,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  FormGroup,
  Label,
} from "reactstrap";
import { toast } from "react-toastify";
import * as authService from "../../services/authService";
import PaginationComponent from "../../context/Pagination";

const Services = () => {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [modal, setModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ id: "", content: "" });

  const toggleModal = () => {
    setModal(!modal);
    if (modal) {
      setEditMode(false);
      setFormData({ id: "", content: "" });
    }
  };

  const fetchData = useCallback(async () => {
    try {
      const res = await authService.getAllServices();
      console.log("Fetched Services Data:", res);

      // FIXED MAPPING: Based on your console screenshot, the array is in res.data.data
      const actualData = res?.data?.data || res?.data || [];

      setServices(Array.isArray(actualData) ? actualData : []);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to load services");
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.content.trim()) return toast.error("Content is required");
    try {
      if (editMode) {
        await authService.updateService(formData.id, {
          content: formData.content,
        });
        toast.success("Service updated");
      } else {
        await authService.createService({ content: formData.content });
        toast.success("Service created");
      }
      toggleModal();
      fetchData();
    } catch (err) {
      toast.error("Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this service?")) {
      try {
        await authService.deleteService(id);
        toast.success("Deleted successfully");
        fetchData();
      } catch (err) {
        toast.error("Delete failed");
      }
    }
  };

  const openEditModal = (s) => {
    setEditMode(true);
    setFormData({ id: s.id, content: s.content });
    setModal(true);
  };

  // Truncate logic: 2 words only
  const getTruncatedContent = (str) => {
    if (!str) return "";
    const words = str.trim().split(/\s+/);
    return words.length > 2 ? words.slice(0, 2).join(" ") + "..." : str;
  };

  const filteredData = services.filter((s) =>
    s.content?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <Container fluid className="p-2 p-md-4 bg-white min-vh-100">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <h5 className="fw-bold text-secondary text-uppercase mb-0">
          SERVICE MANAGEMENT
        </h5>
        <div className="d-flex gap-2">
          <Input
            placeholder="Search content..."
            className="bg-light border-0 shadow-sm"
            style={{ maxWidth: "250px" }}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button color="primary" className="fw-bold" onClick={toggleModal}>
            ADD SERVICE
          </Button>
        </div>
      </div>

      <div className="table-responsive shadow-sm rounded border">
        <Table
          hover
          className="align-middle mb-0"
          style={{ minWidth: "800px" }}>
          <thead className="bg-light">
            <tr className="text-secondary small text-uppercase">
              <th style={{ width: "80px" }}>#</th>
              <th>SERVICE CONTENT</th>
              <th className="text-end">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((s, i) => (
                <tr key={s.id} className="small">
                  <td>{(currentPage - 1) * itemsPerPage + i + 1}</td>
                  <td className="fw-bold">{getTruncatedContent(s.content)}</td>
                  <td className="text-end">
                    <div className="d-flex justify-content-end gap-2">
                      <Button
                        outline
                        color="warning"
                        size="sm"
                        className="rounded-circle"
                        onClick={() => openEditModal(s)}>
                        <i className="bi bi-pencil-fill"></i>
                      </Button>
                      <Button
                        outline
                        color="danger"
                        size="sm"
                        className="rounded-circle"
                        onClick={() => handleDelete(s.id)}>
                        <i className="bi bi-trash-fill"></i>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-4 text-muted">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <div className="mt-4 d-flex justify-content-center">
        <PaginationComponent
          totalItems={filteredData.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>

      <Modal isOpen={modal} toggle={toggleModal} centered>
        <ModalHeader
          toggle={toggleModal}
          className="bg-light fw-bold text-primary">
          {editMode ? "EDIT SERVICE" : "ADD SERVICE"}
        </ModalHeader>
        <ModalBody className="p-4">
          <FormGroup>
            <Label className="small fw-bold">Service Content</Label>
            <Input
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Enter content..."
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter className="bg-light">
          <Button color="secondary" outline onClick={toggleModal}>
            Cancel
          </Button>
          <Button
            color="warning"
            className="px-4 fw-bold shadow-sm"
            onClick={handleSubmit}>
            {editMode ? "UPDATE" : "SAVE"}
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default Services;
