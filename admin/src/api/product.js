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
    return response.data; // This will be the array of categories with subcategories
  } catch (error) {
    throw error.response?.data || error; // Handle errors appropriately
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
    throw error.response?.data || error;
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
    throw error.response?.data || error;
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
    throw error.response?.data || error;
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
    throw error.response?.data || error;
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
    throw error.response?.data || error;
  }
};

// --------------------------
// Product Related Api Calls
// --------------------------

// Create a new product
export const createProduct = async (formData) => {
  try {
    const response = await api.post("/api/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
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
    throw error.response?.data || error;
  }
};

// Update an existing brand
export const updateBrand = async (brandId, formData) => {
  try {
    const response = await api.put(
      `/api/products/brands/${brandId}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete a brand
export const deleteBrand = async (brandId) => {
  try {
    const response = await api.delete(`/api/products/brands/${brandId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get all brands
export const getBrands = async () => {
  try {
    const response = await api.get("/api/products/brands");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get all products
export const getProducts = async () => {
  try {
    const response = await api.get("/api/products");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get a single product
export const getProduct = async (id) => {
  try {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update a product
export const updateProduct = async (id, formData) => {
  try {
    // Create a new FormData instance if formData is a plain object
    let data = formData;
    if (!(formData instanceof FormData)) {
      data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (
          key === "variations" ||
          key === "faqs" ||
          key === "subCategoryIds"
        ) {
          data.append(key, JSON.stringify(formData[key]));
        } else if (key === "mainImage" && formData[key]) {
          data.append("mainImage", formData[key]);
        } else if (key === "subImages" && formData[key]) {
          Array.from(formData[key]).forEach((file) => {
            data.append("subImages", file);
          });
        } else {
          data.append(key, formData[key]);
        }
      });
    }

    const response = await axios({
      method: "put",
      url: `${API_URL}/api/products/${id}`,
      data: data,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Update product error:", error.response || error);
    throw error.response?.data || error;
  }
};

// Delete a product
export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/api/products/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ---------------------------
// Discount Related Api Calls
// ---------------------------

// Get all discounts
export const getDiscounts = async () => {
  try {
    const response = await api.get("/api/products/discounts/all");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Get a single discount
export const getDiscount = async (id) => {
  try {
    const response = await api.get(`/api/products/discounts/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Get discounts for a specific product
export const getProductDiscounts = async (productId) => {
  try {
    const response = await api.get(
      `/api/products/products/${productId}/discounts`
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Create a new discount
export const createDiscount = async (discountData) => {
  try {
    const response = await api.post("/api/products/discounts", discountData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Update a discount
export const updateDiscount = async (id, discountData) => {
  try {
    const response = await api.put(
      `/api/products/discounts/${id}`,
      discountData
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Delete a discount
export const deleteDiscount = async (id) => {
  try {
    const response = await api.delete(`/api/products/discounts/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
// Add this function to your API calls file
export const getProductTotal = async () => {
  try {
    const response = await api.get("/api/products/count"); // Ensure the endpoint matches your backend
    return response.data; // Return data as needed
  } catch (error) {
    throw error.response?.data || error; // Handle errors appropriately
  }
};

// Add this function to your existing product.js file
export const getTopSoldProducts = async (limit = 5) => {
  try {
    const response = await api.get(`/api/products/sold-qty?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching top sold products:", error);
    throw error.response?.data || error;
  }
};
