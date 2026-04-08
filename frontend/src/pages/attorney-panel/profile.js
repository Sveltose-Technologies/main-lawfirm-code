
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AttorneyLayout from "../../components/layout/AttorneyLayout";
import {
  getAttorneylanguages,
  getUserProfile,
  updateAttorney,
  getAllCapabilityCategories,
  getAllLocationCities,
  getAllLocationCountries,
  getAllServices,
} from "../../services/authService";
import { toast } from "react-toastify";

export default function EditProfile() {
  const router = useRouter();
  const [languages, setLanguages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [attorneyId, setAttorneyId] = useState(null);

  // Add this state at the top with your other states
  const [servicesList, setServicesList] = useState([]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    street: "",
    aptBlock: "",
    city: "",
    state: "",
    country: "",
    location: "",
    zipCode: "",
    phoneCell: "",
    phoneHome: "",
    phoneOffice: "",
    dob: "",
    admission: "",
    language: "",
    servicesOffered: "",
    education: "",
    experience: "",
    barCouncilIndiaNo: "",
    barCouncilStateNo: "",
    familyLawPractice: "false",
    familyDetails: "",
    aboutus: "",
    categoryId: "",
    linkedin: "",
    twitter: "",
    facebook: "",
    gmail: "",
    profileImage: null,
    resume: null,
    kycIdentity: null,
    kycAddress: null,
    barCouncilIndiaId: null,
    barCouncilStateId: null,
  });

  // Update the useEffect to include getAllServices
  useEffect(() => {
    const loadInitialData = async () => {
      const userData = localStorage.getItem("user");
      if (!userData) return;
      const currentUserId = JSON.parse(userData).id;

      try {
        // Added getAllServices() to the Promise.all
        const [langRes, catRes, cityRes, countryRes, profileRes, serviceRes] =
          await Promise.all([
            getAttorneylanguages(),
            getAllCapabilityCategories(),
            getAllLocationCities(),
            getAllLocationCountries(),
            getUserProfile(currentUserId),
            getAllServices(), // Ensure this is imported
          ]);

        setLanguages(langRes?.data || []);
        setCategories(catRes?.data || []);
        setCities(cityRes?.data || []);
        setCountries(countryRes?.data || []);

        setServicesList(serviceRes?.data?.data || serviceRes?.data || []);

        const attorneyData =
          profileRes.attorneys && Array.isArray(profileRes.attorneys)
            ? profileRes.attorneys.find(
                (a) => Number(a.id) === Number(currentUserId),
              )
            : profileRes.attorney || profileRes.data || profileRes;

        if (attorneyData) {
          setAttorneyId(attorneyData.id);
          setFormData({
            firstName: attorneyData.firstName || "",
            lastName: attorneyData.lastName || "",
            email: attorneyData.email || "",
            password: "",
            street: attorneyData.street || "",
            aptBlock: attorneyData.aptBlock || "",
            city: attorneyData.city?.toString() || "",
            state: attorneyData.state || "",
            country: attorneyData.country || "",
            location: attorneyData.location || "",
            zipCode: attorneyData.zipCode || "",
            phoneCell: attorneyData.phoneCell || "",
            phoneHome: attorneyData.phoneHome || "",
            phoneOffice: attorneyData.phoneOffice || "",
            dob: attorneyData.dob ? attorneyData.dob.split("T")[0] : "",
            admission: attorneyData.admission || "",
            language: attorneyData.language || "",
            servicesOffered: attorneyData.servicesOffered || "",
            education: attorneyData.education || "",
            experience: attorneyData.experience || "",
            barCouncilIndiaNo: attorneyData.barCouncilIndiaNo || "",
            barCouncilStateNo: attorneyData.barCouncilStateNo || "",
            familyLawPractice:
              attorneyData.familyLawPractice?.toString() || "false",
            familyDetails: attorneyData.familyDetails || "",
            aboutus: attorneyData.aboutus || "",
            categoryId: attorneyData.categoryId?.toString() || "",
            linkedin: attorneyData.linkedin || "",
            twitter: attorneyData.twitter || "",
            facebook: attorneyData.facebook || "",
            gmail: attorneyData.gmail || "",
            profileImage: null,
            resume: null,
            kycIdentity: null,
            kycAddress: null,
            barCouncilIndiaId: null,
            barCouncilStateId: null,
          });
        }
      } catch (error) {
        console.error("Initialization Error:", error);
        toast.error("Failed to load profile data.");
      }
    };
    loadInitialData();
  }, []);

  const selectedCountryObj = countries.find(
    (c) => c.countryName === formData.country,
  );

  const filteredCities = formData.country
    ? cities.filter(
        (ct) => Number(ct.countryId) === Number(selectedCountryObj?.id),
      )
    : [];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const payload = new FormData();

    const fileFields = [
      "profileImage",
      "resume",
      "kycIdentity",
      "kycAddress",
      "barCouncilIndiaId",
      "barCouncilStateId",
    ];

    Object.keys(formData).forEach((key) => {
      if (key === "password" && !formData[key]) return;
      if (key === "status") return;

      if (fileFields.includes(key)) {
        if (formData[key] instanceof File) {
          payload.append(key, formData[key]);
        }
      } else {
        let value = formData[key];

        if (["categoryId", "city"].includes(key)) {
          if (value && value !== "") payload.append(key, Number(value));
          return;
        }

        // Handle Boolean fields
        if (key === "familyLawPractice") {
          payload.append(key, value === "true");
          return;
        }

        // Handle Date
        if (key === "dob" && (!value || value === "Invalid date")) return;

        // Default: Append as string
        payload.append(
          key,
          value === null || value === undefined ? "" : value.toString().trim(),
        );
      }
    });

    // Force profile complete flag for frontend logic
    payload.append("isProfileComplete", "true");

    try {
      const res = await updateAttorney(attorneyId || userData?.id, payload);
      if (res) {
        toast.success("Profile Updated Successfully!");

        // Sync local storage with completion flag
        const updatedUser = { ...userData, isProfileComplete: true };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Notify Layout to refresh sidebar
        window.dispatchEvent(new Event("profileUpdated"));

        // Final redirection to Dashboard
        router.push("/attorney-panel");
      }
    } catch (error) {
      console.error("Update Error:", error);
      toast.error(
        error.response?.data?.message || "Internal Server Error (500)",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AttorneyLayout>
      <div className="container-fluid py-3">
        <div className="card border-0 shadow-sm p-3 p-md-4 bg-white rounded-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 border-bottom pb-3">
            <div>
              <h4 className="fw-bold m-0" style={{ color: "#002147" }}>
                Edit Professional Profile
              </h4>
              <p className="text-muted small m-0">
                All 34 fields must be verified by Admin.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* 1. Account & Basic Info */}
            <h6 className="text-primary fw-bold text-uppercase small">
              1. Basic Information
            </h6>
            <div className="row g-3 mb-4">
              <div className="col-12 col-sm-6 col-md-3">
                <label className="form-label small fw-bold">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  className="form-control"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-12 col-sm-6 col-md-3">
                <label className="form-label small fw-bold">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  className="form-control"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-12 col-sm-6 col-md-3">
                <label className="form-label small fw-bold">Email ID *</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-12 col-sm-6 col-md-3">
                <label className="form-label small fw-bold">
                  Update Password
                </label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  onChange={handleInputChange}
                  placeholder="Leave blank to keep"
                />
              </div>
              <div className="col-12 col-sm-6 col-md-3">
                <label className="form-label small fw-bold">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  className="form-control"
                  value={formData.dob}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-12 col-sm-6 col-md-3">
                <label className="form-label small fw-bold">Language</label>
                <select
                  name="language"
                  className="form-select"
                  value={formData.language}
                  onChange={handleInputChange}>
                  <option value="">Select Language</option>
                  {languages.map((l, i) => (
                    <option key={i} value={l.languageName || l.name}>
                      {l.languageName || l.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 2. Contact & Location */}
            <h6 className="text-primary fw-bold text-uppercase small">
              2. Contact & Address Details
            </h6>
            <div className="row g-3 mb-4">
              <div className="col-12 col-sm-6 col-md-4">
                <label className="form-label small fw-bold">
                  Phone (Mobile) *
                </label>
                <input
                  type="text"
                  name="phoneCell"
                  className="form-control"
                  value={formData.phoneCell}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-12 col-sm-6 col-md-4">
                <label className="form-label small fw-bold">Phone (Home)</label>
                <input
                  type="text"
                  name="phoneHome"
                  className="form-control"
                  value={formData.phoneHome}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-12 col-sm-6 col-md-4">
                <label className="form-label small fw-bold">
                  Phone (Office)
                </label>
                <input
                  type="text"
                  name="phoneOffice"
                  className="form-control"
                  value={formData.phoneOffice}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-12 col-sm-6 col-md-4">
                <label className="form-label small fw-bold">Country</label>
                <select
                  name="country"
                  className="form-select"
                  value={formData.country}
                  onChange={handleInputChange}>
                  <option value="">Select Country</option>
                  {countries.map((c) => (
                    <option key={c.id} value={c.countryName}>
                      {c.countryName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-sm-6 col-md-4">
                <label className="form-label small fw-bold">
                  City (Depends on Country)
                </label>
                <select
                  name="city"
                  className="form-select"
                  value={formData.city}
                  onChange={handleInputChange}
                  disabled={!formData.country}>
                  <option value="">Select City</option>
                  {filteredCities.map((ct) => (
                    <option key={ct.id} value={ct.id}>
                      {ct.cityName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-sm-6 col-md-4">
                <label className="form-label small fw-bold">State</label>
                <input
                  type="text"
                  name="state"
                  className="form-control"
                  value={formData.state}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label small fw-bold">
                  Street Address
                </label>
                <input
                  type="text"
                  name="street"
                  className="form-control"
                  value={formData.street}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-6 col-md-3">
                <label className="form-label small fw-bold">Apt/Block</label>
                <input
                  type="text"
                  name="aptBlock"
                  className="form-control"
                  value={formData.aptBlock}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-6 col-md-3">
                <label className="form-label small fw-bold">Zip Code</label>
                <input
                  type="text"
                  name="zipCode"
                  className="form-control"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-12">
                <label className="form-label small fw-bold">
                  Exact Location/Landmark
                </label>
                <input
                  type="text"
                  name="location"
                  className="form-control"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* 3. Professional Info */}
            <h6 className="text-primary fw-bold text-uppercase small">
              3. Professional Credentials
            </h6>
            <div className="row g-3 mb-4">
              <div className="col-12 col-sm-6 col-md-4">
                <label className="form-label small fw-bold">
                  Practice Category
                </label>
                <select
                  name="categoryId"
                  className="form-select"
                  value={formData.categoryId}
                  onChange={handleInputChange}>
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.categoryName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-sm-6 col-md-4">
                <label className="form-label small fw-bold">
                  Experience (Text Format) *
                </label>
                <input
                  type="text"
                  name="experience"
                  className="form-control"
                  value={formData.experience}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-12 col-sm-6 col-md-4">
                <label className="form-label small fw-bold">
                  Admission Date
                </label>
                <input
                  type="text"
                  name="admission"
                  className="form-control"
                  value={formData.admission}
                  onChange={handleInputChange}
                  placeholder="YYYY-MM-DD"
                />
              </div>
              <div className="col-12">
                <label className="form-label small fw-bold">
                  Education Details
                </label>
                <textarea
                  name="education"
                  className="form-control"
                  rows="2"
                  value={formData.education}
                  onChange={handleInputChange}></textarea>
              </div>
              <div className="col-12 col-sm-6">
                <label className="form-label small fw-bold">
                  Bar Council India No.
                </label>
                <input
                  type="text"
                  name="barCouncilIndiaNo"
                  className="form-control"
                  value={formData.barCouncilIndiaNo}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-12 col-sm-6">
                <label className="form-label small fw-bold">
                  Bar Council State No.
                </label>
                <input
                  type="text"
                  name="barCouncilStateNo"
                  className="form-control"
                  value={formData.barCouncilStateNo}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-12 col-sm-4">
                <label className="form-label small fw-bold">
                  Family Law Practice?
                </label>
                <select
                  name="familyLawPractice"
                  className="form-select"
                  value={formData.familyLawPractice}
                  onChange={handleInputChange}>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div className="col-12 col-sm-8">
                <label className="form-label small fw-bold">
                  Family Law Details
                </label>
                <input
                  type="text"
                  name="familyDetails"
                  className="form-control"
                  value={formData.familyDetails}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-12 col-sm-6 col-md-4">
                <label className="form-label small fw-bold">
                  Services Offered
                </label>
                <select
                  name="servicesOffered"
                  className="form-select"
                  value={formData.servicesOffered}
                  onChange={handleInputChange}>
                  <option value="">Select a Service</option>
                  {servicesList.map((service) => (
                    <option key={service.id} value={service.content}>
                      {service.content}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12">
                <label className="form-label small fw-bold">
                  Professional Bio (About Us)
                </label>
                <textarea
                  name="aboutus"
                  className="form-control"
                  rows="3"
                  value={formData.aboutus}
                  onChange={handleInputChange}></textarea>
              </div>
            </div>

            {/* 4. Social Links */}
            <h6 className="text-primary fw-bold text-uppercase small">
              4. Social & Web Profiles
            </h6>
            <div className="row g-3 mb-4">
              <div className="col-12 col-sm-6 col-md-3">
                <label className="form-label small fw-bold">LinkedIn</label>
                <input
                  type="text"
                  name="linkedin"
                  className="form-control"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-12 col-sm-6 col-md-3">
                <label className="form-label small fw-bold">Twitter</label>
                <input
                  type="text"
                  name="twitter"
                  className="form-control"
                  value={formData.twitter}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-12 col-sm-6 col-md-3">
                <label className="form-label small fw-bold">Facebook</label>
                <input
                  type="text"
                  name="facebook"
                  className="form-control"
                  value={formData.facebook}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-12 col-sm-6 col-md-3">
                <label className="form-label small fw-bold">
                  Gmail/Pro Email
                </label>
                <input
                  type="text"
                  name="gmail"
                  className="form-control"
                  value={formData.gmail}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* 5. Document Uploads */}
            <h6 className="text-primary fw-bold text-uppercase small">
              5. KYC Documents (Upload Files)
            </h6>
            <div className="row g-3 mb-5">
              {[
                { label: "Profile Photo", name: "profileImage" },
                { label: "Resume (CV)", name: "resume" },
                { label: "Identity Proof", name: "kycIdentity" },
                { label: "Address Proof", name: "kycAddress" },
                { label: "BCI ID Card", name: "barCouncilIndiaId" },
                { label: "State Bar ID", name: "barCouncilStateId" },
              ].map((doc, idx) => (
                <div key={idx} className="col-12 col-sm-6 col-md-4">
                  <div className="p-3 border rounded bg-light shadow-sm">
                    <label className="form-label small fw-bold d-block">
                      {doc.label}
                    </label>
                    <input
                      type="file"
                      name={doc.name}
                      className="form-control form-control-sm"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="btn btn-warning w-100 fw-bold py-3 rounded-pill mb-4"
              disabled={loading}>
              {loading ? "SAVING..." : "UPDATE PROFILE & SYNC DASHBOARD"}
            </button>
          </form>
        </div>
      </div>
    </AttorneyLayout>
  );
}