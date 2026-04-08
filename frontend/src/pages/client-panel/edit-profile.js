"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ClientLayout from "../../components/layout/ClientLayout";
import {
  getAllLocationCities,
  getAllLocationCountries,
  updateClientProfile,
  getClientById,
} from "../../services/authService";
import { toast } from "react-toastify";

export default function EditProfile() {
  const router = useRouter();
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clientId, setClientId] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    countryCode: "",
    dob: "",
    street: "",
    aptBlock: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    termsAccepted: "false",
    profileImage: null,
    kycIdentity: null,
    kycAddress: null,
  });

  useEffect(() => {
    const init = async () => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const uid = user.id || user._id;
      try {
        const [cityRes, countryRes, profileRes] = await Promise.all([
          getAllLocationCities(),
          getAllLocationCountries(),
          getClientById(uid),
        ]);
        setCities(cityRes?.data || []);
        setCountries(countryRes?.data || []);

        const data = profileRes.client || profileRes.data || profileRes;
        if (data) {
          setClientId(data.id);
          setFormData({
            ...data,
            dob: data.dob ? data.dob.split("T")[0] : "",
            termsAccepted: data.termsAccepted?.toString() || "false",
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    init();
  }, []);

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.termsAccepted !== "true")
      return toast.warning("Accept terms first");

    setLoading(true);
    const payload = new FormData();
    Object.keys(formData).forEach((key) => {
      if (["profileImage", "kycIdentity", "kycAddress"].includes(key)) {
        if (formData[key] instanceof File) payload.append(key, formData[key]);
      } else {
        payload.append(
          key,
          formData[key] === null ? "" : formData[key].toString(),
        );
      }
    });

    payload.append("isProfileComplete", "true");

    try {
      const res = await updateClientProfile(clientId, payload);
      if (res) {
        toast.success("Profile Updated Successfully!");
        window.dispatchEvent(new Event("profileUpdated"));
        router.push("/client-panel");
      }
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const selectedCountry = countries.find(
    (c) => c.countryName === formData.country,
  );
  const filteredCities = selectedCountry
    ? cities.filter((ct) => Number(ct.countryId) === Number(selectedCountry.id))
    : [];

  return (
    <ClientLayout>
      <div className="card border-0 shadow-sm p-4 bg-white rounded-4">
        <h4 className="fw-bold mb-4" style={{ color: "#002147" }}>
          Edit Profile Details
        </h4>
        <form onSubmit={handleSubmit}>
          {/* Section 1: Basic Info */}
          <h6 className="text-warning fw-bold small mb-3">
            1. IDENTITY DETAILS
          </h6>
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <label className="small fw-bold">First Name</label>
              <input
                type="text"
                name="firstName"
                className="form-control"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="small fw-bold">Last Name</label>
              <input
                type="text"
                name="lastName"
                className="form-control"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="small fw-bold">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                
              />
            </div>
            <div className="col-md-3">
              <label className="small fw-bold">Code</label>
              <input
                type="text"
                name="countryCode"
                className="form-control"
                value={formData.countryCode}
                onChange={handleInputChange}
                placeholder="+91"
              />
            </div>
            <div className="col-md-5">
              <label className="small fw-bold">Mobile</label>
              <input
                type="text"
                name="mobile"
                className="form-control"
                value={formData.mobile}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="small fw-bold">Birth Date</label>
              <input
                type="date"
                name="dob"
                className="form-control"
                value={formData.dob}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Section 2: Address */}
          <h6 className="text-warning fw-bold small mb-3">
            2. LOCATION & ADDRESS
          </h6>
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <label className="small fw-bold">Country</label>
              <select
                name="country"
                className="form-select"
                value={formData.country}
                onChange={handleInputChange}>
                <option value="">Select</option>
                {countries.map((c) => (
                  <option key={c.id} value={c.countryName}>
                    {c.countryName}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="small fw-bold">State</label>
              <input
                type="text"
                name="state"
                className="form-control"
                value={formData.state}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-4">
              <label className="small fw-bold">City</label>
              <select
                name="city"
                className="form-select"
                value={formData.city}
                onChange={handleInputChange}
                required>
                <option value="">Select</option>
                {filteredCities.map((ct) => (
                  <option key={ct.id} value={ct.cityName}>
                    {ct.cityName}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label className="small fw-bold">Street</label>
              <input
                type="text"
                name="street"
                className="form-control"
                value={formData.street}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-3">
              <label className="small fw-bold">Apt/Block</label>
              <input
                type="text"
                name="aptBlock"
                className="form-control"
                value={formData.aptBlock}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-3">
              <label className="small fw-bold">Zip Code</label>
              <input
                type="text"
                name="zipCode"
                className="form-control"
                value={formData.zipCode}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Section 3: Files */}
          <h6 className="text-warning fw-bold small mb-3">3. DOCUMENTS</h6>
          <div className="row g-3 mb-5">
            {[
              { l: "Profile Photo", n: "profileImage" },
              { l: "Identity Proof", n: "kycIdentity" },
              { l: "Address Proof", n: "kycAddress" },
            ].map((d, i) => (
              <div key={i} className="col-md-4">
                <div className="p-3 border rounded bg-light shadow-sm">
                  <label className="small fw-bold">{d.l}</label>
                  <input
                    type="file"
                    name={d.n}
                    className="form-control form-control-sm"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="form-check mb-4">
            <input
              className="form-check-input"
              type="checkbox"
              id="tc"
              checked={formData.termsAccepted === "true"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  termsAccepted: e.target.checked.toString(),
                })
              }
            />
            <label className="form-check-label fw-bold small" htmlFor="tc">
              Verify Information is correct.
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-warning w-100 fw-bold py-3 rounded-pill"
            disabled={loading}>
            {loading ? "SAVING..." : "UPDATE & UNLOCK EVERYTHING"}
          </button>
        </form>
      </div>
    </ClientLayout>
  );
}
