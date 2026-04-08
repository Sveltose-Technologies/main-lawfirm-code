import { API_MESSAGES } from "./apiMessages";

export const responseHandler = (response) => {
  const method = response.config.method.toLowerCase();
  let message = API_MESSAGES.FETCH_SUCCESS;

  if (method === "post") message = API_MESSAGES.CREATE_SUCCESS;
  if (method === "put" || method === "patch")
    message = API_MESSAGES.UPDATE_SUCCESS;
  if (method === "delete") message = API_MESSAGES.DELETE_SUCCESS;

  return {
    success: true,
    message: response.data?.message || message,
    data: response.data,
  };
};
