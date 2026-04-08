export const errorHandler = (error) => {
  if (error.response) {
    const data = error.response.data;
    const status = error.response.status;

    // Prioritize the message from the server (e.g., "Admin access only")
    if (data && data.message) return data.message;
    if (data && data.error) return data.error;

    switch (status) {
      case 401:
        return "Unauthorized: Please login again.";
      case 403:
        return "Access Denied: Admin access only.";
      case 500:
        return "Server error occurred.";
      default:
        return `Error ${status}: Something went wrong.`;
    }
  }
  return error.message || "Network Error";
};
