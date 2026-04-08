// "use client";
// import React, { useState, useEffect } from "react";
// import Head from "next/head";
// import Link from "next/link";
// import { useRouter } from "next/router";
// import * as authService from "../../services/authService";

// export default function CareerCountryDetail() {
//   const router = useRouter();
//   const { slug, category } = router.query;

//   const [detail, setDetail] = useState(null);
//   const [countryName, setCountryName] = useState("");
//   const [loading, setLoading] = useState(true);

//   // News & Events State
//   const [news, setNews] = useState([]);
//   const [events, setEvents] = useState([]);
//   const [activeTab, setActiveTab] = useState("News");

//   const gtGold = "#c5a059";

//   // Helper to match URL slugs
//   const createSlug = (text) => {
//     if (!text) return "";
//     return text
//       .toLowerCase()
//       .trim()
//       .replace(/&/g, "and")
//       .replace(/[^a-z0-9 -]/g, "")
//       .replace(/\s+/g, "-")
//       .replace(/-+/g, "-");
//   };

//   // Helper to parse IDs (Same as your Attorney logic)
//   const parseIds = (val) => {
//     try {
//       if (!val) return [];
//       const parsed = typeof val === "string" ? JSON.parse(val) : val;
//       return (Array.isArray(parsed) ? parsed : [parsed]).map(String);
//     } catch (e) {
//       return val ? [String(val)] : [];
//     }
//   };

//   useEffect(() => {
//     if (!router.isReady || !slug) return;

//     const loadData = async () => {
//       setLoading(true);
//       try {
//         const [detailRes, countryRes, cityRes, newsRes, eventRes] =
//           await Promise.all([
//             authService.getAllCareerDetails(),
//             authService.getAllCountries(),
//             authService.getAllCities(),
//             authService.getAllNews(),
//             authService.getAllEvents(),
//           ]);

//         const allCountries = countryRes?.data || [];
//         const allCities = cityRes?.data || cityRes || [];

//         // 1. Find Country Object from slug
//         const matchedCountry = allCountries.find(
//           (c) => createSlug(c.countryName || c.name) === slug,
//         );

//         if (matchedCountry) {
//           const countryId = String(matchedCountry.id || matchedCountry._id);
//           setCountryName(matchedCountry.countryName || matchedCountry.name);

//           // 2. Get all City IDs that belong to this Country
//           const countryCityIds = allCities
//             .filter(
//               (city) => String(city.countryId || city.countryid) === countryId,
//             )
//             .map((city) => String(city.id || city._id));

//           // 3. Filter News based on City IDs
//           const filteredNews = (newsRes?.data || []).filter((item) =>
//             countryCityIds.includes(String(item.cityId)),
//           );
//           setNews(filteredNews);

//           // 4. Filter Events based on City IDs (matching any city in the country)
//           const filteredEvents = (eventRes?.data || []).filter((item) => {
//             const eventCityIds = parseIds(item.cityIds || item.cityId);
//             return eventCityIds.some((id) => countryCityIds.includes(id));
//           });
//           setEvents(filteredEvents);

//           // 5. Get Latest Career Detail
//           const allDetails = detailRes?.data || [];
//           if (allDetails.length > 0) {
//             setDetail(allDetails[allDetails.length - 1]);
//           }
//         }
//       } catch (error) {
//         console.error("Error loading career detail data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, [slug, router.isReady]);

//   if (loading) return <div className="text-center p-5 fw-bold">Loading...</div>;
//   if (!detail) return <div className="text-center p-5">Not Found</div>;

//   const currentList = activeTab === "News" ? news : events;

//   return (
//     <div className="bg-white">
//       <Head>
//         <title>
//           {countryName} {category} | Lawstick
//         </title>
//       </Head>

//       {/* --- HERO BANNER --- */}
//       <section
//         className="text-white text-center d-flex align-items-center justify-content-center"
//         style={{
//           backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${authService.getImgUrl(detail.bannerImage)})`,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//           minHeight: "450px",
//           marginTop: "70px",
//         }}>
//         <div className="container">
//           <h1 className="display-2 fw-normal font-serif">
//             {countryName} {category}
//           </h1>
//           {detail.bannerText && (
//             <div className="h5 text-warning text-uppercase fw-bold mt-3 tracking-widest opacity-90">
//               {detail.bannerText}
//             </div>
//           )}
//         </div>
//       </section>

