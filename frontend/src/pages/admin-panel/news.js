
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
} from "reactstrap";

import * as authService from "../../services/authService";
import PaginationComponent from "../../context/Pagination";

import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

const News = () => {
  const GOLD = "#eebb5d";
  const LIGHT_GOLD = "#fdf8ef";

  const [newsList, setNewsList] = useState([]);
  const [modal, setModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [attorneys, setAttorneys] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    year: new Date().getFullYear(),
    textEditor: "",
    bannerImage: null,
    newsImage: null,
    capabilityCategoryId: [],
    countryId: [],
    cityId: [],
    attorneyId: [],
    linkedin: "",
    twitter: "",
    facebook: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const truncateTitle = (title, limit = 3) => {
    if (!title) return "";
    const words = title.trim().split(/\s+/);
    if (words.length <= limit) return title;
    return words.slice(0, limit).join(" ") + "...";
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [newsRes, catRes, countRes, cityRes, attRes] = await Promise.all([
        authService.getAllNews(),
        authService.getAllCapabilityCategories(),
        authService.getAllCountries(),
        authService.getAllLocationCities(),
        authService.getAllAttorneys(),
      ]);

      setNewsList(newsRes?.data || newsRes || []);
      setCategories(catRes?.data || catRes || []);
      setCountries(countRes?.data || countRes || []);
      setCities(cityRes?.data || cityRes || []);
      setAttorneys(attRes?.attorneys || attRes?.data || attRes || []);
    } catch (error) {
      console.error("Data Load Error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggle = () => {
    setModal(!modal);
    if (modal) {
      setFormData({
        title: "",
        date: "",
        year: new Date().getFullYear(),
        textEditor: "",
        bannerImage: null,
        newsImage: null,
        capabilityCategoryId: [],
        countryId: [],
        cityId: [],
        attorneyId: [],
        linkedin: "",
        twitter: "",
        facebook: "",
      });
      setIsEditing(false);
      setCurrentId(null);
    }
  };

  const handleCheckboxChange = (id, field) => {
    const stringId = id.toString();
    const updated = formData[field].includes(stringId)
      ? formData[field].filter((i) => i !== stringId)
      : [...formData[field], stringId];
    setFormData({ ...formData, [field]: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentAdminId = authService.getAdminId();
    if (!currentAdminId) {
      alert("Session expired. Please login again.");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append("adminId", currentAdminId);
      data.append("title", formData.title);
      data.append("date", formData.date);
      data.append("year", formData.year);
      data.append("textEditor", formData.textEditor);

      data.append(
        "capabilityCategoryId",
        JSON.stringify(formData.capabilityCategoryId.map(Number)),
      );
      data.append("countryId", JSON.stringify(formData.countryId.map(Number)));
      data.append("cityId", JSON.stringify(formData.cityId.map(Number)));
      data.append(
        "attorneyId",
        JSON.stringify(formData.attorneyId.map(Number)),
      );

      const socials = {
        linkedin: formData.linkedin,
        twitter: formData.twitter,
        facebook: formData.facebook,
      };
      data.append("socialLinks", JSON.stringify(socials));

      if (formData.bannerImage instanceof File)
        data.append("bannerImage", formData.bannerImage);
      if (formData.newsImage instanceof File)
        data.append("newsImage", formData.newsImage);

      const res = isEditing
        ? await authService.updateNews(currentId, data)
        : await authService.createNews(data);

      if (res) {
        toggle();
        fetchData();
      }
    } catch (error) {
      console.error("Submit Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    const parse = (val) => {
      try {
        if (!val) return [];
        return typeof val === "string" ? JSON.parse(val) : val;
      } catch {
        return [];
      }
    };

    const socials = parse(item.socialLinks) || {};

    setFormData({
      title: item.title || "",
      date: item.date || "",
      year: item.year || new Date().getFullYear(),
      textEditor: item.textEditor || "",
      capabilityCategoryId: parse(item.capabilityCategoryId).map(String),
      countryId: parse(item.countryId).map(String),
      cityId: parse(item.cityId).map(String),
      attorneyId: parse(item.attorneyId).map(String),
      linkedin: socials.linkedin || "",
      twitter: socials.twitter || "",
      facebook: socials.facebook || "",
      bannerImage: null,
      newsImage: null,
    });

    setCurrentId(item.id);
    setIsEditing(true);
    setModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this news?")) {
      try {
        await authService.deleteNews(id);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const Selector = ({ label, items, field, type, nameKey }) => (
    <FormGroup>
      <Label className="fw-bold small">{label}</Label>
      <Dropdown
        isOpen={openDropdown === type}
        toggle={() => setOpenDropdown(openDropdown === type ? null : type)}>
        <DropdownToggle
          caret
          className="w-100 d-flex justify-content-between align-items-center bg-white border text-dark shadow-sm">
          {formData[field].length > 0
            ? `${formData[field].length} Selected`
            : `Select ${label}`}
        </DropdownToggle>
        <DropdownMenu
          className="w-100 shadow-lg border-0 p-2"
          style={{ maxHeight: "250px", overflowY: "auto" }}>
          {items.map((item) => {
            const displayName =
              item[nameKey] ||
              item.categoryName ||
              item.countryName ||
              item.cityName ||
              `${item.firstName} ${item.lastName || ""}`;
            return (
              <div
                key={item.id}
                className="d-flex align-items-center p-2 dropdown-item"
                onClick={(e) => e.stopPropagation()}>
                <Input
                  type="checkbox"
                  className="me-2 cursor-pointer"
                  checked={formData[field].includes(item.id.toString())}
                  onChange={() => handleCheckboxChange(item.id, field)}
                />
                <span
                  className="small cursor-pointer w-100"
                  onClick={() => handleCheckboxChange(item.id, field)}>
                  {displayName}
                </span>
              </div>
            );
          })}
        </DropdownMenu>
      </Dropdown>
    </FormGroup>
  );

  const currentItems = newsList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <Container
      fluid
      className="p-3 p-md-4 min-vh-100"
      style={{ backgroundColor: "#f9f9f9" }}>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4 gap-3">
        <div>
          <h4 className="fw-bold mb-0">News Management</h4>
          <p className="text-muted small mb-0">
            Manage and publish news articles.
          </p>
        </div>
        <Button
          className="px-4 text-white fw-bold shadow-sm w-100 w-sm-auto"
          style={{ backgroundColor: GOLD, border: "none" }}
          onClick={toggle}>
          + Add News
        </Button>
      </div>

      <Card className="border-0 shadow-sm rounded-4">
        <CardBody className="p-0">
          <div className="table-responsive">
            <Table hover className="align-middle mb-0 text-nowrap">
              <thead style={{ backgroundColor: LIGHT_GOLD }}>
                <tr>
                  <th className="px-4 py-3">SR.</th>
                  <th>BANNER</th>
                  <th>NEWS TITLE</th>
                  <th>PUBLISHED</th>
                  <th className="text-end px-4">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((item, index) => (
                    <tr key={item.id}>
                      <td className="px-4 text-muted">
                        {(currentPage - 1) * itemsPerPage + index + 1}.
                      </td>
                      <td>
                        <img
                          src={authService.getImgUrl(item.bannerImage)}
                          style={{
                            width: "60px",
                            height: "40px",
                            objectFit: "cover",
                            borderRadius: "4px",
                            border: "1px solid #eee",
                          }}
                          onError={(e) =>
                            (e.target.src =
                              "https://placehold.co/60x40?text=No+Img")
                          }
                          alt="Banner"
                        />
                      </td>
                      <td className="fw-bold">
                        {truncateTitle(item.title, 5)}
                      </td>
                      <td className="text-muted small">
                        {item.date} ({item.year})
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
                    <td colSpan="5" className="text-center py-5">
                      No news found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </CardBody>
      </Card>

      <div className="mt-4 d-flex justify-content-center">
        <PaginationComponent
          totalItems={newsList.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>

      <Modal isOpen={modal} toggle={toggle} centered size="xl" scrollable>
        <ModalHeader
          toggle={toggle}
          className="fw-bold border-0"
          style={{ color: GOLD }}>
          {isEditing ? "Update News Entry" : "Create News Entry"}
        </ModalHeader>
        <ModalBody className="px-4 pb-4">
          <Form onSubmit={handleSubmit}>
            <Row className="gy-3">
              <Col lg={6} md={12}>
                <FormGroup>
                  <Label className="small fw-bold">News Title *</Label>
                  <Input
                    value={formData.title}
                    placeholder="Enter news heading"
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </FormGroup>
              </Col>
              <Col lg={3} md={6} xs={6}>
                <FormGroup>
                  <Label className="small fw-bold">Publish Date *</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    required
                  />
                </FormGroup>
              </Col>
              <Col lg={3} md={6} xs={6}>
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

              <Col md={3} xs={12}>
                <Selector
                  label="Capabilities"
                  items={categories}
                  field="capabilityCategoryId"
                  type="cat"
                  nameKey="categoryName"
                />
              </Col>
              <Col md={3} xs={12}>
                <Selector
                  label="Attorneys"
                  items={attorneys}
                  field="attorneyId"
                  type="att"
                  nameKey="firstName"
                />
              </Col>
              <Col md={3} xs={12}>
                <Selector
                  label="Countries"
                  items={countries}
                  field="countryId"
                  type="count"
                  nameKey="countryName"
                />
              </Col>
              <Col md={3} xs={12}>
                <Selector
                  label="Cities"
                  items={cities}
                  field="cityId"
                  type="city"
                  nameKey="cityName"
                />
              </Col>

              <Col md={6} xs={12}>
                <FormGroup>
                  <Label className="small fw-bold">
                    Banner Image (Large) *
                  </Label>
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
                </FormGroup>
              </Col>
              <Col md={6} xs={12}>
                <FormGroup>
                  <Label className="small fw-bold">
                    Thumbnail Image (Small)
                  </Label>
                  <Input
                    type="file"
                    onChange={(e) =>
                      setFormData({ ...formData, newsImage: e.target.files[0] })
                    }
                    accept="image/*"
                  />
                </FormGroup>
              </Col>

              <Col md={4} xs={12}>
                <Label className="small fw-bold">LinkedIn URL</Label>
                <Input
                  value={formData.linkedin}
                  placeholder="https://linkedin.com/..."
                  onChange={(e) =>
                    setFormData({ ...formData, linkedin: e.target.value })
                  }
                />
              </Col>
              <Col md={4} xs={12}>
                <Label className="small fw-bold">Twitter URL</Label>
                <Input
                  value={formData.twitter}
                  placeholder="https://twitter.com/..."
                  onChange={(e) =>
                    setFormData({ ...formData, twitter: e.target.value })
                  }
                />
              </Col>
              <Col md={4} xs={12}>
                <Label className="small fw-bold">Facebook URL</Label>
                <Input
                  value={formData.facebook}
                  placeholder="https://facebook.com/..."
                  onChange={(e) =>
                    setFormData({ ...formData, facebook: e.target.value })
                  }
                />
              </Col>

              <Col xs={12}>
                <Label className="small fw-bold">News Content Editor *</Label>
                <div style={{ minHeight: "300px", marginBottom: "50px" }}>
                  <ReactQuill
                    theme="snow"
                    value={formData.textEditor}
                    onChange={(v) =>
                      setFormData({ ...formData, textEditor: v })
                    }
                    style={{ height: "250px" }}
                  />
                </div>
              </Col>
            </Row>
            <div className="mt-5 d-flex flex-column flex-sm-row gap-2">
              <Button
                type="submit"
                className="px-5 text-white fw-bold shadow-sm"
                style={{ backgroundColor: GOLD, border: "none" }}
                disabled={loading}>
                {loading
                  ? "Processing..."
                  : isEditing
                    ? "Update News"
                    : "Publish News"}
              </Button>
              <Button outline className="px-4" onClick={toggle}>
                Discard
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>

      <style jsx global>{`
        .table-responsive::-webkit-scrollbar {
          height: 6px;
        }
        .table-responsive::-webkit-scrollbar-thumb {
          background: #eebb5d;
          border-radius: 10px;
        }
        .dropdown-item:hover {
          background-color: #fdf8ef !important;
        }
        .cursor-pointer {
          cursor: pointer;
        }
      `}</style>
    </Container>
  );
};

export default News;