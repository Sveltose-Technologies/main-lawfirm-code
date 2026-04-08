"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import {
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
  Row,
  Col,
  Badge,
} from "reactstrap";

import PaginationComponent from "../../context/Pagination";
import * as authService from "../../services/authService";

import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

const AwardPage = () => {
  const GOLD = "#eebb5d";
  const LIGHT_GOLD = "#fdf8ef";

  const [dataList, setDataList] = useState([]);
  const [modal, setModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [formData, setFormData] = useState({
    bannerImage: null,
    peopleImage: null, // New field for profile image
    personName: "",
    organization: "",
    year: "",
    awardTitle: "",
    details: "",
  });

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["clean"],
      ],
    }),
    [],
  );

  const truncateWords = (text, limit = 3) => {
    if (!text) return "N/A";
    const words = text.split(" ");
    if (words.length <= limit) return text;
    return words.slice(0, limit).join(" ") + "...";
  };

  const stripHtml = (html) => {
    if (!html) return "";
    if (typeof window !== "undefined") {
      const doc = new DOMParser().parseFromString(html, "text/html");
      return doc.body.textContent || "";
    }
    return html;
  };

  const fetchData = useCallback(async () => {
    const res = await authService.getAllAwards();
    if (res.success) {
      setDataList(res.data || []);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggle = () => {
    setModal(!modal);
    if (modal) {
      setFormData({
        bannerImage: null,
        peopleImage: null,
        personName: "",
        organization: "",
        year: "",
        awardTitle: "",
        details: "",
      });
      setIsEditing(false);
      setCurrentId(null);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!formData.awardTitle || !formData.year) {
      alert("Title and Year are required!");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      const adminId = authService.getAdminId() || "1";
      data.append("adminId", adminId);
      data.append("personName", formData.personName || "");
      data.append("organization", formData.organization || "");
      data.append("year", formData.year);
      data.append("awardTitle", formData.awardTitle);
      data.append("details", formData.details || "");

      if (formData.bannerImage instanceof File) {
        data.append("bannerImage", formData.bannerImage);
      }

      // Handle Profile Image Upload
      if (formData.peopleImage instanceof File) {
        data.append("peopleImage", formData.peopleImage);
      }

      const res = isEditing
        ? await authService.updateAward(currentId, data)
        : await authService.createAward(data);

      if (res.success) {
        fetchData();
        toggle();
      }
    } catch (err) {
      console.error("Submission Failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      personName: item.personName || "",
      organization: item.organization || "",
      year: item.year || "",
      awardTitle: item.awardTitle || "",
      details: item.details || "",
      bannerImage: null,
      peopleImage: null,
    });
    setCurrentId(item.id);
    setIsEditing(true);
    setModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this award?")) {
      try {
        const res = await authService.deleteAward(id);
        if (res.success) fetchData();
      } catch (err) {
        console.error("Delete Failed:", err);
      }
    }
  };

  const filteredData = dataList.filter(
    (item) =>
      item.awardTitle?.toLowerCase().includes(search.toLowerCase()) ||
      item.personName?.toLowerCase().includes(search.toLowerCase()) ||
      item.organization?.toLowerCase().includes(search.toLowerCase()) ||
      item.year?.toString().includes(search),
  );

  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div
      className="p-3 p-md-4 min-vh-100"
      style={{ backgroundColor: "#f9f9f9" }}>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h4 className="fw-bold mb-0" style={{ color: "#002147" }}>
            Awards & Recognition
          </h4>
          <p className="text-muted small mb-0">
            Manage achievements and recipient profiles.
          </p>
        </div>
        <Button
          className="px-4 shadow-sm text-white fw-bold"
          style={{ backgroundColor: GOLD, border: "none" }}
          onClick={toggle}>
          + ADD NEW AWARD
        </Button>
      </div>

      <Row className="mb-3">
        <Col xs="12" md="4" lg="3">
          <Input
            placeholder="Search records..."
            className="rounded-pill border-0 shadow-sm px-3"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </Col>
      </Row>

      <Card className="border-0 shadow-sm rounded-4">
        <CardBody className="p-0">
          <Table hover responsive className="align-middle mb-0">
            <thead style={{ backgroundColor: LIGHT_GOLD }}>
              <tr className="text-uppercase small">
                <th className="px-4 py-3">SR.</th>
                <th className="text-center">Profile</th>
                <th className="text-center">Banner</th>
                <th>Award Title</th>
                <th>Recipient</th>
                <th>Organization</th>
                <th className="text-center">Year</th>
                <th className="text-end px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-5 text-center text-muted">
                    No achievements recorded yet.
                  </td>
                </tr>
              ) : (
                currentItems.map((item, index) => (
                  <tr key={item.id}>
                    <td className="px-4 text-muted">
                      {(currentPage - 1) * itemsPerPage + index + 1}.
                    </td>
                    {/* Recipient Profile Image */}
                    <td className="text-center">
                      <div
                        className="rounded-circle border"
                        style={{
                          width: "40px",
                          height: "40px",
                          overflow: "hidden",
                          margin: "auto",
                        }}>
                        <img
                          src={authService.getImgUrl(item.peopleImage)}
                          alt="Profile"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            e.target.src = "https://placehold.co/40x40?text=U";
                          }}
                        />
                      </div>
                    </td>
                    {/* Award Banner Image */}
                    <td className="text-center">
                      <div
                        className="shadow-sm border rounded"
                        style={{
                          width: "60px",
                          height: "40px",
                          overflow: "hidden",
                          margin: "auto",
                        }}>
                        <img
                          src={authService.getImgUrl(item.bannerImage)}
                          alt="Banner"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            e.target.src =
                              "https://placehold.co/60x40?text=No+Img";
                          }}
                        />
                      </div>
                    </td>
                    <td className="fw-bold" style={{ color: "#002147" }}>
                      {truncateWords(item.awardTitle)}
                    </td>
                    <td>{truncateWords(item.personName)}</td>
                    <td>{truncateWords(item.organization)}</td>
                    <td className="text-center">
                      <Badge
                        pill
                        style={{
                          backgroundColor: LIGHT_GOLD,
                          color: GOLD,
                          border: `1px solid ${GOLD}`,
                        }}>
                        {item.year}
                      </Badge>
                    </td>
                    <td className="text-end px-4">
                      <div className="d-flex gap-2 justify-content-end">
                        <Button
                          size="sm"
                          color="white"
                          className="border shadow-sm"
                          onClick={() => handleEdit(item)}>
                          ✏️
                        </Button>
                        <Button
                          size="sm"
                          color="white"
                          className="border shadow-sm text-danger"
                          onClick={() => handleDelete(item.id)}>
                          🗑️
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </CardBody>
      </Card>

      <div className="mt-4">
        <PaginationComponent
          totalItems={filteredData.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>

      <Modal isOpen={modal} toggle={toggle} size="lg" centered scrollable>
        <ModalHeader toggle={toggle} className="fw-bold border-0">
          <span style={{ color: "#002147" }}>
            {isEditing ? "Update Achievement" : "Add Achievement"}
          </span>
        </ModalHeader>
        <ModalBody className="px-4 pb-4">
          <Form onSubmit={handleSubmit}>
            <Row className="gy-3">
              <Col md={8}>
                <FormGroup>
                  <Label className="small fw-bold">Award Title *</Label>
                  <Input
                    type="text"
                    value={formData.awardTitle}
                    onChange={(e) =>
                      setFormData({ ...formData, awardTitle: e.target.value })
                    }
                    required
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label className="small fw-bold">Year *</Label>
                  <Input
                    type="number"
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({ ...formData, year: e.target.value })
                    }
                    required
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className="small fw-bold">Recipient Name</Label>
                  <Input
                    type="text"
                    value={formData.personName}
                    onChange={(e) =>
                      setFormData({ ...formData, personName: e.target.value })
                    }
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className="small fw-bold">Organization</Label>
                  <Input
                    type="text"
                    value={formData.organization}
                    onChange={(e) =>
                      setFormData({ ...formData, organization: e.target.value })
                    }
                  />
                </FormGroup>
              </Col>

              {/* Profile Image Input */}
              <Col md={6}>
                <FormGroup>
                  <Label className="small fw-bold">
                    Recipient Profile Image
                  </Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        peopleImage: e.target.files[0],
                      })
                    }
                  />
                </FormGroup>
              </Col>

              {/* Banner Image Input */}
              <Col md={6}>
                <FormGroup>
                  <Label className="small fw-bold">
                    Banner Image {isEditing ? "(Optional)" : "*"}
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
                  <Label className="small fw-bold">Achievement Details</Label>
                  <div className="bg-white border rounded">
                    <ReactQuill
                      theme="snow"
                      modules={modules}
                      value={formData.details}
                      onChange={(v) => setFormData({ ...formData, details: v })}
                      style={{ height: "200px", marginBottom: "50px" }}
                    />
                  </div>
                </FormGroup>
              </Col>
            </Row>

            <div className="mt-4 d-flex gap-2">
              <Button
                type="submit"
                disabled={loading}
                style={{ backgroundColor: "#002147", border: "none" }}
                className="text-white fw-bold px-4">
                {loading
                  ? "Processing..."
                  : isEditing
                    ? "Save Changes"
                    : "Create Entry"}
              </Button>
              <Button outline type="button" className="px-4" onClick={toggle}>
                Cancel
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default AwardPage;