//       {/* --- DESCRIPTION CONTENT --- */}
//       <main className="container py-5">
//         <div className="row justify-content-center">
//           <div
//             className="col-lg-9 fs-5"
//             style={{ lineHeight: "1.8", color: "#333" }}>
//             <div dangerouslySetInnerHTML={{ __html: detail.description }} />
//           </div>
//         </div>
//       </main>

//       {/* --- DYNAMIC NEWS & EVENTS SECTION (Same Logic as Attorney Page) --- */}
//       <section className="py-5" style={{ backgroundColor: "#1a1a1a" }}>
//         <div className="container" style={{ maxWidth: "850px" }}>
//           <h3
//             className="font-serif text-white mb-4"
//             style={{ fontSize: "2.5rem" }}>
//             News & Events in {countryName}
//           </h3>

//           {/* TABS */}
//           <div className="mb-4 d-flex gap-4 border-bottom border-secondary no-print">
//             <span
//               className={`cursor-pointer pb-2 fw-bold text-white ${activeTab === "News" ? "border-bottom border-white" : "opacity-50"}`}
//               onClick={() => setActiveTab("News")}>
//               News ({news.length})
//             </span>
//             <span
//               className={`cursor-pointer pb-2 fw-bold text-white ${activeTab === "Events" ? "border-bottom border-white" : "opacity-50"}`}
//               onClick={() => setActiveTab("Events")}>
//               Events ({events.length})
//             </span>
//           </div>

//           {/* LIST */}
//           <div className="list-group list-group-flush bg-transparent">
//             {currentList.length > 0 ? (
//               currentList.slice(0, 5).map((item, idx) => (
//                 <div
//                   key={idx}
//                   className="bg-transparent border-bottom border-secondary py-3">
//                   <div className="small text-uppercase opacity-50 mb-1 text-muted">
//                     {new Date(
//                       item.date || item.createdAt || item.startDate,
//                     ).toLocaleDateString()}{" "}
//                     | {activeTab.toUpperCase()}
//                   </div>
//                   <Link
//                     href={`/${activeTab.toLowerCase()}/${createSlug(item.title)}`}>
//                     <a
//                       className="h4 text-decoration-none d-block font-serif"
//                       style={{ color: gtGold }}>
//                       {item.title}
//                     </a>
//                   </Link>
//                 </div>
//               ))
//             ) : (
//               <p className="text-muted">
//                 No {activeTab.toLowerCase()} found for this region.
//               </p>
//             )}
//           </div>
//         </div>
//       </section>

//       <style jsx global>{`
//         @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap");
//         .font-serif {
//           font-family: "Playfair Display", serif;
//         }
//         .cursor-pointer {
//           cursor: pointer;
//         }
//         .tracking-widest {
//           letter-spacing: 3px;
//         }
//       `}</style>
//     </div>
//   );
// }

"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import * as authService from "../../services/authService";

