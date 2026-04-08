// "use client";
// import React, { useState, useEffect } from "react";
// import Head from "next/head";
// import Link from "next/link";
// import { useRouter } from "next/router";
// import * as authService from "../../../services/authService";

// export default function JobDetailSplitView() {
//   const router = useRouter();
//   const { id, slug } = router.query;

//   const [jobs, setJobs] = useState([]);
//   const [filteredJobs, setFilteredJobs] = useState([]);
//   const [selectedJob, setSelectedJob] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Filter States
//   const [searchQuery, setSearchQuery] = useState("");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const careerRes = await authService.getAllCareers();
//         if (careerRes && careerRes.success) {
//           const allJobs = careerRes.data;
//           setJobs(allJobs);
//           setFilteredJobs(allJobs);

//           if (id) {
//             const current = allJobs.find((j) => String(j.id) === String(id));
//             setSelectedJob(current || allJobs[0]);
//           } else if (allJobs.length > 0) {
//             setSelectedJob(allJobs[0]);
//           }
//         }
//       } catch (error) {
//         console.error("❌ Data fetch error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (router.isReady) fetchData();
//   }, [id, router.isReady]);

//   const handleSearch = (e) => {
//     const q = e.target.value.toLowerCase();
//     setSearchQuery(q);
//     const temp = jobs.filter(
//       (j) =>
//         j.jobTitle?.toLowerCase().includes(q) ||
//         j.jobCode?.toLowerCase().includes(q),
//     );
//     setFilteredJobs(temp);
//   };

//   if (loading)
//     return <div className="text-center py-5 fw-bold">Loading...</div>;

//   return (
//     <>
//       <Head>
//         <title>{selectedJob?.jobTitle || "Careers"} | GreenbergTraurig</title>
//       </Head>

//       {/* --- HERO BANNER --- */}
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
//           style={{
//             objectFit: "cover",
//             objectPosition: "center",
//           }}
//           alt="Banner"
//         />
//       </div>

//       <div
//         className="container-fluid bg-light py-3 border-bottom sticky-top"
//         style={{ top: "85px", zIndex: 999 }}>
//         <div className="container" style={{ maxWidth: "1250px" }}>
//           <div className="row g-2 align-items-center">
//             <div className="col-md-9">
//               <div className="input-group">
//                 <span className="input-group-text bg-white border-end-0">
//                   <i className="bi bi-search"></i>
//                 </span>
//                 <input
//                   type="text"
//                   className="form-control border-start-0 py-2 shadow-none"
//                   placeholder="Search for jobs or keywords"
//                   value={searchQuery}
//                   onChange={handleSearch}
//                 />
//               </div>
//             </div>
//             <div className="col-md-3">
//               <button
//                 className="btn btn-warning w-100 fw-bold py-2"
//                 style={{ backgroundColor: "#cfa144", border: "none" }}>
//                 Search
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* --- MAIN SPLIT VIEW --- */}
//       <div className="container-fluid bg-white">
//         <div className="container" style={{ maxWidth: "1250px" }}>
//           <div className="row">
//             {/* LEFT COLUMN: MASTER LIST */}
//             <div
//               className="col-lg-5 border-end scroll-box py-4"
//               style={{ height: "calc(100vh - 250px)", overflowY: "auto" }}>
//               <p className="small text-uppercase fw-bold text-muted mb-3 border-bottom pb-2">
//                 {filteredJobs.length} JOBS FOUND
//               </p>

