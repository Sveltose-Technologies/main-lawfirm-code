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
import PaginationComponent from "../../context/Pagination";
import * as authService from "../../services/authService";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

const CMSCategory = () => {
  const GOLD = "#eebb5d";
  const LIGHT_GOLD = "#fdf8ef";

  const [cmsData, setCmsData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allSubcategories, setAllSubcategories] = useState([]);
  const [modal, setModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [formData, setFormData] = useState({
    adminId: "",
    categoryId: "",
    subcategoryIds: [],
    content: "",
  });

  const decodeHtmlEntities = (text) => {
    if (typeof document === "undefined" || !text) return text;
    const textarea = document.createElement("textarea");
    textarea.innerHTML = text;
    return textarea.value;
  };

  const stripHtml = (html) => {
    if (!html) return "";
    const plainText = html.replace(/<[^>]*>?/gm, "");
    return decodeHtmlEntities(plainText);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [cmsRes, catRes, subRes] = await Promise.all([
        authService.getAllCMSCategories(),
        authService.getAllCapabilityCategories(),
        authService.getAllCapabilitySubCategories(),
      ]);

      if (cmsRes.success) setCmsData(cmsRes.data || []);
      if (catRes.success) setCategories(catRes.data.data || catRes.data || []);
      if (subRes.success) setAllSubcategories(subRes.data || []);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggle = () => {
    setModal(!modal);
    if (!modal) {
      setFormData({
        adminId: authService.getAdminId() || "",
        categoryId: "",
        subcategoryIds: [],
        content: "",
      });
      setIsEditing(false);
      setCurrentId(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentAdminId = authService.getAdminId();
    if (!currentAdminId) return;

    setLoading(true);
    try {
      const payload = {
        ...formData,
        adminId: Number(currentAdminId),
        categoryId: Number(formData.categoryId),
        subcategoryIds: formData.subcategoryIds,
      };

      const res = isEditing
        ? await authService.updateCMSCategory(currentId, payload)
        : await authService.createCMSCategory(payload);

      if (res?.success) {
        toggle();
        fetchData();
      }
    } catch (error) {
      console.error("Operation failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const res = await authService.deleteCMSCategory(id);
      if (res?.success) fetchData();
    } catch (e) {
      console.error("Delete failed", e);
    }
  };

  const handleSubCheck = (subId) => {
    setFormData((prev) => {
      const current = [...prev.subcategoryIds];
      return {
        ...prev,
        subcategoryIds: current.includes(subId)
          ? current.filter((id) => id !== subId)
          : [...current, subId],
      };
    });
  };

  const currentItems = cmsData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <Container
      fluid
      className="p-2 p-md-4 min-vh-100"
      style={{ backgroundColor: "#f9f9f9" }}>
      <Row className="align-items-center mb-4 gy-3">
        <Col xs={12} md={8}>
          <h4 className="fw-bold mb-0">CMS Category Management</h4>
          <p className="text-muted small mb-0">
            Manage content and link sub-categories.
          </p>
        </Col>
        <Col xs={12} md={4} className="text-md-end">
          <Button
            className="w-100 w-md-auto px-4 shadow-sm fw-bold"
            style={{ backgroundColor: GOLD, border: "none", color: "#fff" }}
            onClick={toggle}>
            + Create Content
          </Button>
        </Col>
      </Row>

      <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
        <CardBody className="p-0">
          <div className="table-responsive">
            <Table
              hover
              className="align-middle mb-0"
              style={{ minWidth: "800px" }}>
              <thead style={{ backgroundColor: LIGHT_GOLD }}>
                <tr>
                  <th className="px-4 py-3">SR.</th>
                  <th>PARENT CATEGORY</th>
                  <th>SUB-CATEGORIES</th>
                  <th>PREVIEW</th>
                  <th className="text-end px-4">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((item, index) => (
                    <tr key={item.id} className="border-bottom">
                      <td className="px-4">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="fw-bold">
                        {categories.find(
                          (c) => String(c.id) === String(item.categoryId),
                        )?.categoryName || item.categoryId}
                      </td>
                      <td>
                        <div className="d-flex flex-wrap gap-1">
                          {item.subcategoryIds?.map((subId) => (
                            <Badge
                              key={subId}
                              pill
                              color="warning"
                              className="text-dark">
                              {allSubcategories.find(
                                (s) => String(s.id) === String(subId),
                              )?.subcategoryName || subId}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="text-muted small">
                        <div
                          className="text-truncate"
                          style={{ maxWidth: "200px" }}>
                          {stripHtml(item.content)}
                        </div>
                      </td>
                      <td className="text-end px-4">
                        <div className="d-flex justify-content-end gap-2">
                          <Button
                            size="sm"
                            color="light"
                            className="border"
                            onClick={() => {
                              setIsEditing(true);
                              setCurrentId(item.id);
                              setFormData({
                                adminId: authService.getAdminId(),
                                categoryId: item.categoryId,
                                subcategoryIds: item.subcategoryIds || [],
                                content: decodeHtmlEntities(item.content),
                              });
                              setModal(true);
                            }}>
                            ✏️
                          </Button>
                          <Button
                            size="sm"
                            color="light"
                            className="text-danger border"
                            onClick={() => handleDelete(item.id)}>
                            🗑️
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-5">
                      No Records Found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </CardBody>
      </Card>

      <div className="mt-4 d-flex justify-content-center">
        <PaginationComponent
          totalItems={cmsData.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>

      <Modal isOpen={modal} toggle={toggle} centered size="lg">
        <ModalHeader toggle={toggle} className="border-0 pb-0">
          CMS Entry
        </ModalHeader>
        <ModalBody className="p-4">
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label className="fw-bold small">Choose Category</Label>
              <Input
                type="select"
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value })
                }
                required>
                <option value="">-- Select --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.categoryName}
                  </option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label className="fw-bold small">Map Sub-categories</Label>
              <div
                className="border rounded p-3 bg-light"
                style={{ maxHeight: "150px", overflowY: "auto" }}>
                <Row>
                  {allSubcategories
                    .filter(
                      (s) =>
                        String(s.categoryId) === String(formData.categoryId),
                    )
                    .map((sub) => (
                      <Col xs={12} sm={6} key={sub.id} className="mb-2">
                        <div className="form-check">
                          <Input
                            type="checkbox"
                            id={`sub-${sub.id}`}
                            checked={formData.subcategoryIds.includes(sub.id)}
                            onChange={() => handleSubCheck(sub.id)}
                          />
                          <Label
                            for={`sub-${sub.id}`}
                            className="ms-2 small mb-0">
                            {sub.subcategoryName}
                          </Label>
                        </div>
                      </Col>
                    ))}
                </Row>
              </div>
            </FormGroup>
            <FormGroup>
              <Label className="fw-bold small">Description</Label>
              <ReactQuill
                theme="snow"
                value={formData.content}
                onChange={(v) => setFormData({ ...formData, content: v })}
                style={{ height: "200px", marginBottom: "50px" }}
              />
            </FormGroup>
            <div className="d-flex flex-column flex-sm-row gap-2">
              <Button
                type="submit"
                className="flex-grow-1 fw-bold"
                style={{ backgroundColor: GOLD, border: "none" }}
                disabled={loading}>
                {loading ? "Processing..." : "Save Data"}
              </Button>
              <Button outline onClick={toggle} className="flex-grow-1">
                Cancel
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </Container>
  );
};

export default CMSCategory;
