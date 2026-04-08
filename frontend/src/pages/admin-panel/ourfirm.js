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

import * as authService from "../../services/authService";
import PaginationComponent from "../../context/Pagination";

import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

const OurFirmPage = () => {
  const GOLD = "#eebb5d";
  const LIGHT_GOLD = "#fdf8ef";

  const [dataList, setDataList] = useState([]);
  const [modal, setModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [formData, setFormData] = useState({
    bannerImage: null,
    innovationImage: null,
    peopleImage: null,
    historyImage: null,
    innovationContent: "",
    peopleContent: "",
    historyContent: "",
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

  const fetchData = useCallback(async () => {
    console.log("🔄 Fetching Our Firm data...");
    const res = await authService.getAllOurFirm();
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
        innovationImage: null,
        peopleImage: null,
        historyImage: null,
        innovationContent: "",
        peopleContent: "",
        historyContent: "",
      });
      setIsEditing(false);
      setCurrentId(null);
    }
  };

  const handleFileChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.files[0] });
  };

const handleSubmit = async (e) => {
  if (e) e.preventDefault();

  // Retrieve the dynamic Admin ID from localStorage
  const currentAdminId = authService.getAdminId();

  if (!currentAdminId) {
    alert("Session expired. Please login again.");
    return;
  }

  setLoading(true);
  try {
    const data = new FormData();
    // Use the dynamic ID instead of hardcoded "1"
    data.append("adminId", currentAdminId);
    data.append("innovationContent", formData.innovationContent);
    data.append("peopleContent", formData.peopleContent);
    data.append("historyContent", formData.historyContent);

    if (formData.bannerImage instanceof File)
      data.append("bannerImage", formData.bannerImage);
    if (formData.innovationImage instanceof File)
      data.append("innovationImage", formData.innovationImage);
    if (formData.peopleImage instanceof File)
      data.append("peopleImage", formData.peopleImage);
    if (formData.historyImage instanceof File)
      data.append("historyImage", formData.historyImage);

    console.log(
      `📤 ${isEditing ? "Updating" : "Creating"} Firm Details with Admin ID: ${currentAdminId}`,
    );
    const res = isEditing
      ? await authService.updateOurFirm(currentId, data)
      : await authService.createOurFirm(data);

    if (res.success) {
      fetchData();
      toggle();
    }
  } catch (err) {
    console.error("❌ Submission error:", err);
  } finally {
    setLoading(false);
  }
};

  const handleEdit = (item) => {
    setFormData({
      innovationContent: item.innovationContent || "",
      peopleContent: item.peopleContent || "",
      historyContent: item.historyContent || "",
      bannerImage: null,
      innovationImage: null,
      peopleImage: null,
      historyImage: null,
    });
    setCurrentId(item.id);
    setIsEditing(true);
    setModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete these details?")) {
      try {
        const res = await authService.deleteOurFirm(id);
        if (res.success) fetchData();
      } catch (err) {
        console.error("❌ Delete error:", err);
      }
    }
  };

  const currentItems = dataList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="p-4 min-vh-100" style={{ backgroundColor: "#f9f9f9" }}>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h4 className="fw-bold mb-0">Our Firm Management</h4>
          <p className="text-muted small mb-0">
            Manage Innovation, People, and History sections.
          </p>
        </div>
        <Button
          className="px-4 shadow-sm text-white"
          style={{ backgroundColor: GOLD, border: "none" }}
          onClick={toggle}>
          + Add New Entry
        </Button>
      </div>

      <Card className="border-0 shadow-sm rounded-4">
        <CardBody className="p-0">
          <Table hover responsive className="align-middle mb-0 text-center">
            <thead style={{ backgroundColor: LIGHT_GOLD }}>
              <tr>
                <th className="py-3 px-4">Banner</th>
                <th>Innovation</th>
                <th>People</th>
                <th>History</th>
                <th className="text-end px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-5 text-muted">
                    No records found.
                  </td>
                </tr>
              ) : (
                currentItems.map((item) => (
                  <tr key={item.id}>
                    {/* 1. Banner Image */}
                    <td className="py-3">
                      <img
                        src={authService.getImgUrl(item.bannerImage)}
                        alt="Banner"
                        style={{
                          width: "90px",
                          height: "50px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                        onError={(e) =>
                          (e.target.src =
                            "https://placehold.co/90x50?text=No+Img")
                        }
                      />
                    </td>

                    {/* 2. Innovation Image */}
                    <td>
                      <img
                        src={authService.getImgUrl(item.innovationImage)}
                        style={{
                          width: "80px",
                          height: "45px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                        alt="Innovation"
                        onError={(e) =>
                          (e.target.src =
                            "https://placehold.co/80x45?text=No+Img")
                        }
                      />
                      <div
                        className="small fw-bold mt-1"
                        style={{ color: GOLD }}>
                        Innovation
                      </div>
                    </td>

                    {/* 3. People Image */}
                    <td>
                      <img
                        src={authService.getImgUrl(item.peopleImage)}
                        style={{
                          width: "80px",
                          height: "45px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                        alt="People"
                        onError={(e) =>
                          (e.target.src =
                            "https://placehold.co/80x45?text=No+Img")
                        }
                      />
                      <div
                        className="small fw-bold mt-1"
                        style={{ color: GOLD }}>
                        People
                      </div>
                    </td>

                    {/* 4. History Image */}
                    <td>
                      <img
                        src={authService.getImgUrl(item.historyImage)}
                        style={{
                          width: "80px",
                          height: "45px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                        alt="History"
                        onError={(e) =>
                          (e.target.src =
                            "https://placehold.co/80x45?text=No+Img")
                        }
                      />
                      <div
                        className="small fw-bold mt-1"
                        style={{ color: GOLD }}>
                        History
                      </div>
                    </td>

                    <td className="text-end px-4">
                      <Button
                        size="sm"
                        color="white"
                        className="shadow-sm me-2 border"
                        onClick={() => handleEdit(item)}>
                        ✏️
                      </Button>
                      <Button
                        size="sm"
                        color="white"
                        className="shadow-sm text-danger border"
                        onClick={() => handleDelete(item.id)}>
                        🗑️
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </CardBody>
      </Card>

      <PaginationComponent
        totalItems={dataList.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      <Modal isOpen={modal} toggle={toggle} size="xl" centered scrollable>
        <ModalHeader
          toggle={toggle}
          className="fw-bold"
          style={{ color: GOLD }}>
          {isEditing ? "Edit Firm Details" : "Create Firm Content"}
        </ModalHeader>
        <ModalBody className="p-4">
          <Form onSubmit={handleSubmit}>
            <div className="p-3 mb-4 rounded border bg-light">
              <h6 className="fw-bold mb-3 small">
                IMAGE UPLOADS (RECTANGULAR)
              </h6>
              <Row className="gy-3">
                <Col md={3}>
                  <Label className="small fw-bold">Banner</Label>
                  <Input
                    type="file"
                    onChange={(e) => handleFileChange(e, "bannerImage")}
                  />
                </Col>
                <Col md={3}>
                  <Label className="small fw-bold">Innovation</Label>
                  <Input
                    type="file"
                    onChange={(e) => handleFileChange(e, "innovationImage")}
                  />
                </Col>
                <Col md={3}>
                  <Label className="small fw-bold">People</Label>
                  <Input
                    type="file"
                    onChange={(e) => handleFileChange(e, "peopleImage")}
                  />
                </Col>
                <Col md={3}>
                  <Label className="small fw-bold">History</Label>
                  <Input
                    type="file"
                    onChange={(e) => handleFileChange(e, "historyImage")}
                  />
                </Col>
              </Row>
            </div>

            <Row>
              <Col lg={4} className="mb-3">
                <Label className="fw-bold small">Innovation Content</Label>
                <ReactQuill
                  theme="snow"
                  modules={modules}
                  value={formData.innovationContent}
                  onChange={(v) =>
                    setFormData({ ...formData, innovationContent: v })
                  }
                  style={{ height: "180px", backgroundColor: "#fff" }}
                />
              </Col>
              <Col lg={4} className="mb-3">
                <Label className="fw-bold small">People Content</Label>
                <ReactQuill
                  theme="snow"
                  modules={modules}
                  value={formData.peopleContent}
                  onChange={(v) =>
                    setFormData({ ...formData, peopleContent: v })
                  }
                  style={{ height: "180px", backgroundColor: "#fff" }}
                />
              </Col>
              <Col lg={4} className="mb-3">
                <Label className="fw-bold small">History Content</Label>
                <ReactQuill
                  theme="snow"
                  modules={modules}
                  value={formData.historyContent}
                  onChange={(v) =>
                    setFormData({ ...formData, historyContent: v })
                  }
                  style={{ height: "180px", backgroundColor: "#fff" }}
                />
              </Col>
            </Row>

            <div className="mt-5 d-flex gap-2">
              <Button
                type="submit"
                style={{
                  backgroundColor: GOLD,
                  border: "none",
                  width: "150px",
                }}
                className="text-white fw-bold"
                disabled={loading}>
                {loading ? "Saving..." : isEditing ? "Update" : "Publish"}
              </Button>
              <Button outline style={{ width: "130px" }} onClick={toggle}>
                Cancel
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default OurFirmPage;
