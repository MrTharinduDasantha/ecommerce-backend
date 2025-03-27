const pool = require("../config/database");

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
  getAllCategories,
  createCategory,
  updateCategory,
  toggleCategoryStatus,
  createSubCategory,
  deleteSubCategory,
};
