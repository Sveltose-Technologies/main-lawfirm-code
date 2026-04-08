import API from "./api";

export const IMG_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

console.log("DEBUG - IMG_URL is:", IMG_URL);
// ================= HELPER FUNCTIONS =================

const formatError = (error) => {
  console.error("Format Error Input:", error.response);
  if (typeof error === "string") return error;

  if (error.response?.data?.message) return error.response.data.message;
  if (error.response?.data?.error) return error.response.data.error;

  return error.message || "An unexpected error occurred";
};
export const getAdminId = () => {
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return user.id || user._id || null;
      } catch (error) {
        console.error("Error parsing user data", error);
        return null;
      }
    }
  }
  return null;
};

export const getImgUrl = (path) => {
  if (!path || path === "null" || path === "undefined") {
    return "";
  }

  if (/^(http|https|data:image|blob:)/i.test(path)) {
    return path;
  }

  let cleanPath = path
    .toString()
    .trim()
    .replace(/\\/g, "/") 
    .replace(/^\/+/, "") 
    .replace(/\/+$/, ""); 

  if (!cleanPath) return "";

  const uploadsSegment = "uploads/";
  const alreadyHasUploads = cleanPath.toLowerCase().startsWith(uploadsSegment);

  const finalRelativePath = alreadyHasUploads
    ? cleanPath
    : `${uploadsSegment}${cleanPath}`;

 
  const cleanBase = (IMG_URL || "").replace(/\/+$/, "");

  
  return `${cleanBase}/${finalRelativePath}`;
};

export const getCurrentUser = () => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
  return null;
};

export const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.clear();
    window.location.href = "/login-signup";
  }
};

// ================= CLIENT AUTHENTICATION =================

export const signupUser = async (payload) => {
  try {
    const response = await API.post("/client/signup", payload);
    return response.data;
  } catch (error) {
    throw formatError(error);
  }
};

export const verifyUserOtp = async (payload) => {
  try {
    const response = await API.post("/client/verify-otp", payload);
    return response.data;
  } catch (error) {
    throw formatError(error);
  }
};

export const loginUser = async (payload) => {
  try {
    const cleanPayload = {
      email: payload.email?.trim(),
      password: payload.password?.trim(),
    };
    const response = await API.post("/client/login", cleanPayload);
    return response.data;
  } catch (error) {
    throw formatError(error);
  }
};

export const forgotPassword = async (payload) => {
  try {
    const response = await API.post("/client/forgot-password", payload);
    return response.data;
  } catch (error) {
    throw formatError(error);
  }
};

export const verifyOtp = async (payload) => {
  try {
    const response = await API.post("/client/verify-otp", payload);
    return response.data;
  } catch (error) {
    throw formatError(error);
  }
};

export const resetPassword = async (payload) => {
  try {
    const response = await API.put("/client/reset-password", payload);
    return response.data;
  } catch (error) {
    throw formatError(error);
  }
};

// ================= CLIENT PROFILE API =================