//               {filteredJobs.map((job) => {
//                 const daysAgo = Math.floor(
//                   (new Date() - new Date(job.createdAt)) /
//                     (1000 * 60 * 60 * 24),
//                 );
//                 const postText =
//                   daysAgo === 0 ? "Posted Today" : `Posted ${daysAgo} Days Ago`;
//                 const jobSlug = job.jobTitle
//                   ?.toLowerCase()
//                   .trim()
//                   .replace(/\s+/g, "-")
//                   .replace(/[^\w-]+/g, "");
//                 return (
//                   <div
//                     key={job.id}
//                     className={`job-item-card p-3 mb-2 border rounded-0 cursor-pointer ${String(id) === String(job.id) ? "active-item" : ""}`}
//                     onClick={() =>
//                       router.push(
//                         `/careers/openings/${jobSlug}?id=${job.id}`,
//                         undefined,
//                         { shallow: true },
//                       )
//                     }>
//                     <h6 className="fw-bold mb-1" style={{ color: "#225a9b" }}>
//                       {job.jobTitle}
//                     </h6>
//                     <div className="d-flex flex-wrap gap-3 small text-muted mt-2">
//                       <span>
//                         <i className="bi bi-geo-alt me-1"></i> {job.address}
//                       </span>
//                       <span>
//                         <i className="bi bi-briefcase me-1"></i> {job.jobType}
//                       </span>
//                     </div>
//                     <div className="d-flex justify-content-between mt-2 align-items-center">
//                       <small className="text-muted">
//                         <i className="bi bi-clock me-1"></i> {postText}
//                       </small>
//                       <small
//                         className="text-uppercase fw-bold text-muted"
//                         style={{ fontSize: "10px" }}>
//                         {job.jobCode}
//                       </small>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* RIGHT COLUMN: DETAIL VIEW */}
//             <div
//               className="col-lg-7 ps-lg-4 py-4 scroll-box"
//               style={{ height: "calc(100vh - 250px)", overflowY: "auto" }}>
//               {selectedJob ? (
//                 <div className="job-detail-panel card border shadow-sm p-4 p-md-5 rounded-0 position-relative">
//                   <div className="d-flex justify-content-between align-items-start border-bottom pb-3 mb-4">
//                     <div className="w-75">
//                       <h3
//                         className="fw-bold mb-1"
//                         style={{ color: "#225a9b", fontFamily: "serif" }}>
//                         {selectedJob.jobTitle}{" "}
//                         <i
//                           className="bi bi-box-arrow-up-right ms-1 small text-muted"
//                           style={{ fontSize: "14px" }}></i>
//                       </h3>
//                       <Link
//                         href={`/careers/apply/${slug}?id=${id}`}
//                         className="btn mt-3 fw-bold px-4 py-2 text-uppercase"
//                         style={{
//                           backgroundColor: "#cfa144",
//                           color: "#fff",
//                           border: "none",
//                           borderRadius: "2px",
//                           fontSize: "13px",
//                         }}>
//                         Apply
//                       </Link>
//                     </div>
//                   </div>

//                   <div
//                     className="detail-body-text"
//                     style={{
//                       fontSize: "15px",
//                       color: "#444",
//                       lineHeight: "1.8",
//                     }}>
//                     <div
//                       dangerouslySetInnerHTML={{
//                         __html: selectedJob.textEditor,
//                       }}
//                       className="mb-5"
//                     />

//                     <h5
//                       className="fst-italic text-muted border-bottom pb-2 mb-4"
//                       style={{ fontFamily: "serif" }}>
//                       Qualifications
//                     </h5>

//                     <div className="mb-5">
//                       <h6
//                         className="fw-bold mb-3 border-bottom pb-2"
//                         style={{ color: "#225a9b", fontSize: "0.9rem" }}>
//                         Skills & Competencies
//                       </h6>
//                       <div
//                         dangerouslySetInnerHTML={{ __html: selectedJob.skills }}
//                       />
//                     </div>

//                     {/* --- ADDED TECHNOLOGY SECTION --- */}
//                     {selectedJob.technology &&
//                       selectedJob.technology !== "<p><br></p>" && (
//                         <div className="mb-5">
//                           <h6
//                             className="fw-bold mb-3 border-bottom pb-2"
//                             style={{ color: "#225a9b", fontSize: "0.9rem" }}>
//                             Technology Requirements
//                           </h6>
//                           <div
//                             dangerouslySetInnerHTML={{
//                               __html: selectedJob.technology,
//                             }}
//                           />
//                         </div>
//                       )}

