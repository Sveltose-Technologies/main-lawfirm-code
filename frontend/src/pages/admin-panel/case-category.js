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
  FormGroup,
  Label,
  Row,
  Col,
} from "reactstrap";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import * as authService from "../../services/authService";
import PaginationComponent from "../../context/Pagination";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const CaseCategory = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    categoryName: "",
    description: "",
  });

  const toggleModal = () => {
    setModal(!modal);
    if (modal) {
      setFormData({ id: "", categoryName: "", description: "" });
      setIsEdit(false);
    }
  };

  const fetchData = useCallback(async () => {
    try {
      const res = await authService.getAllCaseCategories();
      // Handle different API response structures
      setCategories(res?.data || res || []);
    } catch (err) {
      toast.error("Failed to load categories");
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (content) => {
    setFormData((prev) => ({ ...prev, description: content }));
  };

  const handleSubmit = async () => {
    if (!formData.categoryName || !formData.description) {
      return toast.warn("Please fill all fields");
    }

    try {
      if (isEdit) {
        await authService.updateCaseCategory(formData.id, {
          categoryName: formData.categoryName,
          description: formData.description,
        });
        toast.success("Category updated successfully");
      } else {
        await authService.createCaseCategory(formData);
        toast.success("Category created successfully");
      }
      toggleModal();
      fetchData();
    } catch (err) {
      toast.error(isEdit ? "Update failed" : "Creation failed");
    }
  };

  const openEditModal = (cat) => {
    setFormData({
      id: cat.id,
      categoryName: cat.categoryName,
      description: cat.description,
    });
    setIsEdit(true);
    setModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await authService.deleteCaseCategory(id);
        toast.success("Deleted successfully");
        fetchData();
      } catch (err) {
        toast.error("Delete failed");
      }
    }
  };

  // Helper to strip HTML and show only 3 words
  const formatDescription = (html) => {
    const plainText = html.replace(/<[^>]*>/g, ""); // Strip HTML tags
    const words = plainText.split(/\s+/);
    if (words.length > 3) {
      return words.slice(0, 3).join(" ") + "...";
    }
    return plainText;
  };

  const filteredData = categories.filter((c) =>
    c.categoryName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <Container fluid className="p-4 bg-white min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold text-secondary">CASE CATEGORIES</h5>
        <div className="d-flex gap-2">
          <Input
            placeholder="Search category..."
            className="bg-light border-0"
            style={{ maxWidth: "250px" }}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button color="primary" onClick={toggleModal}>
            <i className="bi bi-plus-lg me-1"></i> Add New
          </Button>
        </div>
      </div>       

      <Table hover responsive className="align-middle border-top">
        <thead>
          <tr className="text-secondary small">
            <th>#</th>
            <th>CATEGORY NAME</th>
            <th>DESCRIPTION</th>
            <th className="text-end">ACTION</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((c, i) => (
            <tr key={c.id}>
              <td>{(currentPage - 1) * itemsPerPage + i + 1}</td>
              <td className="fw-bold text-dark">{c.categoryName}</td>
              <td className="text-muted small">
                {formatDescription(c.description)}
              </td>
              <td className="text-end">
                <Button
                  outline
                  color="warning"
                  className="rounded-circle me-2 p-1"
                  style={{ width: "32px", height: "32px" }}
                  onClick={() => openEditModal(c)}>
                  <i className="bi bi-pencil-fill small"></i>
                </Button>
                <Button
                  outline
                  color="danger"
                  className="rounded-circle p-1"
                  style={{ width: "32px", height: "32px" }}
                  onClick={() => handleDelete(c.id)}>
                  <i className="bi bi-trash-fill small"></i>
                </Button>
              </td>
            </tr>
          ))}
          {filteredData.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center py-4">
                No categories found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <PaginationComponent
        totalItems={filteredData.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {/* CREATE / UPDATE MODAL */}
      <Modal isOpen={modal} toggle={toggleModal} size="lg" centered>
        <ModalHeader toggle={toggleModal} className="fw-bold">
          {isEdit ? "Update Case Category" : "Add New Case Category"}
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label className="small fw-bold">Category Name</Label>
            <Input
              name="categoryName"
              placeholder="Enter category name"
              value={formData.categoryName}
              onChange={handleInputChange}
            />
          </FormGroup>
          <FormGroup>
            <Label className="small fw-bold">Description</Label>
            <div style={{ height: "250px", marginBottom: "50px" }}>
              <ReactQuill
                theme="snow"
                value={formData.description}
                onChange={handleEditorChange}
                style={{ height: "200px" }}
              />
            </div>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" outline onClick={toggleModal}>
            Cancel
          </Button>
          <Button color="primary" className="px-4" onClick={handleSubmit}>
            {isEdit ? "Save Changes" : "Create Category"}
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default CaseCategory;
