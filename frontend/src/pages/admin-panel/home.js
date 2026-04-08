"use client";
import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  Container,
  Card,
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
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getAllLogoTypes,
  getAllHomeBanners,
  getAllHomeData,
  createLogoType,
  updateLogoType,
  deleteLogoType,
  createHomeBanner,
  updateHomeBanner,
  deleteHomeBanner,
  createHomeData,
  updateHomeData,
  deleteHomeData,
  getAllRanking,
  createRanking,
  updateRanking,
  getAllCounters,
  createCounters,
  updateCounters,
  getImgUrl,
  deleteRankData,
  deleteCountData,
} from "../../services/authService";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

const AdminHomeManagement = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [loading, setLoading] = useState(false);

  // Data States
  const [logoTypes, setLogoTypes] = useState([]);
  const [homeBanners, setHomeBanners] = useState([]);
  const [homeDataList, setHomeDataList] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [counters, setCounters] = useState([]);

  // Modal States
  const [modal, setModal] = useState({
    open: false,
    type: "",
    edit: false,
    id: null,
  });

  // Form States
  const [logoForm, setLogoForm] = useState({ type: "logo" });
  const [bannerForm, setBannerForm] = useState({
    typeId: "",
    textEditor: "",
    image: null,
  });
  const [homeDataForm, setHomeDataForm] = useState({
    middleText: "",
    firstTextEditor: "",
    secondTextEditor: "",
    thirdTextEditor: "",
    fourthTextEditor: "",
    firstImage: null,
    secondImage: null,
    thirdImage: null,
    fourthImage: null,
  });

  // Ranking Form State
  const [rankingForm, setRankingForm] = useState({
    rankingText: "",
    rankingNo: "",
    languageText: "",
    languageNo: "",
    countrieText: "",
    countrieNo: "",
    locationText: "",
    locationNo: "",
    textEditor: "",
  });

  // Counters Form State
  const [counterForm, setCounterForm] = useState({
    consultationsText: "",
    consultationsNo: "",
    successRateText: "",
    successRateCount: "",
    yearsExperienceText: "",
    yearsExperienceCount: "",
    attorneysText: "",
    attorneysCount: "",
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [logoRes, bannerRes, homeRes, rankRes, countRes] =
        await Promise.all([
          getAllLogoTypes(),
          getAllHomeBanners(),
          getAllHomeData(),
          getAllRanking ? getAllRanking() : Promise.resolve({ data: [] }),
          getAllCounters ? getAllCounters() : Promise.resolve({ data: [] }),
        ]);
      setLogoTypes(logoRes.data?.data || logoRes.data || []);
      setHomeBanners(bannerRes.data?.data || bannerRes.data || []);
      setHomeDataList(homeRes.data?.data || homeRes.data || []);
      setRankings(rankRes.data?.data || rankRes.data || []);
      setCounters(countRes.data?.data || countRes.data || []);
    } catch (error) {
      console.error("Fetch Error", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleModal = (type = "", edit = false, data = null) => {
    setModal({ open: !modal.open, type, edit, id: data?.id || null });
    if (!modal.open && data) {
      if (type === "logo") setLogoForm({ type: data.type });
      if (type === "banner")
        setBannerForm({
          typeId: data.typeId,
          textEditor: data.textEditor,
          image: null,
        });
      if (type === "homeData")
        setHomeDataForm({
          ...data,
          firstImage: null,
          secondImage: null,
          thirdImage: null,
          fourthImage: null,
        });
      if (type === "ranking") setRankingForm({ ...data });
      if (type === "counter") setCounterForm({ ...data });
    } else {
      setLogoForm({ type: "logo" });
      setBannerForm({ typeId: "", textEditor: "", image: null });
      setHomeDataForm({
        middleText: "",
        firstTextEditor: "",
        secondTextEditor: "",
        thirdTextEditor: "",
        fourthTextEditor: "",
        firstImage: null,
        secondImage: null,
        thirdImage: null,
        fourthImage: null,
      });
      setRankingForm({
        rankingText: "",
        rankingNo: "",
        languageText: "",
        languageNo: "",
        countrieText: "",
        countrieNo: "",
        locationText: "",
        locationNo: "",
        textEditor: "",
      });
      setCounterForm({
        consultationsText: "",
        consultationsNo: "",
        successRateText: "",
        successRateCount: "",
        yearsExperienceText: "",
        yearsExperienceCount: "",
        attorneysText: "",
        attorneysCount: "",
      });
    }
  };
const handleAction = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    let res;

    if (modal.type === "logo") {
      res = modal.edit
        ? await updateLogoType(modal.id, logoForm)
        : await createLogoType(logoForm);
    } else if (modal.type === "banner") {
      // --- BANNER VALIDATION ---
      if (!bannerForm.typeId) {
        toast.error("Please select a Logo Type ID");
        setLoading(false);
        return;
      }
      if (!modal.edit && !bannerForm.image) {
        toast.error("Please select an image for the banner");
        setLoading(false);
        return;
      }

      const fd = new FormData();
      fd.append("typeId", bannerForm.typeId);
      fd.append("textEditor", bannerForm.textEditor || "");

      if (bannerForm.image) {
        fd.append("image", bannerForm.image);
      }

      res = modal.edit
        ? await updateHomeBanner(modal.id, fd)
        : await createHomeBanner(fd);
    } else if (modal.type === "homeData") {
      const fd = new FormData();
      Object.keys(homeDataForm).forEach((key) => {
        // Null values ko handle karne ke liye
        if (homeDataForm[key] !== null && homeDataForm[key] !== undefined) {
          fd.append(key, homeDataForm[key]);
        }
      });
      res = modal.edit
        ? await updateHomeData(modal.id, fd)
        : await createHomeData(fd);
    } else if (modal.type === "ranking") {
      res = modal.edit
        ? await updateRanking(modal.id, rankingForm)
        : await createRanking(rankingForm);
    } else if (modal.type === "counter") {
      res = modal.edit
        ? await updateCounters(modal.id, counterForm)
        : await createCounters(counterForm);
    }

    if (res) {
      toast.success("Operation Successful!");
      toggleModal();
      fetchData();
    }
  } catch (err) {
    console.error("API Error:", err.response?.data || err.message);
    toast.error(
      err.response?.data?.message ||
        "Operation failed. Check console for details.",
    );
  } finally {
    setLoading(false);
  }
};

  const handleDelete = async (type, id) => {
    if (!window.confirm("Confirm Delete?")) return;
    try {
      if (type === "logo") await deleteLogoType(id);
      if (type === "banner") await deleteHomeBanner(id);
      if (type === "homeData") await deleteHomeData(id);
      if (type === "homeRankData") await deleteRankData(id);
      if (type === "homeCountData") await deleteCountData(id);
      toast.success("Deleted");
      fetchData();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <Container fluid className="p-4 bg-light-gray min-vh-100">
      <ToastContainer theme="colored" />
      <div className="mb-4">
        <h2 className="fw-bold text-blue font-serif">Home Page CMS</h2>
        <p className="text-muted">Manage Logos, Banners, and Section Data</p>
      </div>

      <Nav tabs className="border-0 mb-4">
        {[
          "Logo Types",
          "Home Banners",
          "Home Data Sections",
          "Home Ranking",
          "Home Counters",
        ].map((label, i) => (
          <NavItem key={i}>
            <NavLink
              className={`border-0 fw-bold px-4 py-3 cursor-pointer ${activeTab === `${i + 1}` ? " active" : "text-muted"}`}
              onClick={() => setActiveTab(`${i + 1}`)}
              style={{ cursor: "pointer" }}>
              {label}
            </NavLink>
          </NavItem>
        ))}
      </Nav>

      <TabContent activeTab={activeTab}>
        {/* LOGO TYPE TAB */}
        <TabPane tabId="1">
          <div className="text-end mb-3">
            <Button
              className="btn-primary-custom w-auto px-4"
              onClick={() => toggleModal("logo")}>
              + Add Logo Type
            </Button>
          </div>
          <Card className="card-shadow border-0">
            <Table hover responsive className="align-middle mb-0">
              <thead className="table-dark-custom">
                <tr>
                  <th>ID</th>
                  <th>Type</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {logoTypes.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.id}</td>
                    <td className="text-uppercase fw-bold text-gold">
                      {item.type}
                    </td>
                    <td className="text-end">
                      <Button
                        size="sm"
                        color="white"
                        className="border me-2"
                        onClick={() => toggleModal("logo", true, item)}>
                        ✏️
                      </Button>
                      <Button
                        size="sm"
                        color="white"
                        className="border text-danger"
                        onClick={() => handleDelete("logo", item.id)}>
                        🗑️
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </TabPane>

        {/* HOME BANNER TAB */}
        <TabPane tabId="2">
          <div className="text-end mb-3">
            <Button
              className="btn-primary-custom w-auto px-4"
              onClick={() => toggleModal("banner")}>
              + Add Banner
            </Button>
          </div>
          <Card className="card-shadow border-0">
            <Table hover responsive className="align-middle mb-0">
              <thead className="table-dark-custom">
                <tr>
                  <th>Image</th>
                  <th>Type ID</th>
                  <th>Text Preview</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {homeBanners.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <img
                        src={getImgUrl(item.image)}
                        width="80"
                        className="rounded"
                        alt=""
                      />
                    </td>
                    <td>{item.typeId}</td>
                    <td
                      className="small text-truncate"
                      style={{ maxWidth: "200px" }}>
                      {item.textEditor?.replace(/<[^>]*>/g, "")}
                    </td>
                    <td className="text-end">
                      <Button
                        size="sm"
                        color="white"
                        className="border me-2"
                        onClick={() => toggleModal("banner", true, item)}>
                        ✏️
                      </Button>
                      <Button
                        size="sm"
                        color="white"
                        className="border text-danger"
                        onClick={() => handleDelete("banner", item.id)}>
                        🗑️
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </TabPane>

        {/* HOME DATA TAB */}
        <TabPane tabId="3">
          <div className="text-end mb-3">
            <Button
              className="btn-primary-custom w-auto px-4"
              onClick={() => toggleModal("homeData")}>
              + Add Home Data
            </Button>
          </div>
          <Card className="card-shadow border-0">
            <Table hover responsive className="align-middle mb-0">
              <thead className="table-dark-custom">
                <tr>
                  <th>Middle Text</th>
                  <th>Section 1</th>
                  <th>Section 2</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {homeDataList.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.middleText}</td>
                    <td>
                      <img src={getImgUrl(item.firstImage)} width="50" alt="" />
                    </td>
                    <td>
                      <img
                        src={getImgUrl(item.secondImage)}
                        width="50"
                        alt=""
                      />
                    </td>
                    <td className="text-end">
                      <Button
                        size="sm"
                        color="white"
                        className="border me-2"
                        onClick={() => toggleModal("homeData", true, item)}>
                        ✏️
                      </Button>
                      <Button
                        size="sm"
                        color="white"
                        className="border text-danger"
                        onClick={() => handleDelete("homeData", item.id)}>
                        🗑️
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </TabPane>

        {/* RANKING TAB */}
        <TabPane tabId="4">
          <div className="text-end mb-3">
            <Button
              className="btn-primary-custom w-auto px-4"
              onClick={() => toggleModal("ranking")}>
              + Add Ranking
            </Button>
          </div>
          <Card className="card-shadow border-0">
            <Table hover responsive className="align-middle mb-0">
              <thead className="table-dark-custom">
                <tr>
                  <th>Rank No</th>
                  <th>Countries</th>
                  <th>Languages</th>
                  <th>Location</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rankings.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.rankingNo}</td>
                    <td>{item.countrieNo}</td>
                    <td>{item.languageNo}</td>
                    <td>{item.locationNo}</td>
                    <td className="text-end">
                      <Button
                        size="sm"
                        color="white"
                        className="border me-2"
                        onClick={() => toggleModal("ranking", true, item)}>
                        ✏️
                      </Button>
                      <Button
                        size="sm"
                        color="white"
                        className="border text-danger"
                        onClick={() => handleDelete("homeRankData", item.id)}>
                        🗑️
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </TabPane>

        {/* COUNTERS TAB */}
        <TabPane tabId="5">
          <div className="text-end mb-3">
            <Button
              className="btn-primary-custom w-auto px-4"
              onClick={() => toggleModal("counter")}>
              + Add Counters
            </Button>
          </div>
          <Card className="card-shadow border-0">
            <Table hover responsive className="align-middle mb-0">
              <thead className="table-dark-custom">
                <tr>
                  <th>Consultations</th>
                  <th>Success Rate</th>
                  <th>Attorneys</th>
                  <th>Years Of Experience Count</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {counters.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.consultationsNo}</td>
                    <td>{item.successRateCount}%</td>
                    <td>{item.attorneysCount}</td>
                    <td>{item.yearsExperienceCount}</td>
                    <td className="text-end">
                      <Button
                        size="sm"
                        color="white"
                        className="border me-2"
                        onClick={() => toggleModal("counter", true, item)}>
                        ✏️
                      </Button>
                      <Button
                        size="sm"
                        color="white"
                        className="border text-danger"
                        onClick={() => handleDelete("homeCountData", item.id)}>
                        🗑️
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </TabPane>
      </TabContent>

      {/* MODALS */}
      <Modal
        isOpen={modal.open}
        toggle={() => toggleModal()}
        size={
          modal.type === "homeData" ||
          modal.type === "ranking" ||
          modal.type === "counter"
            ? "xl"
            : "lg"
        }
        centered>
        <ModalHeader className="border-0 text-blue fw-bold">
          {modal.edit ? "Edit" : "Add"} {modal.type.toUpperCase()}
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleAction}>
            {modal.type === "logo" && (
              <FormGroup>
                <Label>Type (ENUM)</Label>
                <Input
                  type="select"
                  value={logoForm.type}
                  onChange={(e) => setLogoForm({ type: e.target.value })}>
                  <option value="logo">logo</option>
                  <option value="banner">banner</option>
                </Input>
              </FormGroup>
            )}

            {modal.type === "ranking" && (
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label>Ranking Text</Label>
                    <Input
                      value={rankingForm.rankingText}
                      onChange={(e) =>
                        setRankingForm({
                          ...rankingForm,
                          rankingText: e.target.value,
                        })
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label>Ranking No</Label>
                    <Input
                      type="number"
                      value={rankingForm.rankingNo}
                      onChange={(e) =>
                        setRankingForm({
                          ...rankingForm,
                          rankingNo: e.target.value,
                        })
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label>Language Text</Label>
                    <Input
                      value={rankingForm.languageText}
                      onChange={(e) =>
                        setRankingForm({
                          ...rankingForm,
                          languageText: e.target.value,
                        })
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label>Language No</Label>
                    <Input
                      type="number"
                      value={rankingForm.languageNo}
                      onChange={(e) =>
                        setRankingForm({
                          ...rankingForm,
                          languageNo: e.target.value,
                        })
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label>Countries Text</Label>
                    <Input
                      value={rankingForm.countrieText}
                      onChange={(e) =>
                        setRankingForm({
                          ...rankingForm,
                          countrieText: e.target.value,
                        })
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label>Countries No</Label>
                    <Input
                      type="number"
                      value={rankingForm.countrieNo}
                      onChange={(e) =>
                        setRankingForm({
                          ...rankingForm,
                          countrieNo: e.target.value,
                        })
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label>Location Text</Label>
                    <Input
                      value={rankingForm.locationText}
                      onChange={(e) =>
                        setRankingForm({
                          ...rankingForm,
                          locationText: e.target.value,
                        })
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label>Location No</Label>
                    <Input
                      type="number"
                      value={rankingForm.locationNo}
                      onChange={(e) =>
                        setRankingForm({
                          ...rankingForm,
                          locationNo: e.target.value,
                        })
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md={12}>
                  <Label>Description (Editor)</Label>
                  <ReactQuill
                    theme="snow"
                    value={rankingForm.textEditor}
                    onChange={(v) => {
                      if (v !== rankingForm.textEditor) {
                        setRankingForm({ ...rankingForm, textEditor: v });
                      }
                    }}
                    style={{ height: "150px", marginBottom: "50px" }}
                  />
                </Col>
              </Row>
            )}

            {modal.type === "counter" && (
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label>Consultations Text</Label>
                    <Input
                      value={counterForm.consultationsText}
                      onChange={(e) =>
                        setCounterForm({
                          ...counterForm,
                          consultationsText: e.target.value,
                        })
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label>Consultations No</Label>
                    <Input
                      type="number"
                      value={counterForm.consultationsNo}
                      onChange={(e) =>
                        setCounterForm({
                          ...counterForm,
                          consultationsNo: e.target.value,
                        })
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label>Success Rate Text</Label>
                    <Input
                      value={counterForm.successRateText}
                      onChange={(e) =>
                        setCounterForm({
                          ...counterForm,
                          successRateText: e.target.value,
                        })
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label>Success Rate Count (%)</Label>
                    <Input
                      type="number"
                      value={counterForm.successRateCount}
                      onChange={(e) =>
                        setCounterForm({
                          ...counterForm,
                          successRateCount: e.target.value,
                        })
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label>Years Experience Text</Label>
                    <Input
                      value={counterForm.yearsExperienceText}
                      onChange={(e) =>
                        setCounterForm({
                          ...counterForm,
                          yearsExperienceText: e.target.value,
                        })
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label>Years Experience Count</Label>
                    <Input
                      type="number"
                      value={counterForm.yearsExperienceCount}
                      onChange={(e) =>
                        setCounterForm({
                          ...counterForm,
                          yearsExperienceCount: e.target.value,
                        })
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label>Attorneys Text</Label>
                    <Input
                      value={counterForm.attorneysText}
                      onChange={(e) =>
                        setCounterForm({
                          ...counterForm,
                          attorneysText: e.target.value,
                        })
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label>Attorneys Count</Label>
                    <Input
                      type="number"
                      value={counterForm.attorneysCount}
                      onChange={(e) =>
                        setCounterForm({
                          ...counterForm,
                          attorneysCount: e.target.value,
                        })
                      }
                    />
                  </FormGroup>
                </Col>
              </Row>
            )}

            {/* Original Banner and HomeData Logic remains untouched */}
            {modal.type === "banner" && (
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label>Type ID</Label>
                    <Input
                      type="select"
                      required
                      value={bannerForm.typeId}
                      onChange={(e) =>
                        setBannerForm({ ...bannerForm, typeId: e.target.value })
                      }>
                      <option value="">Select Logo Type</option>
                      {logoTypes.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.type} (ID: {l.id})
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label>Image</Label>
                    <Input
                      type="file"
                      onChange={(e) =>
                        setBannerForm({
                          ...bannerForm,
                          image: e.target.files[0],
                        })
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md={12}>
                  <Label>Text Editor</Label>
                  <ReactQuill
                    theme="snow"
                    value={bannerForm.textEditor}
                    onChange={(v) => {
                      if (v !== bannerForm.textEditor) {
                        setBannerForm({ ...bannerForm, textEditor: v });
                      }
                    }}
                    style={{ height: "150px", marginBottom: "50px" }}
                  />
                </Col>
              </Row>
            )}

            {modal.type === "homeData" && (
              <Row>
                <Col md={12}>
                  <FormGroup>
                    <Label>Middle Text</Label>
                    <Input
                      value={homeDataForm.middleText}
                      onChange={(e) =>
                        setHomeDataForm({
                          ...homeDataForm,
                          middleText: e.target.value,
                        })
                      }
                    />
                  </FormGroup>
                </Col>
                {[1, 2, 3, 4].map((num) => (
                  <React.Fragment key={num}>
                    <Col md={6} className="mt-3">
                      <Label className="fw-bold text-gold">
                        Section {num} Image
                      </Label>
                      <Input
                        type="file"
                        onChange={(e) =>
                          setHomeDataForm({
                            ...homeDataForm,
                            [`${num === 1 ? "first" : num === 2 ? "second" : num === 3 ? "third" : "fourth"}Image`]:
                              e.target.files[0],
                          })
                        }
                      />
                    </Col>
                    <Col md={12} className="mb-5 mt-2">
                      <Label>Section {num} Text Editor</Label>
                      <ReactQuill
                        theme="snow"
                        value={
                          homeDataForm[
                            `${num === 1 ? "first" : num === 2 ? "second" : num === 3 ? "third" : "fourth"}TextEditor`
                          ]
                        }
                        onChange={(v) => {
                          const fieldName = `${num === 1 ? "first" : num === 2 ? "second" : num === 3 ? "third" : "fourth"}TextEditor`;
                          if (v !== homeDataForm[fieldName]) {
                            setHomeDataForm({
                              ...homeDataForm,
                              [fieldName]: v,
                            });
                          }
                        }}
                        style={{ height: "120px" }}
                      />
                    </Col>
                  </React.Fragment>
                ))}
              </Row>
            )}
            <Button
              className="btn-primary-custom mt-4 py-3"
              type="submit"
              disabled={loading}>
              {loading ? "Processing..." : "Save Changes"}
            </Button>
          </Form>
        </ModalBody>
      </Modal>

      <style jsx global>{`
        .nav-link {
          color: black !important;
          transition: 0.3s;
        }
        .nav-link.active {
          color: #c5a059 !important; /* Gold color from screenshot for active text */
          background-color: transparent !important;
          border-bottom: 2px solid #c5a059 !important;
          font-weight: 700;
        }
        .btn-primary-custom {
          background-color: #7b4433;
          border: none;
          color: white;
        }
        .text-blue {
          color: #003366;
        }
        .text-gold {
          color: #c5a059;
        }
        .table-dark-custom {
          background-color: #f8f9fa;
          border-bottom: 2px solid #dee2e6;
        }
        .card-shadow {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </Container>
  );
};

export default AdminHomeManagement;
