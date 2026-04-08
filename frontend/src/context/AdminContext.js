"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import authService from "../services/authService"; // authService ko import karein
import api from "../services/api";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);

  const baseURL = authService.IMG_URL.endsWith("/")
    ? authService.IMG_URL
    : `${authService.IMG_URL}/`;

  const loadAdmin = useCallback(async () => {
    try {
      // API call to get profile
      const res = await api.get("/admin/getall-adminprofile");

      const data = Array.isArray(res.data) ? res.data[0] : res.data;

      if (data) {
        const fullProfilePath = data.profileImage
          ? `${baseURL}${data.profileImage.replace(/^\//, "")}`
          : null;

        const fullLogoPath = data.websiteLogo
          ? `${baseURL}${data.websiteLogo.replace(/^\//, "")}`
          : null;

        console.log("✅ Admin Data Loaded into Context:", data);

        setAdmin({
          ...data,
          profileImage: fullProfilePath,
          websiteLogo: fullLogoPath,
        });
      }
    } catch (err) {
      console.error("❌ Failed to load admin context:", err);
    }
  }, [baseURL]);

  useEffect(() => {
    loadAdmin();
  }, [loadAdmin]);

  return (
    <AdminContext.Provider value={{ admin, setAdmin, loadAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