export default function CareerCountryDetail() {
  const router = useRouter();
  const { slug, category } = router.query;

  const [detail, setDetail] = useState(null);
  const [countryName, setCountryName] = useState("");
  const [loading, setLoading] = useState(true);

  // News & Events State
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("News");

  const gtGold = "#c5a059";

  // Standard Slug Creator
  const createSlug = (text) => {
    if (!text) return "";
    return text
      .toLowerCase()
      .trim()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  // Helper to parse IDs like "[3,5]" or "[3]" into ["3", "5"]
  const parseIds = (val) => {
    try {
      if (!val) return [];
      // If it's already an array, just map to string
      if (Array.isArray(val)) return val.map(String);
      // If it's a string like "[3,5]", parse it
      const parsed = JSON.parse(val);
      return (Array.isArray(parsed) ? parsed : [parsed]).map(String);
    } catch (e) {
      // Fallback: if it's just a single ID string "3"
      return val ? [String(val)] : [];
    }
  };

  useEffect(() => {
    if (!router.isReady || !slug) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const [detailRes, countryRes, newsRes, eventRes] = await Promise.all([
          authService.getAllCareerDetails(),
          authService.getAllCountries(),
          authService.getAllNews(),
          authService.getAllEvents(),
        ]);

        const allCountries = countryRes?.data || [];
        const allNews = newsRes?.data || [];
        const allEvents = eventRes?.data || [];

        // 1. Find the Country Object from URL slug
        const matchedCountry = allCountries.find(
          (c) => createSlug(c.countryName || c.name) === slug,
        );

        if (matchedCountry) {
          const currentCountryId = String(
            matchedCountry.id || matchedCountry._id,
          );
          setCountryName(matchedCountry.countryName || matchedCountry.name);

          // 2. Filter News based on countryId array in your JSON
          const filteredNews = allNews.filter((item) => {
            const itemCountryIds = parseIds(item.countryId);
            return itemCountryIds.includes(currentCountryId);
          });
          setNews(filteredNews);

          // 3. Filter Events based on countryId array
          const filteredEvents = allEvents.filter((item) => {
            const itemCountryIds = parseIds(item.countryId || item.countryIds);
            return itemCountryIds.includes(currentCountryId);
          });
          setEvents(filteredEvents);

          // 4. Get Latest Career Detail
          const allDetails = detailRes?.data || [];
          if (allDetails.length > 0) {
            setDetail(allDetails[allDetails.length - 1]);
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug, router.isReady]);

  if (loading) return <div className="text-center p-5 fw-bold">Loading...</div>;
  if (!detail) return <div className="text-center p-5">Not Found</div>;

  const currentList = activeTab === "News" ? news : events;

  return (
    <div className="bg-white">
      <Head>
        <title>
          {countryName} {category} | Lawstick
        </title>
      </Head>

      {/* --- HERO BANNER --- */}
      <section
        className="text-white text-center d-flex align-items-center justify-content-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${authService.getImgUrl(detail.bannerImage)})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "450px",
          marginTop: "70px",
        }}>
        <div className="container">
          <h1 className="display-2 fw-normal font-serif">
            {countryName} {category}
          </h1>
          {detail.bannerText && (
            <div className="h5 text-warning text-uppercase fw-bold mt-3 tracking-widest opacity-90">
              {detail.bannerText}
            </div>
          )}
        </div>
      </section>

      {/* --- DESCRIPTION --- */}
      <main className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-9 fs-5" style={{ lineHeight: "1.8" }}>
            <div dangerouslySetInnerHTML={{ __html: detail.description }} />
          </div>
        </div>
      </main>

      {/* --- NEWS & EVENTS SECTION --- */}
      <section className="py-5" style={{ backgroundColor: "#1a1a1a" }}>
        <div className="container" style={{ maxWidth: "850px" }}>
          <h3
            className="font-serif text-white mb-4"
            style={{ fontSize: "2.5rem" }}>
            News & Events in {countryName}
          </h3>

          {/* TABS */}
          <div className="mb-4 d-flex gap-4 border-bottom border-secondary">
            <span
              className={`cursor-pointer pb-2 fw-bold text-white ${activeTab === "News" ? "border-bottom border-white" : "opacity-50"}`}
              onClick={() => setActiveTab("News")}>
              News ({news.length})
            </span>
            <span
              className={`cursor-pointer pb-2 fw-bold text-white ${activeTab === "Events" ? "border-bottom border-white" : "opacity-50"}`}
              onClick={() => setActiveTab("Events")}>
              Events ({events.length})
            </span>
          </div>

          {/* NEWS/EVENTS LIST */}
          <div className="list-group list-group-flush bg-transparent">
            {currentList.length > 0 ? (
              currentList.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-transparent border-bottom border-secondary py-3">
                  <div className="small text-uppercase opacity-50 mb-1 text-muted">
                    {new Date(item.date || item.createdAt).toLocaleDateString()}{" "}
                    | {activeTab.toUpperCase()}
                  </div>
                  <Link
                    href={`/${activeTab.toLowerCase()}/${createSlug(item.title)}`}>
                    <a
                      className="h4 text-decoration-none d-block font-serif"
                      style={{ color: gtGold }}>
                      {item.title}
                    </a>
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-muted italic">
                No {activeTab.toLowerCase()} found for this region.
              </p>
            )}
          </div>
        </div>
      </section>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap");
        .font-serif {
          font-family: "Playfair Display", serif;
        }
        .cursor-pointer {
          cursor: pointer;
        }
        .tracking-widest {
          letter-spacing: 3px;
        }
      `}</style>
    </div>
  );
}