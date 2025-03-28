const pool = require("../config/database");

// ---------------------------
// Product Related Functions
// ---------------------------

// Insert main product record into product table
async function createProduct(productData) {
  const query = `
    INSERT INTO Product 
      (Description, Product_Brand_idProduct_Brand, Market_Price, Selling_Price, Main_Image_Url, Long_Description)
      VALUES (?,?,?,?,?,?,?,?,?)
  `;

  const [result] = await pool.query(query, [
    productData.Description,
    productData.Product_Brand_idProduct_Brand,
    productData.Market_Price,
    productData.Selling_Price,
    productData.Main_Image_Url,
    productData.Long_Description,
    productData.SKU,
  ]);
  return result;
}

// Insert a new brand into product brand table
async function createBrand(brandName, shortDescription, userId) {
  if (!brandName) throw new Error("Brand name is required");
  const query = `
    INSERT INTO Product_Brand (Brand_Name, ShortDescription, User_idUser)
    VALUES (?, ?, ?)
  `;

  const [result] = await pool.query(query, [
    brandName,
    shortDescription,
    userId,
  ]);
  return result;
}

// Get all brands
async function getBrands() {
  const [brands] = await pool.query("SELECT * FROM Product_Brand");
  return brands;
}

// Insert each sub image into product images table
async function createProductImages(productId, imageUrl) {
  const query = `
    INSERT INTO Product_Images (Product_idProduct, Image_Url)
    VALUES (?, ?)
  `;

  const [result] = await pool.query(query, [productId, imageUrl]);
  return result;
}

// Insert a variant into product variant table
async function createProductVariant(productId, variation) {
  const query = `
    INSERT INTO Product_Variations (Product_idProduct, Colour, Size, Qty, SKU)
    VALUES (?,?,?,?,?)
  `;

  // Generate a unique SKU for this variant
  const generatedSKU =
    productId + "-" + variation.size + "-" + variation.colorCode;
  const [result] = await pool.query(query, [
    productId,
    variation.colorCode,
    variation.size,
    variation.qty,
    generatedSKU,
  ]);
  return result;
}

// Insert an faq record into faq table
async function createProductFaq(productId, faq) {
  const query = `
    INSERT INTO FAQ (Question, Answer, Product_idProduct)
    VALUES (?, ?, ?)
  `;

  const [result] = await pool.query(query, [
    faq.question,
    faq.answer,
    productId,
  ]);
  return result;
}

// Insert product to subcategory join records in product has sub category table
async function createProductSubCategory(productId, subCategoryId) {
  const query = `
    INSERT INTO Product_has_Sub_Category (Product_idProduct, Sub_Category_idSub_Category)
    VALUES (?, ?)
  `;
  await pool.query(query, [productId, subCategoryId]);
}

// --------------------------------------------
// Category and Subcategory Related Functions
// --------------------------------------------

// Fetch all categories with subcategories
async function getAllCategories() {
  const [categories] = await pool.query("SELECT * FROM Product_Category");
  const [subcategories] = await pool.query("SELECT * FROM Sub_Category");

  // Map subcategories into each category
  const categoryList = categories.map((cat) => {
    // Filter subcategories that belong to this category
    const relatedSubs = subcategories.filter(
      (sub) =>
        sub.Product_Category_idProduct_Category === cat.idProduct_Category
    );
    return {
      ...cat,
      subcategories: relatedSubs,
    };
  });

  return categoryList;
}

// Create a new category
async function createCategory(description, imageUrl) {
  if (!description) {
    throw new Error("Category description is required");
  }
  const query = `
    INSERT INTO Product_Category (Description, Image_Icon_Url)
    VALUES (?, ?)
  `;
  const [result] = await pool.query(query, [description, imageUrl]);
  return result; // result.insertId will be the new category id
}

// Update an existing category
async function updateCategory(categoryId, description, imageUrl) {
  if (!description) {
    throw new Error("Category description is required");
  }
  if (imageUrl) {
    const query = `
      UPDATE Product_Category
      SET Description = ?, Image_Icon_Url = ?
      WHERE idProduct_Category = ?
    `;
    await pool.query(query, [description, imageUrl, categoryId]);
  } else {
    const query = `
      UPDATE Product_Category
      SET Description = ?
      WHERE idProduct_Category = ?
    `;
    await pool.query(query, [description, categoryId]);
  }
}

// Toggle or update the status column for a category
async function toggleCategoryStatus(categoryId, status) {
  if (!status) {
    throw new Error("Status is required");
  }
  const query = `
    UPDATE Product_Category
    SET Status = ?
    WHERE idProduct_Category = ?
  `;
  await pool.query(query, [status, categoryId]);
}

// Create a new subcategory
async function createSubCategory(categoryId, description) {
  if (!description) {
    throw new Error("Subcategory description is required");
  }
  // Ensure the category exists
  const [categories] = await pool.query(
    "SELECT * FROM Product_Category WHERE idProduct_Category = ?",
    [categoryId]
  );
  if (categories.length === 0) {
    throw new Error("Category does not exist");
  }

  const query = `
    INSERT INTO Sub_Category (Description, Product_Category_idProduct_Category)
    VALUES (?, ?)
  `;
  const [result] = await pool.query(query, [description, categoryId]);
  return result;
}

// Delete a sub category
async function deleteSubCategory(subCategoryId) {
  // If there's a linking table to Product (Product_has_Sub_Category),
  // remove references first:
  await pool.query(
    "DELETE FROM Product_has_Sub_Category WHERE Sub_Category_idSub_Category = ?",
    [subCategoryId]
  );

  // Then delete the subcategory
  await pool.query("DELETE FROM Sub_Category WHERE idSub_Category = ?", [
    subCategoryId,
  ]);
}

module.exports = {
  createProduct,
  createBrand,
  getBrands,
  createProductImages,
  createProductVariant,
  createProductFaq,
  createProductSubCategory,
  getAllCategories,
  createCategory,
  updateCategory,
  toggleCategoryStatus,
  createSubCategory,
  deleteSubCategory,
};
