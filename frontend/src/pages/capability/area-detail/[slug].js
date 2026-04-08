
import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  getAllCapabilitySubCategories,
  getAllSubcategoryCMS,
  getAllNews,
  getAllEvents,
  IMG_URL,
  getImgUrl,
} from "../../../services/authService";

export default function SubCategoryDetail() {
  const router = useRouter();
  const { slug } = router.query;

  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [sameCategorySubs, setSameCategorySubs] = useState([]);
  const [otherCategorySubs, setOtherCategorySubs] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [eventsList, setEventsList] = useState([]);
  const [subCmsData, setSubCmsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("News");

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

  const cleanHTML = (html) => (html ? html.replace(/&nbsp;/g, " ") : "");

  useEffect(() => {
    if (!slug) return;

    async function fetchSubCategoryData() {
      setLoading(true);
      try {
        const [subRes, cmsRes, newsRes, eventRes] = await Promise.all([
          getAllCapabilitySubCategories(),
          getAllSubcategoryCMS(),
          getAllNews(),
          getAllEvents(),
        ]);

        if (subRes?.data) {
          const allSubs = subRes.data;
          const selected = allSubs.find(
            (item) => createSlug(item.subcategoryName) === slug,
          );

          if (selected) {
            setSelectedSubCategory(selected);
            const currentSubId = Number(selected.id);
            const parentCatId = Number(selected.categoryId);

            // Fetch CMS Content
            if (cmsRes?.success && cmsRes.data) {
              const matchedCMS = cmsRes.data.find(
                (cms) => Number(cms.subcategoryId) === currentSubId,
              );
              setSubCmsData(matchedCMS || null);
            }

            const sameSubs = allSubs.filter(
              (item) =>
                Number(item.categoryId) === parentCatId &&
                Number(item.id) !== currentSubId,
            );
            setSameCategorySubs(sameSubs);

            const otherSubs = allSubs
              .filter((item) => Number(item.categoryId) !== parentCatId)
              .slice(0, 10); // Limit to 10 items
            setOtherCategorySubs(otherSubs);
          }
        }
        setNewsList(newsRes?.data || []);
        setEventsList(eventRes?.data || []);
      } catch (err) {
        console.error("Error fetching detail:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSubCategoryData();
  }, [slug]);

  if (loading)
    return (
      <div className="p-5 text-center">
        <div className="spinner-border text-warning"></div>
      </div>
    );
  if (!selectedSubCategory) return null;

  const bannerUrl = getImgUrl(selectedSubCategory.bannerImage);

  const isEventTab = activeTab === "Upcoming Events";
  const displayList = isEventTab
    ? eventsList.slice(0, 4)
    : newsList.slice(0, 4);

  return (
    <>
      <Head>
        <title>{selectedSubCategory.subcategoryName} | Core Law</title>
      </Head>

      {/* --- HERO SECTION --- */}
      <div
        className="d-flex align-items-center justify-content-center text-center text-white position-relative"
        style={{
          height: "420px",
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${bannerUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}>
        <div className="container">
          <h1 className="display-3 mb-5" style={{ fontFamily: "serif" }}>
            {selectedSubCategory.subcategoryName}
          </h1>
          <div className="d-flex justify-content-center gap-3">
            <button
              onClick={() => router.back()}
              className="btn rounded-0 px-4 py-2 fw-bold text-white border border-white"
              style={{ fontSize: "0.75rem" }}>
              &lt; BACK
            </button>
            <Link href="/attorneys">
              <a
                className="btn rounded-0 px-4 py-2 fw-bold text-white border border-white"
                style={{ fontSize: "0.75rem" }}>
                MEET THE TEAM &gt;
              </a>
            </Link>
          </div>
        </div>
      </div>

      {/* --- MIDDLE SECTION: CONTENT & SAME CATEGORY AREAS --- */}
      <div className="container py-5">
        <div className="row justify-content-end">
          <div className="col-lg-9">
            <div
              className="mb-5"
              style={{ fontSize: "1.05rem", lineHeight: "1.8", color: "#333" }}>
              <div
                dangerouslySetInnerHTML={{
                  __html: subCmsData
                    ? cleanHTML(
                        subCmsData.content || subCmsData.textEditorContent,
                      )
                    : cleanHTML(selectedSubCategory.description),
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- NEWS & EVENTS SECTION (DARK) --- */}
      <div className="py-5" style={{ backgroundColor: "#1a1a1a" }}>
        <div className="container py-4">
          <div className="row justify-content-end">
            <div className="col-lg-9">
              <h2
                className="display-5 text-white mb-5"
                style={{ fontFamily: "serif" }}>
                News & Events
              </h2>

              <div className="d-flex flex-wrap border-bottom border-secondary mb-5 pb-0 gap-4">
                {["News", "Upcoming Events"].map((tab) => (
                  <span
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`fw-bold pb-2 cursor-pointer ${activeTab === tab ? "text-white border-bottom border-3" : "text-white-50"}`}
                    style={{
                      cursor: "pointer",
                      borderColor:
                        activeTab === tab ? "#00a3e0" : "transparent",
                      fontSize: "0.9rem",
                    }}>
                    {tab}
                  </span>
                ))}
              </div>

              <div className="row">
                {displayList.map((item, idx) => (
                  <div key={idx} className="col-12 mb-5">
                    <div className="d-flex align-items-center mb-2">
                      <span className="text-uppercase small fw-bold text-white-50">
                        {new Date(
                          item.createdAt || item.startDate,
                        ).toLocaleDateString("en-US", {
                          month: "long",
                          day: "2-digit",
                          year: "numeric",
                        })}
                      </span>
                      <span className="mx-2 text-white-50 small">|</span>
                      <span className="text-uppercase small fw-bold text-white-50">
                        {isEventTab ? "EVENT" : "PRESS RELEASE"}
                      </span>
                    </div>

                    <div className="d-flex justify-content-between align-items-start">
                      <Link
                        href={`/${isEventTab ? "events" : "news"}/${createSlug(item.title)}`}>
                        <a className="text-decoration-none col-lg-9 p-0">
                          <h5 style={{ color: "#be9144", fontFamily: "serif" }}>
                            {item.title}
                          </h5>
                        </a>
                      </Link>
                      <div className="d-none d-md-flex align-items-center text-white-50 small mt-2">
                        <div
                          style={{
                            width: "30px",
                            height: "1px",
                            backgroundColor: "#444",
                            marginRight: "10px",
                          }}></div>
                        <span>
                          {isEventTab ? "View details" : "1 min read"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- BOTTOM SECTION: RELATED CAPABILITIES (Showing other subcategories) --- */}
      <div className="container py-5">
        <div className="row justify-content-end">
          <div className="col-lg-9">
            <h2
              className="display-5 mb-5"
              style={{ fontFamily: "serif", color: "#c0c0c0" }}>
              Related Capabilities
            </h2>
            <div className="row row-cols-1 row-cols-md-2 g-3">
              {otherCategorySubs.map((sub) => (
                <div key={sub.id} className="col d-flex align-items-baseline">
                  <span style={{ color: "#a67c33", marginRight: "10px" }}>
                    •
                  </span>
                  <Link
                    href={`/capability/area-detail/${createSlug(sub.subcategoryName)}`}>
                    <a
                      className="text-decoration-underline"
                      style={{ color: "#a67c33" }}>
                      {sub.subcategoryName}
                    </a>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
