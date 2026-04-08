// "use client";
// import React, { useState, useEffect } from "react";
// import Head from "next/head";
// import Link from "next/link";
// import { useRouter } from "next/router";
// import * as authService from "../../../services/authService";

// export default function CareerOpenings() {
//   const router = useRouter();
//   const [jobs, setJobs] = useState([]);
//   const [filteredJobs, setFilteredJobs] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [jobCategories, setJobCategories] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [searchQuery, setSearchQuery] = useState("");
//   const [selCity, setSelCity] = useState("");
//   const [selType, setSelType] = useState("");
//   const [selJobCat, setSelJobCat] = useState("");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const [careerRes, cityRes, jobCatRes] = await Promise.all([
//           authService.getAllCareers(),
//           authService.getAllLocationCities(),
//           authService.getAllJobCategories(),
//         ]);
//         if (careerRes && careerRes.success) {
//           setJobs(careerRes.data);
//           setFilteredJobs(careerRes.data);
//         }
//         setCities(cityRes?.data || cityRes || []);
//         setJobCategories(jobCatRes?.data || jobCatRes || []);
//       } catch (error) {
//         console.error("❌ Error fetching data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const handleSearch = () => {
//     let temp = [...jobs];
//     if (searchQuery) {
//       const q = searchQuery.toLowerCase();
//       temp = temp.filter(
//         (j) =>
//           j.jobTitle?.toLowerCase().includes(q) ||
//           j.jobCode?.toLowerCase().includes(q),
//       );
//     }
//     if (selCity)
//       temp = temp.filter((j) => String(j.cityId) === String(selCity));
//     if (selType) temp = temp.filter((j) => j.location === selType);
//     if (selJobCat)
//       temp = temp.filter((j) =>
//         String(j.jobCategoryId).includes(String(selJobCat)),
//       );
//     setFilteredJobs(temp);
//   };

//   if (loading)
//     return <div className="text-center py-5 fw-bold">Loading...</div>;

//   return (
//     <>
//       <Head>
//         <title>Career Openings | Lawstick</title>
//       </Head>
//       <div
//         className="position-relative w-100"
//         style={{
//           height: "180px",
//           marginTop: "83px",
//           background: "#000",
//           overflow: "hidden",
//           display: "block",
//         }}>
//         <img
//           src="https://plus.unsplash.com/premium_photo-1695449439526-9cebdbfa1a2c?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW50ZXJuYXRpb25hbCUyMGxhd3xlbnwwfHwwfHx8MA%3D%3D"
//           className="w-100 h-100"
//           style={{ objectFit: "cover", objectPosition: "center" }}
//           alt="Banner"
//         />
//       </div>

