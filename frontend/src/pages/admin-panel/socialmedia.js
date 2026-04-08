import React, { useState, useEffect, useCallback } from "react";
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
} from "reactstrap";

import * as authService from "../../services/authService";
import PaginationComponent from "../../context/Pagination";

const SocialMediaPage = () => {
  const GOLD = "#eebb5d";
  const LIGHT_GOLD = "#fdf8ef";

  const [socialLinks, setSocialLinks] = useState([]);
  const [modal, setModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    facebookUrl: "",
    twitterUrl: "",
    instagramUrl: "",
    linkedinUrl: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      console.log("Fetching social media links...");
      const res = await authService.getAllSocialMedia();
      const finalData = res.data || (Array.isArray(res) ? res : []);
      setSocialLinks(finalData);
      console.log("Social media data loaded:", finalData);
    } catch (error) {
      console.error("Fetch Data Failed:", error);
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
        facebookUrl: "",
        twitterUrl: "",
        instagramUrl: "",
        linkedinUrl: "",
      });
      setIsEditing(false);
      setCurrentId(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const adminId = authService.getAdminId();

    const payload = {
      adminId: adminId || "1",
      ...formData,
    };

    try {
      console.log("Submitting social media data:", payload);
      const res = isEditing
        ? await authService.updateSocialMedia(currentId, payload)
        : await authService.createSocialMedia(payload);

      if (res) {
        console.log("Operation successful:", res);
        toggle();
        fetchData();
      }
    } catch (error) {
      console.error("Submission Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete these links?")) {
      try {
        console.log("Deleting Social Media ID:", id);
        await authService.deleteSocialMedia(id);
        fetchData();
      } catch (error) {
        console.error("Delete Failed:", error);
      }
    }
  };

  const handleEdit = (item) => {
    console.log("Editing social links:", item);
    setFormData({
      facebookUrl: item.facebookUrl || "",
      twitterUrl: item.twitterUrl || "",
      instagramUrl: item.instagramUrl || "",
      linkedinUrl: item.linkedinUrl || "",
    });
    setCurrentId(item.id);
    setIsEditing(true);
    setModal(true);
  };

  const currentItems = socialLinks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <Container
      fluid
      className="p-3 p-md-4 min-vh-100"
      style={{ backgroundColor: "#f9f9f9" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0" style={{ color: "#2c3e50" }}>
            Social Media
          </h4>
          <p className="text-muted small">
            Manage official social media links for the firm.
          </p>
        </div>
        {/* Most firms only have 1 set of links, but we allow adding as per your request structure */}
        <Button
          className="px-4 shadow-sm"
          style={{ backgroundColor: GOLD, border: "none" }}
          onClick={toggle}>
          + Add Social Links
        </Button>
      </div>

      <Card className="border-0 shadow-sm rounded-4">
        <CardBody className="p-0">
          <div className="table-responsive">
            <Table hover className="align-middle mb-0">
              <thead style={{ backgroundColor: LIGHT_GOLD }}>
                <tr>
                  <th className="px-4">SR.</th>
                  <th>FACEBOOK</th>
                  <th>TWITTER</th>
                  <th>INSTAGRAM</th>
                  <th>LINKEDIN</th>
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
                      <td
                        className="small text-truncate"
                        style={{ maxWidth: "150px" }}>
                        <a
                          href={item.facebookUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary">
                          {item.facebookUrl || "N/A"}
                        </a>
                      </td>
                      <td
                        className="small text-truncate"
                        style={{ maxWidth: "150px" }}>
                        <a
                          href={item.twitterUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-info">
                          {item.twitterUrl || "N/A"}
                        </a>
                      </td>
                      <td
                        className="small text-truncate"
                        style={{ maxWidth: "150px" }}>
                        <a
                          href={item.instagramUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: "#e4405f" }}>
                          {item.instagramUrl || "N/A"}
                        </a>
                      </td>
                      <td
                        className="small text-truncate"
                        style={{ maxWidth: "150px" }}>
                        <a
                          href={item.linkedinUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary">
                          {item.linkedinUrl || "N/A"}
                        </a>
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
                    <td colSpan="6" className="text-center py-5">
                      {loading ? "Loading..." : "No social media records found"}
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
          totalItems={socialLinks.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>

      <Modal isOpen={modal} toggle={toggle} centered size="md">
        <ModalHeader
          toggle={toggle}
          className="fw-bold"
          style={{ color: GOLD }}>
          {isEditing ? "Update Social Links" : "Add Social Links"}
        </ModalHeader>
        <ModalBody className="px-4">
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label className="small fw-bold">Facebook URL</Label>
              <Input
                type="url"
                placeholder="https://facebook.com/yourpage"
                value={formData.facebookUrl}
                onChange={(e) =>
                  setFormData({ ...formData, facebookUrl: e.target.value })
                }
              />
            </FormGroup>

            <FormGroup>
              <Label className="small fw-bold">Twitter URL</Label>
              <Input
                type="url"
                placeholder="https://twitter.com/yourhandle"
                value={formData.twitterUrl}
                onChange={(e) =>
                  setFormData({ ...formData, twitterUrl: e.target.value })
                }
              />
            </FormGroup>

            <FormGroup>
              <Label className="small fw-bold">Instagram URL</Label>
              <Input
                type="url"
                placeholder="https://instagram.com/yourprofile"
                value={formData.instagramUrl}
                onChange={(e) =>
                  setFormData({ ...formData, instagramUrl: e.target.value })
                }
              />
            </FormGroup>

            <FormGroup>
              <Label className="small fw-bold">LinkedIn URL</Label>
              <Input
                type="url"
                placeholder="https://linkedin.com/company/yourfirm"
                value={formData.linkedinUrl}
                onChange={(e) =>
                  setFormData({ ...formData, linkedinUrl: e.target.value })
                }
              />
            </FormGroup>

            <div className="d-flex gap-2 mt-4">
              <Button
                type="submit"
                style={{ backgroundColor: GOLD, border: "none" }}
                disabled={loading}
                className="px-5">
                {loading ? "Processing..." : isEditing ? "Update" : "Save"}
              </Button>
              <Button outline onClick={toggle} className="px-4">
                Cancel
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </Container>
  );
};

export default SocialMediaPage;
