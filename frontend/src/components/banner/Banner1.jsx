
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import {
  getAllCounters,
  getAllHomeBanners,
  getAllHomeData,
  getAllLogoTypes,
  getAllRanking,
  getImgUrl,
} from "../../services/authService";

const CountUp = ({ end, duration = 2000, start }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start || end === undefined || end === null) return;
    const finalValue = parseInt(end.toString().replace(/[^0-9]/g, ""), 10);
    if (isNaN(finalValue)) {
      setCount(end);
      return;
    }
    let startTime = null;
    let animationFrame;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOutQuad = progress * (2 - progress);
      const currentCount = Math.floor(easeOutQuad * finalValue);
      setCount(currentCount);
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(finalValue);
      }
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [start, end, duration]);

  return <>{count.toLocaleString()}</>;
};

function Banner1() {
  const [heroData, setHeroData] = useState(null);
  const [homeContent, setHomeContent] = useState(null);
  const [counters, setCounters] = useState(null);
  const [rankings, setRankings] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [heroStatsStart, setHeroStatsStart] = useState(false);
  const [footerStatsStart, setFooterStatsStart] = useState(false);

  const heroStatsRef = useRef(null);
  const footerStatsRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      try {
        const [typesRes, bannersRes, dataRes, counterRes, rankingRes] =
          await Promise.all([
            getAllLogoTypes(),
            getAllHomeBanners(),
            getAllHomeData(),
            getAllCounters(),
            getAllRanking(),
          ]);

        const types = typesRes.data?.data || typesRes.data || [];
        const allBanners = bannersRes.data?.data || bannersRes.data || [];
        const homeSections = dataRes.data?.data || dataRes.data || [];
        const counterSections = counterRes.data?.data || counterRes.data || [];
        const rankingSections = rankingRes.data?.data || rankingRes.data || [];

        if (counterSections.length > 0) setCounters(counterSections[0]);
        if (rankingSections.length > 0) setRankings(rankingSections[0]);

        const bannerTypeObj = types.find(
          (t) => t.type?.toLowerCase() === "banner",
        );
        if (bannerTypeObj) {
          const filteredBanners = allBanners.filter(
            (b) => Number(b.typeId) === Number(bannerTypeObj.id),
          );
          if (filteredBanners.length > 0) {
            setHeroData(filteredBanners.sort((a, b) => b.id - a.id)[0]);
          }
        }
        if (homeSections.length > 0) setHomeContent(homeSections[0]);
      } catch (error) {
        console.error("Data loading error:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const createObserver = (ref, setStart) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setStart(true);
        },
        { threshold: 0.1 },
      );
      if (ref.current) observer.observe(ref.current);
      return observer;
    };
    const obs1 = createObserver(heroStatsRef, setHeroStatsStart);
    const obs2 = createObserver(footerStatsRef, setFooterStatsStart);
    return () => {
      obs1.disconnect();
      obs2.disconnect();
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <>
      <div
        className="banner-section"
        style={{
          backgroundImage: heroData?.image
            ? `url("${getImgUrl(heroData.image)}")`
            : "",
        }}>
        <div className="container banner-content px-3">
          <div className="row justify-content-center m-0">
            <div className="col-lg-10 text-center">
              <div className="py-3 dynamic-hero-text">
                {heroData?.textEditor && heroData.textEditor !== "<p></p>" ? (
                  <div
                    className="custom-html-content"
                    dangerouslySetInnerHTML={{ __html: heroData.textEditor }}
                  />
                ) : (
                  <h1 className="text-white">Global Legal Excellence</h1>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-stats-bar" ref={heroStatsRef}>
        <div className="container">
          <div className="row text-center m-0">
            <div className="col-6 col-md-3 py-4 border-end-custom">
              <h2 className="text-gold fw-bold mb-0 display-6">
                <CountUp
                  end={counters?.consultationsNo}
                  start={heroStatsStart}
                />
                +
              </h2>
              <p className="text-white small mb-0 text-uppercase tracking-wide">
                {counters?.consultationsText || "Consultations"}
              </p>
            </div>
            <div className="col-6 col-md-3 py-4 border-end-custom">
              <h2 className="text-gold fw-bold mb-0 display-6">
                <CountUp
                  end={counters?.successRateCount}
                  start={heroStatsStart}
                />
                %
              </h2>
              <p className="text-white small mb-0 text-uppercase tracking-wide">
                {counters?.successRateText || "Success Rate"}
              </p>
            </div>
            <div className="col-6 col-md-3 py-4 border-end-custom">
              <h2 className="text-gold fw-bold mb-0 display-6">
                <CountUp
                  end={counters?.yearsExperienceCount}
                  start={heroStatsStart}
                />
                +
              </h2>
              <p className="text-white small mb-0 text-uppercase tracking-wide">
                {counters?.yearsExperienceText || "Years Experience"}
              </p>
            </div>
            <div className="col-6 col-md-3 py-4">
              <h2 className="text-gold fw-bold mb-0 display-6">
                <CountUp
                  end={counters?.attorneysCount}
                  start={heroStatsStart}
                />
                +
              </h2>
              <p className="text-white small mb-0 text-uppercase tracking-wide">
                {counters?.attorneysText || "Attorneys"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {[
        {
          img: "firstImage",
          txt: "firstTextEditor",
          bg: "bg-light",
          rev: false,
        },
        {
          img: "secondImage",
          txt: "secondTextEditor",
          bg: "bg-white",
          rev: true,
        },
        {
          img: "thirdImage",
          txt: "thirdTextEditor",
          bg: "bg-light",
          rev: false,
        },
        {
          img: "fourthImage",
          txt: "fourthTextEditor",
          bg: "bg-white",
          rev: true,
        },
      ].map((sec, idx) => (
        <div key={idx} className={`py-5 ${sec.bg}`}>
          <div className="container px-3">
            <div className="row g-0 card-shadow overflow-hidden bg-white align-items-stretch">
              <div
                className={`col-lg-6 ${sec.rev ? "order-lg-2 order-1" : ""}`}>
                <img
                  src={
                    homeContent?.[sec.img]
                      ? getImgUrl(homeContent[sec.img])
                      : ""
                  }
                  className="w-100 h-100 object-fit-cover"
                  style={{ minHeight: "420px" }}
                  alt=""
                />
              </div>
              <div
                className={`col-lg-6 d-flex align-items-center p-4 p-lg-5 ${sec.rev ? "order-lg-1 order-2" : ""}`}>
                <div className="dynamic-content-fix w-100">
                  {homeContent?.[sec.txt] && (
                    <div
                      dangerouslySetInnerHTML={{ __html: homeContent[sec.txt] }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="stats-section py-4" ref={footerStatsRef}>
        <div className="container text-center">
          {rankings?.textEditor ? (
            <div
              className="text-white mb-3 ranking-heading"
              dangerouslySetInnerHTML={{ __html: rankings.textEditor }}
            />
          ) : (
            <h2 className="text-white mb-3">
              Global scale with street smarts.
            </h2>
          )}
          <div className="row mt-4">
            <div className="col-md-3 col-6">
              <h3 className="text-white">
                <CountUp end={rankings?.rankingNo} start={footerStatsStart} />+
              </h3>
              <p className="text-gold">{rankings?.rankingText || "Ranking"}</p>
            </div>
            <div className="col-md-3 col-6">
              <h3 className="text-white">
                <CountUp end={rankings?.languageNo} start={footerStatsStart} />+
              </h3>
              <p className="text-gold">
                {rankings?.languageText || "Languages"}
              </p>
            </div>
            <div className="col-md-3 col-6">
              <h3 className="text-white">
                <CountUp end={rankings?.countrieNo} start={footerStatsStart} />
              </h3>
              <p className="text-gold">
                {rankings?.countrieText || "Countries"}
              </p>
            </div>
            <div className="col-md-3 col-6">
              <h3 className="text-white">
                <CountUp end={rankings?.locationNo} start={footerStatsStart} />
              </h3>
              <p className="text-gold">
                {rankings?.locationText || "Location"}
              </p>
            </div>
          </div>
          <div className="row mt-4 pt-3 m-0">
            <div className="col-12 text-center">
              <Link
                href="/location"
                className="btn btn-light btn-lg rounded-0 px-5 fw-bold">
                <a className="btn btn-light btn-lg rounded-0 px-5 fw-bold">
                  Explore Locations
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Banner1;