//       <div className="container-fluid bg-light py-4 border-bottom shadow-sm">
//         <div className="container" style={{ maxWidth: "1100px" }}>
//           <div className="row g-2">
//             <div className="col-md-9">
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Search..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//             <div className="col-md-3">
//               <button
//                 className="btn btn-warning w-100 fw-bold"
//                 style={{ backgroundColor: "#cfa144", border: "none" }}
//                 onClick={handleSearch}>
//                 Search
//               </button>
//             </div>
//             <div className="col-md-4">
//               <select
//                 className="form-select"
//                 value={selCity}
//                 onChange={(e) => setSelCity(e.target.value)}>
//                 <option value="">Locations</option>
//                 {cities.map((c) => (
//                   <option key={c.id} value={c.id}>
//                     {c.cityName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="col-md-4">
//               <select
//                 className="form-select"
//                 value={selType}
//                 onChange={(e) => setSelType(e.target.value)}>
//                 <option value="">Remote Type</option>
//                 <option value="Onsite">Onsite</option>
//                 <option value="Hybrid">Hybrid</option>
//                 <option value="Remote">Remote</option>
//               </select>
//             </div>
//             <div className="col-md-4">
//               <select
//                 className="form-select"
//                 value={selJobCat}
//                 onChange={(e) => setSelJobCat(e.target.value)}>
//                 <option value="">Categories</option>
//                 {jobCategories.map((cat) => (
//                   <option key={cat.id} value={cat.id}>
//                     {cat.jobCategory}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="container mt-4 pb-5" style={{ maxWidth: "1100px" }}>
//         <div className="row">
//           <div className="col-lg-8 border-end pe-lg-5">
//             <p className="small text-uppercase fw-bold text-muted mb-4">
//               {filteredJobs.length} JOBS FOUND
//             </p>
//             {filteredJobs.length > 0 ? (
//               filteredJobs.map((job) => {
//                 // FIXED: Defining jobSlug inside the map
//                 const jobSlug = job.jobTitle
//                   ?.toLowerCase()
//                   .trim()
//                   .replace(/\s+/g, "-")
//                   .replace(/[^\w-]+/g, "");
//                 return (
//                   <div key={job.id} className="job-item py-3 border-bottom">
//                     <h6 className="fw-bold mb-1" style={{ color: "#225a9b" }}>
//                       {/* FIXED: Wrapped in <span> to avoid multiple children error */}
//                       <Link
//                         href={`/careers/openings/${jobSlug}?id=${job.id}`}
//                         className="text-decoration-none">
//                         <span>{job.jobTitle}</span>
//                       </Link>
//                     </h6>
//                     <div className="d-flex flex-wrap gap-3 small text-muted mt-2">
//                       <span>{job.address}</span> | <span>{job.jobType}</span> |{" "}
//                       <span>{job.location}</span>
//                     </div>
//                     <div className="small text-muted mt-1 text-uppercase">
//                       {job.jobCode}
//                     </div>
//                   </div>
//                 );
//               })
//             ) : (
//               <p className="text-muted py-5 text-center">No jobs found.</p>
//             )}
//           </div>
//           <div className="col-lg-4 ps-lg-4">
//             <h6 className="fw-bold border-bottom pb-2">About Us</h6>
//             <p className="small text-muted">
//               With 51 locations, Greenberg Traurig's global network provides the
//               platform...
//             </p>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import * as authService from "../../../services/authService";

