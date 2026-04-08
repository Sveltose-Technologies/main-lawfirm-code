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
const AdminPrivacyPolicyManagement = () => {
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

  const decodeHTML = (html) => {
    if (!html) return "";
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authService.getAllPrivacyPolicy();
      if (res.success) {
        const actualData = res.data || [];
        setDataList(Array.isArray(actualData) ? actualData : [actualData]);
      }
    } catch (error) {
      console.error(error);
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
    if (!formData.title || !formData.content)
      return toast.error("Title & Content required");

    // Retrieve dynamic Admin ID from authService
    const currentAdminId = authService.getAdminId();

    if (!currentAdminId) {
      return toast.error("Session expired. Please login again.");
    }

    setLoading(true);
    try {
      const payload = {
        title: formData.title,
        content: formData.content,
        adminId: currentAdminId, // Dynamic ID applied here
      };

      const res = isEditing
        ? await authService.updatePrivacyPolicy(currentId, payload)
        : await authService.createPrivacyPolicy(payload);

      if (res.success) {
        toast.success("Privacy Policy Saved!");
        toggle();
        fetchData();
      } else {
        toast.error(res.message || "Failed to save");
      }
    } catch (err) {
      toast.error("An error occurred");
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
      const res = await authService.deletePrivacyPolicy(id);
      if (res.success) {
        toast.success("Deleted!");
        fetchData();
      }
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <Container fluid className="p-4 bg-light min-vh-100">
      <ToastContainer theme="colored" />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold">Privacy Policy CMS</h4>
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
              {dataList.length > 0 ? (
                dataList.map((item, index) => (
                  <tr key={item.id}>
                    <td className="px-4 text-muted">{index + 1}.</td>
                    <td className="fw-bold">{item.title}</td>
                    <td className="small text-muted">
                      <div
                        className="text-truncate"
                        style={{ maxWidth: "300px" }}>
                        {decodeHTML(item.content?.replace(/<[^>]*>?/gm, ""))}
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
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    No Data Found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </CardBody>
      </Card>

      <Modal isOpen={modal} toggle={toggle} centered size="lg">
        <ModalHeader toggle={toggle} className="border-0 fw-bold">
          {isEditing ? "Edit" : "Add"} Privacy Policy
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
              className="w-100 fw-bold mt-3 text-white"
              style={{ backgroundColor: GOLD, border: "none" }}
              disabled={loading}>
              {loading ? "Processing..." : "Save Policy"}
            </Button>
          </Form>
        </ModalBody>
      </Modal>
    </Container>
  );
};

export default AdminPrivacyPolicyManagement;
