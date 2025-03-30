const Product = require("../../models/product.model");
const fs = require("fs");
const path = require("path");

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
      !variations ||
      !faqs ||
      !subCategoryIds
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Build the ful URL for the uploaded main image
    let mainImageUrl = null;
    if (req.files && req.files.mainImage && req.files.mainImage.length > 0) {
      mainImageUrl = `${req.protocol}://${req.get("host")}/src/uploads/${
        req.files.mainImage[0].filename
      }`;
    }

    const productData = {
      Description,
      Product_Brand_idProduct_Brand,
      Market_Price,
      Selling_Price,
      Main_Image_Url: mainImageUrl,
      Long_Description,
    };

    // Compute SIH (total quantity from variations)
    if (variations) {
      const variationData = JSON.parse(variations);
      let totalQty = 0;
      for (const variation of variationData) {
        totalQty += Number(variation.quantity);
      }
      productData.SIH = totalQty;
    }

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
      for (const subCat of subCategoryData) {
        // If subCat is an object, extract its id; otherwise, use it directly
        const subCatId = subCat.idSub_Category ? subCat.idSub_Category : subCat;
        await Product.createProductSubCategory(productId, subCatId);
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
    const { brandName, shortDescription, userId } = req.body;
    if (!brandName) {
      return res.status(400).json({ message: "Brand name is required" });
    }

    const result = await Product.createBrand(
      brandName,
      shortDescription,
      userId
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
      variations, // JSON string representing an array of variation objects
      faqs, // JSON string representing an array of FAQs
      subCategoryIds, // JSON string representing an array of subcategory ids
    } = req.body;
    const existingProduct = await Product.getProductById(id);

    // Compute SIH (total quantity from variations)
    let totalQty = 0;
    let variationData = [];
    if (variations) {
      variationData = JSON.parse(variations);
      for (const variation of variationData) {
        totalQty += Number(variation.quantity);
      }
    }

    let mainImageUrl = null;
    if (req.files && req.files.mainImage && req.files.mainImage.length > 0) {
      // Remove old main image file if it exists
      if (existingProduct && existingProduct.Main_Image_Url) {
        // Convert full URL to file path (assuming your uploads folder structure)
        const oldPath = existingProduct.Main_Image_Url.replace(
          `${req.protocol}://${req.get("host")}/`,
          ""
        );
        fs.unlink(oldPath, (err) => {
          if (err) console.error("Error removing old main image:", err);
        });
      }
      mainImageUrl = `${req.protocol}://${req.get("host")}/src/uploads/${
        req.files.mainImage[0].filename
      }`;
    } else {
      mainImageUrl = existingProduct ? existingProduct.Main_Image_Url : null;
    }

    // If new sub images are uploaded, remove all old sub image files
    let imagesArray = null;
    if (req.files && req.files.subImages && req.files.subImages.length > 0) {
      if (
        existingProduct &&
        existingProduct.images &&
        existingProduct.images.length > 0
      ) {
        existingProduct.images.forEach((img) => {
          const oldPath = img.Image_Url.replace(
            `${req.protocol}://${req.get("host")}/`,
            ""
          );
          fs.unlink(oldPath, (err) => {
            if (err) console.error("Error removing old sub image:", err);
          });
        });
      }
      imagesArray = req.files.subImages.map(
        (file) =>
          `${req.protocol}://${req.get("host")}/src/uploads/${file.filename}`
      );
    }

    const productData = {
      Description,
      Product_Brand_idProduct_Brand,
      Market_Price,
      Selling_Price,
      Main_Image_Url: mainImageUrl,
      Long_Description,
      SIH: totalQty,
    };

    // Build assoicated data objects
    const associatedData = {
      images: imagesArray,
      variations: variationData,
      faqs: faqs ? JSON.parse(faqs) : null,
      subCategoryIds: subCategoryIds ? JSON.parse(subCategoryIds) : null,
    };

    await Product.updateProduct(id, productData, associatedData);
    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Failed to update product" });
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

// Delete a product
async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.getProductById(id);

    if (product) {
      // Remove main image file if it exists
      if (product.Main_Image_Url) {
        // Convert URL to relative file path
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
    }

    // Remove sub images files if they exist
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

    // Delete product and associated data
    await Product.deleteProduct(id);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete product" });
  }
}

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  toggleCategoryStatus,
  createSubCategory,
  deleteSubCategory,
  createProduct,
  createBrand,
  getBrands,
  updateProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
};