export default function CareerOpenings() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [cities, setCities] = useState([]);
  const [jobCategories, setJobCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selCity, setSelCity] = useState("");
  const [selType, setSelType] = useState("");
  const [selJobCat, setSelJobCat] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [careerRes, cityRes, jobCatRes] = await Promise.all([
          authService.getAllCareers(),
          authService.getAllLocationCities(),
          authService.getAllJobCategories(),
        ]);
        if (careerRes && careerRes.success) {
          setJobs(careerRes.data);
          setFilteredJobs(careerRes.data);
        }
        setCities(cityRes?.data || cityRes || []);
        setJobCategories(jobCatRes?.data || jobCatRes || []);
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = () => {
    let temp = [...jobs];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      temp = temp.filter(
        (j) =>
          j.jobTitle?.toLowerCase().includes(q) ||
          j.jobCode?.toLowerCase().includes(q),
      );
    }
    if (selCity)
      temp = temp.filter((j) => String(j.cityId) === String(selCity));
    if (selType) temp = temp.filter((j) => j.location === selType);
    if (selJobCat)
      temp = temp.filter((j) =>
        String(j.jobCategoryId).includes(String(selJobCat)),
      );
    setFilteredJobs(temp);
  };

  if (loading)
    return <div className="text-center py-5 fw-bold">Loading...</div>;

  return (
    <>
      <Head>
        <title>Career Openings | Lawstick</title>
      </Head>
      <div
        className="position-relative w-100"
        style={{
          height: "180px",
          marginTop: "83px",
          background: "#000",
          overflow: "hidden",
          display: "block",
        }}>
        <img
          src="https://plus.unsplash.com/premium_photo-1695449439526-9cebdbfa1a2c?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW50ZXJuYXRpb25hbCUyMGxhd3xlbnwwfHwwfHx8MA%3D%3D"
          className="w-100 h-100"
          style={{ objectFit: "cover", objectPosition: "center" }}
          alt="Banner"
        />
      </div>

      <div className="container-fluid bg-light py-4 border-bottom shadow-sm">
        <div className="container" style={{ maxWidth: "1100px" }}>
          <div className="row g-2">
            <div className="col-md-9">
              <input
                type="text"
                className="form-control"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <button
                className="btn btn-warning w-100 fw-bold"
                style={{ backgroundColor: "#cfa144", border: "none" }}
                onClick={handleSearch}>
                Search
              </button>
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={selCity}
                onChange={(e) => setSelCity(e.target.value)}>
                <option value="">Locations</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.cityName}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={selType}
                onChange={(e) => setSelType(e.target.value)}>
                <option value="">Remote Type</option>
                <option value="Onsite">Onsite</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={selJobCat}
                onChange={(e) => setSelJobCat(e.target.value)}>
                <option value="">Categories</option>
                {jobCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.jobCategory}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-4 pb-5" style={{ maxWidth: "1100px" }}>
        <div className="row">
          <div className="col-lg-8 border-end pe-lg-5">
            <p className="small text-uppercase fw-bold text-muted mb-4">
              {filteredJobs.length} JOBS FOUND
            </p>
            {filteredJobs.length > 0 ? (
  filteredJobs.map((job) => {
    // 1. Calendar Day Logic
    const createdDate = new Date(job.createdAt);
    const today = new Date();
    createdDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffInMs = today.getTime() - createdDate.getTime();
    const daysAgo = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    let postText = "";
    if (daysAgo <= 0) {
      postText = "Posted Today";
    } else if (daysAgo >= 30) {
      postText = "Posted 30+ Days Ago";
    } else {
      postText = `Posted ${daysAgo} ${daysAgo === 1 ? "Day" : "Days"} Ago`;
    }

    const jobSlug = job.jobTitle
      ?.toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

    return (
      <div key={job.id} className="job-item py-3 border-bottom">
        {/* Added cursor pointer to the h6 container as well */}
        <h6 className="fw-bold mb-1" style={{ color: "#225a9b", cursor: "pointer" }}>
          <Link
            href={`/careers/openings/${jobSlug}?id=${job.id}`}
            className="text-decoration-none"
            style={{ color: "inherit", cursor: "pointer" }}
          >
            {/* Added pointer directly to the span text */}
            <span style={{ cursor: "pointer" }}>{job.jobTitle}</span>
          </Link>
        </h6>
        
        <div className="d-flex flex-wrap gap-3 small text-muted mt-2 align-items-center">
          <span>
            <i className="bi bi-geo-alt me-1"></i> {job.address}
          </span>
          <span>
            <i className="bi bi-briefcase me-1"></i> {job.jobType}
          </span>
          <span
            className="badge border text-dark fw-normal"
            style={{ fontSize: "11px", background: "#f8f9fa" }}
          >
            {job.location}
          </span>
        </div>
        
        <div className="d-flex flex-wrap gap-3 small text-muted mt-1 align-items-center">
          <span>
            <i className="bi bi-clock me-1"></i> {postText}
          </span>
          <span className="text-uppercase fw-bold" style={{ fontSize: "10px" }}>
            {job.jobCode}
          </span>
        </div>
      </div>
    );
  })
) : (
  <p className="text-muted py-5 text-center">No jobs found.</p>
)}
          
          </div>
          <div className="col-lg-4 ps-lg-4">
            <h6 className="fw-bold border-bottom pb-2">About Us</h6>
            <p className="small text-muted">
              With 51 locations, Greenberg Traurig's global network provides the
              platform...
            </p>
          </div>
        </div>
      </div>
    </>
  );
}