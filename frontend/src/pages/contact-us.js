import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import {
  createContactInquiry,
  getAdminId,
  getContactText,
} from "../services/authService";

function Contact() {
  const [formData, setFormData] = useState({
    adminId: "",
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "",
    phoneNumber: "",
    address: "",
    inquiryType: "",
    message: "",
  });

  const [contactText, setContactText] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ✅ Set Admin ID
  useEffect(() => {
    const id = getAdminId();
    if (id) {
      setFormData((prev) => ({ ...prev, adminId: id }));
    }
  }, []);

  // ✅ DYNAMIC DATA FETCH
  useEffect(() => {
    const fetchContactText = async () => {
      try {
        const res = await getContactText();
        // Path handling for Axios response and your specific JSON structure
        const actualData = res.data?.data || res.data;

        if (Array.isArray(actualData) && actualData.length > 0) {
          setContactText(actualData[0].contactText);
        } else if (actualData?.contactText) {
          setContactText(actualData.contactText);
        }
      } catch (error) {
        console.error("Failed to load contact text:", error);
      }
    };

    fetchContactText();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "countryCode") {
      if (value.length <= 4 && /^\+?\d*$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    console.log("CONTACT US", formData);
    
    e.preventDefault();
    // if (!formData.adminId) {
    //   alert("Session expired. Please log in again.");
    //   return;
    // }
    if (!termsAccepted) {
      alert("Please accept the disclaimer.");
      return;
    }
    if (!captchaVerified) {
      alert("Please confirm you are not a robot.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await createContactInquiry(formData);
      if (res.success) {
        alert("Message sent successfully!");
        setFormData({
          // adminId: formData.adminId,
          firstName: "",
          lastName: "",
          email: "",
          countryCode: "",
          phoneNumber: "",
          address : " ",
          inquiryType: "",
          message: "",
        });
        setTermsAccepted(false);
        setCaptchaVerified(false);
      } else {
        alert(res.message || "Failed to send message.");
      }
    } catch (error) {
      alert("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Contact Us</title>
      </Head>

      <div className="container py-5 mt-5 pt-5">
        <h1 className="display-4 fw-bold font-serif text-dark mb-4">
          Contact Us
        </h1>

        <div className="row g-4">
          {/* LEFT SIDEBAR - FULLY DYNAMIC EXCEPT BUTTONS */}
          <div className="col-lg-5 col-md-12 border-end">
            {/* 1. Dynamic Content from Editor/API */}
            {contactText ? (
              <div
                className="text-secondary mb-4"
                dangerouslySetInnerHTML={{ __html: contactText }}
              />
            ) : (
              <p className="text-secondary">Loading...</p>
            )}

            {/* 2. Static Buttons (As requested) */}
            <div className="mb-3">
              <Link href="/media-contacts">
                <a className="btn btn-premium">MEDIA CONTACTS</a>
              </Link>
            </div>

            <div className="mb-3">
              <Link href="/careers">
                <a className="btn btn-premium">JOB OPPORTUNITIES</a>
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE - FORM SECTION (UI UNCHANGED) */}
          <div className="col-lg-7 col-md-12">
            <p className="text-secondary">Please fill out the form below.</p>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">
                    First Name*
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    className="form-control"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Last Name*</label>
                  <input
                    type="text"
                    name="lastName"
                    className="form-control"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mt-3">
                <label className="form-label small fw-bold">Email*</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="row g-3 mt-1">
                <div className="col-md-3">
                  <label className="form-label small fw-bold">
                    Country Code*
                  </label>
                  <input
                    type="text"
                    name="countryCode"
                    placeholder="+91"
                    className="form-control"
                    required
                    value={formData.countryCode}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-9">
                  <label className="form-label small fw-bold">
                    Phone Number*
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    className="form-control"
                    required
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mt-3">
                <label className="form-label small fw-bold">
                  Inquiry Type*
                </label>
                <input
                  type="text"
                  name="inquiryType"
                  className="form-control"
                  placeholder="Your inquiry type"
                  value={formData.inquiryType}
                  onChange={handleChange}
                />
              </div>
              <div className="mt-3">
                <label className="form-label small fw-bold">Address</label>
                <input
                  type="text"
                  name="address"
                  className="form-control"
                  
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              <div className="mt-3">
                <label className="form-label small fw-bold">Message*</label>
                <textarea
                  name="message"
                  className="form-control"
                  rows="5"
                  required
                  value={formData.message}
                  onChange={handleChange}></textarea>
              </div>

              <div className="form-check mt-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="disclaimer"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                <label className="form-check-label small" htmlFor="disclaimer">
                  <strong>Note:</strong> Do not send confidential info without
                  speaking to an attorney.
                </label>
              </div>

              <div className="form-check mt-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="captcha"
                  checked={captchaVerified}
                  onChange={() => setCaptchaVerified(!captchaVerified)}
                />
                <label className="form-check-label small" htmlFor="captcha">
                  I'm not a robot
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-premium mt-4"
                disabled={submitting}>
                {submitting ? "SENDING..." : "SUBMIT"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Contact;