//                     <div className="mb-5">
//                       <h6
//                         className="fw-bold mb-3 border-bottom pb-2"
//                         style={{ color: "#225a9b", fontSize: "0.9rem" }}>
//                         Education & Prior Experience
//                       </h6>
//                       <div
//                         dangerouslySetInnerHTML={{
//                           __html: selectedJob.education,
//                         }}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="h-100 d-flex align-items-center justify-content-center text-muted">
//                   <p>Select a job from the list to view details.</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         .job-item-card {
//           cursor: pointer;
//           transition: 0.2s;
//           border-left: 5px solid transparent !important;
//         }
//         .job-item-card:hover {
//           background-color: #f8f9fa;
//           border-left-color: #cfa144 !important;
//         }
//         .active-item {
//           background-color: #f0f7ff;
//           border-color: #225a9b !important;
//           border-left-color: #225a9b !important;
//         }
//         .scroll-box::-webkit-scrollbar {
//           width: 5px;
//         }
//         .scroll-box::-webkit-scrollbar-thumb {
//           background: #ddd;
//           border-radius: 10px;
//         }
//         .detail-body-text :global(ul) {
//           padding-left: 20px;
//           margin-bottom: 20px;
//         }
//         .detail-body-text :global(li) {
//           margin-bottom: 10px;
//         }
//       `}</style>
//     </>
//   );
// }

"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import * as authService from "../../../services/authService";

