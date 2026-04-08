// "use client";
// import React, { useState, useEffect } from "react";
// import Head from "next/head";
// import { useRouter } from "next/router";
// import * as authService from "../../services/authService";

// const Careers = () => {
//   const router = useRouter();
//   const [banner, setBanner] = useState(null);
//   const [lawStudent, setLawStudent] = useState(null);
//   const [attorney, setAttorney] = useState(null);
//   const [professional, setProfessional] = useState(null);
//   const [countries, setCountries] = useState([]);
//   const [lawCategories, setLawCategories] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Helper to create URL-friendly name
//   const createSlug = (text) =>
//     text
//       ?.toLowerCase()
//       .trim()
//       .replace(/\s+/g, "-")
//       .replace(/[^\w-]+/g, "");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [ban, law, att, pro, coun, cats] = await Promise.allSettled([
//           authService.getAllCareerBanners(),
//           authService.getAllCareerLaw(),
//           authService.getAllCareerAttorneys(),
//           authService.getAllCareerProfessionals(),
//           authService.getAllCountries(),
//           authService.getAllLawCareerCategories(),
//         ]);

//         const extractLatest = (res) => {
//           if (res.status === "fulfilled") {
//             const data =
//               res.value?.data?.data || res.value?.data || res.value || [];
//             return Array.isArray(data) ? data[data.length - 1] : null;
//           }
//           return null;
//         };

//         const extractAll = (res) => {
//           if (res.status === "fulfilled") {
//             const data =
//               res.value?.data?.data || res.value?.data || res.value || [];
//             return Array.isArray(data) ? data : [];
//           }
//           return [];
//         };

//         setBanner(extractLatest(ban));
//         setLawStudent(extractLatest(law));
//         setAttorney(extractLatest(att));
//         setProfessional(extractLatest(pro));
//         setCountries(extractAll(coun));
//         setLawCategories(extractAll(cats));
//       } catch (error) {
//         console.error("Error fetching data", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const getDynamicTitle = (item, defaultName) => {
//     const categoryId = item?.categoryid || item?.categoryId;
//     const category = lawCategories.find((c) => (c.id || c._id) == categoryId);
//     return category ? category.name : defaultName;
//   };

// const renderSection = (
//   item,
//   defaultTitle,
//   bgColor,
//   textColor,
//   isReverse = false,
// ) => {
//   if (!item) return null;

//   // This gets the Category Name (e.g., "Law Students", "Attorneys")
//   const sectionCategory = getDynamicTitle(item, defaultTitle);

//   return (
//     <section className={`${bgColor} ${textColor} border-bottom`}>
//       <div
//         className={`row g-0 align-items-center ${isReverse ? "flex-row-reverse" : ""}`}>
//         <div className="col-lg-6 p-4 p-md-5">
//           <h2 className="display-6 mb-3 fw-bold">{sectionCategory}</h2>
//           <div
//             className="mb-4 opacity-75"
//             dangerouslySetInnerHTML={{ __html: item.content }}
//           />
//           <div className="d-flex flex-wrap gap-2">
//             {countries.map((c) => (
//               <button
//                 key={c.id || c._id}
//                 className={`btn btn-sm px-3 py-2 rounded-0 fw-bold text-uppercase ${textColor === "text-white" ? "btn-outline-light" : "btn-outline-dark"}`}
//                 onClick={() => {
//                   const countrySlug = createSlug(c.countryName || c.name);
//                   // We pass the category name in the query string: ?category=Law Students
//                   router.push(
//                     `/careers/${countrySlug}?category=${sectionCategory}`,
//                   );
//                 }}>
//                 {c.countryName || c.name}
//               </button>
//             ))}
//           </div>
//         </div>
//         <div className="col-lg-6">
//           <img
//             src={authService.getImgUrl(item.image || item.bannerImage)}
//             className="w-100 object-fit-cover"
//             style={{ height: "400px" }}
//             alt=""
//           />
//         </div>
//       </div>
//     </section>
//   );
// };

//   if (loading) return <div className="text-center p-5 fw-bold">Loading...</div>;

//   return (
//     <div className="container-fluid p-0">
//       <Head>
//         <title>Careers | Lawstick</title>
//       </Head>
//       {banner && (
//         <section
//           className="bg-dark text-white text-center py-5 d-flex align-items-center justify-content-center"
//           style={{
//             backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${authService.getImgUrl(banner.bannerImage || banner.image)})`,
//             backgroundSize: "cover",
//             minHeight: "60vh",
//           }}>
//           <div className="container px-4">
//             <div
//               className="display-4 fw-bold mb-4"
//               dangerouslySetInnerHTML={{ __html: banner.content }}
//             />
//             <button
//               className="btn btn-outline-light px-5 py-3 rounded-0 fw-bold border-2"
//               onClick={() => router.push("/careers/openings")}>
//               VIEW OPENINGS AND APPLY
//             </button>
//           </div>
//         </section>
//       )}
//       {renderSection(lawStudent, "Law Students", "bg-warning", "text-white")}
//       {renderSection(attorney, "Attorneys", "bg-white", "text-dark", true)}
//       {renderSection(
//         professional,
//         "Professional Staff",
//         "bg-info",
//         "text-white",
//       )}
//     </div>
//   );
// };

// export default Careers;

"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import * as authService from "../../services/authService";

