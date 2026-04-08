
"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Container,
  Table,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  FormGroup,
  Label,
  Badge,
} from "reactstrap";
import { toast } from "react-toastify";
import * as authService from "../../services/authService";
import PaginationComponent from "../../context/Pagination";

const Clients = () => {
  const [users, setUsers] = useState([]);
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [modal, setModal] = useState(false);
  const [docModal, setDocModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [selectedDocs, setSelectedDocs] = useState({});
  const [uploadFiles, setUploadFiles] = useState({
    profileImage: null,
    kycIdentity: null,
    kycAddress: null,
  });

  const toggleModal = () => {
    setModal(!modal);
    setUploadFiles({ profileImage: null, kycIdentity: null, kycAddress: null });
  };

  const toggleDocModal = () => setDocModal(!docModal);

  const fetchData = useCallback(async () => {
    try {
      const [clientRes, cityRes, countryRes] = await Promise.all([
        authService.getAllClients(),
        authService.getAllLocationCities(),
        authService.getAllCountries(),
      ]);
      setUsers(clientRes?.clients || clientRes?.data || clientRes || []);
      setCities(cityRes?.data || cityRes || []);
      setCountries(countryRes?.data || countryRes || []);
    } catch (err) {
      toast.error("Failed to load data from server");
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Logic to show exactly first 2 words of the address
  const getTruncatedAddress = (street, city) => {
    const fullAddress = `${street || ""} ${city || ""}`.trim();
    const words = fullAddress.split(/\s+/);
    if (words.length > 2) {
      return words.slice(0, 2).join(" ") + "...";
    }
    return fullAddress || "N/A";
  };

  const filteredCities = useMemo(() => {
    if (!editData.country) return [];
    const selectedCountry = countries.find(
      (c) => c.countryName === editData.country,
    );
    if (!selectedCountry) return [];
    return cities.filter(
      (city) => Number(city.countryId) === Number(selectedCountry.id),
    );
  }, [editData.country, countries, cities]);

  const handleDelete = async (id) => {
    if (window.confirm("Do you really want to delete this client?")) {
      try {
        await authService.deleteClient(id);
        toast.success("Client deleted");
        fetchData();
      } catch (err) {
        toast.error("Delete failed");
      }
    }
  };

  const toggleStatus = async (user) => {
    try {
      const newStatus = user.status === "active" ? "inactive" : "active";
      const formData = new FormData();
      formData.append("status", newStatus);
      await authService.updateClientProfile(user.id, formData);
      toast.success(`Status updated to: ${newStatus}`);
      fetchData();
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  const openDocModal = (user) => {
    setSelectedDocs({
      name: `${user.firstName} ${user.lastName}`,
      profileImage: user.profileImage,
      kycIdentity: user.kycIdentity,
      kycAddress: user.kycAddress,
    });
    toggleDocModal();
  };

  const downloadFile = async (path) => {
    if (!path || path === "null") return toast.error("File not available");
    try {
      const url = authService.getImgUrl(path);
      const res = await fetch(url);
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = path.split("/").pop();
      link.click();
    } catch (e) {
      window.open(authService.getImgUrl(path), "_blank");
    }
  };

  const handleUpdateSubmit = async () => {
    try {
      const formData = new FormData();
      const allFields = [
        "firstName",
        "lastName",
        "email",
        "mobile",
        "street",
        "aptBlock",
        "city",
        "state",
        "country",
        "zipCode",
        "countryCode",
        "dob",
    
        "status",
        "termsAccepted",
      ];

      allFields.forEach((key) => {
        let value = editData[key];
        if (
          value !== undefined &&
          value !== null &&
          value !== "" &&
          value !== "null"
        ) {
          if (key === "dob")
            formData.append(key, value.toString().split("T")[0]);
          else if (key === "termsAccepted")
            formData.append(key, value ? "1" : "0");
          else formData.append(key, value.toString().trim());
        }
      });

      if (uploadFiles.profileImage instanceof File)
        formData.append("profileImage", uploadFiles.profileImage);
      if (uploadFiles.kycIdentity instanceof File)
        formData.append("kycIdentity", uploadFiles.kycIdentity);
      if (uploadFiles.kycAddress instanceof File)
        formData.append("kycAddress", uploadFiles.kycAddress);

      await authService.updateClientProfile(editData.id, formData);
      toast.success("Profile Updated!");
      toggleModal();
      fetchData();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const filteredData = users.filter((u) =>
    `${u.firstName} ${u.lastName} ${u.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );
  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <Container fluid className="p-2 p-md-4 bg-white min-vh-100">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <h5 className="fw-bold text-secondary text-uppercase mb-0">
          Client Management
        </h5>
        <Input
          placeholder="Search clients..."
          className="bg-light border-0 shadow-sm"
          style={{ maxWidth: "350px" }}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-responsive shadow-sm rounded border">
        <Table
          hover
          className="align-middle mb-0"
          style={{ minWidth: "1400px" }}>
          <thead className="bg-light">
            <tr className="text-secondary small text-uppercase">
              <th style={{ width: "50px" }}>#</th>
              <th>IMAGE</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>PHONE_NO</th>
              <th>SUCCESS CASES</th>
              <th>PENDING CASES</th>
              <th>ACTIVE CASES</th>
              <th className="text-center">DOCUMENTS</th>
              <th>ADDRESS</th>
              <th className="text-center">STATUS</th>
              <th className="text-end">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((u, i) => (
              <tr key={u.id} className="small">
                <td>{(currentPage - 1) * itemsPerPage + i + 1}</td>
                <td>
                  <img
                    src={
                      u.profileImage
                        ? authService.getImgUrl(u.profileImage)
                        : "/assets/images/profilepic.png"
                    }
                    width="40"
                    height="40"
                    className="rounded border"
                    style={{ objectFit: "cover" }}
                    alt="p"
                  />
                </td>
                <td className="fw-bold">
                  {u.firstName} {u.lastName}
                </td>
                <td>{u.email}</td>
                <td>
                  {u.countryCode}
                  {u.mobile}
                </td>
                <td>{u.successCases || 0}</td>
                <td>{u.pendingCases || 0}</td>
                <td>{u.activeCases || 0}</td>
                <td className="text-center">
                  <Button
                    color="info"
                    outline
                    size="sm"
                    className="rounded-pill px-3"
                    onClick={() => openDocModal(u)}>
                    <i className="bi bi-file-earmark-pdf"></i>
                  </Button>
                </td>
                <td>{getTruncatedAddress(u.street, u.city)}</td>
                <td className="text-center">
                  <Badge
                    color={
                      u.status === "active"
                        ? "success"
                        : u.status === "verified"
                          ? "info"
                          : "danger"
                    }
                    pill
                    className="px-3 py-2"
                    onClick={() => toggleStatus(u)}
                    style={{ cursor: "pointer", minWidth: "85px" }}>
                    {u.status}
                  </Badge>
                </td>
                <td className="text-end">
                  <div className="d-flex justify-content-end gap-2">
                    <Button
                      outline
                      color="warning"
                      size="sm"
                      className="rounded-circle"
                      onClick={() => {
                        setEditData(u);
                        setModal(true);
                      }}>
                      <i className="bi bi-pencil-fill"></i>
                    </Button>
                    <Button
                      outline
                      color="danger"
                      size="sm"
                      className="rounded-circle"
                      onClick={() => handleDelete(u.id)}>
                      <i className="bi bi-trash-fill"></i>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div className="mt-4 d-flex justify-content-center">
        <PaginationComponent
          totalItems={filteredData.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* DOCUMENT VIEWER MODAL */}
      <Modal isOpen={docModal} toggle={toggleDocModal} centered>
        <ModalHeader toggle={toggleDocModal} className="fw-bold">
          Client Documents: {selectedDocs.name}
        </ModalHeader>
        <ModalBody className="p-0">
          <Table borderless hover className="mb-0">
            <tbody>
              {[
                { label: "KYC Identity", path: selectedDocs.kycIdentity },
                { label: "KYC Address", path: selectedDocs.kycAddress },
              ].map((doc, idx) => (
                <tr key={idx} className="border-bottom">
                  <td className="ps-4 py-3 align-middle">
                    <div className="fw-bold small">{doc.label}</div>
                    <small className="text-muted">
                      {doc.path ? "File ready" : "No document uploaded"}
                    </small>
                  </td>
                  <td className="text-end pe-4 py-3">
                    <div className="d-flex gap-2 justify-content-end">
                      <Button
                        color="dark"
                        outline
                        size="sm"
                        onClick={() =>
                          window.open(authService.getImgUrl(doc.path), "_blank")
                        }
                        disabled={!doc.path}>
                        View
                      </Button>
                      <Button
                        color="dark"
                        size="sm"
                        onClick={() => downloadFile(doc.path)}
                        disabled={!doc.path}>
                        <i className="bi bi-download"></i>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </ModalBody>
      </Modal>

      {/* FULL EDIT MODAL */}
      <Modal isOpen={modal} toggle={toggleModal} size="xl" centered>
        <ModalHeader
          toggle={toggleModal}
          className="bg-light fw-bold text-primary">
          Edit Client Profile
        </ModalHeader>
        <ModalBody className="p-3 p-md-4">
          <Row className="g-3">
            <Col xs={12} className="border-bottom pb-1">
              <h6 className="fw-bold text-dark mb-0">1. Account & Identity</h6>
            </Col>
            <Col xs={12} sm={6} md={3}>
              <FormGroup>
                <Label className="small fw-bold">First Name</Label>
                <Input
                  name="firstName"
                  value={editData.firstName || ""}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
            <Col xs={12} sm={6} md={3}>
              <FormGroup>
                <Label className="small fw-bold">Last Name</Label>
                <Input
                  name="lastName"
                  value={editData.lastName || ""}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
            <Col xs={12} md={3}>
              <FormGroup>
                <Label className="small fw-bold">Email</Label>
                <Input
                  name="email"
                  value={editData.email || ""}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
            <Col xs={12} sm={6} md={3}>
              <FormGroup>
                <Label className="small fw-bold">Status</Label>
                <Input
                  type="select"
                  name="status"
                  value={editData.status || "inactive"}
                  onChange={handleInputChange}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="verified">Verified</option>
                </Input>
              </FormGroup>
            </Col>
            <Col xs={12} sm={6} md={3}>
              <FormGroup>
                <Label className="small fw-bold">Country Code</Label>
                <Input
                  name="countryCode"
                  value={editData.countryCode || ""}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
            <Col xs={12} sm={6} md={3}>
              <FormGroup>
                <Label className="small fw-bold">Mobile</Label>
                <Input
                  name="mobile"
                  value={editData.mobile || ""}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
            <Col xs={12} sm={6} md={3}>
              <FormGroup>
                <Label className="small fw-bold">DOB</Label>
                <Input
                  type="date"
                  name="dob"
                  value={editData.dob ? editData.dob.split("T")[0] : ""}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
          

            <Col xs={12} className="border-bottom pb-1 mt-3">
              <h6 className="fw-bold text-dark mb-0">2. Location Details</h6>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <FormGroup>
                <Label className="small fw-bold">Country</Label>
                <Input
                  type="select"
                  name="country"
                  value={editData.country || ""}
                  onChange={handleInputChange}>
                  <option value="">Select</option>
                  {countries.map((c) => (
                    <option key={c.id} value={c.countryName}>
                      {c.countryName}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <FormGroup>
                <Label className="small fw-bold">City</Label>
                <Input
                  type="select"
                  name="city"
                  value={editData.city || ""}
                  onChange={handleInputChange}
                  disabled={!editData.country}>
                  <option value="">Select</option>
                  {filteredCities.map((ct) => (
                    <option key={ct.id} value={ct.id}>
                      {ct.cityName}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <FormGroup>
                <Label className="small fw-bold">State</Label>
                <Input
                  name="state"
                  value={editData.state || ""}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
            <Col xs={12} sm={6} md={3}>
              <FormGroup>
                <Label className="small fw-bold">Zip Code</Label>
                <Input
                  name="zipCode"
                  value={editData.zipCode || ""}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
            <Col xs={12} sm={6} md={3}>
              <FormGroup>
                <Label className="small fw-bold">Apt/Block</Label>
                <Input
                  name="aptBlock"
                  value={editData.aptBlock || ""}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
            <Col xs={12} sm={6} md={6}>
              <FormGroup>
                <Label className="small fw-bold">Street Address</Label>
                <Input
                  name="street"
                  value={editData.street || ""}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>

            <Col xs={12} className="border-bottom pb-1 mt-3">
              <h6 className="fw-bold text-dark mb-0">3. Media & Compliance</h6>
            </Col>
            <Col xs={12} sm={4}>
              <div className="p-2 border rounded bg-light text-center h-100">
                <Label className="fw-bold small d-block">Profile Photo</Label>
                <img
                  src={
                    editData.profileImage
                      ? authService.getImgUrl(editData.profileImage)
                      : "/assets/images/profilepic.png"
                  }
                  width="60"
                  height="60"
                  className="rounded mb-2 border"
                  alt="p"
                />
                <Input
                  type="file"
                  className="form-control-sm"
                  onChange={(e) =>
                    setUploadFiles({
                      ...uploadFiles,
                      profileImage: e.target.files[0],
                    })
                  }
                />
              </div>
            </Col>
            <Col xs={12} sm={4}>
              <div className="p-2 border rounded bg-light text-center h-100">
                <Label className="fw-bold small d-block">KYC Identity</Label>
                <div className="mb-2 small text-muted text-truncate">
                  {editData.kycIdentity || "N/A"}
                </div>
                <Input
                  type="file"
                  className="form-control-sm"
                  onChange={(e) =>
                    setUploadFiles({
                      ...uploadFiles,
                      kycIdentity: e.target.files[0],
                    })
                  }
                />
              </div>
            </Col>
            <Col xs={12} sm={4}>
              <div className="p-2 border rounded bg-light text-center h-100">
                <Label className="fw-bold small d-block">KYC Address</Label>
                <div className="mb-2 small text-muted text-truncate">
                  {editData.kycAddress || "N/A"}
                </div>
                <Input
                  type="file"
                  className="form-control-sm"
                  onChange={(e) =>
                    setUploadFiles({
                      ...uploadFiles,
                      kycAddress: e.target.files[0],
                    })
                  }
                />
              </div>
            </Col>

            <Col xs={12} className="mt-3">
              <FormGroup check className="bg-light p-2 rounded border">
                <Label check className="small fw-bold">
                  <Input
                    type="checkbox"
                    name="termsAccepted"
                    checked={editData.termsAccepted || false}
                    onChange={handleInputChange}
                  />
                  {" Verification complete and Terms Accepted by Client"}
                </Label>
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter className="bg-light">
          <Button color="secondary" outline onClick={toggleModal}>
            Cancel
          </Button>
          <Button
            color="warning"
            className="px-5 fw-bold shadow-sm"
            onClick={handleUpdateSubmit}>
            UPDATE CLIENT
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default Clients;