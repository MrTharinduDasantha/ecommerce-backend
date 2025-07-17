import axios from "axios";

// API base URL
const API_URL = "http://localhost:9000";

// Create an instance of axios to include default headers
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token from local storage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// -----------------------------------------
// Header Footers Setting Related Api Calls
// -----------------------------------------

// Fetch header footer setting
export const fetchHeaderFooterSetting = async () => {
  try {
    const response = await api.get("/api/settings/header-footer");
    return response.data.headerFooterSetting;
  } catch (error) {
    throw error.response.data;
  }
};

// Update header footer setting
export const updateHeaderFooterSetting = async (formData) => {
  try {
    const response = await api.put("/api/settings/header-footer", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.updatedHeaderFooterSetting;
  } catch (error) {
    throw error.response.data;
  }
};

// -----------------------------------
// About Us Setting Related Api Calls
// -----------------------------------

// Fetch about us setting
export const fetchAboutUsSetting = async () => {
  try {
    const response = await api.get("/api/settings/about-us");
    return response.data.aboutUsSetting;
  } catch (error) {
    throw error.response.data;
  }
};

// Update about us setting
export const updateAboutUsSetting = async (formData) => {
  try {
    const response = await api.put("/api/settings/about-us", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.updatedAboutUsSetting;
  } catch (error) {
    throw error.response.data;
  }
};

// -----------------------------------------
// Policy Details Setting Related Api Calls
// -----------------------------------------

// Fetch policy details setting
export const fetchPolicyDetailsSetting = async () => {
  try {
    const response = await api.get("/api/settings/policy-details");
    return response.data.policyDetailsSetting;
  } catch (error) {
    throw error.response.data;
  }
};

// Update policy details setting
export const updatePolicyDetailsSetting = async (policyData) => {
  try {
    const response = await api.put("/api/settings/policy-details", policyData);
    return response.data.updatedPolicyDetailsSetting;
  } catch (error) {
    throw error.response.data;
  }
};

// -----------------------------------
// Home Page Setting Related Api Calls
// -----------------------------------

// Fetch home page setting
export const fetchHomePageSetting = async () => {
  try {
    const response = await api.get("/api/settings/home-page");
    return response.data.homePageSetting;
  } catch (error) {
    throw error.response.data;
  }
};

// Update home page setting
export const updateHomePageSetting = async (formData) => {
  try {
    const response = await api.put("/api/settings/home-page", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.updatedHomePageSetting;
  } catch (error) {
    throw error.response.data;
  }
};
