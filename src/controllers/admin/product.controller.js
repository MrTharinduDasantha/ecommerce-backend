const Product = require("../../models/product.model");
const fs = require("fs");
const path = require("path");
const pool = require("../../config/database");

// -------------------------------------------
// Category and Subcategory Related Functions
// -------------------------------------------

// Fetch all categories with subcategories count
async function getAllCategories(req, res) {
  try {
    // Fetch all categories along with their respective subcategories
    const [categories] = await pool.query("SELECT * FROM Product_Category");

    // Prepare an array to hold the categories with their subcategory counts
    const categoryList = await Promise.all(
      categories.map(async (cat) => {
        // Get subcategories for the current category
        const [subcategories] = await pool.query(
          "SELECT * FROM Sub_Category WHERE Product_Category_idProduct_Category = ?",
          [cat.idProduct_Category]
        );

        return {
          ...cat,
          subcategories: subcategories,
          subCategoriesCount: subcategories.length, // Count of subcategories
        };
      })
    );

    res.status(200).json({
      message: "Categories fetched successfully",
      categories: categoryList,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
}

// Get top 6 selling categories
async function getTopSellingCategories(req, res) {
  try {
    const categories = await Product.getTopSellingCategories();
    res.status(200).json({
      message: "Top selling categories fetched successfully",
      categories,
    });
  } catch (error) {
    console.error("Error fetching top selling categories:", error);
    res.status(500).json({ message: "Failed to fetch top selling categories" });
  }
}

// Create a new category
async function createCategory(req, res) {
  try {
    const { description } = req.body;
    if (!description) {
      return res.status(400).json({ message: "Description is required" });
    }

    // Build the full URL for the uploaded image
    let imageUrl = null;
    if (req.file) {
      imageUrl = `${req.protocol}://${req.get("host")}/src/uploads/${
        req.file.filename
      }`;
    }
    const result = await Product.createCategory(description, imageUrl);

    // Log the admin action
    await pool.query(
      "INSERT INTO admin_logs (admin_id, action, device_info, new_user_info) VALUES (?, ?, ?, ?)",
      [
        req.user.userId,
        "Created category",
        req.headers["user-agent"],
        JSON.stringify({ description }),
      ]
    );

    res.status(201).json({
      message: "Category created successfully",
      insertId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Failed to create category" });
  }
}

// Update a category
async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const { description } = req.body;
    if (!description) {
      return res.status(400).json({ message: "Description is required" });
    }

    // Get original category data for logging
    const [originalCategory] = await pool.query(
      "SELECT Description, Image_Icon_Url FROM Product_Category WHERE idProduct_Category = ?",
      [id]
    );

    if (!originalCategory.length) {
      return res.status(404).json({ message: "Category not found" });
    }

    let imageUrl = null;
    if (req.file) {
      imageUrl = `${req.protocol}://${req.get("host")}/src/uploads/${
        req.file.filename
      }`;
    }

    await Product.updateCategory(id, description, imageUrl);

    // Log the admin action with original and updated data
    const logData = {
      originalData: {
        description: originalCategory[0].Description,
        image_url: originalCategory[0].Image_Icon_Url,
      },
      updatedData: {
        description: description,
        image_url: imageUrl || originalCategory[0].Image_Icon_Url,
      },
    };

    await pool.query(
      "INSERT INTO admin_logs (admin_id, action, device_info, new_user_info) VALUES (?, ?, ?, ?)",
      [
        req.user.userId,
        "Updated category",
        req.headers["user-agent"],
        JSON.stringify(logData),
      ]
    );

    res.status(200).json({ message: "Category updated successfully" });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Failed to update category" });
  }
}

// Toggle the status of a category (active/inactive)
async function toggleCategoryStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    // Get original category data for logging
    const [originalCategory] = await pool.query(
      "SELECT Description, Status FROM Product_Category WHERE idProduct_Category = ?",
      [id]
    );

    if (!originalCategory.length) {
      return res.status(404).json({ message: "Category not found" });
    }

    await Product.toggleCategoryStatus(id, status);

    // Log the admin action with original and updated data
    const logData = {
      originalData: {
        description: originalCategory[0].Description,
        status: originalCategory[0].Status,
      },
      updatedData: {
        description: originalCategory[0].Description,
        status: status,
      },
    };

    await pool.query(
      "INSERT INTO admin_logs (admin_id, action, device_info, new_user_info) VALUES (?, ?, ?, ?)",
      [
        req.user.userId,
        "Toggled category status",
        req.headers["user-agent"],
        JSON.stringify(logData),
      ]
    );

    res.status(200).json({ message: "Category status updated successfully" });
  } catch (error) {
    console.error("Error toggling category status:", error);
    res.status(500).json({ message: "Failed to toggle category status" });
  }
}

// Delete a category and its subcategories
async function deleteCategory(req, res) {
  try {
    const { id } = req.params;

    // Get category data for logging before deletion
    const [category] = await pool.query(
      "SELECT Description, Image_Icon_Url FROM Product_Category WHERE idProduct_Category = ?",
      [id]
    );

    if (!category.length) {
      return res.status(404).json({ message: "Category not found" });
    }

    try {
      await Product.deleteCategory(id);
    } catch (error) {
      if (error.message.includes("Cannot delete category")) {
        return res.status(400).json({ message: error.message });
      }
      throw error;
    }

    // Log the admin action
    await pool.query(
      "INSERT INTO admin_logs (admin_id, action, device_info, new_user_info) VALUES (?, ?, ?, ?)",
      [
        req.user.userId,
        "Deleted category",
        req.headers["user-agent"],
        JSON.stringify({
          categoryId: id,
          description: category[0].Description,
        }),
      ]
    );

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Failed to delete category" });
  }
}

// Create a new subcategory under a specific category
async function createSubCategory(req, res) {
  try {
    const { id } = req.params;
    const { description } = req.body;
    if (!description) {
      return res.status(400).json({ message: "Description is required" });
    }

    const result = await Product.createSubCategory(id, description);

    // Log the admin action
    await pool.query(
      "INSERT INTO admin_logs (admin_id, action, device_info, new_user_info) VALUES (?, ?, ?, ?)",
      [
        req.user.userId,
        "Created subcategory",
        req.headers["user-agent"],
        JSON.stringify({ description, categoryId: id }),
      ]
    );

    res.status(201).json({
      message: "Subcategory created successfully",
      insertId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating subcategory:", error);
    res.status(500).json({ message: "Failed to create subcategory", error });
  }
}

// Update a subcategory
async function updateSubCategory(req, res) {
  try {
    const { id, subId } = req.params;
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ message: "Description is required" });
    }

    // Get original subcategory data for logging
    const [originalSubcategory] = await pool.query(
      "SELECT Description FROM Sub_Category WHERE idSub_Category = ?",
      [subId]
    );

    if (!originalSubcategory.length) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    await Product.updateSubCategory(id, subId, description);

    // Log the admin action with original and updated data
    const logData = {
      originalData: {
        description: originalSubcategory[0].Description,
      },
      updatedData: {
        description: description,
      },
    };

    await pool.query(
      "INSERT INTO admin_logs (admin_id, action, device_info, new_user_info) VALUES (?, ?, ?, ?)",
      [
        req.user.userId,
        "Updated subcategory",
        req.headers["user-agent"],
        JSON.stringify(logData),
      ]
    );

    res.status(200).json({ message: "Subcategory updated successfully" });
  } catch (error) {
    console.error("Error updating subcategory:", error);
    res.status(500).json({ message: "Failed to update subcategory" });
  }
}

