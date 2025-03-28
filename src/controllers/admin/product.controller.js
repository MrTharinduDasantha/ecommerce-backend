const Product = require("../../models/product.model");

// --------------------------
// Product Related Functions
// --------------------------

// Create a new product
async function createProduct(req, res) {
  try {
    const {
      Description,
      Product_Brand_idProduct_Brand,
      Market_Price,
      Selling_Price,
      Long_Description,
      SKU,
      variations, // (array of variation objects)
      faqs, // (array of faq objects)
      subCategoryIds, // (array of subcategory ids)
    } = req.body;
    if (
      !Description ||
      !Product_Brand_idProduct_Brand ||
      !Market_Price ||
      !Selling_Price ||
      !Long_Description ||
      !SKU ||
      !variations ||
      !faqs ||
      !subCategoryIds
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Build the ful URL for the uploaded main image
    let mainImageUrl = null;
    if (req.file) {
      mainImageUrl = `${req.protocol}://${req.get("host")}/src/uploads/${
        req.file.filename
      }`;
    }

    const productData = {
      Description,
      Product_Brand_idProduct_Brand,
      Market_Price,
      Selling_Price,
      Main_Image_Url: mainImageUrl,
      Long_Description,
      SKU,
    };
    const result = await Product.createProduct(productData);
    const productId = result.insertId;

    if (req.files && req.files.subImages) {
      for (const file of req.files.subImages) {
        const imageUrl = `${req.protocol}://${req.get("host")}/src/uploads/${
          file.filename
        }`;
        await Product.createProductImages(productId, imageUrl);
      }
    }

    if (variations) {
      const variationData = JSON.parse(variations);
      for (const variation of variationData) {
        await Product.createProductVariant(productId, variation);
      }
    }

    if (faqs) {
      const faqData = JSON.parse(faqs);
      for (const faq of faqData) {
        await Product.createProductFaq(productId, faq);
      }
    }

    if (subCategoryIds) {
      const subCategoryData = JSON.parse(subCategoryIds);
      for (const subCategoryId of subCategoryData) {
        await Product.createProductSubCategory(productId, subCategoryId);
      }
    }

    res
      .status(201)
      .json({ message: "Product created successfully", productId });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Failed to create product" });
  }
}

// Create a new brand
async function createBrand(req, res) {
  try {
    const { brandName, shortDescription } = req.body;
    if (!brandName) {
      return res.status(400).json({ message: "Brand name is required" });
    }

    const result = await Product.createBrand(
      brandName,
      shortDescription,
      req.body.userId
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

// --------------------------------------------
// Category and Subcategory Related Functions
// --------------------------------------------

// Fetch all categories with subcategories
async function getAllCategories(req, res) {
  try {
    const categories = await Product.getAllCategories();
    res
      .status(200)
      .json({ message: "Categories fetched successfully", categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
}

// Create a new category
async function createCategory(req, res) {
  try {
    const { description } = req.body;
    if (!description) {
      return res.status(400).json({ message: "Description is required" });
    }

    // Build the ful URL for the uploaded image
    let imageUrl = null;
    if (req.file) {
      imageUrl = `${req.protocol}://${req.get("host")}/src/uploads/${
        req.file.filename
      }`;
    }
    const result = await Product.createCategory(description, imageUrl);

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

    let imageUrl = null;
    if (req.file) {
      imageUrl = `${req.protocol}://${req.get("host")}/src/uploads/${
        req.file.filename
      }`;
    }
    await Product.updateCategory(id, description, imageUrl);
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

    await Product.toggleCategoryStatus(id, status);
    res.status(200).json({ message: "Category status updated successfully" });
  } catch (error) {
    console.error("Error toggling category status:", error);
    res.status(500).json({ message: "Failed to toggle category status" });
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
    res.status(201).json({
      message: "Subcategory created successfully",
      insertId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating subcategory:", error);
    res.status(500).json({ message: "Failed to create subcategory", error });
  }
}

// Delete a subcategory (also remove from Product_has_Sub_Category)
async function deleteSubCategory(req, res) {
  try {
    const { subId } = req.params; // id - category, subId - sub category

    await Product.deleteSubCategory(subId);
    res.status(200).json({ message: "Subcategory deleted successfully" });
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    res.status(500).json({ message: "Failed to delete subcategory" });
  }
}

module.exports = {
  createProduct,
  createBrand,
  getBrands,
  getAllCategories,
  createCategory,
  updateCategory,
  toggleCategoryStatus,
  createSubCategory,
  deleteSubCategory,
};
