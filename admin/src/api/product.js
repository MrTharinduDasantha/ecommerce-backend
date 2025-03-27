// src/api/product.js
import axios from "axios";

const API_URL = "http://localhost:9000"; // Your API base URL

// Create an instance of axios to include default headers
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Get all categories
export const getCategories = async () => {
  try {
    const response = await api.get("/api/products/categories");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Create new category
export const createCategory = async (formData) => {
  try {
    const response = await api.post("/api/products/categories", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
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
