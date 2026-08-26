/**
 * Central API Client for CampusCommerce SDUI CMS.
 * Handles base URLs, standard headers, request serialization, and error normalization.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

class ApiError extends Error {
  constructor(message, code = "API_ERROR", status = 500, details = null) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  if (config.body && typeof config.body === "object") {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errPayload = result?.error || {};
      throw new ApiError(
        errPayload.message || `HTTP error ${response.status}: ${response.statusText}`,
        errPayload.code || "HTTP_ERROR",
        response.status,
        errPayload.details || null
      );
    }

    // Return the payload data or raw result
    return result?.data !== undefined ? result.data : result;
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(err.message || "Network connection error", "NETWORK_ERROR", 0);
  }
}

export const apiClient = {
  get(endpoint, queryParams) {
    let url = endpoint;
    if (queryParams && typeof queryParams === "object") {
      const search = new URLSearchParams();
      Object.entries(queryParams).forEach(([key, val]) => {
        if (val !== undefined && val !== null) search.append(key, val);
      });
      const queryStr = search.toString();
      if (queryStr) url += (url.includes("?") ? "&" : "?") + queryStr;
    }
    return request(url, { method: "GET" });
  },

  post(endpoint, body) {
    return request(endpoint, { method: "POST", body });
  },

  put(endpoint, body) {
    return request(endpoint, { method: "PUT", body });
  },

  patch(endpoint, body) {
    return request(endpoint, { method: "PATCH", body });
  },

  delete(endpoint) {
    return request(endpoint, { method: "DELETE" });
  },
};

export default apiClient;
