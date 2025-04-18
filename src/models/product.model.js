const pool = require("../config/database");

// -------------------------------------------
// Category and Subcategory Related Functions
// -------------------------------------------

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

// --------------------------
// Product Related Functions
// --------------------------

// Insert main product record into product table
async function createProduct(productData) {
  const query = `
    INSERT INTO Product 
      (Description, Product_Brand_idProduct_Brand, Market_Price, Selling_Price, Main_Image_Url, Long_Description, SIH)
      VALUES (?,?,?,?,?,?,?)
  `;

  const [result] = await pool.query(query, [
    productData.Description,
    productData.Product_Brand_idProduct_Brand,
    productData.Market_Price,
    productData.Selling_Price,
    productData.Main_Image_Url,
    productData.Long_Description,
    productData.SIH,
  ]);
  return result;
}

// Insert a new brand into product brand table
async function createBrand(brandName, brandImageUrl, shortDescription, userId) {
  if (!brandName) throw new Error("Brand name is required");
  const query = `
    INSERT INTO Product_Brand (Brand_Name, Brand_Image_Url, ShortDescription, User_idUser)
    VALUES (?, ?, ?, ?)
  `;

  const [result] = await pool.query(query, [
    brandName,
    brandImageUrl,
    shortDescription,
    userId,
  ]);
  return result;
}

// Update an existing brand
async function updateBrand(
  brandId,
  brandName,
  brandImageUrl,
  shortDescription,
  userId
) {
  if (!brandName) throw new Error("Brand name is required");

  // Check if brand exists
  const [existingBrand] = await pool.query(
    "SELECT * FROM Product_Brand WHERE idProduct_Brand = ?",
    [brandId]
  );
  if (existingBrand.length === 0) {
    throw new Error("Brand not found");
  }

  // If image URL is provided, update it; otherwise, keep the existing one
  if (brandImageUrl) {
    const query = `
      UPDATE Product_Brand 
      SET Brand_Name = ?, Brand_Image_Url = ?, ShortDescription = ?
      WHERE idProduct_Brand = ?
    `;
    await pool.query(query, [
      brandName,
      brandImageUrl,
      shortDescription,
      brandId,
    ]);
  } else {
    const query = `
      UPDATE Product_Brand 
      SET Brand_Name = ?, ShortDescription = ?
      WHERE idProduct_Brand = ?
    `;
    await pool.query(query, [brandName, shortDescription, brandId]);
  }
}

