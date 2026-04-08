"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import * as authService from "../services/authService";

function Footer() {
  const router = useRouter();
  const [socialLinks, setSocialLinks] = useState(null);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [socialRes, cityRes] = await Promise.all([
          authService.getAllSocialMedia(),
          authService.getAllLocationCities(),
        ]);

        // Social Media
        if (socialRes?.success && socialRes?.data?.length > 0) {
          setSocialLinks(socialRes.data[0]);
        }

        // Cities (safe parsing)
        const allCities = cityRes?.data?.data || cityRes?.data || cityRes || [];

        setCities(Array.isArray(allCities) ? allCities : []);
      } catch (error) {
        console.error("Footer Data Error:", error);
      }
    };

    fetchData();
  }, []);

  const createSlug = (text) =>
    text
      ?.toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-");

  return (
    <>
      <footer className="footer-section pt-5">
        <div className="footer-top">
          <div className="container-xl container-lg-fluid container">
            <div className="row gy-5">
              {/* Column 1 */}
              <div className="col-lg-3 col-md-6">
                <div className="footer-about">
                  <img
                    src="/assets/images/brand-logo.png"
                    alt="NRIS Law Firm"
                  />
                  <p>
                    NRIS LAW FIRM
                    <br />
                    Attorney Advertising.
                    <br />
                    All rights reserved.
                  </p>

                  <ul className="footer-social gap-4">
                    <li>
                      <a
                        href={socialLinks?.facebookUrl || "#"}
                        target="_blank"
                        rel="noreferrer">
                        <i className="bx bxl-facebook" />
                      </a>
                    </li>
                    <li>
                      <a
                        href={socialLinks?.twitterUrl || "#"}
                        target="_blank"
                        rel="noreferrer">
                        <i className="bx bxl-twitter" />
                      </a>
                    </li>
                    <li>
                      <a
                        href={socialLinks?.instagramUrl || "#"}
                        target="_blank"
                        rel="noreferrer">
                        <i className="bx bxl-instagram" />
                      </a>
                    </li>
                    <li>
                      <a
                        href={socialLinks?.linkedinUrl || "#"}
                        target="_blank"
                        rel="noreferrer">
                        <i className="bx bxl-linkedin" />
                      </a>
                    </li>
                  </ul>

               
                </div>
              </div>

              {/* Column 2 */}
              <div className="col-lg-3 col-md-6 d-flex justify-content-lg-center">
                <div className="footer-item">
                  <h4>Important Links</h4>
                  <ul className="link-list">
                    <li>
                      <Link href="/attorneys">
                        <a className="footer-link">Professionals</a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/capability">
                        <a className="footer-link">Capabilities</a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/news">
                        <a className="footer-link">News</a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/contact">
                        <a className="footer-link">Contact Us</a>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Column 3 */}
              <div className="col-lg-3 col-md-6 d-flex justify-content-lg-center">
                <div className="footer-item">
                  <h4>Contact Us</h4>
                  <ul className="contact-list">
                    <li>
                      <div className="text">
                        <a href="#">Contact Us</a>
                        <a href="#" className="mb-0">
                          Global Offices
                        </a>
                      </div>
                    </li>
                    <li>
                      <div className="text">
                        <a href="#">Alumni Network</a>
                        <a href="#" className="mb-0">
                          info@nrislawfirm.com
                        </a>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Column 4 */}
              <div className="col-lg-3 col-md-6 d-flex justify-content-lg-end">
                <div className="footer-item">
                  <h4>Global Presence</h4>
                  <ul className="list-unstyled p-0 m-0 d-flex flex-wrap gap-2 text-white">
                    {cities.map((city, index) => (
                      <li key={city.id || city._id}>
                        <Link href={`/location/${createSlug(city.cityName)}`}>
                          <a className="text-white text-decoration-none hover-gold">
                            {city.cityName}
                            {index < cities.length - 1 ? "," : ""}
                          </a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mt-4">
          <div className="footer-bottom pt-4 pb-3">
            <div className="row d-flex align-items-center g-3">
              <div className="col-lg-4 d-flex justify-content-lg-start justify-content-center text-lg-start text-center">
                <p className="mb-0">©2025 NRIS LAW FIRM All rights reserved.</p>
              </div>
              <div className="col-lg-4 d-flex justify-content-center align-items-center">
                <ul className="f-bottom-list d-flex justify-content-center align-items-center mb-0">
                  <li>
                    <Link href="/term-condition">Terms of Use</Link>
                    <span className="mx-2">|</span>
                  </li>
                  <li>
                    <Link href="/private-policy">Privacy Notice</Link>
                    <span className="mx-2">|</span>
                  </li>
                  <li>
                    <Link href="#">Cookie Settings</Link>
                  </li>
                </ul>
              </div>
              <div className="col-lg-4 d-flex justify-content-lg-end justify-content-center text-lg-end text-center">
                <p className="mb-0">
                  Powered by <Link href="#">Cintrox</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