export const getClientById = async (id) => {
  try {
    const response = await API.get(`/client/get-by-id/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateClientProfile = async (userId, formData) => {
  try {
    const response = await API.put(`/client/update/${userId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ================= ATTORNEY AUTHENTICATION =================

export const signupAttorney = async (payload) => {
  try {
    console.log("Sending Attorney Payload:", payload);
    const response = await API.post("/attorney/signup", payload);
    console.log("response", response);

    return response.data;
    console.log("response", response);
  } catch (error) {
    throw formatError(error);
  }
};

export const verifyAttorneyOtp = async (payload) => {
  try {
    const response = await API.post("/attorney/verify-otp", payload);
    return response.data;
  } catch (error) {
    throw formatError(error);
  }
};

export const loginAttorney = async (payload) => {
  try {
    const cleanPayload = {
      email: payload.email?.trim(),
      password: payload.password?.trim(),
    };
    const response = await API.post("/attorney/login", cleanPayload);
    return response.data;
  } catch (error) {
    throw formatError(error);
  }
};

export const getUserProfile = async (userId) => {
  try {
    const response = await API.get(`/attorney/get-by-id/${userId}`);
    return response.data;
  } catch (error) {
    throw formatError(error);
  }
};

export const forgotPasswordAttorney = async (payload) => {
  const response = await API.post("/attorney/forgot-password", payload);
  return response.data;
};

export const verifyOtpAttorney = async (payload) => {
  const response = await API.post("/attorney/verify-otp", payload);
  return response.data;
};

export const resetPasswordAttorney = async (payload) => {
  const response = await API.put("/attorney/reset-password", payload);
  return response.data;
};

// ================= ADMIN AUTH & OTP =================

export const adminLogin = async (email, password) => {
  try {
    localStorage.clear();
    const response = await API.post("/admin/login", {
      email: email.trim(),
      password: password.trim(),
    });

    const token =
      response.data?.token ||
      response.data?.admin?.token ||
      response.data?.data?.token;
    const adminData =
      response.data?.admin || response.data?.user || response.data?.data;

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(adminData));
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("role", "admin");
      return { success: true, data: response.data };
    }
    return { success: false, message: "Token not received from server" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};

export const adminForgotPassword = async (email) => {
  try {
    const response = await API.post("/admin/forgot-password", {
      email: email.trim(),
    });
    return { success: true, message: response.data?.message || "OTP sent" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};

export const adminVerifyOtp = async (email, otp) => {
  try {
    const response = await API.post("/admin/verify-otp", { email, otp });
    return { success: true, message: response.data?.message || "OTP verified" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};

export const adminResetPassword = async (
  email,
  newPassword,
  confirmPassword,
) => {
  try {
    const response = await API.post("/admin/reset-password", {
      email,
      newPassword,
      confirmPassword,
    });
    return { success: true, message: response.data?.message || "Success" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};

// ================= ADMIN PROFILE =================

export const getAdminProfile = async () => {
  try {
    const response = await API.get("/admin/getall-adminprofile");
    const data = response.data?.data || response.data;
    return Array.isArray(data) ? data[0] : data;
  } catch (error) {
    throw formatError(error);
  }
};

export const updateAdminProfile = async (id, formData) => {
  try {
    const response = await API.put(`/admin/update/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    localStorage.setItem(
      "user",
      JSON.stringify({ ...currentUser, ...response.data.data }),
    );
    return response.data;
  } catch (error) {
    throw formatError(error);
  }
};
// ================= CAPABILITY CATEGORY APIs =================

export const getAllCapabilityCategories = async () => {
  try {
    const response = await API.get("/capability-categories/get-all");
    console.log(" capability response", response.data);

    return response.data;
  } catch (error) {
    console.error("❌ Fetch Categories Error:", error);
    return { success: false, data: [] };
  }
};
export const createCapabilityCategory = async (formData) => {
  try {
    console.log("🚀 Creating New Category...");
    const response = await API.post("/capability-categories/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("✅ Create Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Create Category Error:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const updateCapabilityCategory = async (id, formData) => {
  try {
    console.log(`🚀 Updating Category ID: ${id}...`);
    const response = await API.put(
      `/capability-categories/update/${id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    console.log("✅ Update Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Update Category Error:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const deleteCapabilityCategory = async (id) => {
  try {
    console.log(`🚀 Deleting Category ID: ${id}`);
    const response = await API.delete(`/capability-categories/delete/${id}`);
    console.log("✅ Delete Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Delete Category Error:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

// ================= CAPABILITY SUBCATEGORY APIs =================

export const getAllCapabilitySubCategories = async () => {
  try {
    console.log("🚀 Fetching all Subcategories...");
    const response = await API.get(
      "/capability-subcategory/getall-subcategory",
    );
    console.log("✅ Subcategories fetched:", response.data);
    return { success: true, data: response.data.data || response.data || [] };
  } catch (error) {
    console.error("❌ SubCat API Error:", error);
    return { success: false, data: [] };
  }
};

export const createCapabilitySubCategory = async (formData) => {
  try {
    console.log("🚀 Creating New Subcategory...");
    const res = await API.post("/capability-subcategory/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("✅ Create Subcategory Response:", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ Create Subcategory Error:", error);
    throw error;
  }
};

export const updateCapabilitySubCategory = async (id, formData) => {
  try {
    console.log(`🚀 Updating Subcategory ID: ${id}`);
    const res = await API.put(
      `/capability-subcategory/update/${id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    console.log("✅ Update Subcategory Response:", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ Update Subcategory Error:", error);
    throw error;
  }
};

export const deleteCapabilitySubCategory = async (id) => {
  try {
    console.log(`🚀 Deleting Subcategory ID: ${id}`);
    const res = await API.delete(`/capability-subcategory/delete/${id}`);
    console.log("✅ Delete Subcategory Response:", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ Delete Subcategory Error:", error);
    throw error;
  }
};

// ================= CMS APIs =================

export const getAllCapabilityCategoryCMS = async () => {
  try {
    console.log("🚀 Fetching all Capability Category CMS Content...");
    const response = await API.get("/cms-category/getall");
    console.log("✅ Category CMS Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Category CMS API Error:", error);
    return { success: false, data: [] };
  }
};

export const getAllCMSCategories = async () => {
  try {
    console.log("🚀 Calling CMS Category getAll...");
    const response = await API.get("/cms-category/getall");
    console.log("✅ CMS Category Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ CMS Category API Error:", error);
    throw error;
  }
};

export const createCMSCategory = async (data) => {
  try {
    console.log("🚀 Creating CMS Category Content:", data);
    const response = await API.post("/cms-category/create", data);
    console.log("✅ CMS Category Create Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Create CMS Category Error:", error);
    throw error;
  }
};

export const updateCMSCategory = async (id, data) => {
  try {
    console.log(`🚀 Updating CMS Category Content ID: ${id}`, data);
    const response = await API.put(`/cms-category/update/${id}`, data);
    console.log("✅ CMS Category Update Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Update CMS Category Error:", error);
    throw error;
  }
};

export const deleteCMSCategory = async (id) => {
  try {
    console.log(`🚀 Deleting CMS Category Content ID: ${id}`);
    const response = await API.delete(`/cms-category/delete/${id}`);
    console.log("✅ CMS Category Delete Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Delete CMS Category Error:", error);
    throw error;
  }
};

// ================= CMS SUBCATEGORY APIs =================

/**
 * Fetch all CMS entries for subcategory detail pages
 */
export const getAllCMSSubcategories = async () => {
  try {
    console.log("🚀 Fetching all CMS Subcategory entries...");
    const response = await API.get("/cms-subcategory/getall");
    console.log("✅ CMS Subcategory entries fetched:", response.data);
    return { success: true, data: response.data?.data || response.data || [] };
  } catch (error) {
    console.error(
      "❌ Fetch CMS Subcategory Error:",
      error.response?.data || error.message,
    );
    return { success: false, data: [] };
  }
};

/**
 * Create a new CMS entry for a subcategory
 */
export const createCMSSubcategory = async (payload) => {
  try {
    console.log("🚀 Creating New CMS Subcategory entry:", payload);
    const response = await API.post("/cms-subcategory/create", payload);
    console.log("✅ CMS Subcategory Created:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Create CMS Subcategory Error:",
      error.response?.data || error.message,
    );
    throw error.response?.data || error;
  }
};

/**
 * Update an existing CMS entry for a subcategory
 */
export const updateCMSSubcategory = async (id, payload) => {
  try {
    console.log(`🚀 Updating CMS Subcategory ID: ${id}`, payload);
    const response = await API.put(`/cms-subcategory/update/${id}`, payload);
    console.log("✅ CMS Subcategory Updated:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Update CMS Subcategory Error:",
      error.response?.data || error.message,
    );
    throw error.response?.data || error;
  }
};

/**
 * Delete a CMS entry for a subcategory
 */
export const deleteCMSSubcategory = async (id) => {
  try {
    console.log(`🚀 Deleting CMS Subcategory ID: ${id}`);
    const response = await API.delete(`/cms-subcategory/delete/${id}`);
    console.log("✅ CMS Subcategory Deleted:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Delete CMS Subcategory Error:",
      error.response?.data || error.message,
    );
    throw error.response?.data || error;
  }
};

// authService.js

// ================= CMS SUBCATEGORY APIs =================

/**
 * Fetch all CMS entries for subcategory detail pages
 */
export const getAllSubcategoryCMS = async () => {
  try {
    console.log("🚀 Fetching all Subcategory CMS Content...");
    const response = await API.get("/cms-subcategory/getall");
    console.log("✅ Subcategory CMS fetched:", response.data);

    // Response handling based on your data structure
    return {
      success: true,
      data: response.data?.data || response.data || [],
    };
  } catch (error) {
    console.error(
      "❌ Fetch Subcategory CMS Error:",
      error.response?.data || error.message,
    );
    return { success: false, data: [] };
  }
};

// ================= OUR FIRM APIs =================

export const getAllOurFirm = async () => {
  try {
    console.log("🚀 Fetching all Our Firm records...");
    const response = await API.get("/ourfirm/getall");
    console.log("✅ Our Firm Response:", response.data);
    const data = response.data?.data || response.data || [];
    return { success: true, data: Array.isArray(data) ? data : [data] };
  } catch (error) {
    console.error("❌ Our Firm Fetch Error:", error);
    return { success: false, data: [] };
  }
};

export const createOurFirm = async (formData) => {
  try {
    console.log("🚀 Creating New Our Firm record...");
    const res = await API.post("/ourfirm/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("✅ Our Firm Create Success:", res.data);
    return { success: true, data: res.data };
  } catch (error) {
    console.error("❌ Create Our Firm Error:", error);
    throw error;
  }
};

export const updateOurFirm = async (id, formData) => {
  try {
    console.log(`🚀 Updating Our Firm record ID: ${id}`);
    const res = await API.put(`/ourfirm/update/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("✅ Our Firm Update Success:", res.data);
    return { success: true, data: res.data };
  } catch (error) {
    console.error("❌ Update Our Firm Error:", error);
    throw error;
  }
};

export const deleteOurFirm = async (id) => {
  try {
    console.log(`🚀 Deleting Our Firm record ID: ${id}`);
    const res = await API.delete(`/ourfirm/delete/${id}`);
    console.log("✅ Our Firm Delete Success:", res.data);
    return { success: true, data: res.data };
  } catch (error) {
    console.error("❌ Delete Our Firm Error:", error);
    throw error;
  }
};

// ================= AWARDS APIs =================

export const getAllAwards = async () => {
  try {
    console.log("🚀 Fetching all Awards...");
    const response = await API.get("/award/getall");
    console.log("✅ Awards Response:", response.data);
    let data = [];
    if (Array.isArray(response.data)) {
      data = response.data;
    } else if (response.data?.data) {
      data = response.data.data;
    } else if (response.data?.awards) {
      data = response.data.awards;
    }
    return { success: true, data };
  } catch (error) {
    console.error("❌ Awards Fetch Error:", error);
    return { success: false, data: [] };
  }
};

export const createAward = async (formData) => {
  try {
    console.log("🚀 Creating New Award...");
    const res = await API.post("/award/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("✅ Award Create Success:", res.data);
    return { success: true, data: res.data };
  } catch (error) {
    console.error("❌ Create Award Error:", error);
    return { success: false, message: "Create failed" };
  }
};

export const updateAward = async (id, formData) => {
  try {
    console.log(`🚀 Updating Award ID: ${id}`);
    const res = await API.put(`/award/update/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("✅ Award Update Success:", res.data);
    return { success: true, data: res.data };
  } catch (error) {
    console.error("❌ Update Award Error:", error);
    return { success: false, message: "Update failed" };
  }
};

export const deleteAward = async (id) => {
  try {
    console.log(`🚀 Deleting Award ID: ${id}`);
    const res = await API.delete(`/award/delete/${id}`);
    console.log("✅ Award Delete Success:", res.data);
    return { success: true, data: res.data };
  } catch (error) {
    console.error("❌ Delete Award Error:", error);
    return { success: false, message: "Delete failed" };
  }
};

export const getAllPromoters = async () => {
  try {
    const res = await API.get("/promoter/getall");
    // Standardizing the response data format
    const data = res.data?.data || res.data?.promoters || res.data || [];
    return { success: true, data };
  } catch (error) {
    console.error(
      "Fetch Promoters Error:",
      error.response?.data || error.message,
    );
    return { success: false, data: [] };
  }
};

/**
 * Create a new promoter with images
 */
export const createPromoter = async (formData) => {
  try {
    const res = await API.post("/promoter/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return { success: true, data: res.data };
  } catch (error) {
    // 500 Error details logged here
    console.error(
      "Create Promoter Error:",
      error.response?.data || error.message,
    );
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Server Error: Unable to create promoter",
    };
  }
};

/**
 * Update an existing promoter by ID
 */
export const updatePromoter = async (id, formData) => {
  try {
    const res = await API.put(`/promoter/update/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return { success: true, data: res.data };
  } catch (error) {
    console.error(
      "Update Promoter Error:",
      error.response?.data || error.message,
    );
    return { success: false, message: "Update failed" };
  }
};

/**
 * Delete a promoter by ID
 */
export const deletePromoter = async (id) => {
  try {
    const res = await API.delete(`/promoter/delete/${id}`);
    return { success: true, data: res.data };
  } catch (error) {
    console.error(
      "Delete Promoter Error:",
      error.response?.data || error.message,
    );
    return { success: false, message: "Delete failed" };
  }
};
// ================= NEWS APIs =================

export const getAllNews = async () => {
  try {
    console.log("🚀 Fetching all News...");
    const response = await API.get("/news/getall");
    let data =
      response.data?.data || response.data?.news || response.data || [];
    console.log("✅ News fetched:", data);
    return { success: true, data };
  } catch (error) {
    console.error("❌ Get News Error:", error);
    return { success: false, data: [] };
  }
};

export const createNews = async (formData) => {
  try {
    console.log("🚀 Creating New News Article...");
    const response = await API.post("/news/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("✅ News Create Success:", response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("❌ Create News Error:", error);
    throw error;
  }
};

export const updateNews = async (id, formData) => {
  try {
    console.log(`🚀 Updating News ID: ${id}`);
    const response = await API.put(`/news/update/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("✅ News Update Success:", response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("❌ Update News Error:", error);
    throw error;
  }
};

export const deleteNews = async (id) => {
  try {
    console.log(`🚀 Deleting News ID: ${id}`);
    const response = await API.delete(`/news/delete/${id}`);
    console.log("✅ News Delete Success:", response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("❌ Delete News Error:", error);
    throw error;
  }
};

// ================= EVENTS APIs =================

export const getAllEvents = async () => {
  try {
    const response = await API.get("/event/getall");
    const data =
      response.data?.events || response.data?.data || response.data || [];
    return { success: true, data: Array.isArray(data) ? data : [] };
  } catch (error) {
    console.error("❌ getAllEvents Error:", error);
    return { success: false, data: [] };
  }
};

export const getBanner = async () => {
  try {
    const response = await API.get("/event-banner/get-all");
    const data =
      response.data?.banner || response.data?.data || response.data || [];
    return { success: true, data: Array.isArray(data) ? data : [] };
  } catch (error) {
    console.error("❌ getBanner Error:", error);
    return { success: false, data: [] };
  }
};
// create event banner
export const createBannerEvent = async (formData) => {
  try {
    console.log("Creating banner Event...p", formData);
    const response = await API.post("/event-banner/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("Event banner Create Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Create Event Error:", error);
    throw error;
  }
};
export const updateBannerEvent = async (id, formData) => {
  try {
    console.log(`🚀 Updating Event ID: ${id}`);
    const response = await API.put(`/event-banner/update/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("✅ Event Update Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Update Event Error:", error);
    throw error;
  }
};
export const deleteBannerEvent = async (id) => {
  try {
    console.log(`🚀 Deleting Event ID: ${id}`);
    const response = await API.delete(`/event-banner/delete/${id}`);
    console.log("✅ Event Delete Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Delete Event Error:", error);
    throw error;
  }
};

export const createEvent = async (formData) => {
  try {
    console.log("🚀 Creating New Event...p", formData);
    const response = await API.post("/event/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("✅ Event Create Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Create Event Error:", error);
    throw error;
  }
};

export const updateEvent = async (id, formData) => {
  try {
    console.log(`🚀 Updating Event ID: ${id}`);
    const response = await API.put(`/event/update/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("✅ Event Update Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Update Event Error:", error);
    throw error;
  }
};

export const deleteEvent = async (id) => {
  try {
    console.log(`🚀 Deleting Event ID: ${id}`);
    const response = await API.delete(`/event/delete/${id}`);
    console.log("✅ Event Delete Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Delete Event Error:", error);
    throw error;
  }
};

// ================= CAREERS APIs =================
export const getAllCareers = async () => {
  try {
    const response = await API.get("/career/get-all");
    // API returns { count, jobs: [...] } or similar structure
    console.log("✅ Countries fetched successfully:", response.data);
    const data =
      response.data?.jobs || response.data?.data || response.data || [];
    return { success: true, data: Array.isArray(data) ? data : [] };
  } catch (error) {
    console.error("❌ Get Careers Error:", error);
    return { success: false, data: [] };
  }
};

// ================= CAREERS APIs =================

export const createCareer = async (payload) => {
  try {
    // 🚀 Check payload in console
    console.log("🚀 [AuthService] Sending CREATE Career (JSON):", payload);

    // FIX: Removed 'multipart/form-data' headers because we are sending JSON object
    const res = await API.post("/career/create", payload);

    console.log("✅ [AuthService] Career Created Success:", res.data);
    return { success: true, data: res.data };
  } catch (error) {
    console.error(
      "❌ [AuthService] CREATE Career Error:",
      error.response?.data || error.message,
    );
    const msg = error.response?.data?.message || "Internal Server Error";
    return { success: false, message: msg };
  }
};

export const updateCareer = async (id, payload) => {
  try {
    console.log(
      `🚀 [AuthService] Sending UPDATE Career ID: ${id} (JSON):`,
      payload,
    );

    // FIX: Removed 'multipart/form-data' headers
    const res = await API.put(`/career/update/${id}`, payload);

    console.log("✅ [AuthService] Career Updated Success:", res.data);
    return { success: true, data: res.data };
  } catch (error) {
    console.error(
      "❌ [AuthService] UPDATE Career Error:",
      error.response?.data || error.message,
    );
    return {
      success: false,
      message: error.response?.data?.message || "Update failed",
    };
  }
};

export const deleteCareer = async (id) => {
  try {
    const res = await API.delete(`/career/delete/${id}`);
    return { success: true, data: res.data };
  } catch (error) {
    return { success: false, message: "Delete failed" };
  }
};
// ================= LOCATION COUNTRY APIs =================

export const getAllCountries = async () => {
  try {
    console.log("🚀 Fetching all countries...");
    const response = await API.get("/location-country/getall");
    console.log("✅ Countries fetched successfully:", response.data);
    const data = response.data?.data || response.data || [];
    return { success: true, data: Array.isArray(data) ? data : [] };
  } catch (error) {
    console.error(
      "❌ Fetch Countries Error:",
      error.response?.data || error.message,
    );
    return { success: false, data: [] };
  }
};

/**
 * Create a new country
 */
export const createLocationCountry = async (payload) => {
  try {
    console.log("🚀 Creating new Location Country:", payload);
    const response = await API.post("/location-country/create", payload);
    console.log("✅ Country created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Create Country Error:",
      error.response?.data || error.message,
    );
    throw error.response?.data || error;
  }
};

/**
 * Update an existing country
 */
export const updateLocationCountry = async (id, payload) => {
  try {
    console.log(`🚀 Updating Location Country ID: ${id}`, payload);
    const response = await API.put(`/location-country/update/${id}`, payload);
    console.log("✅ Country updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Update Country Error:",
      error.response?.data || error.message,
    );
    throw error.response?.data || error;
  }
};

/**
 * Delete a country
 */
export const deleteLocationCountry = async (id) => {
  try {
    console.log(`🚀 Deleting Location Country ID: ${id}`);
    const response = await API.delete(`/location-country/delete/${id}`);
    console.log("✅ Country deleted successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Delete Country Error:",
      error.response?.data || error.message,
    );
    throw error.response?.data || error;
  }
};

// ================= LOCATION CITY APIs =================

/**
 * Fetch all cities
 */

/**
 * Update an existing city (Uses FormData for Image Upload)
 */
export const updateLocationCity = async (id, formData) => {
  try {
    console.log(`🚀 Updating Location City ID: ${id} (FormData)...`);
    const response = await API.put(`/location-city/update/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("✅ City updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Update City Error:",
      error.response?.data || error.message,
    );
    throw error.response?.data || error;
  }
};

/**
 * Delete a city
 */
export const deleteLocationCity = async (id) => {
  try {
    console.log(`🚀 Deleting Location City ID: ${id}`);
    const response = await API.delete(`/location-city/delete/${id}`);
    console.log("✅ City deleted successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Delete City Error:",
      error.response?.data || error.message,
    );
    throw error.response?.data || error;
  }
};

export const getAllLocationCountries = async () => {
  try {
    console.log("🚀 Fetching Location Country records...");
    const response = await API.get("/location-country/getall");
    console.log("✅ Location Countries fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Location Country API Error:", error);
    return { success: false, data: [] };
  }
};

export const getAllCities = async () => {
  try {
    console.log("🚀 Fetching all cities...");
    const res = await API.get("/location-city/getall");
    console.log("✅ Cities response:", res.data);
    const data = res.data?.data || res.data || [];
    return { success: true, data: Array.isArray(data) ? data : [] };
  } catch (error) {
    console.error("❌ Get Cities Error:", error);
    return { success: false, data: [] };
  }
};

export const getAllLocationCities = async () => {
  try {
    console.log("🚀 Fetching Location City records...");
    const response = await API.get("/location-city/getall");
    console.log("✅ Location Cities fetched:", response.data);
    const data = response.data?.data || response.data || [];
    return { success: true, data: Array.isArray(data) ? data : [] };
  } catch (error) {
    console.error("❌ Location City API Error:", error);
    return { success: false, data: [] };
  }
};

export const createLocationCity = async (formData) => {
  try {
    // Automatically append adminId if not already present in formData
    if (!formData.has("adminId")) {
      formData.append("adminId", getAdminId());
    }

    const res = await API.post("/location-city/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ================= LOCATION MAIN (BANNER) APIs =================

export const createLocation = async (formData) => {
  try {
    // Kyunki isme image (bannerImage) hai, isliye FormData use hoga
    const response = await API.post("/location/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getAllLocations = async () => {
  try {
    const response = await API.get("/location/get-all");
    return response.data;
  } catch (error) {
    console.error("❌ Get All Locations Error:", error);
    return { success: false, data: [] };
  }
};

export const getLocationById = async (id) => {
  const response = await API.get(`/location/get-by-id/${id}`);
  return response.data;
};

export const updateLocation = async (id, formData) => {
  try {
    const response = await API.put(`/location/update/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteLocation = async (id) => {
  try {
    const response = await API.delete(`/location/delete/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
export const getAllLocationCMS = async () => {
  try {
    console.log("🚀 Fetching Location CMS records...");
    const res = await API.get("/location-cms/getall");
    console.log("✅ Location CMS fetched:", res.data);
    return { success: true, data: res.data };
  } catch (error) {
    console.error("❌ Location CMS Error:", error);
    return { success: false, message: "Failed to fetch CMS" };
  }
};

/**
 * Create a new Location CMS record
 */
export const createLocationCMS = async (payload) => {
  try {
    console.log("🚀 Creating new Location CMS record:", payload);
    const res = await API.post("/location-cms/create", payload);
    console.log("✅ Location CMS created successfully:", res.data);
    return res.data;
  } catch (error) {
    console.error(
      "❌ Create Location CMS Error:",
      error.response?.data || error.message,
    );
    throw error.response?.data || error;
  }
};

/**
 * Update an existing Location CMS record
 */
export const updateLocationCMS = async (id, payload) => {
  try {
    console.log(`🚀 Updating Location CMS record ID: ${id}`, payload);
    const res = await API.put(`/location-cms/update/${id}`, payload);
    console.log("✅ Location CMS updated successfully:", res.data);
    return res.data;
  } catch (error) {
    console.error(
      "❌ Update Location CMS Error:",
      error.response?.data || error.message,
    );
    throw error.response?.data || error;
  }
};

/**
 * Delete a Location CMS record
 */
export const deleteLocationCMS = async (id) => {
  try {
    console.log(`🚀 Deleting Location CMS record ID: ${id}`);
    const res = await API.delete(`/location-cms/delete/${id}`);
    console.log("✅ Location CMS deleted successfully:", res.data);
    return { success: true, data: res.data };
  } catch (error) {
    console.error(
      "❌ Delete Location CMS Error:",
      error.response?.data || error.message,
    );
    throw error.response?.data || error;
  }
};
// ================= CONTACT & INQUIRY =================

export const createContactInquiry = async (formData) => {
  try {
    console.log("🚀 Submitting Contact Inquiry...", formData);
    const response = await API.post("/contact/create", formData);
    console.log("✅ Inquiry Submit Success:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Submit Inquiry Error:", error);
    throw error;
  }
};

export const getAllContacts = async () => {
  try {
    console.log("🚀 Fetching all Contact inquiries...");
    const res = await API.get("/contact/getall");
    console.log("✅ Contacts fetched:", res.data);
    return { success: true, data: res.data };
  } catch (error) {
    console.error("❌ Get Contacts Error:", error);
    throw error;
  }
};

// ... existing code

export const updateContact = async (id, data) => {
  try {
    const response = await API.put(`/contact/update/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteContact = async (id) => {
  try {
    const response = await API.delete(`/contact/delete/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// --- Contact Page Text Methods ---

export const getContactText = async () => {
  try {
    const res = await API.get("/contact-text/get-all");
    return { success: true, data: res.data };
  } catch (error) {
    console.error("❌ Get Contact Text Error:", error);
    throw error;
  }
};

export const createContactText = async (data) => {
  try {
    const response = await API.post("/contact-text/create", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateContactText = async (id, data) => {
  try {
    // URL format: /contact-text/update/:id
    const response = await API.put(`/contact-text/update/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteContactText = async (id) => {
  try {
    // URL format: /contact-text/delete/:id
    const response = await API.delete(`/contact-text/delete/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
// ================= CLIENT MANAGEMENT =================

// services/authService.js

export const getAllClients = async () => {
  try {
    const response = await API.get("/client/getall");
    console.log("✅ API Success /client/getall:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Get Clients Error:",
      error.response?.data || error.message,
    );
    throw error;
  }
};
export const updateClient = async (id, payload) => {
  try {
    console.log(`🚀 Updating Client ID: ${id}`, payload);
    const response = await API.put(`/client/update/${id}`, payload);
    console.log("✅ Update Client Success:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Update Client Error:",
      error.response?.data || error.message,
    );
    throw error.response?.data || error;
  }
};

export const deleteClient = async (id) => {
  try {
    console.log(`🚀 Deleting Client ID: ${id}`);
    const response = await API.delete(`/client/delete/${id}`);
    console.log("✅ Delete Client Success:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Delete Client Error:",
      error.response?.data || error.message,
    );
    throw error.response?.data || error;
  }
};

// ================= ATTORNEY MANAGEMENT =================

export const getAllAttorneys = async () => {
  try {
    console.log("🚀 Fetching All Attorneys...");
    const response = await API.get("/attorney/getall");
    console.log("✅ Attorneys fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Get Attorneys Error:",
      error.response?.data || error.message,
    );
    throw error.response?.data || error;
  }
};

export const deleteAttorney = async (id) => {
  try {
    console.log(`🚀 Deleting Attorney ID: ${id}`);
    const response = await API.delete(`/attorney/delete/${id}`);
    console.log("✅ Delete Attorney Success:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Delete Attorney Error:",
      error.response?.data || error.message,
    );
    throw error.response?.data || error;
  }
};

// Add this to your authService.js
export const updateAttorney = async (userId, payload) => {
  try {
    console.log("🚀 Updating Attorney Profile for ID:", userId);
    // Use PUT /attorney/update/:id
    const response = await API.put(`/attorney/update/${userId}`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Update Error:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};
// ================= TERMS & CONDITIONS APIs =================

/**
 * Fetch all Terms & Conditions
 */
export const getAllTermsConditions = async () => {
  try {
    console.log("🚀 Fetching all Terms & Conditions...");
    const response = await API.get("/terms-condition/getall");
    console.log("✅ Terms & Conditions fetched:", response.data);

    // Returning structured data based on your log: { success: true, data: Array(1) }
    return {
      success: true,
      data: response.data?.data || response.data || [],
    };
  } catch (error) {
    console.error(
      "❌ Fetch Terms Error:",
      error.response?.data || error.message,
    );
    return { success: false, data: [] };
  }
};

/**
 * Create new Terms & Conditions
 */
export const createTermsCondition = async (payload) => {
  try {
    console.log("🚀 Creating new Terms & Conditions:", payload);
    const response = await API.post("/terms-condition/create", payload);
    console.log("✅ Terms & Conditions created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Create Terms Error:",
      error.response?.data || error.message,
    );
    throw error.response?.data || error;
  }
};

/**
 * Update existing Terms & Conditions
 */
export const updateTermsCondition = async (id, payload) => {
  try {
    console.log(`🚀 Updating Terms & Conditions ID: ${id}`, payload);
    const response = await API.put(`/terms-condition/update/${id}`, payload);
    console.log("✅ Terms & Conditions updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Update Terms Error:",
      error.response?.data || error.message,
    );
    throw error.response?.data || error;
  }
};

/**
 * Delete Terms & Conditions entry
 */
export const deleteTermsCondition = async (id) => {
  try {
    console.log(`🚀 Deleting Terms & Conditions ID: ${id}`);
    const response = await API.delete(`/terms-condition/delete/${id}`);
    console.log("✅ Terms & Conditions deleted successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Delete Terms Error:",
      error.response?.data || error.message,
    );
    throw error.response?.data || error;
  }
};

/**
 * Fetch all Privacy Policies
 */
// --- Privacy Policy API ---
export const getAllPrivacyPolicy = async () => {
  try {
    const response = await API.get("/privacy-policy/getall");
    console.log("Privacy Policy API Response:", response);
    return response.data;
  } catch (error) {
    console.error("Privacy Policy API Error:", error);
    return { success: false, data: [] };
  }
};

/**
 * Create Privacy Policy
 */
export const createPrivacyPolicy = async (payload) => {
  try {
    console.log("🚀 Creating Privacy Policy:", payload);
    const response = await API.post("/privacy-policy/create", payload);
    console.log("✅ Privacy Policy created:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Create Privacy Error:",
      error.response?.data || error.message,
    );
    throw error.response?.data || error;
  }
};

/**
 * Update Privacy Policy
 */
export const updatePrivacyPolicy = async (id, payload) => {
  try {
    console.log(`🚀 Updating Privacy Policy ID: ${id}`, payload);
    const response = await API.put(`/privacy-policy/update/${id}`, payload);
    console.log("✅ Privacy Policy updated:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Update Privacy Error:",
      error.response?.data || error.message,
    );
    throw error.response?.data || error;
  }
};

/**
 * Delete Privacy Policy
 */
export const deletePrivacyPolicy = async (id) => {
  try {
    console.log(`🚀 Deleting Privacy Policy ID: ${id}`);
    const response = await API.delete(`/privacy-policy/delete/${id}`);
    console.log("✅ Privacy Policy deleted:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Delete Privacy Error:",
      error.response?.data || error.message,
    );
    throw error.response?.data || error;
  }
};

// ================= PROFESSIONAL SERVICES =================

export const getAllProfessionals = async () => {
  try {
    console.log("🚀 Fetching All Professionals (Attorneys)...");
    const response = await API.get("/professionals/get-all");
    console.log("✅ Professionals fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching professionals:", error);
    return { success: false, data: [] };
  }
};

// services/authService.js update karein

export const createProfessional = async (data) => {
  // Headers override karne ke liye config yahan pass karein
  const response = await API.post("/professionals/create", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateProfessional = async (id, data) => {
  const response = await API.put(`/professionals/update/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteProfessional = async (id) => {
  const response = await API.delete(`/professionals/delete/${id}`);
  return response.data;
};
// ================= CAPABILITIES SERVICES =================

export const getAllCapabilities = async () => {
  const response = await API.get("/capability/getall");
  return response.data;
};

export const createCapability = async (data) => {
  const response = await API.post("/capability/create", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateCapability = async (id, data) => {
  const response = await API.put(`/capability/update/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteCapability = async (id) => {
  const response = await API.delete(`/capability/delete/${id}`);
  return response.data;
};

// ================= SOCIAL MEDIA SERVICES =================

export const getAllSocialMedia = async () => {
  const response = await API.get("/social-media/get-all");
  return response.data;
};

export const createSocialMedia = async (data) => {
  const response = await API.post("/social-media/create", data);
  return response.data;
};

export const updateSocialMedia = async (id, data) => {
  const response = await API.put(`/social-media/update/${id}`, data);
  return response.data;
};

export const deleteSocialMedia = async (id) => {
  const response = await API.delete(`/social-media/delete/${id}`);
  return response.data;
};

// Logo Type API
export const createLogoType = (data) => API.post("/logo-type/create", data);
export const getAllLogoTypes = () => API.get("/logo-type/get-all");
export const updateLogoType = (id, data) =>
  API.put(`/logo-type/update/${id}`, data);
export const deleteLogoType = (id) => API.delete(`/logo-type/delete/${id}`);

// Home Banner API
export const createHomeBanner = (formData) =>
  API.post("/home-banner/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const getAllHomeBanners = () => API.get("/home-banner/get-all");
export const updateHomeBanner = (id, formData) =>
  API.put(`/home-banner/update/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteHomeBanner = (id) => API.delete(`/home-banner/delete/${id}`);

// Home Data API
export const createHomeData = (formData) =>
  API.post("/home-data/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const getAllHomeData = () => API.get("/home-data/get-all");
export const updateHomeData = (id, formData) =>
  API.put(`/home-data/update/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteHomeData = (id) => API.delete(`/home-data/delete/${id}`);

// Home Counter API
export const createCounters = (formData) =>
  API.post("/home-count/create", formData);
export const getAllCounters = () => API.get("home-count/getall");
export const updateCounters = (id, formData) =>
  API.put(`/home-count/update/${id}`, formData);
export const deleteCountData = (id) => API.delete(`/home-count/delete/${id}`);

// Home Ranking API
export const createRanking = (formData) =>
  API.post("/home-ranking/create", formData);
export const getAllRanking = () => API.get("/home-ranking/getall");
export const deleteRankData = (id) => API.delete(`/home-ranking/delete/${id}`);
export const updateRanking = (id, formData) =>
  API.put(`/home-ranking/update/${id}`, formData);

export const getAllAdmissions = async () => {
  try {
    const response = await API.get("/attorney/getall-admission");
    return response.data;
  } catch (error) {
    console.error("Error fetching admissions:", error);
    return { data: [] };
  }
};

export const getAllEducations = async () => {
  try {
    const response = await API.get("/attorney/getall-education");
    return response.data;
  } catch (error) {
    console.error("Error fetching educations:", error);
    return { data: [] };
  }
};
// Home All Languages
export const getAttorneylanguages = async () => {
  try {
    console.log("Fetching All Languages...");
    const response = await API.get("/languages/get-all");
    const data = response.data || response.data;
    console.log("data Testing", data);

    return data;
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw error;
  }
};

// Home All Location
export const getAttorneyLocation = async () => {
  try {
    console.log("Fetching All Languages...");
    const response = await API.get("/languages/get-all");
    const data = response.data || response.data;
    return data;
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw error;
  }
};

// ================= CASE CATEGORIES API =================

export const createCaseCategory = async (payload) => {
  try {
    const adminId = getAdminId(); // Using the helper from your file
    const data = { ...payload, adminId };
    console.log("🚀 Creating Case Category:", data);
    const response = await API.post("/casecategories/create", data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Create Category Error:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const getAllCaseCategories = async () => {
  try {
    console.log("🚀 Fetching All Case Categories");
    const response = await API.get("/casecategories/get-all");
    return response.data;
  } catch (error) {
    console.error(
      "❌ Get Categories Error:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const updateCaseCategory = async (id, payload) => {
  try {
    console.log(`🚀 Updating Case Category ID: ${id}`, payload);
    const response = await API.put(`/casecategories/update/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Update Category Error:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const deleteCaseCategory = async (id) => {
  try {
    console.log(`🚀 Deleting Case Category ID: ${id}`);
    const response = await API.delete(`/casecategories/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Delete Category Error:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

// ================= Admin - Messages =================

export const adminMessage = async (data) => {
  const response = await API.post("/client-conversation/send", data);
  return response.data;
};

// Service Management APIs
export const createService = (data) => API.post(`/services/create`, data);
export const updateService = (id, data) =>
  API.put(`/services/update/${id}`, data);
export const deleteService = (id) => API.delete(`/services/delete/${id}`);
export const getServiceById = (id) => API.get(`/services/get-by-id/${id}`);
export const getAllServices = () => API.get(`/services/get-all`);

// ============================================================
// 1. CLIENT-CONVERSATION APIs (Admin <-> Client)
// ============================================================

// Update Admin-Client Message
export const adminClientMessage = async (data) => {
  console.log("🚀 [Admin-Client] Sending Message:", data);
  const res = await API.post("/client-conversation/send", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
export const getAllAdminClientConversations = async () => {
  console.log("🚀 [Admin-Client] Fetching All...");
  const res = await API.get("/client-conversation/get-all", {
    headers: { "Content-Type": "multipart/form-data" },
  });

  console.log("✅ [Admin-Client] All Data:", res.data);
  return res.data;
};

export const getAdminClientMessageById = async (id) => {
  console.log(`🚀 [Admin-Client] Fetching by ID: ${id}`);
  const res = await API.get(`/client-conversation/get-by-id/${id}`);
  console.log("✅ [Admin-Client] Data by ID:", res.data);
  return res.data;
};

export const getAdminClientByAdminId = async (adminId) => {
  console.log(`🚀 [Admin-Client] Fetching by Admin ID: ${adminId}`);
  const res = await API.get(`/client-conversation/admin/${adminId}`);
  console.log("✅ [Admin-Client] Data by Admin:", res.data);
  return res.data;
};

export const getAdminClientByClientId = async (clientId) => {
  console.log(`🚀 [Admin-Client] Fetching by Client ID: ${clientId}`);
  const res = await API.get(`/client-conversation/client/${clientId}`);
  console.log("✅ [Admin-Client] Data by Client:", res.data);
  return res.data;
};

// Main History Method for Admin-Client
export const getUserMessageHistory = async (adminId, clientId) => {
  console.log(
    `🚀 [Admin-Client] Fetching History: Admin ${adminId}, Client ${clientId}`,
  );
  const res = await API.get(`/client-conversation/get/${adminId}/${clientId}`);
  console.log("✅ [Admin-Client] History Loaded:", res.data);
  return res.data;
};

export const deleteAdminClientMessage = async (id) => {
  console.log(`🚀 [Admin-Client] Deleting ID: ${id}`);
  const res = await API.delete(`/client-conversation/delete/${id}`);
  console.log("✅ [Admin-Client] Deleted Success");
  return res.data;
};

// ============================================================
// 2. ATTORNEY-CONVERSATION APIs (Admin <-> Attorney)
// ============================================================

export const adminAttorneyMessage = async (data) => {
  console.log("🚀 [Admin-Attorney] Sending Message:", data);
  const res = await API.post("/attorney-conversation/send", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
export const getAllAdminAttorneyConversations = async () => {
  console.log("🚀 [Admin-Attorney] Fetching All...");
  const res = await API.get("/attorney-conversation/get-all");
  console.log("✅ [Admin-Attorney] All Data:", res.data);
  return res.data;
};

export const getAdminAttorneyMessageById = async (id) => {
  console.log(`🚀 [Admin-Attorney] Fetching by ID: ${id}`);
  const res = await API.get(`/attorney-conversation/get-by-id/${id}`);
  console.log("✅ [Admin-Attorney] Data by ID:", res.data);
  return res.data;
};

export const getAdminAttorneyByAdminId = async (adminId) => {
  console.log(`🚀 [Admin-Attorney] Fetching by Admin ID: ${adminId}`);
  const res = await API.get(`/attorney-conversation/admin/${adminId}`);
  console.log("✅ [Admin-Attorney] Data by Admin:", res.data);
  return res.data;
};

export const getAdminAttorneyByAttorneyId = async (attorneyId) => {
  console.log(`🚀 [Admin-Attorney] Fetching by Attorney ID: ${attorneyId}`);
  const res = await API.get(`/attorney-conversation/attorney/${attorneyId}`);
  console.log("✅ [Admin-Attorney] Data by Attorney:", res.data);
  return res.data;
};

// Main History Method for Admin-Attorney
export const getAttorneyMessageHistory = async (adminId, attorneyId) => {
  console.log(
    `🚀 [Admin-Attorney] Fetching History: Admin ${adminId}, Attorney ${attorneyId}`,
  );
  // Using the exact route from your doc: /attorney-conversationget/get/
  const res = await API.get(
    `/attorney-conversation/get/${adminId}/${attorneyId}`,
  );
  console.log("✅ [Admin-Attorney] History Loaded:", res.data);
  return res.data;
};

export const deleteAdminAttorneyMessage = async (id) => {
  console.log(`🚀 [Admin-Attorney] Deleting ID: ${id}`);
  const res = await API.delete(`/attorney-conversation/delete/${id}`);
  console.log("✅ [Admin-Attorney] Deleted Success");
  return res.data;
};

// ============================================================
// 3. ATTORNEY-CLIENT APIs (Attorney <-> Client)
// ============================================================

export const attorneyClientMessage = async (data) => {
  console.log("🚀 [Attorney-Client] Sending Message:", data);
  const res = await API.post("/attorney-client-conversation/send", data);
  console.log("✅ [Attorney-Client] Send Success:", res.data);
  return res.data;
};

export const getAllAttorneyClientConversations = async () => {
  console.log("🚀 [Attorney-Client] Fetching All...");
  const res = await API.get("/attorney-client-conversation/get-all");
  console.log("✅ [Attorney-Client] All Data:", res.data);
  return res.data;
};

export const getAttorneyClientMessageById = async (id) => {
  console.log(`🚀 [Attorney-Client] Fetching by ID: ${id}`);
  const res = await API.get(`/attorney-client-conversation/get-by-id/${id}`);
  console.log("✅ [Attorney-Client] Data by ID:", res.data);
  return res.data;
};

export const getAttorneyClientByAttorneyId = async (attorneyId) => {
  console.log(`🚀 [Attorney-Client] Fetching by Attorney ID: ${attorneyId}`);
  const res = await API.get(
    `/attorney-client-conversation/attorney/${attorneyId}`,
  );
  console.log("✅ [Attorney-Client] Data by Attorney:", res.data);
  return res.data;
};

export const getAttorneyClientByClientId = async (clientId) => {
  console.log(`🚀 [Attorney-Client] Fetching by Client ID: ${clientId}`);
  const res = await API.get(`/attorney-client-conversation/client/${clientId}`);
  console.log("✅ [Attorney-Client] Data by Client:", res.data);
  return res.data;
};

// Main History Method for Attorney-Client
export const getClientAttorneyMessageHistory = async (attorneyId, clientId) => {
  console.log(
    `🚀 [Attorney-Client] Fetching History: Attorney ${attorneyId}, Client ${clientId}`,
  );
  const res = await API.get(
    `/attorney-client-conversation/get/${attorneyId}/${clientId}`,
  );
  console.log("✅ [Attorney-Client] History Loaded:", res.data);
  return res.data;
};

export const deleteAttorneyClientMessage = async (id) => {
  console.log(`🚀 [Attorney-Client] Deleting ID: ${id}`);
  const res = await API.delete(`/attorney-client-conversation/delete/${id}`);
  console.log("✅ [Attorney-Client] Deleted Success");
  return res.data;
};

export const getAllUsers = async () => {
  try {
    console.log("🚀 [AuthService] Fetching All Clients...");
    const response = await API.get("/client/getall");
    console.log("✅ [AuthService] Clients Fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ [AuthService] getAllUsers Error:", error);
    throw error;
  }
};

// Law Career Category
export const getAllLawCareerCategories = async () => {
  try {
    console.log("🚀 [LawCareer] Fetching All Categories...");
    const response = await API.get("/law-career-category/getall");

    const rawData = response.data?.data || response.data || [];

    const finalData = Array.isArray(rawData) ? rawData : [];

    console.log("✅ [LawCareer] Categories Fetched:", finalData);
    return { success: true, data: finalData };
  } catch (error) {
    console.error("❌ [LawCareer] getAllLawCareerCategories Error:", error);
    return { success: false, data: [] };
  }
};
export const createLawCareerCategory = async (data) => {
  try {
    console.log("🚀 [LawCareer] Creating Category...", data);
    const response = await API.post("/law-career-category/create", data);
    console.log("✅ [LawCareer] Category Created:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ [LawCareer] createLawCareerCategory Error:", error);
    throw error;
  }
};

export const updateLawCareerCategory = async (id, data) => {
  try {
    console.log(`🚀 [LawCareer] Updating Category ID: ${id}...`, data);
    const response = await API.put(`/law-career-category/update/${id}`, data);
    console.log("✅ [LawCareer] Category Updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ [LawCareer] updateLawCareerCategory Error:", error);
    throw error;
  }
};

export const deleteLawCareerCategory = async (id) => {
  try {
    console.log(`🚀 [LawCareer] Deleting Category ID: ${id}...`);
    const response = await API.delete(`/law-career-category/delete/${id}`);
    console.log("✅ [LawCareer] Category Deleted:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ [LawCareer] deleteLawCareerCategory Error:", error);
    throw error;
  }
};

// Career Front
export const getAllCareerFront = async () => {
  try {
    console.log("🚀 [CareerFront] Fetching All Fronts...");
    const response = await API.get("/careerfront/get-all");
    console.log("✅ [CareerFront] Fronts Fetched:", response.data);
    const data = response.data?.data || response.data || [];
    return { success: true, data: Array.isArray(data) ? data : [] };
  } catch (error) {
    console.error("❌ [CareerFront] getAllCareerFront Error:", error);
    return { success: false, data: [] };
  }
};

export const createCareerFront = async (fd) => {
  try {
    console.log("🚀 [CareerFront] Creating Front (FormData)...");
    const response = await API.post("/careerfront/create", fd);
    console.log("✅ [CareerFront] Front Created:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ [CareerFront] createCareerFront Error:", error);
    throw error;
  }
};

export const updateCareerFront = async (id, fd) => {
  try {
    console.log(`🚀 [CareerFront] Updating Front ID: ${id}...`);
    const response = await API.put(`/careerfront/update/${id}`, fd);
    console.log("✅ [CareerFront] Front Updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ [CareerFront] updateCareerFront Error:", error);
    throw error;
  }
};

export const deleteCareerFront = async (id) => {
  try {
    console.log(`🚀 [CareerFront] Deleting Front ID: ${id}...`);
    const response = await API.delete(`/careerfront/delete/${id}`);
    console.log("✅ [CareerFront] Front Deleted:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ [CareerFront] deleteCareerFront Error:", error);
    throw error;
  }
};
// Career Detail
export const getAllCareerDetails = async () => {
  try {
    console.log("🚀 [CareerDetail] Fetching All Details...");
    const response = await API.get("/career-detail/get-all");
    console.log("✅ [CareerDetail] Details Fetched:", response.data);
    const data = response.data?.data || response.data || [];
    return { success: true, data: Array.isArray(data) ? data : [] };
  } catch (error) {
    console.error("❌ [CareerDetail] getAllCareerDetails Error:", error);
    return { success: false, data: [] };
  }
};
export const createCareerDetail = (fd) =>
  API.post("/career-detail/create", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateCareerDetail = (id, fd) =>
  API.put(`/career-detail/update/${id}`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteCareerDetail = async (id) => {
  try {
    console.log(`🚀 [CareerDetail] Deleting Detail ID: ${id}...`);
    const response = await API.delete(`/career-detail/delete/${id}`);
    console.log("✅ [CareerDetail] Detail Deleted:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ [CareerDetail] deleteCareerDetail Error:", error);
    throw error;
  }
};

// Career Get By ID
export const getCareerById = async (id) => {
  try {
    console.log(`🚀 [Career] Fetching Career ID: ${id}...`);
    // Dhyaan dein: URL wahi hona chahiye jo aapke Backend API mein hai
    const response = await API.get(`/career/get-by-id/${id}`);
    console.log("✅ [Career] Career Fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ [Career] getCareerById Error:", error);
    throw error;
  }
};

// Job Category
export const getAllJobCategories = async () => {
  try {
    console.log("🚀 [JobCategory] Fetching All Job Categories...");
    const response = await API.get("/job-category/get-all");
    console.log("✅ [JobCategory] Job Categories Fetched:", response.data);
    const data = response.data?.data || response.data || [];
    return { success: true, data: Array.isArray(data) ? data : [] };
  } catch (error) {
    console.error("❌ [JobCategory] getAllJobCategories Error:", error);
    return { success: false, data: [] };
  }
};

export const createJobCategory = async (data) => {
  try {
    console.log("🚀 [JobCategory] Creating Job Category...", data);
    const response = await API.post("/job-category/create", data);
    console.log("✅ [JobCategory] Job Category Created:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ [JobCategory] createJobCategory Error:", error);
    throw error;
  }
};

export const updateJobCategory = async (id, data) => {
  try {
    console.log(`🚀 [JobCategory] Updating Job Category ID: ${id}...`, data);
    const response = await API.put(`/job-category/update/${id}`, data);
    console.log("✅ [JobCategory] Job Category Updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ [JobCategory] updateJobCategory Error:", error);
    throw error;
  }
};

export const deleteJobCategory = async (id) => {
  try {
    console.log(`🚀 [JobCategory] Deleting Job Category ID: ${id}...`);
    const response = await API.delete(`/job-category/delete/${id}`);
    console.log("✅ [JobCategory] Job Category Deleted:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ [JobCategory] deleteJobCategory Error:", error);
    throw error;
  }
};

// Career Banner API Methods
export const createCareerBanner = async (formData) => {
  try {
    const res = await API.post("/career-banner/create", formData);
    console.log("✅ Create Career Banner:", res.data);
    return res;
  } catch (err) {
    console.error("❌ Create Career Banner Error:", err);
    throw err;
  }
};

export const updateCareerBanner = async (id, formData) => {
  try {
    const res = await API.put(`/career-banner/update/${id}`, formData);
    console.log("✅ Update Career Banner:", res.data);
    return res;
  } catch (err) {
    console.error("❌ Update Career Banner Error:", err);
    throw err;
  }
};

export const deleteCareerBanner = async (id) => {
  try {
    const res = await API.delete(`/career-banner/delete/${id}`);
    console.log("✅ Delete Career Banner ID:", id);
    return res;
  } catch (err) {
    console.error("❌ Delete Career Banner Error:", err);
    throw err;
  }
};

export const getCareerBannerById = async (id) => {
  try {
    const res = await API.get(`/career-banner/get-by-id/${id}`);
    console.log("✅ Get Career Banner By ID:", res.data);
    return res;
  } catch (err) {
    console.error("❌ Get Career Banner By ID Error:", err);
    throw err;
  }
};

export const getAllCareerBanners = async () => {
  try {
    const res = await API.get("/career-banner/get-all");
    console.log("✅ Get All Career Banner Data:", res.data);
    return res;
  } catch (err) {
    console.error("❌ Get All Career Banner Error:", err);
    throw err;
  }
};

// Career Law API Methods
export const createCareerLaw = async (formData) => {
  try {
    const res = await API.post("/career-law/create", formData);
    console.log("✅ Create Career Law:", res.data);
    return res;
  } catch (err) {
    console.error("❌ Create Career Law Error:", err);
    throw err;
  }
};

export const updateCareerLaw = async (id, formData) => {
  try {
    const res = await API.put(`/career-law/update/${id}`, formData); // Changed to PUT
    console.log("✅ Update Career Law:", res.data);
    return res;
  } catch (err) {
    console.error("❌ Update Career Law Error:", err);
    throw err;
  }
};

export const deleteCareerLaw = async (id) => {
  try {
    const res = await API.delete(`/career-law/delete/${id}`);
    console.log("✅ Delete Career Law ID:", id);
    return res;
  } catch (err) {
    console.error("❌ Delete Career Law Error:", err);
    throw err;
  }
};

export const getCareerLawById = async (id) => {
  try {
    const res = await API.get(`/career-law/get-by-id/${id}`);
    console.log("✅ Get Career Law By ID:", res.data);
    return res;
  } catch (err) {
    console.error("❌ Get Career Law By ID Error:", err);
    throw err;
  }
};

export const getAllCareerLaw = async () => {
  try {
    const res = await API.get("/career-law/get-all");
    console.log("✅ Get All Career Law Data:", res.data);
    return res;
  } catch (err) {
    console.error("❌ Get All Career Law Error:", err);
    throw err;
  }
};

export const createCareerAttorney = async (formData) => {
  try {
    const res = await API.post("/career-attorney/create", formData);
    console.log("✅ Create Career Attorney:", res.data);
    return res;
  } catch (err) {
    console.error("❌ Create Career Attorney Error:", err);
    throw err;
  }
};

export const updateCareerAttorney = async (id, formData) => {
  try {
    const res = await API.put(`/career-attorney/update/${id}`, formData);
    console.log("✅ Update Career Attorney:", res.data);
    return res;
  } catch (err) {
    console.error("❌ Update Career Attorney Error:", err);
    throw err;
  }
};

export const deleteCareerAttorney = async (id) => {
  try {
    const res = await API.delete(`/career-attorney/delete/${id}`);
    console.log("✅ Delete Career Attorney ID:", id);
    return res;
  } catch (err) {
    console.error("❌ Delete Career Attorney Error:", err);
    throw err;
  }
};

export const getCareerAttorneyById = async (id) => {
  try {
    const res = await API.get(`/career-attorney/get-by-id/${id}`);
    console.log("✅ Get Career Attorney By ID:", res.data);
    return res;
  } catch (err) {
    console.error("❌ Get Career Attorney By ID Error:", err);
    throw err;
  }
};

export const getAllCareerAttorneys = async () => {
  try {
    const res = await API.get("/career-attorney/get-all");
    console.log("✅ Get All Career Attorney Data:", res.data);
    return res;
  } catch (err) {
    console.error("❌ Get All Career Attorney Error:", err);
    throw err;
  }
};

export const createCareerProfessional = async (formData) => {
  try {
    const res = await API.post("/career-professional/create", formData);
    console.log("✅ Create Career Professional:", res.data);
    return res;
  } catch (err) {
    console.error("❌ Create Career Professional Error:", err);
    throw err;
  }
};

export const updateCareerProfessional = async (id, formData) => {
  try {
    const res = await API.put(`/career-professional/update/${id}`, formData);
    console.log("✅ Update Career Professional:", res.data);
    return res;
  } catch (err) {
    console.error("❌ Update Career Professional Error:", err);
    throw err;
  }
};

export const deleteCareerProfessional = async (id) => {
  try {
    const res = await API.delete(`/career-professional/delete/${id}`);
    console.log("✅ Delete Career Professional ID:", id);
    return res;
  } catch (err) {
    console.error("❌ Delete Career Professional Error:", err);
    throw err;
  }
};

export const getCareerProfessionalById = async (id) => {
  try {
    const res = await API.get(`/career-professional/get-by-id/${id}`);
    console.log("✅ Get Career Professional By ID:", res.data);
    return res;
  } catch (err) {
    console.error("❌ Get Career Professional By ID Error:", err);
    throw err;
  }
};

export const getAllCareerProfessionals = async () => {
  try {
    const res = await API.get("/career-professional/get-all");
    console.log("✅ Get All Career Professional Data:", res.data);
    return res;
  } catch (err) {
    console.error("❌ Get All Career Professional Error:", err);
    throw err;
  }
};

// --- ROLE API ---

export const createRole = async (roleData) => {
  try {
    const res = await API.post("/role/create", roleData); // roleData: { roleName }
    return res.data;
  } catch (err) {
    console.error("❌ Create Role Error:", err);
    throw err;
  }
};

export const getAllRoles = async () => {
  try {
    const res = await API.get("/role/get-all");
    return res.data;
  } catch (err) {
    console.error("❌ Get All Roles Error:", err);
    throw err;
  }
};

export const updateRole = async (id, roleData) => {
  try {
    const res = await API.put(`/role/update/${id}`, roleData);
    return res.data;
  } catch (err) {
    console.error("❌ Update Role Error:", err);
    throw err;
  }
};

export const deleteRole = async (id) => {
  try {
    const res = await API.delete(`/role/delete/${id}`);
    return res.data;
  } catch (err) {
    console.error("❌ Delete Role Error:", err);
    throw err;
  }
};

export const getRoleById = async (id) => {
  try {
    const res = await API.get(`/role/get-by-id/${id}`);
    return res.data;
  } catch (err) {
    console.error("❌ Get Role By ID Error:", err);
    throw err;
  }
};

// --- USER API ---

export const createUser = async (userData) => {
  try {
    // userData: { fullName, email, password, confirmPassword, phoneNo, roleId, countryId, cityId }
    const res = await API.post("/user/create", userData);
    return res.data;
  } catch (err) {
    console.error("❌ Create User Error:", err);
    throw err;
  }
};

export const getRoleUser = async () => {
  try {
    const res = await API.get("/user/get-all");
    return res.data;
  } catch (err) {
    console.error("❌ Get All Users Error:", err);
    throw err;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const res = await API.put(`/user/update/${id}`, userData);
    return res.data;
  } catch (err) {
    console.error("❌ Update User Error:", err);
    throw err;
  }
};

export const deleteUser = async (id) => {
  try {
    const res = await API.delete(`/user/delete/${id}`);
    return res.data;
  } catch (err) {
    console.error("❌ Delete User Error:", err);
    throw err;
  }
};

export const getUserById = async (id) => {
  try {
    const res = await API.get(`/user/get-by-id/${id}`);
    return res.data;
  } catch (err) {
    console.error("❌ Get User By ID Error:", err);
    throw err;
  }
};

// --- PERMISSION API ---

export const createPermission = async (permissionData) => {
  try {
    const res = await API.post("/permission/create", permissionData); // { name }
    return res.data;
  } catch (err) {
    console.error("❌ Create Permission Error:", err);
    throw err;
  }
};

export const createMultiplePermissions = async (permissionsArray) => {
  try {
    const res = await API.post("/permission/create-multiple", permissionsArray);
    return res.data;
  } catch (err) {
    console.error("❌ Create Multiple Permissions Error:", err);
    throw err;
  }
};

export const getAllPermissions = async () => {
  try {
    const res = await API.get("/permission/get-all");
    return res.data;
  } catch (err) {
    console.error("❌ Get All Permissions Error:", err);
    throw err;
  }
};

export const updatePermission = async (id, permissionData) => {
  try {
    const res = await API.put(`/permission/update/${id}`, permissionData);
    return res.data;
  } catch (err) {
    console.error("❌ Update Permission Error:", err);
    throw err;
  }
};

export const deletePermission = async (id) => {
  try {
    const res = await API.delete(`/permission/delete/${id}`);
    return res.data;
  } catch (err) {
    console.error("❌ Delete Permission Error:", err);
    throw err;
  }
};

export const getPermissionById = async (id) => {
  try {
    const res = await API.get(`/permission/get-by-id/${id}`);
    return res.data;
  } catch (err) {
    console.error("❌ Get Permission By ID Error:", err);
    throw err;
  }
};

// --- ROLE-PERMISSION API ---

export const createRolePermission = async (data) => {
  try {
    const res = await API.post("/role-permission/create", data); // { roleId, permissionId }
    return res.data;
  } catch (err) {
    console.error("❌ Create Role-Permission Error:", err);
    throw err;
  }
};

export const getAllRolePermissions = async () => {
  try {
    const res = await API.get("/role-permission/get-all");
    return res.data;
  } catch (err) {
    console.error("❌ Get All Role-Permissions Error:", err);
    throw err;
  }
};

export const updateRolePermission = async (id, data) => {
  try {
    const res = await API.put(`/role-permission/update/${id}`, data);
    return res.data;
  } catch (err) {
    console.error("❌ Update Role-Permission Error:", err);
    throw err;
  }
};

export const deleteRolePermission = async (id) => {
  try {
    const res = await API.delete(`/role-permission/delete/${id}`);
    return res.data;
  } catch (err) {
    console.error("❌ Delete Role-Permission Error:", err);
    throw err;
  }
};

export const getRolePermissionById = async (id) => {
  try {
    const res = await API.get(`/role-permission/get-by-id/${id}`);
    return res.data;
  } catch (err) {
    console.error("❌ Get Role-Permission By ID Error:", err);
    throw err;
  }
};
