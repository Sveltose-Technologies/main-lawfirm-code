"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  Nav,
  NavItem,
  NavLink,
  Row,
  Col,
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import classnames from "classnames";
import * as authService from "../../services/authService";

import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

const LocationManagement = () => {
  const GOLD = "#eebb5d";
  const LIGHT_GOLD = "#fdf8ef";

  const [activeTab, setActiveTab] = useState("country");
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [locations, setLocations] = useState([]); // New State

  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [formData, setFormData] = useState({
    countryName: "",
    content: "",
    countryId: "",
    cityName: "",
    address: "",
    phoneNo: "",
    faxNo: "",
    image: null,
    bannerImage: null, // New field
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

  const truncateWords = (html, limit) => {
    if (!html) return "No description";
    const plainText = html
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const words = plainText.split(" ");
    if (words.length <= limit) return plainText;
    return words.slice(0, limit).join(" ") + "...";
  };

  const getSafeArray = (res) => {
    if (res?.success && Array.isArray(res.data)) return res.data;
    if (Array.isArray(res)) return res;
    return [];
  };

  const fetchData = useCallback(async () => {
    try {
      const countryRes = await authService.getAllCountries();
      const cityRes = await authService.getAllCities();
      const locationRes = await authService.getAllLocations(); // Fetch Locations

      setCountries(getSafeArray(countryRes));
      setCities(getSafeArray(cityRes));
      setLocations(getSafeArray(locationRes));
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggle = () => {
    setModal(!modal);
    if (!modal) {
      setFormData({
        countryName: "",
        content: "",
        countryId: "",
        cityName: "",
        address: "",
        phoneNo: "",
        faxNo: "",
        image: null,
        bannerImage: null,
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
  console.log("Submit Initialized:", { activeTab, isEditing, currentId });

  try {
    let res;

    // --- 1. COUNTRY TAB ---
    if (activeTab === "country") {
      const payload = {
        adminId: parseInt(currentAdminId),
        countryName: formData.countryName.trim(),
        content: formData.content,
      };
      console.log("Sending Country Payload:", payload);
      res = isEditing
        ? await authService.updateLocationCountry(currentId, payload)
        : await authService.createLocationCountry(payload);
    }

    // --- 2. CITY TAB ---
    else if (activeTab === "city") {
      if (!formData.countryId) {
        toast.error("Please select a country first");
        setLoading(false);
        return;
      }

      const data = new FormData();
      // Ensure specific data types
      data.append("adminId", String(currentAdminId));
      data.append("countryId", String(formData.countryId));
      data.append("cityName", formData.cityName.trim());
      data.append("address", formData.address || "");
      data.append("phoneNo", formData.phoneNo || "");
      data.append("faxNo", formData.faxNo || "");
      data.append("content", formData.content || "");

      if (formData.image instanceof File) {
        data.append("image", formData.image);
      }

      console.log("Checking City FormData before send:");
      data.forEach((value, key) => console.log(`${key}:`, value));

      res = isEditing
        ? await authService.updateLocationCity(currentId, data)
        : await authService.createLocationCity(data);
    }

    // --- 3. LOCATION TAB ---
    else if (activeTab === "location") {
      const data = new FormData();
      data.append("adminId", String(currentAdminId));
      data.append("content", formData.content || "");

      if (formData.bannerImage instanceof File) {
        data.append("bannerImage", formData.bannerImage);
      }

      res = isEditing
        ? await authService.updateLocation(currentId, data)
        : await authService.createLocation(data);
    }

    if (res) {
      toast.success(`${activeTab.toUpperCase()} Saved Successfully!`);
      toggle();
      fetchData();
    }
  } catch (err) {
    console.error("Submission Error Details:", err);

    // Fixed: Check if err exists and has response property
    let errorMsg = "Operation failed";

    if (err && err.response && err.response.data) {
      console.error("Server Error Data:", err.response.data);
      errorMsg = err.response.data.message || errorMsg;
    } else if (err && err.message) {
      errorMsg = err.message;
    }

    toast.error(errorMsg);
  } finally {
    setLoading(false);
  }
};
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      let res;
      if (activeTab === "country")
        res = await authService.deleteLocationCountry(id);
      else if (activeTab === "city")
        res = await authService.deleteLocationCity(id);
      else if (activeTab === "location")
        res = await authService.deleteLocation(id);

      if (res) {
        toast.success("Deleted successfully");
        fetchData();
      }
    } catch (e) {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setCurrentId(item.id || item._id);
    if (activeTab === "country") {
      setFormData({
        countryName: item.countryName,
        content: item.content || "",
      });
    } else if (activeTab === "city") {
      setFormData({
        countryId: item.countryId,
        cityName: item.cityName,
        address: item.address || "",
        phoneNo: item.phoneNo || "",
        faxNo: item.faxNo || "",
        content: item.content || "",
        image: null,
      });
    } else if (activeTab === "location") {
      setFormData({
        content: item.content || "",
        bannerImage: null,
      });
    }
    setModal(true);
  };

  return (
    <Container
      fluid
      className="p-4"
      style={{ backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <ToastContainer theme="colored" />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0">Location Management</h4>
          <p className="text-muted small">
            Manage Countries, Cities and Main Locations.
          </p>
        </div>
        <Button className="btn-gold px-4" onClick={toggle}>
          + Add{" "}
          {activeTab === "country"
            ? "Country"
            : activeTab === "city"
              ? "City"
              : "Location"}
        </Button>
      </div>

      <Nav tabs className="border-0 mb-3">
        {["country", "city", "location"].map((tab) => (
          <NavItem key={tab}>
            <NavLink
              className={classnames("fw-bold border-0 px-4", {
                active: activeTab === tab,
              })}
              onClick={() => setActiveTab(tab)}
              style={{ cursor: "pointer" }}>
              {tab.toUpperCase()} {tab === "location" ? "" : "MANAGEMENT"}
            </NavLink>
          </NavItem>
        ))}
      </Nav>

      <Card className="border-0 shadow-sm rounded-4">
        <CardBody className="p-0">
          <Table hover responsive className="align-middle mb-0 text-nowrap">
            <thead style={{ backgroundColor: LIGHT_GOLD }}>
              <tr>
                <th className="px-4 py-3">Sr. No.</th>
                {activeTab === "country" ? (
                  <>
                    <th>Country Name</th>
                    <th>Description</th>
                  </>
                ) : activeTab === "city" ? (
                  <>
                    <th>Image</th>
                    <th>City Name</th>
                    <th>Country</th>
                    <th>Description</th>
                    <th>Contacts</th>
                  </>
                ) : (
                  <>
                    <th>Banner Image</th>
                    <th>Content</th>
                  </>
                )}
                <th className="text-end px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {activeTab === "country" &&
                countries.map((c, i) => (
                  <tr key={c.id}>
                    <td className="px-4">{i + 1}</td>
                    <td className="fw-bold">{c.countryName}</td>
                    <td className="text-muted small">
                      {truncateWords(c.content, 3)}
                    </td>
                    <td className="text-end px-4">
                      <Button
                        size="sm"
                        color="white"
                        className="border shadow-sm me-2"
                        onClick={() => handleEdit(c)}>
                        ✏️
                      </Button>
                      <Button
                        size="sm"
                        color="white"
                        className="text-danger border shadow-sm"
                        onClick={() => handleDelete(c.id)}>
                        🗑️
                      </Button>
                    </td>
                  </tr>
                ))}

              {activeTab === "city" &&
                cities.map((city, i) => (
                  <tr key={city.id}>
                    <td className="px-4">{i + 1}</td>
                    <td>
                      <img
                        src={authService.getImgUrl(city.image)}
                        alt="city"
                        style={{
                          width: "55px",
                          height: "40px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                        onError={(e) => {
                          e.target.src =
                            "https://placehold.co/70x45?text=No+Image";
                        }}
                      />
                    </td>
                    <td className="fw-bold">{city.cityName}</td>
                    <td>
                      {countries.find(
                        (c) => String(c.id) === String(city.countryId),
                      )?.countryName || `ID: ${city.countryId}`}
                    </td>
                    <td className="text-muted small">
                      {truncateWords(city.content, 3)}
                    </td>
                    <td className="small">
                      📞 {city.phoneNo} <br /> 📠 {city.faxNo}
                    </td>
                    <td className="text-end px-4">
                      <Button
                        size="sm"
                        color="white"
                        className="border shadow-sm me-2"
                        onClick={() => handleEdit(city)}>
                        ✏️
                      </Button>
                      <Button
                        size="sm"
                        color="white"
                        className="text-danger border shadow-sm"
                        onClick={() => handleDelete(city.id)}>
                        🗑️
                      </Button>
                    </td>
                  </tr>
                ))}

              {activeTab === "location" &&
                locations.map((loc, i) => (
                  <tr key={loc.id || loc._id}>
                    <td className="px-4">{i + 1}</td>
                    <td>
                      <img
                        src={authService.getImgUrl(loc.bannerImage)}
                        alt="banner"
                        style={{
                          width: "80px",
                          height: "45px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                        onError={(e) => {
                          e.target.src =
                            "https://placehold.co/80x45?text=No+Image";
                        }}
                      />
                    </td>
                    <td className="text-muted small">
                      {truncateWords(loc.content, 10)}
                    </td>
                    <td className="text-end px-4">
                      <Button
                        size="sm"
                        color="white"
                        className="border shadow-sm me-2"
                        onClick={() => handleEdit(loc)}>
                        ✏️
                      </Button>
                      <Button
                        size="sm"
                        color="white"
                        className="text-danger border shadow-sm"
                        onClick={() => handleDelete(loc.id || loc._id)}>
                        🗑️
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>

      <Modal isOpen={modal} toggle={toggle} size="lg" centered scrollable>
        <ModalHeader
          toggle={toggle}
          className="border-0 fw-bold"
          style={{ color: GOLD }}>
          {isEditing ? "Edit" : "Add New"} {activeTab.toUpperCase()}
        </ModalHeader>
        <ModalBody className="px-4 pb-4">
          <Form onSubmit={handleSubmit}>
            {activeTab === "country" && (
              <>
                <FormGroup>
                  <Label className="small fw-bold">Country Name *</Label>
                  <Input
                    required
                    value={formData.countryName}
                    onChange={(e) =>
                      setFormData({ ...formData, countryName: e.target.value })
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label className="small fw-bold">Description *</Label>
                  <ReactQuill
                    theme="snow"
                    value={formData.content}
                    onChange={(val) =>
                      setFormData({ ...formData, content: val })
                    }
                    modules={modules}
                    style={{ height: "250px", marginBottom: "50px" }}
                  />
                </FormGroup>
              </>
            )}

            {activeTab === "city" && (
              <Row className="gy-3">
                <Col md={12}>
                  <FormGroup>
                    <Label className="small fw-bold">Country *</Label>
                    <Input
                      type="select"
                      required
                      value={formData.countryId}
                      onChange={(e) =>
                        setFormData({ ...formData, countryId: e.target.value })
                      }>
                      <option value="">-- Select Country --</option>
                      {countries.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.countryName}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={12}>
                  <FormGroup>
                    <Label className="small fw-bold">City Name *</Label>
                    <Input
                      required
                      value={formData.cityName}
                      onChange={(e) =>
                        setFormData({ ...formData, cityName: e.target.value })
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label className="small fw-bold">Phone No</Label>
                    <Input
                      value={formData.phoneNo}
                      onChange={(e) =>
                        setFormData({ ...formData, phoneNo: e.target.value })
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label className="small fw-bold">Fax No</Label>
                    <Input
                      value={formData.faxNo}
                      onChange={(e) =>
                        setFormData({ ...formData, faxNo: e.target.value })
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md={12}>
                  <FormGroup>
                    <Label className="small fw-bold">Address</Label>
                    <Input
                      type="textarea"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md={12}>
                  <FormGroup>
                    <Label className="small fw-bold">City Content</Label>
                    <ReactQuill
                      theme="snow"
                      value={formData.content}
                      onChange={(val) =>
                        setFormData({ ...formData, content: val })
                      }
                      modules={modules}
                      style={{ height: "180px", marginBottom: "45px" }}
                    />
                  </FormGroup>
                </Col>
                <Col md={12}>
                  <FormGroup>
                    <Label className="small fw-bold">City Image</Label>
                    <Input
                      type="file"
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.files[0] })
                      }
                      accept="image/*"
                    />
                  </FormGroup>
                </Col>
              </Row>
            )}

            {activeTab === "location" && (
              <Row className="gy-3">
                <Col md={12}>
                  <FormGroup>
                    <Label className="small fw-bold">Banner Image</Label>
                    <Input
                      type="file"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bannerImage: e.target.files[0],
                        })
                      }
                      accept="image/*"
                    />
                    {isEditing && (
                      <small className="text-muted">
                        Leave empty to keep current image
                      </small>
                    )}
                  </FormGroup>
                </Col>
                <Col md={12}>
                  <FormGroup>
                    <Label className="small fw-bold">Location Content *</Label>
                    <ReactQuill
                      theme="snow"
                      value={formData.content}
                      onChange={(val) =>
                        setFormData({ ...formData, content: val })
                      }
                      modules={modules}
                      style={{ height: "250px", marginBottom: "50px" }}
                    />
                  </FormGroup>
                </Col>
              </Row>
            )}

            <Button
              type="submit"
              className="btn-gold w-100 mt-4 py-2 fw-bold"
              disabled={loading}>
              {loading ? "Processing..." : "Save Details"}
            </Button>
          </Form>
        </ModalBody>
      </Modal>

      <style jsx global>{`
        .btn-gold {
          background-color: #eebb5d !important;
          color: white !important;
          border: none !important;
        }
        .nav-link {
          color: black !important;
        }
        .nav-link.active {
          border-bottom: 3px solid #eebb5d !important;
          background: transparent !important;
          color: black !important;
          font-weight: 700;
        }
        .text-nowrap th,
        .text-nowrap td {
          white-space: nowrap;
        }
      `}</style>
    </Container>
  );
};

export default LocationManagement;
