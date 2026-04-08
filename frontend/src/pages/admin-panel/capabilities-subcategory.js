"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  Badge,
} from "reactstrap";
import { toast } from "react-toastify";
import * as authService from "../../services/authService";
import PaginationComponent from "../../context/Pagination";

import "react-quill/dist/quill.snow.css";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const CapabilitySubCategory = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [modal, setModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    categoryId: "",
    subcategoryName: "",
    description: "",
    bannerImage: null,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Description format: Only 2 words + ...
  const formatSummary = (html) => {
    if (!html) return "";
    const text = html.replace(/<[^>]*>/g, "").trim();
    const words = text.split(/\s+/);
    if (words.length <= 2) return text;
    return words.slice(0, 2).join(" ") + "...";
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [subRes, catRes] = await Promise.all([
        authService.getAllCapabilitySubCategories(),
        authService.getAllCapabilityCategories(),
      ]);
      setSubcategories(
        Array.isArray(subRes.data || subRes) ? subRes.data || subRes : [],
      );
      setParentCategories(
        Array.isArray(catRes.data || catRes) ? catRes.data || catRes : [],
      );
    } catch (error) {
      toast.error(error || "Data loading failed");
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
      setFormData({
        categoryId: "",
        subcategoryName: "",
        description: "",
        bannerImage: null,
      });
      setIsEditing(false);
      setCurrentId(null);
    }
  };

  const getCategoryName = (id) => {
    const found = parentCategories.find((cat) => String(cat.id) === String(id));
    return found ? found.categoryName : "N/A";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append("adminId", "1");
      data.append("categoryId", formData.categoryId);
      data.append("subcategoryName", formData.subcategoryName.trim());
      data.append("description", formData.description);
      if (formData.bannerImage instanceof File)
        data.append("bannerImage", formData.bannerImage);

      const res = isEditing
        ? await authService.updateCapabilitySubCategory(currentId, data)
        : await authService.createCapabilitySubCategory(data);

      if (res && res.success) {
        toast.success(res.message || "Saved Successfully");
        toggle();
        fetchData();
      }
    } catch (err) {
      toast.error(err || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      categoryId: item.categoryId || "",
      subcategoryName: item.subcategoryName || "",
      description: item.description || "",
      bannerImage: null,
    });
    setCurrentId(item.id);
    setIsEditing(true);
    setModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this subcategory?")) {
      try {
        await authService.deleteCapabilitySubCategory(id);
        toast.success("Deleted");
        fetchData();
      } catch (err) {
        toast.error(err);
      }
    }
  };

  const currentItems = subcategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <Container fluid className="p-2 p-md-4 min-vh-100 bg-light-gray">
      <Row className="mb-4 align-items-center g-3">
        <Col xs={12} md={6}>
          <h4 className="fw-bold mb-0 text-dark">Subcategories</h4>
          <p className="text-muted small mb-0">
            Manage services and specialized areas.
          </p>
        </Col>
        <Col xs={12} md={6} className="text-md-end">
          <Button
            className="btn-gold-custom w-100 w-md-auto shadow-sm"
            onClick={toggle}>
            + Add Subcategory
          </Button>
        </Col>
      </Row>

      <Card className="border-0 shadow-sm rounded-0">
        <CardBody className="p-0">
          <div className="table-responsive">
            <Table hover className="align-middle mb-0">
              <thead className="table-dark-custom">
                <tr>
                  <th className="px-4 py-3">SR.</th>
                  <th>IMAGE</th>
                  <th>SUBCATEGORY</th>
                  <th className="d-none d-lg-table-cell">PARENT</th>
                  <th>SUMMARY</th>
                  <th className="text-end px-4">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={item.id}>
                    <td className="px-4 text-muted">
                      {(currentPage - 1) * itemsPerPage + index + 1}.
                    </td>
                    <td>
                      <img
                        src={authService.getImgUrl(item.bannerImage)}
                        className="border"
                        style={{
                          width: "45px",
                          height: "30px",
                          objectFit: "cover",
                        }}
                        alt="sub"
                        onError={(e) =>
                          (e.target.src = "https://placehold.co/45x30")
                        }
                      />
                    </td>
                    <td className="fw-bold text-dark">
                      {item.subcategoryName}
                    </td>
                    <td className="d-none d-lg-table-cell">
                      <Badge className="bg-dark text-white rounded-0 px-2 fw-normal">
                        {getCategoryName(item.categoryId)}
                      </Badge>
                    </td>
                    <td className="text-muted small">
                      {formatSummary(item.description)}
                    </td>
                    <td className="text-end px-4">
                      <div className="d-flex justify-content-end gap-2">
                        <Button
                          className="btn-action"
                          onClick={() => handleEdit(item)}>
                          ✏️
                        </Button>
                        <Button
                          className="btn-action text-danger"
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
          totalItems={subcategories.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>

      <Modal
        isOpen={modal}
        toggle={toggle}
        size="lg"
        centered
        className="rounded-0">
        <ModalHeader toggle={toggle} className="fw-bold text-dark border-0">
          {isEditing ? "Edit Subcategory" : "Add Subcategory"}
        </ModalHeader>
        <ModalBody className="px-4 pb-4 pt-0">
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={6}>
                <FormGroup>
                  <Label className="fw-bold small">Parent Category *</Label>
                  <Input
                    type="select"
                    className="rounded-0"
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: e.target.value })
                    }
                    required>
                    <option value="">-- Select Category --</option>
                    {parentCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.categoryName}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className="fw-bold small">Subcategory Name *</Label>
                  <Input
                    className="rounded-0"
                    value={formData.subcategoryName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        subcategoryName: e.target.value,
                      })
                    }
                    required
                  />
                </FormGroup>
              </Col>
              <Col xs={12}>
                <FormGroup>
                  <Label className="fw-bold small">Banner Image</Label>
                  <Input
                    className="rounded-0"
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
                  <div style={{ marginBottom: "55px" }}>
                    <ReactQuill
                      theme="snow"
                      value={formData.description}
                      onChange={(v) =>
                        setFormData({ ...formData, description: v })
                      }
                      style={{ height: "180px" }}
                    />
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <div className="d-flex flex-column flex-md-row gap-2 mt-4 mt-md-0">
              <Button
                type="submit"
                className="btn-gold-custom order-0 order-md-1"
                disabled={loading}>
                {loading ? "Saving..." : "Sumbit"}
              </Button>
              <Button
                className="btn-outline-custom order-1 order-md-0"
                onClick={toggle}>
                Cancle
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </Container>
  );
};

export default CapabilitySubCategory;