export default function JobDetailSplitView() {
  const router = useRouter();
  const { id, slug } = router.query;

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const careerRes = await authService.getAllCareers();
        if (careerRes && careerRes.success) {
          const allJobs = careerRes.data;
          setJobs(allJobs);
          setFilteredJobs(allJobs);

          if (id) {
            const current = allJobs.find((j) => String(j.id) === String(id));
            setSelectedJob(current || allJobs[0]);
          } else if (allJobs.length > 0) {
            setSelectedJob(allJobs[0]);
          }
        }
      } catch (error) {
        console.error("❌ Data fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    if (router.isReady) fetchData();
  }, [id, router.isReady]);

  const handleSearch = (e) => {
    const q = e.target.value.toLowerCase();
    setSearchQuery(q);
    const temp = jobs.filter(
      (j) =>
        j.jobTitle?.toLowerCase().includes(q) ||
        j.jobCode?.toLowerCase().includes(q),
    );
    setFilteredJobs(temp);
  };

  if (loading)
    return <div className="text-center py-5 fw-bold">Loading...</div>;

  return (
    <>
      <Head>
        <title>{selectedJob?.jobTitle || "Careers"} | GreenbergTraurig</title>
      </Head>

      {/* --- HERO BANNER --- */}
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

      {/* --- SEARCH BAR --- */}
      <div
        className="container-fluid bg-light py-3 border-bottom sticky-top"
        style={{ top: "85px", zIndex: 999 }}>
        <div className="container" style={{ maxWidth: "1250px" }}>
          <div className="row g-2 align-items-center">
            <div className="col-md-9">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 py-2 shadow-none"
                  placeholder="Search for jobs or keywords"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
            </div>
            <div className="col-md-3">
              <button
                className="btn btn-warning w-100 fw-bold py-2"
                style={{ backgroundColor: "#cfa144", border: "none" }}>
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN SPLIT VIEW --- */}
      <div className="container-fluid bg-white">
        <div className="container" style={{ maxWidth: "1250px" }}>
          <div className="row">
            {/* LEFT COLUMN: MASTER LIST */}
            <div
              className="col-lg-5 border-end scroll-box py-4"
              style={{ height: "calc(100vh - 250px)", overflowY: "auto" }}>
              <p className="small text-uppercase fw-bold text-muted mb-3 border-bottom pb-2">
                {filteredJobs.length} JOBS FOUND
              </p>

              {filteredJobs.map((job) => {
                // 1. Calculate the difference based on calendar days (Midnight to Midnight)
                const createdDate = new Date(job.createdAt);
                const today = new Date();

                // Set both dates to midnight (00:00:00) to ignore time differences
                createdDate.setHours(0, 0, 0, 0);
                today.setHours(0, 0, 0, 0);

                const diffInMs = today.getTime() - createdDate.getTime();
                const daysAgo = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

                // 2. Formatting logic
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
                  <div
                    key={job.id}
                    className={`job-item-card p-3 mb-2 border rounded-0 cursor-pointer ${String(id) === String(job.id) ? "active-item" : ""}`}
                    onClick={() =>
                      router.push(
                        `/careers/openings/${jobSlug}?id=${job.id}`,
                        undefined,
                        { shallow: true },
                      )
                    }>
                    <h6 className="fw-bold mb-1" style={{ color: "#225a9b" }}>
                      {job.jobTitle}
                    </h6>
                    <div className="d-flex flex-wrap gap-3 small text-muted mt-2">
                      <span>
                        <i className="bi bi-geo-alt me-1"></i> {job.address}
                      </span>
                      <span>
                        <i className="bi bi-briefcase me-1"></i> {job.jobType}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between mt-2 align-items-center">
                      <small className="text-muted">
                        <i className="bi bi-clock me-1"></i> {postText}
                      </small>
                      <small
                        className="text-uppercase fw-bold text-muted"
                        style={{ fontSize: "10px" }}>
                        {job.jobCode}
                      </small>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* RIGHT COLUMN: DETAIL VIEW */}
            <div
              className="col-lg-7 ps-lg-4 py-4 scroll-box"
              style={{ height: "calc(100vh - 250px)", overflowY: "auto" }}>
              {selectedJob ? (
                <div className="job-detail-panel card border shadow-sm p-4 p-md-5 rounded-0 position-relative">
                  <div className="d-flex justify-content-between align-items-start border-bottom pb-3 mb-4">
                    <div className="w-75">
                      <h3
                        className="fw-bold mb-1"
                        style={{ color: "#225a9b", fontFamily: "serif" }}>
                        {selectedJob.jobTitle}{" "}
                        <i
                          className="bi bi-box-arrow-up-right ms-1 small text-muted"
                          style={{ fontSize: "14px" }}></i>
                      </h3>
                      <Link
                        href={`/careers/apply/${slug}?id=${id}`}
                        className="btn mt-3 fw-bold px-4 py-2 text-uppercase"
                        style={{
                          backgroundColor: "#cfa144",
                          color: "#fff",
                          border: "none",
                          borderRadius: "2px",
                          fontSize: "13px",
                        }}>
                        Apply
                      </Link>
                    </div>
                  </div>

                  <div
                    className="detail-body-text"
                    style={{
                      fontSize: "15px",
                      color: "#444",
                      lineHeight: "1.8",
                    }}>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: selectedJob.textEditor,
                      }}
                      className="mb-5"
                    />

                    <h5
                      className="fst-italic text-muted border-bottom pb-2 mb-4"
                      style={{ fontFamily: "serif" }}>
                      Qualifications
                    </h5>

                    <div className="mb-5">
                      <h6
                        className="fw-bold mb-3 border-bottom pb-2"
                        style={{ color: "#225a9b", fontSize: "0.9rem" }}>
                        Skills & Competencies
                      </h6>
                      <div
                        dangerouslySetInnerHTML={{ __html: selectedJob.skills }}
                      />
                    </div>

                    {selectedJob.technology &&
                      selectedJob.technology !== "<p><br></p>" && (
                        <div className="mb-5">
                          <h6
                            className="fw-bold mb-3 border-bottom pb-2"
                            style={{ color: "#225a9b", fontSize: "0.9rem" }}>
                            Technology Requirements
                          </h6>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: selectedJob.technology,
                            }}
                          />
                        </div>
                      )}

                    <div className="mb-5">
                      <h6
                        className="fw-bold mb-3 border-bottom pb-2"
                        style={{ color: "#225a9b", fontSize: "0.9rem" }}>
                        Education & Prior Experience
                      </h6>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: selectedJob.education,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-100 d-flex align-items-center justify-content-center text-muted">
                  <p>Select a job from the list to view details.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .job-item-card {
          cursor: pointer;
          transition: 0.2s;
          border-left: 5px solid transparent !important;
        }
        .job-item-card:hover {
          background-color: #f8f9fa;
          border-left-color: #cfa144 !important;
        }
        .active-item {
          background-color: #f0f7ff;
          border-color: #225a9b !important;
          border-left-color: #225a9b !important;
        }
        .scroll-box::-webkit-scrollbar {
          width: 5px;
        }
        .scroll-box::-webkit-scrollbar-thumb {
          background: #ddd;
          border-radius: 10px;
        }
        .detail-body-text :global(ul) {
          padding-left: 20px;
          margin-bottom: 20px;
        }
        .detail-body-text :global(li) {
          margin-bottom: 10px;
        }
      `}</style>
    </>
  );
}