// Delete a subcategory (also remove from Product_has_Sub_Category)
async function deleteSubCategory(req, res) {
  try {
    const { subId } = req.params;

    // Check if subcategory is in use before deletion
    try {
      const inUse = await Product.checkSubCategoryInUse(subId);
      if (inUse) {
        return res.status(400).json({
          message: "Cannot delete subcategory as it is used in products",
        });
      }
    } catch (error) {
      console.error("Error checking subcategory usage:", error);
    }

    // Log the admin action before deletion
    await pool.query(
      "INSERT INTO admin_logs (admin_id, action, device_info, new_user_info) VALUES (?, ?, ?, ?)",
      [
        req.user.userId,
        "Deleted subcategory",
        req.headers["user-agent"],
        JSON.stringify({ subCategoryId: subId }),
      ]
    );

    await Product.deleteSubCategory(subId);
    res.status(200).json({ message: "Subcategory deleted successfully" });
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    res
      .status(500)
      .json({ message: "Failed to delete subcategory", error: error.message });
  }
}

// ------------------------
// Brand Related Functions
// ------------------------

// Create a new brand
async function createBrand(req, res) {
  try {
    const { brandName, shortDescription, userId } = req.body;
    if (!brandName) {
      return res.status(400).json({ message: "Brand name is required" });
    }

    let brandImageUrl = null;
    if (req.file) {
      brandImageUrl = `${req.protocol}://${req.get("host")}/src/uploads/${
        req.file.filename
      }`;
    }

    const result = await Product.createBrand(
      brandName,
      brandImageUrl,
      shortDescription,
      userId
    );

    // Log the admin action
    await pool.query(
      "INSERT INTO admin_logs (admin_id, action, device_info, new_user_info) VALUES (?, ?, ?, ?)",
      [
        userId,
        "Created brand",
        req.headers["user-agent"],
        JSON.stringify({
          brandName,
          description: shortDescription,
        }),
      ]
    );

    res.status(201).json({
      message: "Brand created successfully",
      insertId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating brand:", error);
    res.status(500).json({ message: "Failed to create brand" });
  }
}

// Update an existing brand
async function updateBrand(req, res) {
  try {
    const { id } = req.params;
    const { brandName, shortDescription, userId } = req.body;

    if (!brandName) {
      return res.status(400).json({ message: "Brand name is required" });
    }

    // Get original brand data for logging
    const [originalBrand] = await pool.query(
      "SELECT Brand_Name, Brand_Image_Url, ShortDescription FROM Product_Brand WHERE idProduct_Brand = ?",
      [id]
    );

    if (!originalBrand.length) {
      return res.status(404).json({ message: "Brand not found" });
    }

    let brandImageUrl = null;
    if (req.file) {
      brandImageUrl = `${req.protocol}://${req.get("host")}/src/uploads/${
        req.file.filename
      }`;
    }

    await Product.updateBrand(
      id,
      brandName,
      brandImageUrl,
      shortDescription,
      userId
    );

    // Log the admin action with original and updated data
    const logData = {
      originalData: {
        brandName: originalBrand[0].Brand_Name,
        image_url: originalBrand[0].Brand_Image_Url,
        description: originalBrand[0].ShortDescription,
      },
      updatedData: {
        brandName: brandName,
        image_url: brandImageUrl || originalBrand[0].Brand_Image_Url,
        description: shortDescription,
      },
    };

    await pool.query(
      "INSERT INTO admin_logs (admin_id, action, device_info, new_user_info) VALUES (?, ?, ?, ?)",
      [
        userId,
        "Updated brand",
        req.headers["user-agent"],
        JSON.stringify(logData),
      ]
    );

    res.status(200).json({ message: "Brand updated successfully" });
  } catch (error) {
    console.error("Error updating brand:", error);
    res.status(500).json({ message: "Failed to update brand" });
  }
}

// Delete a brand
async function deleteBrand(req, res) {
  try {
    const { id } = req.params;

    // Get brand data for logging before deletion
    const [brand] = await pool.query(
      "SELECT Brand_Name, Brand_Image_Url, ShortDescription FROM Product_Brand WHERE idProduct_Brand = ?",
      [id]
    );

    if (!brand.length) {
      return res.status(404).json({ message: "Brand not found" });
    }

    try {
      await Product.deleteBrand(id);
    } catch (error) {
      if (error.message.includes("Cannot delete brand")) {
        return res.status(400).json({ message: error.message });
      }
      throw error;
    }

    // Log the admin action
    await pool.query(
      "INSERT INTO admin_logs (admin_id, action, device_info, new_user_info) VALUES (?, ?, ?, ?)",
      [
        req.user.userId,
        "Deleted brand",
        req.headers["user-agent"],
        JSON.stringify({
          brandId: id,
          brandName: brand[0].Brand_Name,
        }),
      ]
    );

    res.status(200).json({ message: "Brand deleted successfully" });
  } catch (error) {
    console.error("Error deleting brand:", error);
    res.status(500).json({ message: "Failed to delete brand" });
  }
}

// Fetch all brands
async function getBrands(req, res) {
  try {
    const brands = await Product.getBrands();
    res.status(200).json({ message: "Brands fetched successfully", brands });
  } catch (error) {
    console.error("Error fetching brands:", error);
    res.status(500).json({ message: "Failed to fetch brands" });
  }
}

// --------------------------
// Product Related Functions
// --------------------------

// Create a new product
async function createProduct(req, res) {
  try {
    const {
      Description,
      Product_Brand_idProduct_Brand = null,
      Market_Price,
      Selling_Price,
      Long_Description,
      variations,
      faqs,
      subCategoryIds,
    } = req.body;

    let mainImageUrl = null;
    if (req.files && req.files.mainImage && req.files.mainImage.length > 0) {
      mainImageUrl = `${req.protocol}://${req.get("host")}/src/uploads/${
        req.files.mainImage[0].filename
      }`;
    }

    let variationData;
    try {
      variationData = JSON.parse(variations);
      if (!Array.isArray(variationData) || variationData.length === 0) {
        return res
          .status(400)
          .json({ message: "Variations must be a non-empty array" });
      }
    } catch (error) {
      console.error("Error parsing variations:", error);
      return res.status(400).json({ message: "Invalid variations format" });
    }

    const productData = {
      Description,
      Product_Brand_idProduct_Brand: Product_Brand_idProduct_Brand || null,
      Market_Price,
      Selling_Price,
      Main_Image_Url: mainImageUrl,
      Long_Description,
      SIH: 0,
    };

    let totalQty = 0;
    for (const variation of variationData) {
      if (!variation.colorCode || !variation.size || !variation.quantity) {
        return res.status(400).json({
          message: "Each variation must have colorCode, size, and quantity",
        });
      }
      totalQty += Number(variation.quantity);
    }
    productData.SIH = totalQty;

    const result = await Product.createProduct(productData);
    const productId = result.insertId;

    let subImageUrls = [];
    if (req.files && req.files.subImages) {
      for (const file of req.files.subImages) {
        const imageUrl = `${req.protocol}://${req.get("host")}/src/uploads/${
          file.filename
        }`;
        await Product.createProductImages(productId, imageUrl);
        subImageUrls.push(imageUrl);
      }
    }

    for (const variation of variationData) {
      await Product.createProductVariant(productId, variation);
    }

    let faqData = [];
    if (faqs) {
      faqData = JSON.parse(faqs);
      for (const faq of faqData) {
        await Product.createProductFaq(productId, faq);
      }
    }

    let subCategoryData = [];
    let subCategoryDescriptions = [];
    if (subCategoryIds) {
      subCategoryData = JSON.parse(subCategoryIds);
      for (const subCat of subCategoryData) {
        const subCatId = subCat.idSub_Category ? subCat.idSub_Category : subCat;
        await Product.createProductSubCategory(productId, subCatId);
        // Fetch subcategory description
        const [subCategory] = await pool.query(
          "SELECT Description FROM Sub_Category WHERE idSub_Category = ?",
          [subCatId]
        );
        if (subCategory.length) {
          subCategoryDescriptions.push({
            idSub_Category: subCatId,
            Description: subCategory[0].Description,
          });
        }
      }
    }

    const [brand] = await pool.query(
      "SELECT Brand_Name FROM Product_Brand WHERE idProduct_Brand = ?",
      [Product_Brand_idProduct_Brand]
    );

    // Enhanced log data
    const logData = {
      description: Description,
      brand: brand[0]?.Brand_Name || "Unknown",
      market_price: Market_Price,
      selling_price: Selling_Price,
      long_description: Long_Description,
      main_image: mainImageUrl,
      sub_images: subImageUrls,
      variations: variationData,
      faqs: faqData,
      sub_categories: subCategoryDescriptions,
    };

    await pool.query(
      "INSERT INTO admin_logs (admin_id, action, device_info, new_user_info) VALUES (?, ?, ?, ?)",
      [
        req.user.userId,
        "Created product",
        req.headers["user-agent"],
        JSON.stringify(logData),
      ]
    );

    res
      .status(201)
      .json({ message: "Product created successfully", productId });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Failed to create product" });
  }
}

// Update a product
async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const {
      Description,
      Product_Brand_idProduct_Brand,
      Market_Price,
      Selling_Price,
      Long_Description,
      variations,
      faqs,
      subCategoryIds,
    } = req.body;

    const existingProduct = await Product.getProductById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const [originalVariations] = await pool.query(
      "SELECT * FROM Product_Variations WHERE Product_idProduct = ?",
      [id]
    );

    const [originalFaqs] = await pool.query(
      "SELECT * FROM FAQ WHERE Product_idProduct = ?",
      [id]
    );

    const [originalSubCategories] = await pool.query(
      "SELECT sc.idSub_Category, sc.Description FROM Sub_Category sc JOIN Product_has_Sub_Category phsc ON sc.idSub_Category = phsc.Sub_Category_idSub_Category WHERE phsc.Product_idProduct = ?",
      [id]
    );

    let mainImageUrl = null;
    if (req.files && req.files.mainImage && req.files.mainImage.length > 0) {
      mainImageUrl = `${req.protocol}://${req.get("host")}/src/uploads/${
        req.files.mainImage[0].filename
      }`;
    } else {
      mainImageUrl = existingProduct.Main_Image_Url;
    }

    // Deleted sub-images handling
    const deletedSubImages = req.body.deletedSubImages
      ? JSON.parse(req.body.deletedSubImages)
      : [];
    const subImages =
      req.files?.subImages?.map(
        (file) =>
          `${req.protocol}://${req.get("host")}/src/uploads/${file.filename}`
      ) || [];

    const productData = {
      Description,
      Product_Brand_idProduct_Brand: Product_Brand_idProduct_Brand || null,
      Market_Price,
      Selling_Price,
      Main_Image_Url: mainImageUrl,
      Long_Description,
      SIH: 0,
    };

    let variationData = null;
    if (variations) {
      try {
        variationData = JSON.parse(variations);
        if (!Array.isArray(variationData)) {
          return res
            .status(400)
            .json({ message: "Variations must be an array" });
        }
        let totalQty = 0;
        for (const variation of variationData) {
          if (!variation.colorCode || !variation.size || !variation.quantity) {
            return res.status(400).json({
              message: "Each variation must have colorCode, size, and quantity",
            });
          }
          totalQty += Number(variation.quantity);
        }
        productData.SIH = totalQty;
      } catch (error) {
        console.error("Error parsing variations:", error);
        return res.status(400).json({ message: "Invalid variations format" });
      }
    }

    let faqData = null;
    if (faqs) {
      try {
        faqData = JSON.parse(faqs);
      } catch (error) {
        console.error("Error parsing FAQs:", error);
        return res.status(400).json({ message: "Invalid FAQs format" });
      }
    }

    let subCategoryData = [];
    let subCategoryDescriptions = [];
    if (subCategoryIds) {
      try {
        subCategoryData = JSON.parse(subCategoryIds);
        for (const subCat of subCategoryData) {
          const subCatId = subCat.idSub_Category
            ? subCat.idSub_Category
            : subCat;
          const [subCategory] = await pool.query(
            "SELECT Description FROM Sub_Category WHERE idSub_Category = ?",
            [subCatId]
          );
          if (subCategory.length) {
            subCategoryDescriptions.push({
              idSub_Category: subCatId,
              Description: subCategory[0].Description,
            });
          }
        }
      } catch (error) {
        console.error("Error parsing subCategoryIds:", error);
        return res
          .status(400)
          .json({ message: "Invalid subCategoryIds format" });
      }
    }

    const [oldBrand] = await pool.query(
      "SELECT Brand_Name FROM Product_Brand WHERE idProduct_Brand = ?",
      [existingProduct.Product_Brand_idProduct_Brand]
    );

    const [newBrand] = await pool.query(
      "SELECT Brand_Name FROM Product_Brand WHERE idProduct_Brand = ?",
      [Product_Brand_idProduct_Brand]
    );

    // Update call with deleted images
    await Product.updateProduct(id, productData, {
      images: subImages.length > 0 ? subImages : null,
      deletedImages: deletedSubImages.length > 0 ? deletedSubImages : null,
      variations: variationData,
      faqs: faqData,
      subCategoryIds: subCategoryData,
    });

    // Enhanced log data
    const logData = {
      originalData: {
        description: existingProduct.Description,
        brand: oldBrand[0]?.Brand_Name || "Unknown",
        market_price: existingProduct.Market_Price,
        selling_price: existingProduct.Selling_Price,
        long_description: existingProduct.Long_Description,
        main_image: existingProduct.Main_Image_Url,
        sub_images: existingProduct.images?.map((img) => img.Image_Url) || [],
        variations: originalVariations || [],
        faqs: originalFaqs || [],
        sub_categories: originalSubCategories || [],
      },
      updatedData: {
        description: Description,
        brand: newBrand[0]?.Brand_Name || "Unknown",
        market_price: Market_Price,
        selling_price: Selling_Price,
        long_description: Long_Description,
        main_image: mainImageUrl,
        sub_images_added: subImages,
        sub_images_deleted: deletedSubImages,
        variations: variationData || [],
        faqs: faqData || [],
        sub_categories: subCategoryDescriptions || [],
      },
    };

    await pool.query(
      "INSERT INTO admin_logs (admin_id, action, device_info, new_user_info) VALUES (?, ?, ?, ?)",
      [
        req.user.userId,
        "Updated product",
        req.headers["user-agent"],
        JSON.stringify(logData),
      ]
    );

    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Failed to update product" });
  }
}

