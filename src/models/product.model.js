const pool = require("../config/database");

// -------------------------------------------
// Category and Subcategory Related Functions
// -------------------------------------------

// Fetch all categories with subcategories
async function getAllCategories() {
  const [categories] = await pool.query("SELECT * FROM Product_Category");

  // Prepare an array with subcategories nested
  const categoryList = await Promise.all(
    categories.map(async (cat) => {
      const [subcategories] = await pool.query(
        "SELECT * FROM Sub_Category WHERE Product_Category_idProduct_Category = ?",
        [cat.idProduct_Category]
      );

      return {
        ...cat,
        subcategories, // Attach subcategories to the category
      };
    })
  );

  return categoryList;
}

// Get top 6 selling categories
async function getTopSellingCategories() {
  const query = `
    SELECT 
        pc.idProduct_Category,
        pc.Description AS Category_Name,
        pc.Image_Icon_Url,
        pc.Description AS Category_Description,
        COALESCE(SUM(p.Sold_Qty), 0) AS Total_Sold_Qty
    FROM 
        Product_Category pc
    LEFT JOIN 
        Sub_Category sc ON pc.idProduct_Category = sc.Product_Category_idProduct_Category
    LEFT JOIN 
        Product_has_Sub_Category phsc ON sc.idSub_Category = phsc.Sub_Category_idSub_Category
    LEFT JOIN 
        Product p ON phsc.Product_idProduct = p.idProduct
    GROUP BY 
        pc.idProduct_Category, pc.Description, pc.Image_Icon_Url
    ORDER BY 
        Total_Sold_Qty DESC
    LIMIT 6
  `;
  const [categories] = await pool.query(query);
  return categories;
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

// Delete a category and its subcategories
async function deleteCategory(categoryId) {
  // First check if any subcategories are used in products
  const [subcategories] = await pool.query(
    "SELECT idSub_Category FROM Sub_Category WHERE Product_Category_idProduct_Category = ?",
    [categoryId]
  );

  for (const sub of subcategories) {
    const [products] = await pool.query(
      "SELECT COUNT(*) as count FROM Product_has_Sub_Category WHERE Sub_Category_idSub_Category = ?",
      [sub.idSub_Category]
    );

    if (products[0].count > 0) {
      throw new Error(
        "Cannot delete category as a subcategory has already been added to a product"
      );
    }
  }

  // Delete all subcategories first
  await pool.query(
    "DELETE FROM Sub_Category WHERE Product_Category_idProduct_Category = ?",
    [categoryId]
  );

  // Then delete the category
  await pool.query(
    "DELETE FROM Product_Category WHERE idProduct_Category = ?",
    [categoryId]
  );
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

// Update a subcategory
async function updateSubCategory(categoryId, subCategoryId, description) {
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

  // Ensure the subcategory exists
  const [subcategories] = await pool.query(
    "SELECT * FROM Sub_Category WHERE idSub_Category = ? AND Product_Category_idProduct_Category = ?",
    [subCategoryId, categoryId]
  );

  if (subcategories.length === 0) {
    throw new Error("Subcategory does not exist");
  }

  const query = `
    UPDATE Sub_Category
    SET Description = ?
    WHERE idSub_Category = ?
  `;

  await pool.query(query, [description, subCategoryId]);
}

// Check if a subcategory is used in any products
async function checkSubCategoryInUse(subCategoryId) {
  const [products] = await pool.query(
    "SELECT COUNT(*) as count FROM Product_has_Sub_Category WHERE Sub_Category_idSub_Category = ?",
    [subCategoryId]
  );

  return products[0].count > 0;
}

// Delete a sub category
async function deleteSubCategory(subCategoryId) {
  // Check if the subcategory is used in any products
  const inUse = await checkSubCategoryInUse(subCategoryId);

  if (inUse) {
    throw new Error("Cannot delete subcategory as it is used in products");
  }

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

// ------------------------
// Brand Related Functions
// ------------------------

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

// --------------------------
// Product Related Functions
// --------------------------

// Insert main product record into product table
async function createProduct(productData) {
  const query = `
    INSERT INTO Product 
      (Description, Product_Brand_idProduct_Brand, Market_Price, Selling_Price, Main_Image_Url, Long_Description, SIH, Seasonal_Offer, Rush_Delivery, For_You)
      VALUES (?,?,?,?,?,?,?,?,?,?)
  `;

  const [result] = await pool.query(query, [
    productData.Description,
    productData.Product_Brand_idProduct_Brand,
    productData.Market_Price,
    productData.Selling_Price,
    productData.Main_Image_Url,
    productData.Long_Description,
    productData.SIH,
    productData.Seasonal_Offer || 0,
    productData.Rush_Delivery || 0,
    productData.For_You || 0,
  ]);
  return result;
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
  // Update main product details
  const query = `
    UPDATE Product
    SET Description = ?, Product_Brand_idProduct_Brand = ?, Market_Price = ?, Selling_Price = ?, Main_Image_Url = ?, Long_Description = ?, SIH = ?, Seasonal_Offer = ?, Rush_Delivery = ?, For_You = ?
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
    productData.Seasonal_Offer || 0,
    productData.Rush_Delivery || 0,
    productData.For_You || 0,
    productId,
  ]);

  // Update product images: Delete existing images and insert new ones
  if (associatedData.images || associatedData.deletedImages) {
    // Delete specified images first
    if (associatedData.deletedImages) {
      await pool.query(
        "DELETE FROM Product_Images WHERE Product_idProduct = ? AND Image_Url IN (?)",
        [productId, associatedData.deletedImages]
      );
    }

    // Delete all images if new ones are provided
    if (associatedData.images) {
      await pool.query(
        "DELETE FROM Product_Images WHERE Product_idProduct = ?",
        [productId]
      );
      for (const imageUrl of associatedData.images) {
        await createProductImages(productId, imageUrl);
      }
    }
  }

  // Update variations
  if (associatedData.variations) {
    const newVariations = associatedData.variations;
    const [existingVariations] = await pool.query(
      "SELECT idProduct_Variations FROM Product_Variations WHERE Product_idProduct = ?",
      [productId]
    );
    const existingIds = existingVariations.map((v) => v.idProduct_Variations);
    const newIds = newVariations.filter((v) => v.id).map((v) => v.id);

    const toDelete = existingIds.filter((id) => !newIds.includes(id));
    for (const id of toDelete) {
      const [orders] = await pool.query(
        "SELECT COUNT(*) as count FROM order_has_product_variations WHERE Product_Variations_idProduct_Variations = ?",
        [id]
      );
      if (orders[0].count > 0) {
        throw new Error("Cannot delete variation as it has been ordered");
      }
    }
    if (toDelete.length > 0) {
      await pool.query(
        "DELETE FROM Product_Variations WHERE idProduct_Variations IN (?)",
        [toDelete]
      );
    }

    for (const variation of newVariations) {
      if (variation.id) {
        await pool.query(
          "UPDATE Product_Variations SET Colour = ?, Size = ?, Qty = ?, SIH = ? WHERE idProduct_Variations = ?",
          [
            variation.colorCode,
            variation.size,
            variation.quantity,
            variation.quantity,
            variation.id,
          ]
        );
      } else {
        await createProductVariant(productId, variation);
      }
    }
  }

  // Update faqs
  if (associatedData.faqs) {
    const newFaqs = associatedData.faqs;
    const [existingFaqs] = await pool.query(
      "SELECT idFAQ FROM FAQ WHERE Product_idProduct = ?",
      [productId]
    );
    const existingIds = existingFaqs.map((f) => f.idFAQ);
    const newIds = newFaqs.filter((f) => f.id).map((f) => f.id);

    const toDelete = existingIds.filter((id) => !newIds.includes(id));
    if (toDelete.length > 0) {
      await pool.query("DELETE FROM FAQ WHERE idFAQ IN (?)", [toDelete]);
    }

    for (const faq of newFaqs) {
      if (faq.id) {
        await pool.query(
          "UPDATE FAQ SET Question = ?, Answer = ? WHERE idFAQ = ?",
          [faq.question, faq.answer, faq.id]
        );
      } else {
        await createProductFaq(productId, faq);
      }
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

// Toggle or update the history status of a product
async function toggleProductHistoryStatus(productId, historyStatus) {
  if (!historyStatus) {
    throw new Error("History status is required");
  }

  const query = `
    UPDATE Product
    SET History_Status = ?
    WHERE idProduct = ?
  `;

  await pool.query(query, [historyStatus, productId]);
}

// Toggle or update the status of a product
async function toggleProductStatus(productId, status) {
  if (!status) {
    throw new Error("Status is required");
  }

  const query = `
    UPDATE Product
    SET Status = ?
    WHERE idProduct = ?
  `;

  await pool.query(query, [status, productId]);
}

// Get all products
async function getAllProducts() {
  const query = `
    SELECT P.*, 
      B.Brand_Name,
      B.Brand_Image_Url,
      B.ShortDescription,
      (SELECT COUNT(*) FROM order_has_product_variations ohpv
        JOIN Product_Variations pv 
          ON ohpv.Product_Variations_idProduct_Variations = pv.idProduct_Variations
        WHERE pv.Product_idProduct = P.idProduct
      ) > 0 as hasOrders,
      (SELECT COUNT(*) FROM Cart_has_Product chp
        JOIN Product_Variations pv 
        ON chp.Product_Variations_idProduct_Variations = pv.idProduct_Variations 
      WHERE pv.Product_idProduct = P.idProduct
      ) > 0 as hasCart
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

    // Get active discounts for each product
    product.discounts = await getActiveDiscountsByProductId(product.idProduct);

    // Get active event‐level discounts for each product
    product.eventDiscounts = await getActiveEventDiscountsByProductId(
      product.idProduct
    );
  }

  return products;
}

// Get the total number of products
async function getProductCount() {
  const query = `SELECT COUNT(*) AS totalProducts FROM Product`;
  const [result] = await pool.query(query);
  return result[0].totalProducts; // Return the count value
}

// Get top sold products
async function getProductsSoldQty() {
  const query = `
    SELECT idProduct, Description, Sold_Qty, Main_Image_Url,Selling_Price,Market_Price
    FROM Product
    WHERE Sold_Qty > 0
    ORDER BY Sold_Qty DESC
    LIMIT 5
  `;
  console.log("Executing getProductsSoldQty query");
  const [products] = await pool.query(query);
  console.log("Query result:", products);
  return products;
}

// Get sold quantity of a product
async function getProductSoldQty(productId) {
  const query = `
    SELECT idProduct, Description, Sold_Qty
    FROM Product
    WHERE idProduct = ?
  `;
  const [rows] = await pool.query(query, [productId]);
  return rows.length > 0 ? rows[0] : null;
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
    product.discounts = await getActiveDiscountsByProductId(product.idProduct);
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
    product.discounts = await getActiveDiscountsByProductId(product.idProduct);
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
    `SELECT PV.*, 
      (SELECT COUNT(*) FROM order_has_product_variations ohpv 
       WHERE ohpv.Product_Variations_idProduct_Variations = PV.idProduct_Variations) > 0 as hasOrders
     FROM Product_Variations PV
     WHERE PV.Product_idProduct = ?`,
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

  // Get active discounts for this product
  product.discounts = await getActiveDiscountsByProductId(product.idProduct);

  // Get active event‐level discounts for this product
  product.eventDiscounts = await getActiveEventDiscountsByProductId(
    product.idProduct
  );

  return product;
}

// Get sales information for a product
async function getProductSalesInfo(productId) {
  // Get total units sold and revenue in last 30 days
  const [totals] = await pool.query(
    `SELECT SUM(ohpv.Qty) AS totalUnitsSoldLast30Days, SUM(ohpv.Total_Amount) AS totalRevenueLast30Days
    FROM Order_has_Product_Variations ohpv
    JOIN \`Order\` o ON ohpv.Order_idOrder = o.idOrder
    JOIN Product_Variations pv ON ohpv.Product_Variations_idProduct_Variations = pv.idProduct_Variations
    WHERE pv.Product_idProduct = ?
    AND o.Date_Time >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    AND o.Payment_Stats = 'paid'`,
    [productId]
  );

  // Get weekly sales data for the last 30 days
  const [weeklySales] = await pool.query(
    `SELECT DATE_FORMAT(o.Date_Time, '%Y-%u') AS week, SUM(ohpv.Qty) AS unitsSold, SUM(ohpv.Total_Amount) AS revenue
    FROM Order_has_Product_Variations ohpv
    JOIN \`Order\` o ON ohpv.Order_idOrder = o.idOrder
    JOIN Product_Variations pv ON ohpv.Product_Variations_idProduct_Variations = pv.idProduct_Variations
    WHERE pv.Product_idProduct = ?
    AND o.Date_Time >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    AND o.Payment_Stats = 'paid'
    GROUP BY week
    ORDER BY week`,
    [productId]
  );

  return {
    totalUnitsSoldLast30Days: totals[0].totalUnitsSoldLast30Days || 0,
    totalRevenueLast30Days: totals[0].totalRevenueLast30Days || 0,
    weeklySales: weeklySales,
  };
}

// Get all products with active discounts
async function getDiscountedProducts() {
  const query = `
    SELECT DISTINCT P.*
    FROM Product P
    JOIN Discounts D ON P.idProduct = D.Product_idProduct
    WHERE D.Status = 'active'
    AND CURDATE() BETWEEN STR_TO_DATE(D.Start_Date, '%Y-%m-%d') AND STR_TO_DATE(D.End_Date, '%Y-%m-%d')
  `;
  const [products] = await pool.query(query);

  // Fetch complete details and discounts for each product
  const detailedProducts = [];
  for (const product of products) {
    const fullProduct = await getProductById(product.idProduct);
    const discounts = await getDiscountsByProductId(product.idProduct);

    // Filter active discounts
    fullProduct.discounts = discounts.filter((d) => {
      const today = new Date();
      const startDate = new Date(d.Start_Date);
      const endDate = new Date(d.End_Date);
      return d.Status === "active" && today >= startDate && today <= endDate;
    });

    detailedProducts.push(fullProduct);
  }

  return detailedProducts;
}

// Delete a product and its related records
async function deleteProduct(productId) {
  // Check if product exists in cart
  const [cartItems] = await pool.query(
    "SELECT COUNT(*) as count FROM Cart_has_Product chp JOIN Product_Variations pv ON chp.Product_Variations_idProduct_Variations = pv.idProduct_Variations WHERE pv.Product_idProduct = ?",
    [productId]
  );

  if (cartItems[0].count > 0) {
    throw new Error("Cannot delete product as it is currently in someone's cart");
  }

  // Check if product has been ordered
  const [orderItems] = await pool.query(
    "SELECT COUNT(*) as count FROM Order_has_Product_Variations ohpv JOIN Product_Variations pv ON ohpv.Product_Variations_idProduct_Variations = pv.idProduct_Variations WHERE pv.Product_idProduct = ?",
    [productId]
  );

  if (orderItems[0].count > 0) {
    throw new Error("Cannot delete product as it has already been ordered");
  }

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

  // Delete discounts
  await pool.query("DELETE FROM Discounts WHERE Product_idProduct = ?", [
    productId,
  ]);

  // Delete event's product
  await pool.query(
    "DELETE FROM Event_has_Product WHERE Product_idProduct = ?",
    [productId]
  );

  // Delete product
  await pool.query("DELETE FROM Product WHERE idProduct = ?", [productId]);
}

// ---------------------------
// Discount Related Functions
// ---------------------------

// Get active event‐discounts for a specific product
async function getActiveEventDiscountsByProductId(productId) {
  const query = `
    SELECT
      ed.idEvent_Discounts    AS id,
      ed.Event_idEvent        AS eventId,
      ed.Product_Ids          AS productIdsJson,
      ed.Description          AS description,
      ed.Discount_Type        AS discountType,
      ed.Discount_Value       AS discountValue,
      ed.Start_Date           AS startDate,
      ed.End_Date             AS endDate,
      ed.Status               AS status
    FROM Event_Discounts ed
    JOIN Event_has_Product ehp
      ON ed.Event_idEvent = ehp.Event_idEvent
    WHERE ehp.Product_idProduct = ?
      AND ed.Status = 'active'
      AND CURDATE() BETWEEN STR_TO_DATE(ed.Start_Date, '%Y-%m-%d') AND STR_TO_DATE(ed.End_Date, '%Y-%m-%d') 
  `;
  const [rows] = await pool.query(query, [productId]);
  return rows.map((r) => ({
    id: r.id,
    eventId: r.eventId,
    productIds: JSON.parse(r.productIdsJson || "[]"),
    description: r.description,
    discountType: r.discountType,
    discountValue: r.discountValue,
    startDate: r.startDate,
    endDate: r.endDate,
    status: r.status,
  }));
}

// Get active discounts for a specific product
async function getActiveDiscountsByProductId(productId) {
  const query = `
    SELECT * FROM Discounts 
    WHERE Product_idProduct = ?
    AND Status = 'active'
    AND CURDATE() BETWEEN STR_TO_DATE(Start_Date, '%Y-%m-%d') AND STR_TO_DATE(End_Date, '%Y-%m-%d')
  `;
  const [discounts] = await pool.query(query, [productId]);
  return discounts;
}

// Get all discounts
async function getAllDiscounts() {
  const query = `
    SELECT d.*,
      p.Description as ProductName,
      (SELECT COUNT(*) FROM Order_has_Product_Variations ohpv
      WHERE ohpv.Discounts_idDiscounts = d.idDiscounts) > 0 as hasOrders
    FROM Discounts d
    JOIN Product p ON d.Product_idProduct = p.idProduct
    ORDER BY created_at DESC
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
      Discount_Type,
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
      Discount_Type = ?,
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
  // Category and Sub-Category related functions
  getAllCategories,
  getTopSellingCategories,
  createCategory,
  updateCategory,
  toggleCategoryStatus,
  deleteCategory,
  createSubCategory,
  updateSubCategory,
  checkSubCategoryInUse,
  deleteSubCategory,
  // Brand related functions
  createBrand,
  updateBrand,
  deleteBrand,
  getBrands,
  // Product related functions
  createProduct,
  createProductImages,
  createProductVariant,
  createProductFaq,
  createProductSubCategory,
  updateProduct,
  toggleProductHistoryStatus,
  toggleProductStatus,
  getAllProducts,
  getProductCount,
  getProductsSoldQty,
  getProductSoldQty,
  getProductsBySubCategory,
  getProductsByBrand,
  getProductById,
  getProductSalesInfo,
  getDiscountedProducts,
  deleteProduct,
  // Discount related functions
  getAllDiscounts,
  getDiscountsByProductId,
  getActiveDiscountsByProductId,
  getActiveEventDiscountsByProductId,
  createDiscount,
  updateDiscount,
  deleteDiscount,
  getDiscountById,
};
