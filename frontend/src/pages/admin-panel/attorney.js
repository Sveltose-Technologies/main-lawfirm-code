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

const Attorney = () => {
  const [attorneys, setAttorneys] = useState([]);
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  const [languagesList, setLanguagesList] = useState([]); // State for Languages
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
    resume: null,
    barCouncilIndiaId: null,
    barCouncilStateId: null,
  });

  const toggleModal = () => {
    setModal(!modal);
    if (!modal)
      setUploadFiles({
        profileImage: null,
        kycIdentity: null,
        kycAddress: null,
        resume: null,
        barCouncilIndiaId: null,
        barCouncilStateId: null,
      });
  };
  const toggleDocModal = () => setDocModal(!docModal);

const fetchData = useCallback(async () => {
  try {
    const [attorneyRes, cityRes, countryRes, catRes, serviceRes, langRes] =
      await Promise.all([
        authService.getAllAttorneys(),
        authService.getAllLocationCities(),
        authService.getAllCountries(),
        authService.getAllCapabilityCategories(),
        authService.getAllServices(),
        authService.getAttorneylanguages(),
      ]);

    // 1. Attorneys
    setAttorneys(
      attorneyRes?.attorneys ||
        attorneyRes?.data ||
        (Array.isArray(attorneyRes) ? attorneyRes : []),
    );

    // 2. Cities
    setCities(cityRes?.data || (Array.isArray(cityRes) ? cityRes : []));

    // 3. Countries
    setCountries(
      countryRes?.data || (Array.isArray(countryRes) ? countryRes : []),
    );

    // 4. Categories (FIXED LINE)
    const finalCats = catRes?.data || (Array.isArray(catRes) ? catRes : []);
    setCategories(finalCats);

    // 5. Services
    setServicesList(
      serviceRes?.data?.data ||
        serviceRes?.data ||
        (Array.isArray(serviceRes) ? serviceRes : []),
    );

    // 6. Languages
    setLanguagesList(langRes?.data || (Array.isArray(langRes) ? langRes : []));
  } catch (err) {
    console.error("Fetch Error:", err);
    toast.error("Failed to load data");
  }
}, []);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

 const handleDelete = async (id) => {
   if (window.confirm("Are you sure you want to delete this attorney?")) {
     try {
       console.log("Attempting to delete ID:", id);
       await authService.deleteAttorney(id);
       toast.success("Attorney deleted successfully");
       fetchData();
     } catch (err) {
       console.error("Full Delete Error:", err);

       const errorMsg =
         err?.response?.data?.message || err?.message || "Delete failed";

       if (
         errorMsg.toLowerCase().includes("token") ||
         errorMsg.includes("401")
       ) {
         toast.error("Session Expired: Please Logout and Login again.");
       } else {
         toast.error(errorMsg);
       }
     }
   }
 };

  const toggleStatus = async (attorney) => {
    try {
      const newStatus = attorney.status === "active" ? "inactive" : "active";
      const formData = new FormData();
      formData.append("status", newStatus);
      formData.append("isActive", newStatus === "active" ? "1" : "0");
      await authService.updateAttorney(attorney.id, formData);
      toast.success(`Status updated to ${newStatus}`);
      fetchData();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const openDocModal = (attorney) => {
    setSelectedDocs({
      name: `${attorney.firstName} ${attorney.lastName}`,
      kycIdentity: attorney.kycIdentity,
      kycAddress: attorney.kycAddress,
      resume: attorney.resume,
      barCouncilIndiaId: attorney.barCouncilIndiaId,
      barCouncilStateId: attorney.barCouncilStateId,
      profileImage: attorney.profileImage,
    });
    toggleDocModal();
  };

  const handleDownload = async (path) => {
    if (!path || path === "null") return toast.error("No file found");
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
  const formData = new FormData();

  // 1. IMPORTANT: REMOVE file keys from this array.
  // DO NOT include: profileImage, kycIdentity, kycAddress, resume, barCouncilIndiaId, barCouncilStateId
  const textFields = [
    "firstName",
    "lastName",
    "email",
    "street",
    "aptBlock",
    "city",
    "state",
    "country",
    "location",
    "zipCode",
    "phoneCell",
    "phoneHome",
    "phoneOffice",
    "dob",
    "admission",
    "language",
    "servicesOffered",
    "education",
    "experience",
    "barCouncilIndiaNo",
    "barCouncilStateNo",
    "familyLawPractice",
    "familyDetails",
    "aboutus",
    "categoryId",
    "linkedin",
    "twitter",
    "facebook",
    "gmail",
    "status",
  ];

  // 2. Append only the text/data fields
  textFields.forEach((f) => {
    if (editData[f] !== undefined && editData[f] !== null) {
      let value = editData[f];

      // Format Date
      if (f === "dob" && typeof value === "string" && value.includes("T")) {
        value = value.split("T")[0];
      }

      // Ensure Numeric IDs
      if (f === "categoryId" || f === "city") {
        value = value === "" ? "" : Number(value);
      }

      formData.append(f, value);
    }
  });

  // 3. Append files ONLY if a NEW file was selected by the user
  // (Instance check ensures we don't send the old string path)
  Object.keys(uploadFiles).forEach((k) => {
    if (uploadFiles[k] instanceof File) {
      formData.append(k, uploadFiles[k]);
      console.log(`Appending new file for: ${k}`);
    }
  });

  try {
    // This will now only send text data + any newly selected files.
    // Existing files in the database will remain untouched.
    await authService.updateAttorney(editData.id, formData);
    toast.success("Updated Successfully!");
    toggleModal();
    fetchData();
  } catch (e) {
    console.error("Update Error:", e);
    toast.error("Error updating profile");
  }
};
  const filteredData = attorneys.filter((u) =>
    `${u.firstName} ${u.lastName} ${u.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );
  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const filteredCities = useMemo(() => {
    if (!editData.country) return [];
    const selectedCountryObj = countries.find(
      (c) => c.countryName === editData.country,
    );
    if (!selectedCountryObj) return [];
    return cities.filter(
      (ct) => Number(ct.countryId) === Number(selectedCountryObj.id),
    );
  }, [editData.country, countries, cities]);

  return (
    <Container fluid className="p-4 bg-white min-vh-100">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <h5 className="fw-bold text-uppercase">Attorney Management</h5>
        <Input
          placeholder="Search attorneys..."
          className="shadow-sm border-0 bg-light"
          style={{ maxWidth: "350px" }}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-responsive shadow-sm rounded border">
        <Table hover className="align-middle mb-0">
          <thead className="bg-light text-secondary small text-uppercase">
            <tr>
              <th>#</th>
              <th>IMAGE</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>PHONE</th>
              <th>SERVICES</th>
              <th>EXPERIENCE</th>
              <th className="text-center">DOCS</th>
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
                        : "/assets/images/profile.png"
                    }
                    width="40"
                    height="40"
                    className="rounded-circle border"
                    style={{ objectFit: "cover" }}
                    alt="p"
                  />
                </td>
                <td className="fw-bold">
                  {u.firstName} {u.lastName}
                </td>
                <td className="text-primary">{u.email}</td>
                <td>{u.phoneCell || "N/A"}</td>
                <td>{u.servicesOffered || "N/A"}</td>
                <td>
                  {u.experience
                    ? u.experience.split(" ").length > 2
                      ? u.experience.split(" ").slice(0, 2).join(" ") + "..."
                      : u.experience
                    : "N/A"}
                </td>
                <td className="text-center">
                  <Button
                    color="dark"
                    outline
                    size="sm"
                    className="rounded-circle"
                    onClick={() => openDocModal(u)}>
                    <i className="bi bi-file-earmark-text"></i>
                  </Button>
                </td>
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
                    style={{ cursor: "pointer", minWidth: "80px" }}>
                    {u.status}
                  </Badge>
                </td>
                <td className="text-end">
                  <div className="d-flex justify-content-end gap-2">
                    <Button
                      color="warning"
                      outline
                      size="sm"
                      className="rounded-circle"
                      onClick={() => {
                        setEditData(u);
                        toggleModal();
                      }}>
                      <i className="bi bi-pencil-fill"></i>
                    </Button>
                    <Button
                      color="danger"
                      outline
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

      <Modal isOpen={docModal} toggle={toggleDocModal} centered>
        <ModalHeader toggle={toggleDocModal} className="fw-bold">
          Document Center: {selectedDocs.name}
        </ModalHeader>
        <ModalBody className="p-0">
          <Table borderless hover className="mb-0">
            <tbody>
              {[
                { label: "KYC Identity", path: selectedDocs.kycIdentity },
                { label: "KYC Address", path: selectedDocs.kycAddress },
                { label: "Resume/CV", path: selectedDocs.resume },
                { label: "BCI India ID", path: selectedDocs.barCouncilIndiaId },
                { label: "State Bar ID", path: selectedDocs.barCouncilStateId },
              ].map((doc, idx) => (
                <tr key={idx} className="border-bottom">
                  <td className="ps-4 py-3 fw-bold small">{doc.label}</td>
                  <td className="text-end pe-4 py-3">
                    {doc.path ? (
                      <div className="d-flex gap-2 justify-content-end">
                        <Button
                          color="primary"
                          size="sm"
                          outline
                          onClick={() =>
                            window.open(
                              authService.getImgUrl(doc.path),
                              "_blank",
                            )
                          }>
                          View
                        </Button>
                        <Button
                          color="primary"
                          size="sm"
                          onClick={() => handleDownload(doc.path)}>
                          <i className="bi bi-download"></i>
                        </Button>
                      </div>
                    ) : (
                      <span className="text-muted small italic">
                        Not Uploaded
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </ModalBody>
      </Modal>

      <Modal isOpen={modal} toggle={toggleModal} size="xl" centered>
        <ModalHeader
          toggle={toggleModal}
          className="bg-light fw-bold text-primary">
          Edit Attorney Professional Profile
        </ModalHeader>
        <ModalBody className="p-4">
          <Row className="g-3">
            <Col xs={12} className="border-bottom pb-1">
              <h6 className="fw-bold text-dark mb-0">1. Account & Identity</h6>
            </Col>
            <Col md={3}>
              <FormGroup>
                <Label className="small fw-bold">First Name</Label>
                <Input
                  name="firstName"
                  value={editData.firstName || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, firstName: e.target.value })
                  }
                />
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <Label className="small fw-bold">Last Name</Label>
                <Input
                  name="lastName"
                  value={editData.lastName || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, lastName: e.target.value })
                  }
                />
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <Label className="small fw-bold">Email</Label>
                <Input
                  name="email"
                  value={editData.email || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, email: e.target.value })
                  }
                />
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <Label className="small fw-bold">DOB</Label>
                <Input
                  type="date"
                  name="dob"
                  value={editData.dob ? editData.dob.split("T")[0] : ""}
                  onChange={(e) =>
                    setEditData({ ...editData, dob: e.target.value })
                  }
                />
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <Label className="small fw-bold">Status</Label>
                <Input
                  type="select"
                  name="status"
                  value={editData.status || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, status: e.target.value })
                  }>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="verified">Verified</option>
                </Input>
              </FormGroup>
            </Col>

            {/* LANGUAGE DROPDOWN */}
            <Col md={3}>
              <FormGroup>
                <Label className="small fw-bold">Language</Label>
                <Input
                  type="select"
                  name="language"
                  value={editData.language || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, language: e.target.value })
                  }>
                  <option value="">Select Language</option>
                  {languagesList.map((lang) => (
                    <option
                      key={lang.id}
                      value={lang.languageName || lang.name}>
                      {lang.languageName || lang.name}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>

            <Col xs={12} className="border-bottom pb-1 mt-3">
              <h6 className="fw-bold text-dark mb-0">2. Contact & Location</h6>
            </Col>
            <Col md={3}>
              <FormGroup>
                <Label className="small fw-bold">Country</Label>
                <Input
                  type="select"
                  name="country"
                  value={editData.country || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      country: e.target.value,
                      city: "",
                    })
                  }>
                  <option value="">Select Country</option>
                  {countries.map((c) => (
                    <option key={c.id} value={c.countryName}>
                      {c.countryName}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <Label className="small fw-bold">City</Label>
                <Input
                  type="select"
                  name="city"
                  value={editData.city || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, city: e.target.value })
                  }
                  disabled={!editData.country}>
                  <option value="">
                    {editData.country ? "Select City" : "Select Country First"}
                  </option>
                  {filteredCities.map((ct) => (
                    <option key={ct.id} value={ct.id}>
                      {ct.cityName}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <Label className="small fw-bold">State</Label>
                <Input
                  name="state"
                  value={editData.state || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, state: e.target.value })
                  }
                />
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <Label className="small fw-bold">Zip Code</Label>
                <Input
                  name="zipCode"
                  value={editData.zipCode || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, zipCode: e.target.value })
                  }
                />
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <Label className="small fw-bold">Apt/Block</Label>
                <Input
                  name="aptBlock"
                  value={editData.aptBlock || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, aptBlock: e.target.value })
                  }
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label className="small fw-bold">Phone Cell</Label>
                <Input
                  name="phoneCell"
                  value={editData.phoneCell || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, phoneCell: e.target.value })
                  }
                />
              </FormGroup>
            </Col>
            <Col md={5}>
              <FormGroup>
                <Label className="small fw-bold">Street Address</Label>
                <Input
                  name="street"
                  value={editData.street || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, street: e.target.value })
                  }
                />
              </FormGroup>
            </Col>
            <Col md={12}>
              <FormGroup>
                <Label className="small fw-bold">Landmark / Location</Label>
                <Input
                  name="location"
                  value={editData.location || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, location: e.target.value })
                  }
                />
              </FormGroup>
            </Col>

            <Col xs={12} className="border-bottom pb-1 mt-3">
              <h6 className="fw-bold text-dark mb-0">
                3. Professional Credentials
              </h6>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label className="small fw-bold">Services Offered</Label>
                <Input
                  type="select"
                  name="servicesOffered"
                  value={editData.servicesOffered || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      servicesOffered: e.target.value,
                    })
                  }>
                  <option value="">Select Service</option>
                  {servicesList.map((s) => (
                    <option key={s.id} value={s.content}>
                      {s.content}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label className="small fw-bold">Category</Label>
                <Input
                  type="select"
                  name="categoryId"
                  value={editData.categoryId || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, categoryId: e.target.value })
                  }>
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.categoryName}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label className="small fw-bold">Experience</Label>
                <Input
                  name="experience"
                  value={editData.experience || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, experience: e.target.value })
                  }
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label className="small fw-bold">Admission</Label>
                <Input
                  name="text"
                  value={editData.admission || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, admission: e.target.value })
                  }
                  
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label className="small fw-bold">Bar Council India No</Label>
                <Input
                  name="barCouncilIndiaNo"
                  value={editData.barCouncilIndiaNo || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      barCouncilIndiaNo: e.target.value,
                    })
                  }
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label className="small fw-bold">Bar Council State No</Label>
                <Input
                  name="barCouncilStateNo"
                  value={editData.barCouncilStateNo || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      barCouncilStateNo: e.target.value,
                    })
                  }
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label className="small fw-bold">Family Law Practice?</Label>
                <Input
                  type="select"
                  name="familyLawPractice"
                  value={editData.familyLawPractice?.toString() || "false"}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      familyLawPractice: e.target.value,
                    })
                  }>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </Input>
              </FormGroup>
            </Col>
            <Col md={8}>
              <FormGroup>
                <Label className="small fw-bold">Family Law Details</Label>
                <Input
                  name="familyDetails"
                  value={editData.familyDetails || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, familyDetails: e.target.value })
                  }
                />
              </FormGroup>
            </Col>
            <Col md={12}>
              <FormGroup>
                <Label className="small fw-bold">Education Details</Label>
                <Input
                  type="textarea"
                  name="education"
                  value={editData.education || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, education: e.target.value })
                  }
                />
              </FormGroup>
            </Col>
            <Col md={12}>
              <FormGroup>
                <Label className="small fw-bold">Bio / About Us</Label>
                <Input
                  type="textarea"
                  rows="3"
                  name="aboutus"
                  value={editData.aboutus || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, aboutus: e.target.value })
                  }
                />
              </FormGroup>
            </Col>

            <Col xs={12} className="border-bottom pb-1 mt-3">
              <h6 className="fw-bold text-dark mb-0">4. Social Links</h6>
            </Col>
            <Col md={3}>
              <FormGroup>
                <Label className="small fw-bold">LinkedIn</Label>
                <Input
                  name="linkedin"
                  value={editData.linkedin || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, linkedin: e.target.value })
                  }
                />
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <Label className="small fw-bold">Twitter</Label>
                <Input
                  name="twitter"
                  value={editData.twitter || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, twitter: e.target.value })
                  }
                />
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <Label className="small fw-bold">Facebook</Label>
                <Input
                  name="facebook"
                  value={editData.facebook || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, facebook: e.target.value })
                  }
                />
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <Label className="small fw-bold">Gmail/Web</Label>
                <Input
                  name="gmail"
                  value={editData.gmail || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, gmail: e.target.value })
                  }
                />
              </FormGroup>
            </Col>

            <Col xs={12} className="border-bottom pb-1 mt-3">
              <h6 className="fw-bold text-dark mb-0">
                5. Upload New Documents
              </h6>
            </Col>
            {[
              { label: "Profile Photo", key: "profileImage" },
              { label: "KYC Identity", key: "kycIdentity" },
              { label: "KYC Address", key: "kycAddress" },
              { label: "Resume/CV", key: "resume" },
              { label: "BCI India Card", key: "barCouncilIndiaId" },
              { label: "State Bar Card", key: "barCouncilStateId" },
            ].map((f) => (
              <Col md={4} key={f.key}>
                <div className="p-2 border rounded bg-light">
                  <Label
                    className="small fw-bold text-uppercase"
                    style={{ fontSize: "11px" }}>
                    {f.label}
                  </Label>
                  <Input
                    type="file"
                    className="form-control-sm"
                    onChange={(e) =>
                      setUploadFiles({
                        ...uploadFiles,
                        [f.key]: e.target.files[0],
                      })
                    }
                  />
                </div>
              </Col>
            ))}
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
            UPDATE ATTORNEY
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default Attorney;
