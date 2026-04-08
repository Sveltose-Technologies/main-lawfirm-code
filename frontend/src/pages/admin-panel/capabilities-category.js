"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { toast } from "react-toastify";
import * as authService from "../../services/authService";
import PaginationComponent from "../../context/Pagination";

import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const CapabilityCategory = () => {
  const [categories, setCategories] = useState([]);
  const [modal, setModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    categoryName: "",
    description: "",
    bannerImage: null,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const stripHtmlToTwoWords = (html) => {
    if (!html) return "";
    let text = html.replace(/<[^>]*>/g, "");
    const words = text.trim().split(/\s+/);
    if (words.length <= 2) return text;
    return words.slice(0, 2).join(" ") + "...";
  };

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["clean"],
      ],
    }),
    [],
  );

const fetchData = useCallback(async () => {
  setLoading(true);
  try {
    const res = await authService.getAllCapabilityCategories();

    // Debugging ke liye yahan log lagayein
    console.log("Full API Response in Component:", res);

    // Agar response { success: true, data: [...] } hai
    const actualData = res?.data || [];

    if (Array.isArray(actualData)) {
      setCategories(actualData);
    } else {
      setCategories([]);
    }
  } catch (error) {
    toast.error("Failed to load categories");
    setCategories([]);
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggle = () => {
    setModal(!modal);
    if (modal) {
      setFormData({ categoryName: "", description: "", bannerImage: null });
      setIsEditing(false);
      setCurrentId(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append("adminId", "1");
      data.append("categoryName", formData.categoryName.trim());
      data.append("description", formData.description);
      if (formData.bannerImage instanceof File)
        data.append("bannerImage", formData.bannerImage);

      const res = isEditing
        ? await authService.updateCapabilityCategory(currentId, data)
        : await authService.createCapabilityCategory(data);

      if (res) {
        toast.success(res.message || "Operation successful");
        toggle();
        fetchData();
      }
    } catch (error) {
      toast.error(error || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this category?")) {
      try {
        const res = await authService.deleteCapabilityCategory(id);
        toast.success(res.message || "Deleted successfully");
        fetchData();
      } catch (error) {
        toast.error(error || "Delete failed");
      }
    }
  };

  const handleEdit = (item) => {
    setFormData({
      categoryName: item.categoryName || "",
      description: item.description || "",
      bannerImage: null,
    });
    setCurrentId(item.id);
    setIsEditing(true);
    setModal(true);
  };

  const currentItems = Array.isArray(categories)
    ? categories.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
      )
    : [];

  return (
    <Container fluid className="py-4 bg-light-gray min-vh-100">
      <Row className="mb-4 align-items-center g-3">
        <Col xs={12} md={6}>
          <h4 className="fw-bold text-blue mb-0">Capability Categories</h4>
          <p className="text-muted small mb-0">
            Manage law firm practice areas.
          </p>
        </Col>
        <Col xs={12} md={6} className="text-md-end">
          <Button
            className="btn-gold w-100 w-md-auto shadow-sm"
            onClick={toggle}>
            + Add Category
          </Button>
        </Col>
      </Row>

      <Card className="border-0 card-shadow">
        <CardBody className="p-0">
          <div className="table-responsive">
            <Table hover className="align-middle mb-0">
              <thead className="table-dark-custom">
                <tr>
                  <th className="px-4">SR.</th>
                  <th>IMAGE</th>
                  <th>CATEGORY</th>
                  <th className="d-none d-md-table-cell">SUMMARY</th>
                  <th className="text-end px-4">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={item.id}>
                    <td className="px-4">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td>
                      <img
                        src={authService.getImgUrl(item.bannerImage)}
                        className="rounded border"
                        style={{
                          width: "50px",
                          height: "35px",
                          objectFit: "cover",
                        }}
                        alt="img"
                        onError={(e) =>
                          (e.target.src = "https://placehold.co/50x35?text=NA")
                        }
                      />
                    </td>
                    <td className="fw-bold">{item.categoryName}</td>
                    <td className="d-none d-md-table-cell text-muted">
                      {stripHtmlToTwoWords(item.description)}
                    </td>
                    <td className="text-end px-4">
                      <div className="d-flex justify-content-end gap-2">
                        <Button
                          color="light"
                          size="sm"
                          className="border shadow-sm"
                          onClick={() => handleEdit(item)}>
                          ✏️
                        </Button>
                        <Button
                          color="light"
                          size="sm"
                          className="border shadow-sm text-danger"
                          onClick={() => handleDelete(item.id)}>
                          🗑️
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </CardBody>
      </Card>

      <div className="mt-4 d-flex justify-content-center">
        <PaginationComponent
          totalItems={Array.isArray(categories) ? categories.length : 0}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>

      <Modal isOpen={modal} toggle={toggle} centered size="lg">
        <ModalHeader toggle={toggle} className="text-gold fw-bold">
          {isEditing ? "Update Category" : "New Category"}
        </ModalHeader>
        <ModalBody className="p-4">
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={6}>
                <FormGroup>
                  <Label className="fw-bold small">Category Name *</Label>
                  <Input
                    value={formData.categoryName}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryName: e.target.value })
                    }
                    required
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className="fw-bold small">
                    Banner Image {isEditing && "(Optional)"}
                  </Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bannerImage: e.target.files[0],
                      })
                    }
                    required={!isEditing}
                  />
                </FormGroup>
              </Col>
              <Col xs={12}>
                <FormGroup>
                  <Label className="fw-bold small">Description *</Label>
                  <div className="bg-white" style={{ marginBottom: "50px" }}>
                    <ReactQuill
                      theme="snow"
                      value={formData.description}
                      onChange={(v) =>
                        setFormData({ ...formData, description: v })
                      }
                      modules={modules}
                      style={{ height: "200px" }}
                    />
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <div className="d-flex flex-column flex-md-row gap-2 mt-4 mt-md-0">
              <Button
                type="submit"
                className="btn-gold px-5 order-0 order-md-1"
                disabled={loading}>
                {loading ? "Processing..." : "Save Changes"}
              </Button>
              <Button
                outline
                onClick={toggle}
                className="btn-outline-custom px-4 order-1 order-md-0">
                Cancel
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </Container>
  );
};

export default CapabilityCategory;
