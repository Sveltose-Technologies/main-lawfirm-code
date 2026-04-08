import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";

import { getAllAwards, getImgUrl } from "../../services/authService";

function AwardsAccolades() {
  const router = useRouter();
  const [allAwards, setAllAwards] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [uniqueYears, setUniqueYears] = useState([]);

  const [orgSuggestions, setOrgSuggestions] = useState([]);
  const [nameSuggestions, setNameSuggestions] = useState([]);
  const [showOrgList, setShowOrgList] = useState(false);
  const [showNameList, setShowNameList] = useState(false);

  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    presenter: "",
    recipient: "",
    year: "",
  });

  const orgRef = useRef(null);
  const nameRef = useRef(null);

  const stripHtml = (html) => {
    if (!html) return "";
    if (typeof window !== "undefined") {
      const doc = new DOMParser().parseFromString(html, "text/html");
      const plainText = doc.body.textContent || "";
      return plainText
        .replace(/\u00a0/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }
    return html.replace(/<[^>]*>?/gm, "");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getAllAwards();
        if (res && res.success) {
          const data = res.data || [];
          setAllAwards(data);
          setFilteredData(data);
          setUniqueYears([
            ...new Set(
              data
                .map((item) => item.year)
                .filter((y) => y)
                .sort((a, b) => b - a),
            ),
          ]);
          setOrgSuggestions([
            ...new Set(data.map((item) => item.organization).filter((o) => o)),
          ]);
          setNameSuggestions([
            ...new Set(data.map((item) => item.personName).filter((n) => n)),
          ]);
        }
      } catch (error) {
        console.error("Error fetching awards:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    const handleClickOutside = (event) => {
      if (orgRef.current && !orgRef.current.contains(event.target))
        setShowOrgList(false);
      if (nameRef.current && !nameRef.current.contains(event.target))
        setShowNameList(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    if (name === "presenter") setShowOrgList(true);
    if (name === "recipient") setShowNameList(true);
  };

  const selectSuggestion = (name, value) => {
    setFilters({ ...filters, [name]: value });
    setShowOrgList(false);
    setShowNameList(false);
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const results = allAwards.filter((item) => {
      const matchPresenter = (item.organization || "")
        .toLowerCase()
        .includes(filters.presenter.toLowerCase().trim());
      const matchRecipient = (item.personName || "")
        .toLowerCase()
        .includes(filters.recipient.toLowerCase().trim());
      const matchYear =
        filters.year === ""
          ? true
          : (item.year || "").toString() === filters.year;
      return matchPresenter && matchRecipient && matchYear;
    });
    setFilteredData(results);
    setShowOrgList(false);
    setShowNameList(false);
  };

  const handleReset = () => {
    setFilters({ presenter: "", recipient: "", year: "" });
    setFilteredData(allAwards);
  };

  const createSlug = (text) => {
    if (!text) return "";
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
  };

  if (loading)
    return <div className="p-5 text-center fw-bold">Loading Awards...</div>;

  // Manual concatenation hatakar helper function ka use kiya
  const bannerImg =
    allAwards.length > 0 && allAwards[0].bannerImage
      ? getImgUrl(allAwards[0].bannerImage)
      : "";

  return (
    <div className="bg-light-gray min-vh-100">
      {/* Dynamic Banner Section */}
      <div
        className="universal-banner"
        style={{ backgroundImage: `url('${bannerImg}')` }}>
        <div className="banner-overlay"></div>
        <div className="container banner-content">
          <h1 className="text-white display-4">Awards & Accolades</h1>
          <p className="text-white lead">
            Recognizing Excellence in Legal Practice
          </p>
        </div>
      </div>

      <div className="container py-5">
        <div className="card shadow-sm border-0 mb-5 p-4 overflow-visible">
          <form onSubmit={handleSearch}>
            <div className="row g-3">
              <div className="col-md-3 position-relative" ref={orgRef}>
                <label className="form-label fw-bold small text-muted">
                  Organization
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="presenter"
                  value={filters.presenter}
                  onChange={handleInputChange}
                  onFocus={() => setShowOrgList(true)}
                  autoComplete="off"
                  placeholder="Type to search..."
                />
                {showOrgList && filters.presenter && (
                  <ul className="list-group position-absolute shadow suggestion-list">
                    {orgSuggestions
                      .filter((o) =>
                        o
                          .toLowerCase()
                          .includes(filters.presenter.toLowerCase()),
                      )
                      .map((org, i) => (
                        <li
                          key={i}
                          className="list-group-item list-group-item-action small cursor-pointer"
                          onClick={() => selectSuggestion("presenter", org)}>
                          {org}
                        </li>
                      ))}
                  </ul>
                )}
              </div>

              <div className="col-md-3 position-relative" ref={nameRef}>
                <label className="form-label fw-bold small text-muted">
                  Person Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="recipient"
                  value={filters.recipient}
                  onChange={handleInputChange}
                  onFocus={() => setShowNameList(true)}
                  autoComplete="off"
                  placeholder="Type to search..."
                />
                {showNameList && filters.recipient && (
                  <ul className="list-group position-absolute shadow suggestion-list">
                    {nameSuggestions
                      .filter((n) =>
                        n
                          .toLowerCase()
                          .includes(filters.recipient.toLowerCase()),
                      )
                      .map((name, i) => (
                        <li
                          key={i}
                          className="list-group-item list-group-item-action small cursor-pointer"
                          onClick={() => selectSuggestion("recipient", name)}>
                          {name}
                        </li>
                      ))}
                  </ul>
                )}
              </div>

              <div className="col-md-3">
                <label className="form-label fw-bold small text-muted">
                  Year
                </label>
                <select
                  className="form-select"
                  name="year"
                  value={filters.year}
                  onChange={handleInputChange}>
                  <option value="">All Years</option>
                  {uniqueYears.map((year, index) => (
                    <option key={index} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3 d-flex align-items-end">
                <button type="submit" className="btn btn-dark w-50 me-2">
                  Search
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn btn-outline-secondary w-50">
                  Reset
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="table-responsive shadow-sm rounded bg-white">
          <table className="table table-hover align-middle mb-0 border">
            <thead className="table-dark-custom">
              <tr>
                <th className="py-3 ps-3">Year</th>
                <th className="py-3">Organization</th>
                <th className="py-3">Award Title</th>
                <th className="py-3">Recipient</th>
                <th className="py-3">Summary</th>
                <th className="py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((row) => (
                  <tr key={row.id}>
                    <td className="ps-3 fw-bold text-blue">{row.year}</td>
                    <td>{row.organization}</td>
                    <td>
                      <span className="badge bg-light text-dark border p-2">
                        {row.awardTitle}
                      </span>
                    </td>
                    <td>{row.personName}</td>
                    <td className="small text-muted">
                      <div className="text-truncate table-summary-width">
                        {stripHtml(row.details)}
                      </div>
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-outline-dark px-3 fw-bold rounded-0"
                        onClick={() =>
                          router.push(`/award/${createSlug(row.awardTitle)}`)
                        }>
                        VIEW
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-5">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AwardsAccolades;