// Toggle the history status of a product (new arrivals/old)
async function toggleProductHistoryStatus(req, res) {
  try {
    const { id } = req.params;
    const { historyStatus } = req.body;

    if (!historyStatus) {
      return res.status(400).json({ message: "History status is required" });
    }

    // Get original product data for logging
    const [originalProduct] = await pool.query(
      "SELECT Description, History_Status FROM Product WHERE idProduct = ?",
      [id]
    );

    if (!originalProduct.length) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Product.toggleProductHistoryStatus(id, historyStatus);

    // Log the admin action with original and updated data
    const logData = {
      originalData: {
        description: originalProduct[0].Description,
        historyStatus: originalProduct[0].History_Status,
      },
      updatedData: {
        description: originalProduct[0].Description,
        historyStatus: historyStatus,
      },
    };

    await pool.query(
      "INSERT INTO admin_logs (admin_id, action, device_info, new_user_info) VALUES (?, ?, ?, ?)",
      [
        req.user.userId,
        "Toggled product history status",
        req.headers["user-agent"],
        JSON.stringify(logData),
      ]
    );

    res
      .status(200)
      .json({ message: "Product history status updated successfully" });
  } catch (error) {
    console.error("Error toggling product history status:", error);
    res
      .status(500)
      .json({ message: "Failed to toggle product history status" });
  }
}

