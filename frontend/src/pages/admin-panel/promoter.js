import React, { useEffect, useState, useCallback } from "react";
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
import { toast } from "react-toastify";

const PromoterPage = () => {
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
    personImage: null,
    personName: "",
    designation: "",
    specialization: "",
    email: "",
    mobileNo: "",
  });

  const fetchData = useCallback(async () => {
    const res = await authService.getAllPromoters();
    if (res.success) setDataList(res.data || []);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const truncateWords = (text, limit = 3) => {
    if (!text) return "N/A";
    const words = text.trim().split(/\s+/);
    if (words.length > limit) {
      return words.slice(0, limit).join(" ") + "...";
    }
    return text;
  };

  const toggle = () => {
    setModal(!modal);
    if (modal) {
      setFormData({
        bannerImage: null,
        personImage: null,
        personName: "",
        designation: "",
        specialization: "",
        email: "",
        mobileNo: "",
      });
      setIsEditing(false);
      setCurrentId(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentAdminId = authService.getAdminId();
    if (!currentAdminId) {
      toast.error("Session expired. Please login again.");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append("adminId", currentAdminId);
      data.append("personName", formData.personName);
      data.append("designation", formData.designation);
      data.append("specialization", formData.specialization);
      data.append("email", formData.email);
      data.append("mobileNo", formData.mobileNo);

      if (formData.bannerImage instanceof File)
        data.append("bannerImage", formData.bannerImage);
      if (formData.personImage instanceof File)
        data.append("personImage", formData.personImage);

      const res = isEditing
        ? await authService.updatePromoter(currentId, data)
        : await authService.createPromoter(data);

      if (res.success) {
        toast.success(
          isEditing ? "Updated Successfully" : "Created Successfully",
        );
        fetchData();
        toggle();
      }
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("Failed to save profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      personName: item.personName || "",
      designation: item.designation || "",
      specialization: item.specialization || "",
      email: item.email || "",
      mobileNo: item.mobileNo || "",
      bannerImage: null,
      personImage: null,
    });
    setCurrentId(item.id);
    setIsEditing(true);
    setModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this promoter?")) {
      const res = await authService.deletePromoter(id);
      if (res.success) {
        toast.success("Deleted successfully");
        fetchData();
      }
    }
  };

  const filteredData = dataList.filter((item) =>
    item.personName.toLowerCase().includes(search.toLowerCase()),
  );

  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4 gap-3">
        <h4 className="fw-bold mb-0" style={{ color: "#002147" }}>
          Promoters Management
        </h4>
        <Button color="dark" className="rounded-pill px-4" onClick={toggle}>
          + ADD PROMOTER
        </Button>
      </div>

      <div className="mb-3">
        <Input
          placeholder="Search by name..."
          className="rounded-pill border-0 shadow-sm w-25"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card className="border-0 shadow-sm rounded-4">
        <CardBody className="p-0">
          <div className="table-responsive">
            <Table hover className="align-middle mb-0">
              <thead className="bg-dark text-white small text-uppercase">
                <tr>
                  <th className="ps-4">SR.</th>
                  <th className="text-center">Profile</th>
                  <th className="text-center">Banner</th>
                  <th>Name</th>
                  <th>Designation</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Specialization</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((item, index) => (
                    <tr key={item.id} className="small">
                      <td className="ps-4 text-muted">
                        {(currentPage - 1) * itemsPerPage + index + 1}.
                      </td>
                      <td className="text-center">
                        <img
                          src={authService.getImgUrl(item.personImage)}
                          style={{
                            width: "45px",
                            height: "45px",
                            objectFit: "cover",
                          }}
                          className="rounded-circle border shadow-sm"
                          alt="profile"
                          onError={(e) => {
                            e.target.src =
                              "https://placehold.co/45x45?text=No+Img";
                          }}
                        />
                      </td>
                      <td className="text-center">
                        <img
                          src={authService.getImgUrl(item.bannerImage)}
                          style={{
                            width: "60px",
                            height: "35px",
                            objectFit: "cover",
                          }}
                          className="rounded-1 border shadow-sm"
                          alt="banner"
                          onError={(e) => {
                            e.target.src =
                              "https://placehold.co/60x35?text=No+Img";
                          }}
                        />
                      </td>
                      <td className="fw-bold">
                        {truncateWords(item.personName, 3)}
                      </td>
                      <td>
                        <Badge color="light" className="text-dark border">
                          {truncateWords(item.designation, 3)}
                        </Badge>
                      </td>
                      <td>{item.email || "N/A"}</td>
                      <td>{item.mobileNo || "N/A"}</td>
                      <td className="text-muted">
                        {truncateWords(item.specialization, 3)}
                      </td>
                      <td className="text-end pe-4">
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
                            className="text-danger border shadow-sm"
                            onClick={() => handleDelete(item.id)}>
                            🗑️
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-5 text-muted">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
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

      <Modal isOpen={modal} toggle={toggle} size="lg" centered>
        <ModalHeader toggle={toggle} className="border-0 fw-bold">
          Promoter Configuration
        </ModalHeader>
        <ModalBody className="px-4 pb-4">
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={6}>
                <FormGroup>
                  <Label className="small fw-bold">Full Name *</Label>
                  <Input
                    className="rounded-3"
                    value={formData.personName}
                    onChange={(e) =>
                      setFormData({ ...formData, personName: e.target.value })
                    }
                    required
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className="small fw-bold">Designation *</Label>
                  <Input
                    className="rounded-3"
                    value={formData.designation}
                    onChange={(e) =>
                      setFormData({ ...formData, designation: e.target.value })
                    }
                    required
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className="small fw-bold">Primary Email</Label>
                  <Input
                    className="rounded-3"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className="small fw-bold">Mobile Number</Label>
                  <Input
                    className="rounded-3"
                    type="text"
                    value={formData.mobileNo}
                    onChange={(e) =>
                      setFormData({ ...formData, mobileNo: e.target.value })
                    }
                  />
                </FormGroup>
              </Col>
              <Col xs={12}>
                <FormGroup>
                  <Label className="small fw-bold">
                    Biography / Specialization
                  </Label>
                  <Input
                    className="rounded-3"
                    type="textarea"
                    rows="4"
                    value={formData.specialization}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specialization: e.target.value,
                      })
                    }
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className="small fw-bold">Profile Image</Label>
                  <Input
                    className="rounded-3"
                    type="file"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        personImage: e.target.files[0],
                      })
                    }
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className="small fw-bold">Banner Image</Label>
                  <Input
                    className="rounded-3"
                    type="file"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bannerImage: e.target.files[0],
                      })
                    }
                  />
                </FormGroup>
              </Col>
            </Row>
            <div className="mt-4">
              <Button
                color="dark"
                type="submit"
                disabled={loading}
                className="w-100 rounded-3 py-2 fw-bold">
                {loading ? "Processing..." : "Save Data"}
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default PromoterPage;
