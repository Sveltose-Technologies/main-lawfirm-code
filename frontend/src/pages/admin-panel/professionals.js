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
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";

import * as authService from "../../services/authService";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

// --- Local Pagination Component Fix ---
const CustomPagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null;

  return (
    <Pagination aria-label="Page navigation">
      <PaginationItem disabled={currentPage <= 1}>
        <PaginationLink
          previous
          onClick={() => onPageChange(currentPage - 1)}
        />
      </PaginationItem>
      {[...Array(totalPages)].map((_, i) => (
        <PaginationItem active={i + 1 === currentPage} key={i}>
          <PaginationLink onClick={() => onPageChange(i + 1)}>
            {i + 1}
          </PaginationLink>
        </PaginationItem>
      ))}
      <PaginationItem disabled={currentPage >= totalPages}>
        <PaginationLink next onClick={() => onPageChange(currentPage + 1)} />
      </PaginationItem>
    </Pagination>
  );
};

const ProfessionalsPage = () => {
  const GOLD = "#eebb5d";
  const LIGHT_GOLD = "#fdf8ef";

  const [professionals, setProfessionals] = useState([]);
  const [modal, setModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    textEditor: "",
    bannerImage: null,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

 const stripHtml = (html) => {
   if (!html) return "";
   return html
     .replace(/<[^>]*>/g, "")
     .replace(/&nbsp;/gi, " ")
     .replace(/\s+/g, " ")
     .trim();
 };
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["clean"],
      ],
    }),
    [],
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authService.getAllProfessionals();
      const finalData = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
          ? res
          : [];
      setProfessionals(finalData);
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
      setFormData({ textEditor: "", bannerImage: null });
      setIsEditing(false);
      setCurrentId(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const adminId = authService.getAdminId();

    try {
      const data = new FormData();
      data.append("adminId", adminId || "1");
      data.append("textEditor", formData.textEditor);

      if (formData.bannerImage instanceof File) {
        data.append("bannerImage", formData.bannerImage);
      }

      const res = isEditing
        ? await authService.updateProfessional(currentId, data)
        : await authService.createProfessional(data);

      if (res) {
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
    if (window.confirm("Are you sure?")) {
      try {
        await authService.deleteProfessional(id);
        fetchData();
      } catch (error) {
        console.error("Delete Error:", error);
      }
    }
  };

  const handleEdit = (item) => {
    setFormData({
      textEditor: item.textEditor || "",
      bannerImage: null,
    });
    setCurrentId(item.id);
    setIsEditing(true);
    setModal(true);
  };

  const currentItems = professionals.slice(
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
            Professionals
          </h4>
          <p className="text-muted small">
            Manage professionals and their images.
          </p>
        </div>
        <Button
          className="px-4 shadow-sm"
          style={{ backgroundColor: GOLD, border: "none" }}
          onClick={toggle}>
          + Add Professional
        </Button>
      </div>

      <Card className="border-0 shadow-sm rounded-4">
        <CardBody className="p-0">
          <div className="table-responsive">
            <Table hover className="align-middle mb-0">
              <thead style={{ backgroundColor: LIGHT_GOLD }}>
                <tr>
                  <th className="px-4">SR.</th>
                  <th>IMAGE</th>
                  <th>DESCRIPTION</th>
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
                        <div
                          style={{
                            width: "60px",
                            height: "40px",
                            borderRadius: "6px",
                            overflow: "hidden",
                            border: "1px solid #eee",
                          }}>
                          <img
                            src={authService.getImgUrl(item.bannerImage)}
                            alt="professional"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              e.target.src =
                                "https://placehold.co/60x40?text=No+Img";
                            }}
                          />
                        </div>
                      </td>
                      <td>
                        <div
                          className="text-muted small"
                          style={{
                            maxWidth: "400px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}>
                          {stripHtml(item.textEditor)}
                        </div>
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
                    <td colSpan="4" className="text-center py-5">
                      {loading ? "Loading..." : "No data found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </CardBody>
      </Card>

      <div className="d-flex justify-content-center mt-4">
        <CustomPagination
          totalItems={professionals.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>

      <Modal isOpen={modal} toggle={toggle} centered size="lg">
        <ModalHeader
          toggle={toggle}
          className="fw-bold"
          style={{ color: GOLD }}>
          {isEditing ? "Update Professional" : "Add Professional"}
        </ModalHeader>
        <ModalBody className="px-4">
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label className="small fw-bold">
                Banner Image {isEditing ? "(Optional)" : "*"}
              </Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData({ ...formData, bannerImage: e.target.files[0] })
                }
                required={!isEditing}
              />
            </FormGroup>

            <FormGroup>
              <Label className="small fw-bold">Description Editor *</Label>
              <div style={{ height: "300px", marginBottom: "50px" }}>
                <ReactQuill
                  theme="snow"
                  modules={modules}
                  value={formData.textEditor}
                  onChange={(val) =>
                    setFormData({ ...formData, textEditor: val })
                  }
                  style={{ height: "250px" }}
                />
              </div>
            </FormGroup>

            <div className="d-flex gap-2">
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

export default ProfessionalsPage;