const Careers = () => {
  const router = useRouter();
  const [banner, setBanner] = useState(null);
  const [lawStudent, setLawStudent] = useState(null);
  const [attorney, setAttorney] = useState(null);
  const [professional, setProfessional] = useState(null);
  const [countries, setCountries] = useState([]);
  const [lawCategories, setLawCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const createSlug = (text) =>
    text
      ?.toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ban, law, att, pro, coun, cats] = await Promise.allSettled([
          authService.getAllCareerBanners(),
          authService.getAllCareerLaw(),
          authService.getAllCareerAttorneys(),
          authService.getAllCareerProfessionals(),
          authService.getAllCountries(),
          authService.getAllLawCareerCategories(),
        ]);

        const extractLatest = (res) => {
          if (res.status === "fulfilled") {
            const data =
              res.value?.data?.data || res.value?.data || res.value || [];
            return Array.isArray(data) ? data[data.length - 1] : null;
          }
          return null;
        };

        const extractAll = (res) => {
          if (res.status === "fulfilled") {
            const data =
              res.value?.data?.data || res.value?.data || res.value || [];
            return Array.isArray(data) ? data : [];
          }
          return [];
        };

        setBanner(extractLatest(ban));
        setLawStudent(extractLatest(law));
        setAttorney(extractLatest(att));
        setProfessional(extractLatest(pro));
        setCountries(extractAll(coun));
        setLawCategories(extractAll(cats));
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getDynamicTitle = (item, defaultName) => {
    const categoryId = item?.categoryid || item?.categoryId;
    const category = lawCategories.find((c) => (c.id || c._id) == categoryId);
    return category ? category.name : defaultName;
  };

  const renderSection = (
    item,
    defaultTitle,
    bgColor,
    textColor,
    isReverse = false,
  ) => {
    if (!item) return null;
    const sectionCategory = getDynamicTitle(item, defaultTitle);
    const isWhiteSection = textColor === "text-white";

    return (
      <section
        className={`${bgColor} border-bottom overflow-hidden ${isWhiteSection ? "force-white-all" : ""}`}>
        <div
          className={`row g-0 align-items-center ${isReverse ? "flex-row-reverse" : ""}`}>
          <div className="col-lg-6 p-4 p-md-5">
            {/* Reduced Header Font Size */}
            <h2
              className={`mb-3 fw-bold font-serif section-title ${textColor}`}>
              {sectionCategory}
            </h2>

            {/* Reduced Content Font Size */}
            <div className={`mb-4 content-body ${textColor}`}>
              <div dangerouslySetInnerHTML={{ __html: item.content }} />
            </div>

            {/* Buttons */}
            <div className="d-flex flex-wrap gap-2">
              {countries.map((c) => (
                <button
                  key={c.id || c._id}
                  className={`btn btn-sm px-3 py-2 rounded-0 fw-bold text-uppercase border-2 ${
                    isWhiteSection ? "btn-outline-light" : "btn-outline-dark"
                  }`}
                  style={{ fontSize: "11px", letterSpacing: "1px" }}
                  onClick={() => {
                    const countrySlug = createSlug(c.countryName || c.name);
                    router.push(
                      `/careers/${countrySlug}?category=${sectionCategory}`,
                    );
                  }}>
                  {c.countryName || c.name}
                </button>
              ))}
            </div>
          </div>

          <div className="col-lg-6">
            <img
              src={authService.getImgUrl(item.image || item.bannerImage)}
              className="w-100 object-fit-cover shadow-sm"
              style={{ height: "400px", minHeight: "300px" }}
              alt={sectionCategory}
            />
          </div>
        </div>
      </section>
    );
  };

  if (loading) return <div className="text-center p-5">Loading...</div>;

  return (
    <div className="container-fluid p-0">
      <Head>
        <title>Careers | Lawstick</title>
      </Head>

      {banner && (
        <section
          className="bg-dark text-white text-center py-5 d-flex align-items-center justify-content-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${authService.getImgUrl(banner.bannerImage || banner.image)})`,
            backgroundSize: "cover",
            minHeight: "55vh",
          }}>
          <div className="container px-4">
            <div
              className="h2 fw-bold mb-4 font-serif"
              dangerouslySetInnerHTML={{ __html: banner.content }}
            />
            <button
              className="btn btn-outline-light px-4 py-2 rounded-0 fw-bold border-2"
              onClick={() => router.push("/careers/openings")}>
              VIEW OPENINGS AND APPLY
            </button>
          </div>
        </section>
      )}

      {/* Law Students (Yellow Background - Pure White Text) */}
      {renderSection(lawStudent, "Law Students", "bg-warning", "text-white")}

      {/* Attorneys (White Background - Dark Text) */}
      {renderSection(attorney, "Attorneys", "bg-white", "text-dark", true)}

      {/* Professionals (Blue Background - Pure White Text) */}
      {renderSection(
        professional,
        "Professional Staff",
        "bg-info",
        "text-white",
      )}

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap");

        .font-serif {
          font-family: "Playfair Display", serif;
        }

        /* Reduced Heading Font Size */
        .section-title {
          font-size: 30px !important; /* Title smaller */
        }

        /* Reduced Content Font Size */
        .content-body,
        .content-body p,
        .content-body span,
        .content-body div {
          font-size: 14.5px !important; /* Description smaller */
          line-height: 1.6 !important;
        }

        /* FORCE WHITE COLOR for Law Students and Professional Staff */
        .force-white-all .section-title,
        .force-white-all .content-body,
        .force-white-all .content-body p,
        .force-white-all .content-body span,
        .force-white-all .content-body div {
          color: #ffffff !important;
        }

        .bg-warning {
          background-color: #f7b700 !important;
        }

        .bg-info {
          background-color: #0077b5 !important;
        }

        .btn-outline-light {
          border-color: #ffffff !important;
          color: #ffffff !important;
        }
        .btn-outline-light:hover {
          background-color: #ffffff !important;
          color: #000000 !important;
        }
      `}</style>
    </div>
  );
};

export default Careers;