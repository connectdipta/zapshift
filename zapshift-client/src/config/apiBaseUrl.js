let _url = (import.meta.env.VITE_API_URL || "").trim().replace(/\/+$/, "");

// Safety: auto-prepend http:// if protocol is missing
if (_url && !/^https?:\/\//i.test(_url)) {
  _url = `http://${_url}`;
}

const apiBaseUrl = _url || "http://localhost:5000";

export default apiBaseUrl;