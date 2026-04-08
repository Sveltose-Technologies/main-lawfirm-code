"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  Container,
  Card,
  CardBody,
  Table,
  Button,
  FormGroup,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Spinner,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import classnames from "classnames";
import * as authService from "../../services/authService";

import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const ContactUsPage = () => {
  const GOLD = "#eebb5d";
  const LIGHT_GOLD = "#fdf8ef";

  const [activeTab, setActiveTab] = useState("inquiry");
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  // Modal states for "Read More"
  const [modal, setModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState("");

  const toggleModal = () => setModal(!modal);

  const openMessage = (msg) => {
    setSelectedMessage(msg);
    toggleModal();
  };

  // Helper function to show only 3 words
  const formatMessage = (msg) => {
    if (!msg) return "";
    const words = msg.split(" ");
    if (words.length <= 3) return msg;
    return words.slice(0, 3).join(" ") + "...";
  };

  // Data state
  const [descriptionData, setDescriptionData] = useState({
    id: null,
    text: "",
  });

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ color: [] }, { background: [] }],
        ["clean"],
      ],
    }),
    [],
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === "inquiry") {
        const res = await authService.getAllContacts();
        const data = Array.isArray(res?.data)
          ? res.data
          : res?.data?.data || res || [];
        setInquiries(
          [...data].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
          ),
        );
      } else {
        const res = await authService.getContactText();
        const serverData = Array.isArray(res?.data) ? res.data[0] : res.data;
        if (serverData) {
          setDescriptionData({
            id: serverData.id,
            text: serverData.contactText || "",
          });
        } else {
          setDescriptionData({ id: null, text: "" });
        }
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async () => {
    if (!descriptionData.text || descriptionData.text === "<p><br></p>") {
      return toast.warning("Content cannot be empty.");
    }
    setBtnLoading(true);
    try {
      const payload = { contactText: descriptionData.text };
      if (descriptionData.id) {
        await authService.updateContactText(descriptionData.id, payload);
        toast.success("Content updated successfully!");
      } else {
        await authService.createContactText(payload);
        toast.success("Content created successfully!");
      }
      fetchData();
    } catch (error) {
      toast.error("Failed to save content.");
    } finally {
      setBtnLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!descriptionData.id) return toast.error("Nothing to delete.");
    if (!window.confirm("Are you sure?")) return;
    setBtnLoading(true);
    try {
      await authService.deleteContactText(descriptionData.id);
      toast.success("Deleted");
      setDescriptionData({ id: null, text: "" });
      fetchData();
    } catch (error) {
      toast.error("Delete failed.");
    } finally {
      setBtnLoading(false);
    }
  };

  const handleDeleteInquiry = async (id) => {
    if (!window.confirm("Delete this inquiry?")) return;
    try {
      await authService.deleteContact(id);
      toast.success("Deleted");
      fetchData();
    } catch (e) {
      toast.error("Error");
    }
  };

  return (
    <Container fluid className="p-4 bg-light min-vh-100">
      <ToastContainer theme="colored" position="top-right" />

      <div className="mb-4">
        <h3 className="fw-bold text-dark">Contact Management</h3>
        <p className="text-muted small">Manage inquiries and page content.</p>
      </div>

      <Nav
        tabs
        className="border-0 mb-4 bg-white shadow-sm p-2 rounded-3 w-fit">
        <NavItem>
          <NavLink
            className={classnames("fw-bold border-0 px-4 py-2 rounded-2", {
              active: activeTab === "inquiry",
            })}
            onClick={() => setActiveTab("inquiry")}
            style={{
              cursor: "pointer",
              backgroundColor: activeTab === "inquiry" ? GOLD : "#eee",
            }}>
            User Inquiries
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames("fw-bold border-0 px-4 py-2 rounded-2", {
              active: activeTab === "description",
            })}
            onClick={() => setActiveTab("description")}
            style={{
              cursor: "pointer",
              marginLeft: 10,
              backgroundColor: activeTab === "description" ? GOLD : "#eee",
            }}>
            Page Content (Editor)
          </NavLink>
        </NavItem>
      </Nav>

      <TabContent activeTab={activeTab}>
        <TabPane tabId="inquiry">
          <Card className="border-0 shadow-sm rounded-4">
            <CardBody className="p-0">
              <Table
                hover
                responsive
                className="align-middle mb-0"
                style={{ fontSize: "13px" }}>
                <thead style={{ backgroundColor: LIGHT_GOLD }}>
                  <tr>
                    <th className="px-4 py-3">Sr.</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Message</th>
                    <th>Address</th>
                    <th className="text-end px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="text-center py-5">
                        <Spinner color="warning" />
                      </td>
                    </tr>
                  ) : inquiries.length > 0 ? (
                    inquiries.map((item, index) => (
                      <tr key={item.id}>
                        <td className="px-4 text-muted">{index + 1}</td>
                        <td className="fw-bold">
                          {item.firstName} {item.lastName}
                        </td>
                        <td>{item.email}</td>
                        <td>
                          {item.countryCode} {item.phoneNumber}
                        </td>
                        <td>
                          {formatMessage(item.message)}
                          {item.message &&
                            item.message.split(" ").length > 3 && (
                              <span
                                className="text-primary fw-bold ms-1"
                                style={{ cursor: "pointer", fontSize: "11px" }}
                                onClick={() => openMessage(item.message)}>
                                Read More
                              </span>
                            )}
                        </td>
                        <td>{item.address || "N/A"}</td>
                        <td className="text-end px-4">
                          <Button
                            size="sm"
                            color="white"
                            className="text-danger border shadow-sm"
                            onClick={() => handleDeleteInquiry(item.id)}>
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        No data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </TabPane>

        {/* EDITOR TAB (No changes here as requested) */}
        <TabPane tabId="description">
          <Card className="border-0 shadow-sm rounded-4">
            <CardBody className="p-4 p-lg-5">
              <div className="mb-4">
                <h5 className="fw-bold">Edit Contact Page Description</h5>
              </div>
              {loading ? (
                <div className="text-center py-5">
                  <Spinner color="warning" />
                </div>
              ) : (
                <>
                  <FormGroup className="mb-5">
                    <ReactQuill
                      theme="snow"
                      value={descriptionData.text}
                      onChange={(val) =>
                        setDescriptionData({ ...descriptionData, text: val })
                      }
                      modules={modules}
                      style={{ height: "350px", marginBottom: "50px" }}
                    />
                  </FormGroup>
                  <div className="d-flex gap-3">
                    <Button
                      className="btn-gold px-5 py-2 fw-bold"
                      onClick={handleSave}
                      disabled={btnLoading}>
                      {btnLoading
                        ? "Saving..."
                        : descriptionData.id
                          ? "UPDATE CONTENT"
                          : "SAVE CONTENT"}
                    </Button>
                    <Button
                      color="white"
                      className="border text-danger px-4 py-2 fw-bold"
                      onClick={handleDelete}
                      disabled={btnLoading || !descriptionData.id}>
                      Delete Record
                    </Button>
                  </div>
                </>
              )}
            </CardBody>
          </Card>
        </TabPane>
      </TabContent>

      {/* READ MORE MODAL */}
      <Modal isOpen={modal} toggle={toggleModal} centered>
        <ModalHeader toggle={toggleModal} className="border-0 fw-bold">
          Message Details
        </ModalHeader>
        <ModalBody className="py-3">
          <p style={{ whiteSpace: "pre-wrap", color: "#555" }}>
            {selectedMessage}
          </p>
        </ModalBody>
        <ModalFooter className="border-0">
          <Button color="secondary" size="sm" onClick={toggleModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>

      <style jsx global>{`
        .btn-gold {
          background-color: #eebb5d !important;
          color: white !important;
          border: none !important;
        }
        .nav-link.active {
          background-color: #eebb5d !important;
          color: white !important;
        }
        .w-fit {
          width: fit-content;
        }
      `}</style>
    </Container>
  );
};

export default ContactUsPage;
