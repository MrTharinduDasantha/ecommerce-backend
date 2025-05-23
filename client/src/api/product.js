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

// --------------------------------------------
// Category and Sub-Category Related Api Calls
// --------------------------------------------

// Get all categories
export const getCategories = async () => {
  try {
    const response = await api.get("/api/products/categories");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Update category
export const updateCategory = async (id, formData) => {
  try {
    const response = await api.put(`/api/products/categories/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Toggle category status
export const toggleCategoryStatus = async (id, status) => {
  try {
    const response = await api.patch(`/api/products/categories/${id}/status`, {
      status,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Create a subcategory
export const createSubCategory = async (categoryId, description) => {
  try {
    const response = await api.post(
      `/api/products/categories/${categoryId}/sub-categories`,
      { description }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Delete a subcategory
export const deleteSubCategory = async (categoryId, subId) => {
  try {
    const response = await api.delete(
      `/api/products/categories/${categoryId}/sub-categories/${subId}`
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// ---------------------------
// Product Related Api Calls
// ---------------------------

// Create a new product
export const createProduct = async (formData) => {
  try {
    const response = await api.post("/api/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Create a new brand
export const createBrand = async (formData) => {
  try {
    const response = await api.post("/api/products/brands", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Get all brands
export const getBrands = async () => {
  try {
    const response = await api.get("/api/products/brands");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// ✅ NEW: Get products by brand ID
export const getProductsByBrand = async (brandId) => {
  try {
    const response = await api.get(`/api/products/brands/${brandId}/products`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Get all products
export const getProducts = async () => {
  try {
    const response = await api.get("/api/products");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Get a single product
export const getProduct = async (id) => {
  try {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Update a product
export const updateProduct = async (id, formData) => {
  try {
    const response = await api.put(`/api/products/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Get products with active discounts
export const getDiscountedProducts = async () => {
  try {
    const response = await api.get("/api/products/discountd-products/all");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Delete a product
export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/api/products/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

//  Get top 6 selling categories
export const getTopSellingCategories = async () => {
  try {
    const response = await api.get("/api/products/categories/top-selling");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getTopSoldProducts = async (limit = 10) => {
  try {
    const response = await api.get(`/api/products/sold-qty?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching top sold products:", error);
    throw error.response?.data || error;
  }
};

// Inside your API file

export const getSubCategoriesByCategoryId = async (categoryId) => {
  try {
    const response = await api.get(
      `/api/products/categories/${categoryId}/subcategories`
    );
    return response.data; // Adjust according to your server's response structure
  } catch (error) {
    throw error.response.data;
  }
};

export const getProductsBySubCategoryId = async (subCategoryId) => {
  try {
    const response = await api.get(
      `/api/products/sub-categories/${subCategoryId}/products`
    );
    return response.data; // Adjust according to your server's response structure
  } catch (error) {
    throw error.response.data;
  }
};

// Mock implementation - replace with your actual API call
export const getSubCategoryById = async (id) => {
  const response = await fetch(`/api/subcategories/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch subcategory");
  }
  const data = await response.json();
  return data; // Ensure this structure has a 'description' field as expected
};

