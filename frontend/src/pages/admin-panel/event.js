

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
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  FormText,
  ModalFooter,
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import * as authService from "../../services/authService";
import PaginationComponent from "../../context/Pagination";

import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

const Events = () => {
  const GOLD = "#b36b39";
  const LIGHT_GOLD = "#fdf8ef";

  const [activeTab, setActiveTab] = useState("Event Banners");

  const [eventsList, setEventsList] = useState([]);
  const [bannersList, setBannersList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [attorneys, setAttorneys] = useState([]);

  const [modal, setModal] = useState(false);
  const [bannerModalOpen, setBannerModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    description: "",
    registrationLink: "",
    linkedin: "",
    facebook: "",
    twitter: "",
    gmail: "",
    bannerImage: null,
    capabilityCategoryId: "",
    subcategoryIds: [],
    countryId: "",
    cityIds: [],
    attorneyIds: [],
  });

  const [bannerData, setBannerData] = useState({
    image: null,
    description: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const safeArray = (res) => {
    if (Array.isArray(res)) return res;
    if (res?.data && Array.isArray(res.data)) return res.data;
    if (res?.data?.data && Array.isArray(res.data.data)) return res.data.data;
    if (res?.attorneys && Array.isArray(res.attorneys)) return res.attorneys;
    return [];
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [
        eventBannerRes,
        eventRes,
        catRes,
        subRes,
        countRes,
        cityRes,
        attRes,
      ] = await Promise.all([
        authService.getBanner().catch(() => []),
        authService.getAllEvents().catch(() => []),
        authService.getAllCapabilityCategories().catch(() => []),
        authService.getAllCapabilitySubCategories().catch(() => []),
        authService.getAllCountries().catch(() => []),
        authService.getAllCities().catch(() => []),
        authService.getAllAttorneys().catch(() => []),
      ]);

      setBannersList(safeArray(eventBannerRes));
      setEventsList(safeArray(eventRes));
      setCategories(safeArray(catRes));
      setSubcategories(safeArray(subRes));
      setCountries(safeArray(countRes));
      setCities(safeArray(cityRes));
      setAttorneys(safeArray(attRes));
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
        title: "",
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        description: "",
        registrationLink: "",
        linkedin: "",
        facebook: "",
        twitter: "",
        gmail: "",
        bannerImage: null,
        capabilityCategoryId: "",
        subcategoryIds: [],
        countryId: "",
        cityIds: [],
        attorneyIds: [],
      });
      setIsEditing(false);
      setCurrentId(null);
    }
  };

  const toggleBannerModal = () => {
    setBannerModal(!bannerModalOpen);
    if (!bannerModalOpen) {
      setBannerData({ image: null, description: "" });
      setIsEditing(false);
      setCurrentId(null);
    }
  };

  const handleCheckboxChange = (id, field) => {
    const numId = Number(id);
    setFormData((prev) => {
      const list = Array.isArray(prev[field]) ? [...prev[field]] : [];
      return {
        ...prev,
        [field]: list.includes(numId)
          ? list.filter((i) => i !== numId)
          : [...list, numId],
      };
    });
  };

  const handleEditBanner = (item) => {
    setBannerData({
      image: null,
      description: item.textEditor || "",
    });
    setCurrentId(item.id);
    setIsEditing(true);
    setBannerModal(true);
  };

  const handleDeleteBanner = async (id) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      try {
        await authService.deleteBannerEvent(id);
        toast.success("Banner deleted successfully");
        fetchData();
      } catch (err) {
        toast.error("Delete failed");
      }
    }
  };

  const saveBanner = async (e) => {
    if (e) e.preventDefault();
    const currentAdminId = authService.getAdminId();
    if (!currentAdminId) return toast.error("Session expired.");

    setLoading(true);
    try {
      const data = new FormData();
      data.append("textEditor", bannerData.description);
      if (bannerData.image instanceof File) {
        data.append("bannerImage", bannerData.image);
      }

      const res = isEditing
        ? await authService.updateBannerEvent(currentId, data)
        : await authService.createBannerEvent(data);

      if (res) {
        toast.success(isEditing ? "Banner Updated" : "Banner Created");
        toggleBannerModal();
        fetchData();
      }
    } catch (err) {
      toast.error("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentAdminId = authService.getAdminId();
    if (!currentAdminId) return toast.error("Session expired.");

    setLoading(true);
    try {
      const data = new FormData();
      data.append("adminId", currentAdminId);
      data.append("title", formData.title);
      data.append("startDate", formData.startDate);
      data.append("endDate", formData.endDate);
      data.append("startTime", formData.startTime);
      data.append("endTime", formData.endTime);
      data.append("description", formData.description);
      data.append("registrationLink", formData.registrationLink);
      data.append("linkedin", formData.linkedin);
      data.append("facebook", formData.facebook);
      data.append("twitter", formData.twitter);
      data.append("gmail", formData.gmail);
      data.append("capabilityCategoryId", formData.capabilityCategoryId);
      data.append("countryId", formData.countryId);
      data.append("subcategoryIds", JSON.stringify(formData.subcategoryIds));
      data.append("cityIds", JSON.stringify(formData.cityIds));
      data.append("attorneyIds", JSON.stringify(formData.attorneyIds));

      if (formData.bannerImage instanceof File) {
        data.append("bannerImage", formData.bannerImage);
      }

      const res = isEditing
        ? await authService.updateEvent(currentId, data)
        : await authService.createEvent(data);

      if (res) {
        toast.success(isEditing ? "Event Updated" : "Event Created");
        toggle();
        fetchData();
      }
    } catch (err) {
      toast.error("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    const parseIds = (val) => {
      try {
        if (!val) return [];
        return (typeof val === "string" ? JSON.parse(val) : val).map(Number);
      } catch (e) {
        return [];
      }
    };

    setFormData({
      ...item,
      bannerImage: null,
      startDate: item.startDate ? item.startDate.split("T")[0] : "",
      endDate: item.endDate ? item.endDate.split("T")[0] : "",
      capabilityCategoryId: String(item.capabilityCategoryId),
      countryId: String(item.countryId),
      subcategoryIds: parseIds(item.subcategoryIds),
      cityIds: parseIds(item.cityIds),
      attorneyIds: parseIds(item.attorneyIds),
    });
    setCurrentId(item.id);
    setIsEditing(true);
    setModal(true);
  };

  const Selector = ({ label, items, field, type, nameKey }) => (
    <FormGroup>
      <Label className="fw-bold small">{label}</Label>
      <Dropdown
        isOpen={openDropdown === type}
        toggle={() => setOpenDropdown(openDropdown === type ? null : type)}>
        <DropdownToggle
          caret
          className="w-100 d-flex justify-content-between align-items-center bg-white border text-dark">
          {(formData[field] || []).length > 0
            ? `${formData[field].length} Selected`
            : `Select ${label}`}
        </DropdownToggle>
        <DropdownMenu
          className="w-100 shadow-lg border-0 p-2"
          style={{ maxHeight: "250px", overflowY: "auto" }}>
          {items.map((item) => (
            <div
              key={item.id}
              className="d-flex align-items-center p-2 dropdown-item"
              onClick={(e) => e.stopPropagation()}>
              <Input
                type="checkbox"
                className="me-2"
                checked={(formData[field] || []).includes(Number(item.id))}
                onChange={() => handleCheckboxChange(item.id, field)}
              />
              <span className="small">
                {item[nameKey] || `${item.firstName} ${item.lastName || ""}`}
              </span>
            </div>
          ))}
        </DropdownMenu>
      </Dropdown>
    </FormGroup>
  );

  const currentItems = eventsList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <Container
      fluid
      className="p-3 p-md-4 min-vh-100"
      style={{ backgroundColor: "#f9f9f9" }}>
      <ToastContainer />

      <div className="mb-4">
        <h2 className="fw-bold" style={{ color: "#1a365d" }}>
          Events Management
        </h2>
        <p className="text-muted small">
          Manage global conferences and webinars.
        </p>

        <div className="d-flex border-bottom mb-4 overflow-auto">
          {["Event Banners", "Events"].map((tab) => (
            <Button
              key={tab}
              color="link"
              className={`text-decoration-none px-3 py-2 fw-bold text-nowrap ${
                activeTab === tab
                  ? "border-bottom border-3 border-warning text-dark"
                  : "text-muted"
              }`}
              onClick={() => setActiveTab(tab)}
              style={{ fontSize: "14px" }}>
              {tab}
            </Button>
          ))}
        </div>

        <div className="d-flex justify-content-start mb-3">
          <Button
            className="text-white fw-bold shadow-sm"
            style={{
              backgroundColor: GOLD,
              border: "none",
              borderRadius: "4px",
            }}
            onClick={
              activeTab === "Event Banners" ? toggleBannerModal : toggle
            }>
            {activeTab === "Event Banners" ? "+ Add Banner" : "+ Add New Event"}
          </Button>
        </div>
      </div>

      <Card className="border-0 shadow-sm rounded-0">
        <CardBody className="p-0">
          <div className="table-responsive">
            <Table hover className="align-middle mb-0 border">
              <thead style={{ backgroundColor: "#fdfdfd" }}>
                <tr>
                  <th className="px-4" width="10%">
                    ID
                  </th>
                  <th width="15%">BANNER</th>
                  <th width="55%">
                    {activeTab === "Event Banners"
                      ? "DESCRIPTION"
                      : "EVENT TITLE"}
                  </th>
                  <th className="text-end px-4" width="20%">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {activeTab === "Event Banners" ? (
                  bannersList.length > 0 ? (
                    bannersList.map((b, i) => (
                      <tr key={b.id || i}>
                        <td className="px-4">{i + 1}</td>
                        <td>
                          <img
                            src={authService.getImgUrl(b.bannerImage)}
                            alt="banner"
                            style={{
                              height: "40px",
                              width: "70px",
                              objectFit: "cover",
                              borderRadius: "4px",
                            }}
                            onError={(e) =>
                              (e.target.src =
                                "https://placehold.co/70x40?text=No+Img")
                            }
                          />
                        </td>
                        <td className="small">
                          <div
                            dangerouslySetInnerHTML={{ __html: b.textEditor }}
                          />
                        </td>
                        <td className="text-end px-4">
                          <Button
                            size="sm"
                            color="link"
                            onClick={() => handleEditBanner(b)}>
                            ✏️
                          </Button>
                          <Button
                            size="sm"
                            color="link"
                            className="text-danger"
                            onClick={() => handleDeleteBanner(b.id)}>
                            🗑️
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center py-5 text-muted small">
                        No Banners Added Yet
                      </td>
                    </tr>
                  )
                ) : currentItems.length > 0 ? (
                  currentItems.map((item, index) => (
                    <tr key={item.id}>
                      <td className="px-4 text-muted">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td>
                        <img
                          src={authService.getImgUrl(item.bannerImage)}
                          alt="Event Banner"
                          style={{
                            height: "40px",
                            width: "70px",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                          onError={(e) =>
                            (e.target.src =
                              "https://placehold.co/70x40?text=No+Img")
                          }
                        />
                      </td>
                      <td className="fw-bold">{item.title}</td>
                      <td className="text-end px-4">
                        <Button
                          size="sm"
                          color="link"
                          onClick={() => handleEdit(item)}>
                          ✏️
                        </Button>
                        <Button
                          size="sm"
                          color="link"
                          className="text-danger"
                          onClick={() => {
                            if (window.confirm("Delete this event?"))
                              authService.deleteEvent(item.id).then(fetchData);
                          }}>
                          🗑️
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-5 text-muted small">
                      No Events Found
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
          totalItems={
            activeTab === "Event Banners"
              ? bannersList.length
              : eventsList.length
          }
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>

      <Modal isOpen={modal} toggle={toggle} centered size="xl" scrollable>
        <ModalHeader toggle={toggle} style={{ color: GOLD }}>
          {isEditing ? "Update Event" : "Create New Event"}
        </ModalHeader>
        <ModalBody className="px-4 pb-4">
          <Form onSubmit={handleSubmit}>
            <Row className="gy-3">
              <Col md={12}>
                <FormGroup>
                  <Label className="fw-bold small">Event Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </FormGroup>
              </Col>
              <Col md={3}>
                <FormGroup>
                  <Label className="fw-bold small">Start Date *</Label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    required
                  />
                </FormGroup>
              </Col>
              <Col md={3}>
                <FormGroup>
                  <Label className="fw-bold small">End Date *</Label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    required
                  />
                </FormGroup>
              </Col>
              <Col md={3}>
                <FormGroup>
                  <Label className="fw-bold small">Start Time</Label>
                  <Input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) =>
                      setFormData({ ...formData, startTime: e.target.value })
                    }
                  />
                </FormGroup>
              </Col>
              <Col md={3}>
                <FormGroup>
                  <Label className="fw-bold small">End Time</Label>
                  <Input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData({ ...formData, endTime: e.target.value })
                    }
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className="fw-bold small">Main Category *</Label>
                  <Input
                    type="select"
                    value={formData.capabilityCategoryId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        capabilityCategoryId: e.target.value,
                      })
                    }
                    required>
                    <option value="">-- Select Category --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.categoryName}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className="fw-bold small">Country *</Label>
                  <Input
                    type="select"
                    value={formData.countryId}
                    onChange={(e) =>
                      setFormData({ ...formData, countryId: e.target.value })
                    }
                    required>
                    <option value="">-- Select Country --</option>
                    {countries.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.countryName}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col md={4}>
                <Selector
                  label="Subcategories"
                  items={subcategories}
                  field="subcategoryIds"
                  type="sub"
                  nameKey="subcategoryName"
                />
              </Col>
              <Col md={4}>
                <Selector
                  label="Cities"
                  items={cities}
                  field="cityIds"
                  type="city"
                  nameKey="cityName"
                />
              </Col>
              <Col md={4}>
                <Selector
                  label="Attorneys"
                  items={attorneys}
                  field="attorneyIds"
                  type="attor"
                  nameKey="firstName"
                />
              </Col>
              <Col md={6}>
                <Label className="small fw-bold">Registration Link</Label>
                <Input
                  value={formData.registrationLink}
                  placeholder="Enter registration URL"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      registrationLink: e.target.value,
                    })
                  }
                />
              </Col>
              <Col md={6}>
                <Label className="small fw-bold">Gmail / Contact Email</Label>
                <Input
                  placeholder="Enter Contact Email"
                  value={formData.gmail}
                  onChange={(e) =>
                    setFormData({ ...formData, gmail: e.target.value })
                  }
                />
              </Col>
              <Col md={4}>
                <Label className="small fw-bold">LinkedIn</Label>
                <Input
                  value={formData.linkedin}
                  placeholder="LinkedIn URL"
                  onChange={(e) =>
                    setFormData({ ...formData, linkedin: e.target.value })
                  }
                />
              </Col>
              <Col md={4}>
                <Label className="small fw-bold">Facebook</Label>
                <Input
                  value={formData.facebook}
                  placeholder="Facebook URL"
                  onChange={(e) =>
                    setFormData({ ...formData, facebook: e.target.value })
                  }
                />
              </Col>
              <Col md={4}>
                <Label className="small fw-bold">Twitter</Label>
                <Input
                  value={formData.twitter}
                  placeholder="Twitter URL"
                  onChange={(e) =>
                    setFormData({ ...formData, twitter: e.target.value })
                  }
                />
              </Col>
              <Col md={12}>
                <Label className="fw-bold small">Description *</Label>
                <ReactQuill
                  theme="snow"
                  value={formData.description}
                  onChange={(v) => setFormData({ ...formData, description: v })}
                  style={{ height: "200px", marginBottom: "50px" }}
                />
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className="fw-bold small">Banner Image</Label>
                  <Input
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
            <div className="mt-4 d-flex gap-2">
              <Button
                type="submit"
                className="px-5 text-white fw-bold shadow-sm"
                style={{ backgroundColor: GOLD, border: "none" }}
                disabled={loading}>
                {loading ? "Saving..." : "Save Event"}
              </Button>
              <Button outline className="px-5 fw-bold" onClick={toggle}>
                Cancel
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>

      <Modal
        isOpen={bannerModalOpen}
        toggle={toggleBannerModal}
        size="lg"
        centered>
        <ModalHeader toggle={toggleBannerModal}>
          {isEditing ? "Edit Banner" : "Add Event Banner"}
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label className="fw-bold">Image</Label>
            <Input
              type="file"
              onChange={(e) =>
                setBannerData({ ...bannerData, image: e.target.files[0] })
              }
            />
            {isEditing && (
              <FormText color="muted">
                Leave blank to keep current image
              </FormText>
            )}
          </FormGroup>
          <FormGroup>
            <Label className="fw-bold">Description Text</Label>
            <ReactQuill
              theme="snow"
              value={bannerData.description}
              onChange={(v) => setBannerData({ ...bannerData, description: v })}
              style={{ height: "150px", marginBottom: "40px" }}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleBannerModal}>
            Cancel
          </Button>
          <Button
            style={{ backgroundColor: GOLD, color: "#fff" }}
            onClick={saveBanner}
            disabled={loading}>
            {loading
              ? "Saving..."
              : isEditing
                ? "Update Banner"
                : "Save Banner"}
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default Events;