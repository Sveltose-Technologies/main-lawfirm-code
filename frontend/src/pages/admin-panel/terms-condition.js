"use client";
import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  Container,
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
import "react-toastify/dist/ReactToastify.css";
import * as authService from "../../services/authService";

import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

const AdminTermsManagement = () => {
  const GOLD = "#eebb5d";
  const LIGHT_GOLD = "#fdf8ef";

  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authService.getAllTermsConditions();
      if (res.success) {
        // API response structure handle karein
        const actualData = res.data?.data || res.data || [];
        setDataList(Array.isArray(actualData) ? actualData : [actualData]);
      }
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
      setFormData({ title: "", content: "" });
      setIsEditing(false);
      setCurrentId(null);
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  // Get the dynamic admin ID from localStorage via authService
  const currentAdminId = authService.getAdminId();

  // If ID is not found, prevent submission and alert the user
  if (!currentAdminId) {
    toast.error("Session expired. Please login again to continue.");
    return;
  }

  setLoading(true);
  try {
    // Construct payload with the dynamic adminId
    const payload = {
      adminId: currentAdminId,
      ...formData,
    };

    console.log("Submitting payload with Admin ID:", currentAdminId);

    const res = isEditing
      ? await authService.updateTermsCondition(currentId, payload)
      : await authService.createTermsCondition(payload);

    if (res) {
      toast.success(
        `Content ${isEditing ? "Updated" : "Created"} Successfully!`,
      );
      toggle();
      fetchData();
    }
  } catch (err) {
    console.error("Submission Error:", err);
    toast.error("Operation failed. Please try again.");
  } finally {
    setLoading(false);
  }
};

  const handleEdit = (item) => {
    setFormData({ title: item.title, content: item.content });
    setCurrentId(item.id);
    setIsEditing(true);
    setModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await authService.deleteTermsCondition(id);
      toast.success("Deleted!");
      fetchData();
    } catch (e) {
      toast.error("Delete failed");
    }
  };

  return (
    <Container fluid className="p-4 bg-light min-vh-100">
      <ToastContainer theme="colored" />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold">Terms & Conditions CMS</h4>
        <Button
          style={{ backgroundColor: GOLD, border: "none" }}
          onClick={toggle}>
          + Add New Content
        </Button>
      </div>

      <Card className="border-0 shadow-sm rounded-4">
        <CardBody className="p-0">
          <Table hover responsive className="align-middle mb-0">
            <thead style={{ backgroundColor: LIGHT_GOLD }}>
              <tr>
                <th className="px-4 py-3">SR.</th>
                <th>TITLE</th>
                <th>CONTENT PREVIEW</th>
                <th className="text-end px-4">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {dataList.map((item, index) => (
                <tr key={item.id}>
                  <td className="px-4 text-muted">{index + 1}.</td>
                  <td className="fw-bold">{item.title}</td>
                  <td className="small text-muted">
                    <div
                      className="text-truncate"
                      style={{ maxWidth: "300px" }}>
                      {item.content
                        ?.replace(/<[^>]*>?/gm, "")
                        .replace(/&nbsp;/g, " ")
                        .replace(/&amp;/g, "&")
                        .replace(/&lt;/g, "<")
                        .replace(/&gt;/g, ">")}
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
            </tbody>
          </Table>
        </CardBody>
      </Card>

      <Modal isOpen={modal} toggle={toggle} centered size="lg">
        <ModalHeader toggle={toggle} className="border-0">
          {isEditing ? "Edit" : "Add"} Legal Terms
        </ModalHeader>
        <ModalBody className="px-4 pb-4">
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label className="fw-bold small">TITLE *</Label>
              <Input
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </FormGroup>
            <FormGroup>
              <Label className="fw-bold small">CONTENT *</Label>
              <div className="bg-white border rounded">
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={(v) => setFormData({ ...formData, content: v })}
                  style={{ height: "250px", marginBottom: "50px" }}
                />
              </div>
            </FormGroup>
            <Button
              type="submit"
              className="w-100 fw-bold mt-3"
              style={{ backgroundColor: GOLD, border: "none" }}
              disabled={loading}>
              {loading ? "Processing..." : "Save Terms"}
            </Button>
          </Form>
        </ModalBody>
      </Modal>
    </Container>
  );
};

export default AdminTermsManagement;
