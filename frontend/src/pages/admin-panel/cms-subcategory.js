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
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import * as authService from "../../services/authService";
import PaginationComponent from "../../context/Pagination";

import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

const CMSSubcategory = () => {
  const GOLD = "#eebb5d";
  const LIGHT_GOLD = "#fdf8ef";

  const [cmsSubList, setCmsSubList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allSubcategories, setAllSubcategories] = useState([]);
  const [modal, setModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    adminId: "",
    categoryId: "",
    subcategoryId: "",
    content: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Helper functions
  const getCatName = (id) =>
    categories.find((c) => String(c.id) === String(id))?.categoryName ||
    `ID: ${id}`;
  const getSubName = (id) =>
    allSubcategories.find((s) => String(s.id) === String(id))
      ?.subcategoryName || `ID: ${id}`;

  // Decode HTML entities like &nbsp;, &amp;
  const decodeHtmlEntities = (text) => {
    if (!text) return "";
    const textarea = document.createElement("textarea");
    textarea.innerHTML = text;
    return textarea.value;
  };

  // Strip HTML and decode entities for preview
  const stripHtml = (html) => {
    if (!html) return "";
    const plainText = html.replace(/<[^>]*>?/gm, ""); // remove HTML tags
    return decodeHtmlEntities(plainText); // decode entities
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authService.getAllCMSSubcategories();
      setCmsSubList(res.data || res || []);

      const catRes = await authService.getAllCapabilityCategories();
      setCategories(catRes.data?.data || catRes.data || []);

      const subRes = await authService.getAllCapabilitySubCategories();
      setAllSubcategories(subRes.data || []);
    } catch (error) {
      toast.error("Fetch failed");
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
     // Get dynamic Admin ID from localStorage
     const currentAdminId = authService.getAdminId();

     setFormData({
       adminId: currentAdminId || "", // Set dynamic ID instead of "3"
       categoryId: "",
       subcategoryId: "",
       content: "",
     });
     setIsEditing(false);
   }
 };

 const handleSubmit = async (e) => {
   e.preventDefault();

   // Ensure Admin ID is retrieved dynamically
   const currentAdminId = authService.getAdminId();

   if (!currentAdminId) {
     toast.error("Session expired. Please login again.");
     return;
   }

   setLoading(true);
   try {
     const payload = {
       ...formData,
       adminId: currentAdminId, // Use dynamic ID
       categoryId: Number(formData.categoryId),
       subcategoryId: Number(formData.subcategoryId),
     };

     const res = isEditing
       ? await authService.updateCMSSubcategory(currentId, payload)
       : await authService.createCMSSubcategory(payload);

     if (res) {
       toast.success("Saved Successfully!");
       toggle();
       fetchData();
     }
   } catch (err) {
     console.error("Submission error:", err);
     toast.error("Save failed");
   } finally {
     setLoading(false);
   }
 };
  const handleEdit = (item) => {
    setFormData({
      adminId: item.adminId,
      categoryId: item.categoryId,
      subcategoryId: item.subcategoryId,
      content: decodeHtmlEntities(item.content), // decode for editor
    });
    setCurrentId(item.id);
    setIsEditing(true);
    setModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete?")) {
      try {
        await authService.deleteCMSSubcategory(id);
        toast.success("Deleted");
        fetchData();
      } catch (err) {
        toast.error("Failed");
      }
    }
  };

  const currentItems = cmsSubList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <Container
      fluid
      className="p-3 p-md-4 min-vh-100"
      style={{ backgroundColor: "#f9f9f9" }}>
      <ToastContainer theme="colored" />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0">CMS Subcategory Content</h4>
          <p className="text-muted small">
            Manage landing page content for sub-services.
          </p>
        </div>
        <Button
          style={{ backgroundColor: GOLD, border: "none", color: "#fff" }}
          className="px-4 shadow-sm fw-bold"
          onClick={toggle}>
          + Add Service Detail
        </Button>
      </div>

      <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
        <CardBody className="p-0">
          <div className="table-responsive">
            <Table hover className="align-middle mb-0">
              <thead style={{ backgroundColor: LIGHT_GOLD }}>
                <tr>
                  <th className="px-4 py-3 text-uppercase small">Sr. No.</th>
                  <th className="text-uppercase small">Parent Category</th>
                  <th className="text-uppercase small">Sub-Service</th>
                  <th className="text-uppercase small">Content Preview</th>
                  <th className="text-end px-4 text-uppercase small">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={item.id} className="border-bottom">
                    <td className="px-4 text-muted">
                      {(currentPage - 1) * itemsPerPage + index + 1}.
                    </td>
                    <td className="text-muted small">
                      {getCatName(item.categoryId)}
                    </td>
                    <td className="fw-bold text-dark">
                      {getSubName(item.subcategoryId)}
                    </td>
                    <td>
                      <div
                        className="text-muted small text-truncate"
                        style={{ maxWidth: "300px" }}>
                        {stripHtml(item.content)}
                      </div>
                    </td>
                    <td className="text-end px-4">
                      <Button
                        size="sm"
                        color="white"
                        className="border shadow-sm me-2"
                        onClick={() => handleEdit(item)}>
                        ✏️
                      </Button>
                      <Button
                        size="sm"
                        color="white"
                        className="text-danger border shadow-sm"
                        onClick={() => handleDelete(item.id)}>
                        🗑️
                      </Button>
                    </td>
                  </tr>
                ))}
                {cmsSubList.length === 0 && (
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

      <div className="mt-3">
        <PaginationComponent
          totalItems={cmsSubList.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* MODAL */}
      <Modal isOpen={modal} toggle={toggle} centered size="lg">
        <ModalHeader toggle={toggle} className="border-0 pb-0">
          <span className="fw-bold" style={{ color: GOLD }}>
            {isEditing ? "Edit" : "Add"} Service Content
          </span>
        </ModalHeader>
        <ModalBody className="px-4 pb-4">
          <Form onSubmit={handleSubmit}>
            <Row className="gy-3">
              <Col md={6}>
                <FormGroup>
                  <Label className="small fw-bold">Select Category *</Label>
                  <Input
                    type="select"
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        categoryId: e.target.value,
                        subcategoryId: "",
                      })
                    }
                    required>
                    <option value="">-- Choose Category --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.categoryName}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label className="small fw-bold">Select Sub-Service *</Label>
                  <Input
                    type="select"
                    value={formData.subcategoryId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        subcategoryId: e.target.value,
                      })
                    }
                    required
                    disabled={!formData.categoryId}>
                    <option value="">-- Choose Subcategory --</option>
                    {allSubcategories
                      .filter(
                        (sub) =>
                          String(sub.categoryId) ===
                          String(formData.categoryId),
                      )
                      .map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.subcategoryName}
                        </option>
                      ))}
                  </Input>
                </FormGroup>
              </Col>

              <Col xs={12}>
                <FormGroup>
                  <Label className="small fw-bold">Detailed Content *</Label>
                  <div className="bg-white border rounded">
                    <ReactQuill
                      theme="snow"
                      value={formData.content}
                      onChange={(v) => setFormData({ ...formData, content: v })}
                      style={{ height: "250px", marginBottom: "50px" }}
                    />
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <div className="mt-4 d-flex gap-2">
              <Button
                type="submit"
                style={{
                  backgroundColor: GOLD,
                  border: "none",
                  width: "150px",
                  color: "#fff",
                }}
                className="fw-bold"
                disabled={loading}>
                {loading ? "Saving..." : "Save Content"}
              </Button>
              <Button outline onClick={toggle} style={{ width: "120px" }}>
                Cancel
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </Container>
  );
};

export default CMSSubcategory;
