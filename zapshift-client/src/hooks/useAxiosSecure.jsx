import axios from "axios";
import apiBaseUrl from "../config/apiBaseUrl";

const instance = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("zapshift_access_token");
  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const hadAuthHeader = Boolean(
      error?.config?.headers?.authorization || error?.config?.headers?.Authorization
    );

    if (error?.response?.status === 401 && hadAuthHeader) {
      localStorage.removeItem("zapshift_access_token");
      localStorage.removeItem("zapshift_access_expires_at");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default instance;