// Toggle the status of a product (active/inactive)
async function toggleProductStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    // Get original product data for logging
    const [originalProduct] = await pool.query(
      "SELECT Description, Status FROM Product WHERE idProduct = ?",
      [id]
    );

    if (!originalProduct.length) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Product.toggleProductStatus(id, status);

    // Log the admin action with original and updated data
    const logData = {
      originalData: {
        description: originalProduct[0].Description,
        status: originalProduct[0].Status,
      },
      updatedData: {
        description: originalProduct[0].Description,
        status: status,
      },
    };

    await pool.query(
      "INSERT INTO admin_logs (admin_id, action, device_info, new_user_info) VALUES (?, ?, ?, ?)",
      [
        req.user.userId,
        "Toggled product status",
        req.headers["user-agent"],
        JSON.stringify(logData),
      ]
    );

    res.status(200).json({ message: "Product status updated successfully" });
  } catch (error) {
    console.error("Error toggling product status:", error);
    res.status(500).json({ message: "Failed to toggle product status" });
  }
}

// Fetch all products
async function getAllProducts(req, res) {
  try {
    const products = await Product.getAllProducts();
    res
      .status(200)
      .json({ message: "Products fetched successfully", products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
}

// Get total number of products
async function getProductTotal(req, res) {
  try {
    const totalProducts = await Product.getProductCount();

    res.status(200).json({
      message: "Total products fetched successfully",
      totalProducts,
    });
  } catch (error) {
    console.error("Error fetching total products:", error);
    res.status(500).json({ message: "Failed to fetch total products" });
  }
}

// Get top sold products
async function getProductsSoldQty(req, res) {
  console.log("Called getProductsSoldQty");
  try {
    // Default to 5 if no limit is provided
    const limit = parseInt(req.query.limit) || 5;
    if (limit < 1 || limit > 100) {
      return res
        .status(400)
        .json({ message: "Limit must be between 1 and 100" });
    }

    const query = `
      SELECT idProduct, Description, Sold_Qty, Main_Image_Url,Selling_Price,Market_Price
      FROM Product
      WHERE Sold_Qty > 0
      ORDER BY Sold_Qty DESC
      LIMIT ?
    `;
    const [products] = await pool.query(query, [limit]);
    res.status(200).json({
      message: `Top ${limit} most sold products fetched successfully`,
      products,
    });
  } catch (error) {
    console.error("Error fetching sold quantities:", error);
    res.status(500).json({ message: "Failed to fetch sold quantities" });
  }
}

// Get sold quantity of a product
async function getProductSoldQty(req, res) {
  console.log("Called getProductSoldQty", req.params.id);
  try {
    const { id } = req.params;
    const product = await Product.getProductSoldQty(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({
      message: "Sold quantity fetched successfully",
      product,
    });
  } catch (error) {
    console.error("Error fetching sold quantity:", error);
    res.status(500).json({ message: "Failed to fetch sold quantity" });
  }
}

// Get products by sub-category
async function getProductsBySubCategory(req, res) {
  try {
    const { subId } = req.params;
    const products = await Product.getProductsBySubCategory(subId);

    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for this sub-category" });
    }

    res
      .status(200)
      .json({ message: "Products fetched successfully", products });
  } catch (error) {
    console.error("Error fetching products by sub-category:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
}

// Get products by brand
async function getProductsByBrand(req, res) {
  try {
    const { brandId } = req.params;
    const products = await Product.getProductsByBrand(brandId);

    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for this brand" });
    }

    res
      .status(200)
      .json({ message: "Products fetched successfully", products });
  } catch (error) {
    console.error("Error fetching products by brand:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
}

// Fetch a product by id
async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.getProductById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product fetched successfully", product });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Failed to fetch product" });
  }
}

// Get sales information for a product
async function getProductSales(req, res) {
  try {
    const { id } = req.params;
    const salesInfo = await Product.getProductSalesInfo(id);

    res
      .status(200)
      .json({ message: "Sales information fetched successfully", salesInfo });
  } catch (error) {
    console.error("Error fetching sales information:", error);
    res.status(500).json({ message: "Failed to fetch sales information" });
  }
}

// Get products with active discounts
async function getDiscountedProducts(req, res) {
  try {
    const products = await Product.getDiscountedProducts();

    res
      .status(200)
      .json({ message: "Discounted products fetched successfully", products });
  } catch (error) {
    console.error("Error fetching discounted products:", error);
    res.status(500).json({ message: "Failed to fetch discounted products" });
  }
}

// Delete a product
async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.getProductById(id);

    if (product) {
      const [variations] = await pool.query(
        "SELECT * FROM Product_Variations WHERE Product_idProduct = ?",
        [id]
      );

      const [faqs] = await pool.query(
        "SELECT * FROM FAQ WHERE Product_idProduct = ?",
        [id]
      );

      await pool.query(
        "INSERT INTO admin_logs (admin_id, action, device_info, new_user_info) VALUES (?, ?, ?, ?)",
        [
          req.user.userId,
          "Deleted product",
          req.headers["user-agent"],
          JSON.stringify({
            productId: id,
            description: product.Description,
            variations: variations || [],
            faqs: faqs || [],
          }),
        ]
      );

      if (product.Main_Image_Url) {
        const mainImagePath = path.join(
          __dirname,
          "../../",
          product.Main_Image_Url.replace(
            `${req.protocol}://${req.get("host")}/`,
            ""
          )
        );
        fs.unlink(mainImagePath, (err) => {
          if (err) console.error("Error deleting main image:", err);
        });
      }

      if (product.images && product.images.length > 0) {
        product.images.forEach((img) => {
          if (img.Image_Url) {
            const subImagePath = path.join(
              __dirname,
              "../../",
              img.Image_Url.replace(`${req.protocol}://${req.get("host")}/`, "")
            );
            fs.unlink(subImagePath, (err) => {
              if (err) console.error("Error deleting sub image:", err);
            });
          }
        });
      }

      await Product.deleteProduct(id);
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete product" });
  }
}

// ---------------------------
// Discount Related Functions
// ---------------------------

// Get all discounts
async function getAllDiscounts(req, res) {
  try {
    const discounts = await Product.getAllDiscounts();

    res
      .status(200)
      .json({ message: "Discounts fetched successfully", discounts });
  } catch (error) {
    console.error("Error fetching discounts:", error);
    res.status(500).json({ message: "Failed to fetch discounts" });
  }
}

// Get discounts for a specific product
async function getDiscountsByProductId(req, res) {
  try {
    const { productId } = req.params;
    const discounts = await Product.getDiscountsByProductId(productId);

    res
      .status(200)
      .json({ message: "Product discounts fetched successfully", discounts });
  } catch (error) {
    console.error("Error fetching product discounts:", error);
    res.status(500).json({ message: "Failed to fetch product discounts" });
  }
}

// Create a new discount
async function createDiscount(req, res) {
  try {
    const {
      productId,
      description,
      discountType,
      discountValue,
      startDate,
      endDate,
      status,
    } = req.body;

    if (
      !productId ||
      !description ||
      !discountType ||
      !discountValue ||
      !startDate ||
      !endDate
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if product exists
    const product = await Product.getProductById(productId);
    if (!product) {
      return res.status(400).json({ message: "Product not found" });
    }

    const discountData = {
      productId,
      description,
      discountType,
      discountValue,
      startDate,
      endDate,
      status: status || "active",
    };

    const result = await Product.createDiscount(discountData);

    // Log the admin action
    await pool.query(
      "INSERT INTO admin_logs (admin_id, action, device_info, new_user_info) VALUES (?, ?, ?, ?)",
      [
        req.user.userId,
        "Created discount",
        req.headers["user-agent"],
        JSON.stringify({
          productId,
          description,
          discountType,
          discountValue,
        }),
      ]
    );

    res.status(201).json({
      message: "Discount created successfully",
      discountId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating discount:", error);
    res.status(500).json({ message: "Failed to create discount" });
  }
}

// Update an existing discount
async function updateDiscount(req, res) {
  try {
    const { id } = req.params;
    const {
      productId,
      description,
      discountType,
      discountValue,
      startDate,
      endDate,
      status,
    } = req.body;

    if (
      !productId ||
      !description ||
      !discountType ||
      !discountValue ||
      !startDate ||
      !endDate ||
      !status
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if discount exists and get original data
    const existingDiscount = await Product.getDiscountById(id);
    if (!existingDiscount) {
      return res.status(400).json({ message: "Discount not found" });
    }

    const discountData = {
      productId,
      description,
      discountType,
      discountValue,
      startDate,
      endDate,
      status,
    };

    await Product.updateDiscount(id, discountData);

    // Prepare logging data with original and updated values
    const logData = {
      originalData: {
        description: existingDiscount.Description,
        discountType: existingDiscount.Dicaunt_Type,
        discountValue: existingDiscount.Discount_Value,
        startDate: existingDiscount.Start_Date,
        endDate: existingDiscount.End_Date,
        status: existingDiscount.Status,
      },
      updatedData: {
        description,
        discountType,
        discountValue,
        startDate,
        endDate,
        status,
      },
    };

    // Log the admin action with both original and updated data
    await pool.query(
      "INSERT INTO admin_logs (admin_id, action, device_info, new_user_info) VALUES (?, ?, ?, ?)",
      [
        req.user.userId,
        "Updated discount",
        req.headers["user-agent"],
        JSON.stringify(logData),
      ]
    );

    res.status(200).json({ message: "Discount updated successfully" });
  } catch (error) {
    console.error("Error updating discount:", error);
    res.status(500).json({ message: "Failed to update discount" });
  }
}
// Delete a discount
async function deleteDiscount(req, res) {
  try {
    const { id } = req.params;

    // Check if discount exists
    const discount = await Product.getDiscountById(id);
    if (!discount) {
      return res.status(404).json({ message: "Discount not found" });
    }

    // Log the admin action before deletion
    await pool.query(
      "INSERT INTO admin_logs (admin_id, action, device_info, new_user_info) VALUES (?, ?, ?, ?)",
      [
        req.user.userId,
        "Deleted discount",
        req.headers["user-agent"],
        JSON.stringify({
          discountId: id,
          productId: discount.Product_idProduct,
          description: discount.Description,
        }),
      ]
    );

    await Product.deleteDiscount(id);
    res.status(200).json({ message: "Discount deleted successfully" });
  } catch (error) {
    console.error("Error deleting discount:", error);
    res.status(500).json({ message: "Failed to delete discount" });
  }
}

// Get a single discount by id
async function getDiscountById(req, res) {
  try {
    const { id } = req.params;
    const discount = await Product.getDiscountById(id);

    if (!discount) {
      return res.status(404).json({ message: "Discount not found" });
    }

    res
      .status(200)
      .json({ message: "Discount fetched successfully", discount });
  } catch (error) {
    console.error("Error fetching discount:", error);
    res.status(500).json({ message: "Failed to fetch discount" });
  }
}

module.exports = {
  // Category and Sub-Category related functions
  getAllCategories,
  getTopSellingCategories,
  createCategory,
  updateCategory,
  toggleCategoryStatus,
  deleteCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  // Brand related functions
  createBrand,
  updateBrand,
  deleteBrand,
  getBrands,
  // Product related functions
  createProduct,
  updateProduct,
  toggleProductHistoryStatus,
  toggleProductStatus,
  getAllProducts,
  getProductTotal,
  getProductsSoldQty,
  getProductSoldQty,
  getProductsBySubCategory,
  getProductsByBrand,
  getProductById,
  getProductSales,
  getDiscountedProducts,
  deleteProduct,
  // Discount related functions
  getAllDiscounts,
  getDiscountsByProductId,
  createDiscount,
  updateDiscount,
  deleteDiscount,
  getDiscountById,
};