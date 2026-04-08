import React, { useEffect, useState } from "react";
import { getAllOurFirm, getImgUrl } from "../services/authService";

function OurFirm() {
  const [firmData, setFirmData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFirmData = async () => {
      try {
        const res = await getAllOurFirm();
        const dataArray = res?.data || [];
        if (Array.isArray(dataArray) && dataArray.length > 0) {
          setFirmData(dataArray[0]);
        }
      } catch (err) {
        console.error("Error fetching firm data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFirmData();
  }, []);

  if (loading)
    return (
      <div className="text-center py-5 my-5">
        <div className="spinner-border" style={{ color: "#c5a059" }}></div>
      </div>
    );

  if (!firmData)
    return <div className="text-center py-5 my-5">No firm data available.</div>;

  return (
    <div className="bg-white mt-5 pt-4">
      {/* 1. Hero Banner */}
      <section
        className="universal-banner"
        style={{
          backgroundImage: `url('${getImgUrl(firmData.bannerImage)}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "300px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}>
        <div
          className=""
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
          }}></div>
        <div
          className="container banner-content text-center"
          style={{ zIndex: 1 }}>
          <h1 className="display-4 fw-bold mb-2 text-uppercase font-serif text-white">
            Our Firm
          </h1>
        </div>
      </section>

      {/* 2. Innovation Section */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center g-0">
            <div className="col-md-6 pe-md-5 order-2 order-md-1">
              <div className="dynamic-content-fix">
                <span
                  className="fw-bold text-uppercase small mb-2 d-block"
                  style={{ color: "#c5a059" }}>
                  Innovation
                </span>
                <div
                  className="text-muted"
                  dangerouslySetInnerHTML={{
                    __html: firmData.innovationContent,
                  }}
                />
              </div>
            </div>

            <div className="col-md-6 order-1 order-md-2 mb-4 mb-md-0">
              <img
                src={getImgUrl(firmData.innovationImage)}
                className="img-fluid w-100 shadow-sm img-cover rounded"
                alt="Innovation"
                style={{ objectFit: "cover", height: "400px" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. People Section (Reversed) */}
      <section className="py-5" style={{ backgroundColor: "#f8f9fa" }}>
        <div className="container">
          <div className="row align-items-center g-0">
            <div className="col-md-6 mb-4 mb-md-0">
              <img
                src={getImgUrl(firmData.peopleImage)}
                className="img-fluid w-100 shadow-sm img-cover rounded"
                alt="People"
                style={{ objectFit: "cover", height: "400px" }}
              />
            </div>

            <div className="col-md-6 ps-md-5">
              <div className="dynamic-content-fix">
                <span
                  className="fw-bold text-uppercase small mb-2 d-block"
                  style={{ color: "#c5a059" }}>
                  Our People
                </span>
                <div
                  className="text-muted"
                  dangerouslySetInnerHTML={{ __html: firmData.peopleContent }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. History Section */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center g-0">
            <div className="col-md-6 pe-md-5 order-2 order-md-1">
              <div className="dynamic-content-fix">
                <span
                  className="fw-bold text-uppercase small mb-2 d-block"
                  style={{ color: "#c5a059" }}>
                  Our History
                </span>
                <div
                  className="text-muted"
                  dangerouslySetInnerHTML={{ __html: firmData.historyContent }}
                />
              </div>
            </div>
            <div className="col-md-6 order-1 order-md-2 mb-4 mb-md-0">
              <img
                src={getImgUrl(firmData.historyImage)}
                className="img-fluid w-100 shadow-sm img-cover rounded"
                alt="History"
                style={{ objectFit: "cover", height: "400px" }}
              />
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap");
        .font-serif {
          font-family: "Playfair Display", serif;
        }
        .dynamic-content-fix p {
          margin-bottom: 1rem;
          line-height: 1.7;
        }
      `}</style>
    </div>
  );
}

export default OurFirm;