// Delete a brand
async function deleteBrand(brandId) {
  // Check if brand exists
  const [existingBrand] = await pool.query(
    "SELECT * FROM Product_Brand WHERE idProduct_Brand = ?",
    [brandId]
  );
  if (existingBrand.length === 0) {
    throw new Error("Brand not found");
  }

  // Check if brand is used in any products
  const [products] = await pool.query(
    "SELECT COUNT(*) as count FROM Product WHERE Product_Brand_idProduct_Brand = ?",
    [brandId]
  );
  if (products[0].count > 0) {
    throw new Error("Cannot delete brand as it is used in products");
  }

  // Delete the brand
  await pool.query("DELETE FROM Product_Brand WHERE idProduct_Brand = ?", [
    brandId,
  ]);
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
    INSERT INTO Product_Variations (Product_idProduct, Colour, Size, Qty, SIH)
    VALUES (?,?,?,?,?)
  `;

  const [result] = await pool.query(query, [
    productId,
    variation.colorCode,
    variation.size,
    variation.quantity,
    variation.quantity,
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

// Update a product
async function updateProduct(productId, productData, associatedData) {
  const query = `
    UPDATE Product
    SET Description = ?, Product_Brand_idProduct_Brand = ?, Market_Price = ?, Selling_Price = ?, Main_Image_Url = ?, Long_Description = ?, SIH = ?
    WHERE idProduct = ?
  `;

  await pool.query(query, [
    productData.Description,
    productData.Product_Brand_idProduct_Brand,
    productData.Market_Price,
    productData.Selling_Price,
    productData.Main_Image_Url,
    productData.Long_Description,
    productData.SIH,
    productId,
  ]);

  // Update product images: Delete existing images and insert new ones
  if (associatedData.images) {
    await pool.query("DELETE FROM Product_Images WHERE Product_idProduct = ?", [
      productId,
    ]);
    for (const imageUrl of associatedData.images) {
      await createProductImages(productId, imageUrl);
    }
  }

  // Update variations: Delete existing variations and insert new ones
  if (associatedData.variations) {
    await pool.query(
      "DELETE FROM Product_Variations WHERE Product_idProduct = ?",
      [productId]
    );
    for (const variation of associatedData.variations) {
      await createProductVariant(productId, variation);
    }
  }

  // Update faqs: Delete existing faqs and insert new ones
  if (associatedData.faqs) {
    await pool.query("DELETE FROM FAQ WHERE Product_idProduct = ?", [
      productId,
    ]);
    for (const faq of associatedData.faqs) {
      await createProductFaq(productId, faq);
    }
  }

  // Update subcategories: Delete existing join records and insert new ones
  if (associatedData.subCategoryIds) {
    await pool.query(
      "DELETE FROM Product_has_Sub_Category WHERE Product_idProduct = ?",
      [productId]
    );
    for (const subCat of associatedData.subCategoryIds) {
      // If subCat is an object, extract its id; otherwise, use it directly.
      const subCatId = subCat.idSub_Category ? subCat.idSub_Category : subCat;
      await createProductSubCategory(productId, subCatId);
    }
  }
}

// Get all products
async function getAllProducts() {
  const query = `
    SELECT P.*, 
      B.Brand_Name,
      B.Brand_Image_Url,
      B.ShortDescription,
      (SELECT COUNT(*) FROM order_has_product_variations ohpv
       JOIN Product_Variations pv ON ohpv.Product_Variations_idProduct_Variations = pv.idProduct_Variations
       WHERE pv.Product_idProduct = P.idProduct) > 0 as hasOrders
    FROM Product P
    LEFT JOIN Product_Brand B 
      ON P.Product_Brand_idProduct_Brand = B.idProduct_Brand
  `;
  const [products] = await pool.query(query);

  // For each product, fetch all images, variations, faqs, and subcategories
  for (const product of products) {
    // Get all sub images
    const [images] = await pool.query(
      "SELECT * FROM Product_Images WHERE Product_idProduct = ?",
      [product.idProduct]
    );
    product.images = images;

    // Get all variations
    const [variations] = await pool.query(
      "SELECT * FROM Product_Variations WHERE Product_idProduct = ?",
      [product.idProduct]
    );
    product.variations = variations;

    // Get all faqs
    const [faqs] = await pool.query(
      "SELECT * FROM FAQ WHERE Product_idProduct = ?",
      [product.idProduct]
    );
    product.faqs = faqs;

    // Get all subcategories
    const [subCats] = await pool.query(
      `SELECT SC.*
       FROM Sub_Category SC
       JOIN Product_has_Sub_Category PS 
        ON SC.idSub_Category = PS.Sub_Category_idSub_Category
       WHERE PS.Product_idProduct = ?`,
      [product.idProduct]
    );
    product.subcategories = subCats;
  }

  return products;
}

// Get all products by subcategory id
async function getProductsBySubCategory(subCategoryId) {
  const query = `
    SELECT P.*, B.Brand_Name
    FROM Product P
    JOIN Product_has_Sub_Category PS ON P.idProduct = PS.Product_idProduct
    JOIN Product_Brand B ON P.Product_Brand_idProduct_Brand = B.idProduct_Brand
    WHERE PS.Sub_Category_idSub_Category = ?
  `;
  const [products] = await pool.query(query, [subCategoryId]);

  // Fetch additional data like images for each product
  for (const product of products) {
    const [images] = await pool.query(
      "SELECT * FROM Product_Images WHERE Product_idProduct = ?",
      [product.idProduct]
    );
    product.images = images;
  }

  return products;
}

// Get all products by brand id
async function getProductsByBrand(brandId) {
  const query = `
    SELECT P.*, B.Brand_Name
    FROM Product P
    JOIN Product_Brand B ON P.Product_Brand_idProduct_Brand = B.idProduct_Brand
    WHERE P.Product_Brand_idProduct_Brand = ?
  `;
  const [products] = await pool.query(query, [brandId]);

  // Fetch additional data like images for each product
  for (const product of products) {
    const [images] = await pool.query(
      "SELECT * FROM Product_Images WHERE Product_idProduct = ?",
      [product.idProduct]
    );
    product.images = images;
  }

  return products;
}

// Get a single product by id
async function getProductById(productId) {
  // Fetch main product record with brand info
  const query = `
    SELECT P.*, 
      B.Brand_Name,
      B.Brand_Image_Url,
      B.ShortDescription
    FROM Product P
    LEFT JOIN Product_Brand B 
      ON P.Product_Brand_idProduct_Brand = B.idProduct_Brand
    WHERE P.idProduct = ?
  `;
  const [rows] = await pool.query(query, [productId]);
  if (rows.length === 0) return null;
  const product = rows[0];

  // Get all sub images
  const [images] = await pool.query(
    "SELECT * FROM Product_Images WHERE Product_idProduct = ?",
    [product.idProduct]
  );
  product.images = images;

  // Get all variations
  const [variations] = await pool.query(
    "SELECT * FROM Product_Variations WHERE Product_idProduct = ?",
    [product.idProduct]
  );
  product.variations = variations;

  // Get all faqs
  const [faqs] = await pool.query(
    "SELECT * FROM FAQ WHERE Product_idProduct = ?",
    [product.idProduct]
  );
  product.faqs = faqs;

  // Get all subcategories
  const [subCats] = await pool.query(
    `SELECT SC.*
     FROM Sub_Category SC
     JOIN Product_has_Sub_Category PS ON SC.idSub_Category = PS.Sub_Category_idSub_Category
     WHERE PS.Product_idProduct = ?`,
    [product.idProduct]
  );
  product.subcategories = subCats;

  return product;
}

// Delete a product and its related records
async function deleteProduct(productId) {
  // Delete from join table
  await pool.query(
    "DELETE FROM Product_has_Sub_Category WHERE Product_idProduct = ?",
    [productId]
  );

  // Delete product images
  await pool.query("DELETE FROM Product_Images WHERE Product_idProduct = ?", [
    productId,
  ]);

  // Delete product variations
  await pool.query(
    "DELETE FROM Product_Variations WHERE Product_idProduct = ?",
    [productId]
  );

  // Delete faqs
  await pool.query("DELETE FROM FAQ WHERE Product_idProduct = ?", [productId]);

  // Delete product
  await pool.query("DELETE FROM Product WHERE idProduct = ?", [productId]);
}

// ---------------------------
// Discount Related Functions
// ---------------------------

// Get all discounts
async function getAllDiscounts() {
  const query = `
    SELECT d.*, p.Description as ProductName
    FROM Discounts d
    JOIN Product p ON d.Product_idProduct = p.idProduct
    ORDER BY d.created_at DESC
  `;
  const [discounts] = await pool.query(query);
  return discounts;
}

// Get discounts for a specific product
async function getDiscountsByProductId(productId) {
  const query = `
    SELECT * FROM Discounts
    WHERE Product_idProduct = ?
    ORDER BY created_at DESC
  `;
  const [discounts] = await pool.query(query, [productId]);
  return discounts;
}

// Create a new discount
async function createDiscount(discountData) {
  const query = `
    INSERT INTO Discounts (
      Product_idProduct,
      Description,
      Dicaunt_Type,
      Discount_Value,
      Start_Date,
      End_Date,
      Status
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await pool.query(query, [
    discountData.productId,
    discountData.description,
    discountData.discountType,
    discountData.discountValue,
    discountData.startDate,
    discountData.endDate,
    discountData.status || "active",
  ]);

  return result;
}

// Update an existing discount
async function updateDiscount(discountId, discountData) {
  const query = `
    UPDATE Discounts
    SET
      Product_idProduct = ?,
      Description = ?,
      Dicaunt_Type = ?,
      Discount_Value = ?,
      Start_Date = ?,
      End_Date = ?,
      Status = ?
    WHERE idDiscounts = ?
  `;

  const [result] = await pool.query(query, [
    discountData.productId,
    discountData.description,
    discountData.discountType,
    discountData.discountValue,
    discountData.startDate,
    discountData.endDate,
    discountData.status,
    discountId,
  ]);
}

// Delete a discount
async function deleteDiscount(discountId) {
  const query = `
    DELETE FROM Discounts
    WHERE idDiscounts = ?
  `;
  const [result] = await pool.query(query, [discountId]);
  return result;
}

// Get a single discount by id
async function getDiscountById(discountId) {
  const query = `
    SELECT d.*, p.Description as ProductName
    FROM Discounts d
    JOIN Product p ON d.Product_idProduct = p.idProduct
    WHERE d.idDiscounts = ?
  `;
  const [rows] = await pool.query(query, [discountId]);
  return rows.length > 0 ? rows[0] : null;
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
  updateBrand,
  deleteBrand,
  getBrands,
  createProductImages,
  createProductVariant,
  createProductFaq,
  createProductSubCategory,
  updateProduct,
  getAllProducts,
  getProductsBySubCategory,
  getProductsByBrand,
  getProductById,
  deleteProduct,
  getAllDiscounts,
  getDiscountsByProductId,
  createDiscount,
  updateDiscount,
  deleteDiscount,
  getDiscountById,
};
