const pool = require("../config/database");

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

// ------------------------
// Event Related Functions
// ------------------------

// Get all events with their products
async function getAllEvents() {
  const query = `
        SELECT e.*,
            (SELECT COUNT(*) FROM Event_has_Product ehp WHERE ehp.Event_idEvent = e.idEvent) as productCount
        FROM Event e
        ORDER BY e.created_at DESC
    `;
  const [events] = await pool.query(query);
  return events;
}

// Get a single event by ID with its products
async function getEventById(eventId) {
  const eventQuery = `
        SELECT * FROM Event WHERE idEvent = ?
    `;
  const [eventRows] = await pool.query(eventQuery, [eventId]);

  if (eventRows.length === 0) {
    return null;
  }

  const event = eventRows[0];

  // Get products associated with this event
  const productsQuery = `
        SELECT p.*, ehp.Event_idEvent
        FROM Product p
        INNER JOIN Event_has_Product ehp ON p.idProduct = ehp.Product_idProduct
        WHERE ehp.Event_idEvent = ?
  `;
  const [products] = await pool.query(productsQuery, [eventId]);

  event.products = products;
  return event;
}

// Get products for a specific event
async function getEventProducts(eventId) {
  const query = ` 
        SELECT p.idProduct, p.Description, p.Main_Image_Url, p.Long_Description, p.Selling_Price, p.Market_Price, p.History_Status
        FROM Product p
        INNER JOIN Event_has_Product ehp ON p.idProduct = ehp.Product_idProduct
        WHERE ehp.Event_idEvent = ?
    `;
  const [products] = await pool.query(query, [eventId]);
  
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

// Create a new event
async function createEvent(eventData) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Insert event
    const eventQuery = `
            INSERT INTO Event (
                Event_Name,
                Event_Description,
                Event_Image_Url,
                Status
            ) VALUES (?, ?, ?, ?)
        `;

    const [eventResult] = await connection.query(eventQuery, [
      eventData.eventName,
      eventData.eventDescription,
      eventData.eventImageUrl,
      eventData.status || "active",
    ]);

    const eventId = eventResult.insertId;

    // Insert event products if any
    if (eventData.productIds && eventData.productIds.length > 0) {
      const productQuery = `
            INSERT INTO Event_has_Product (Event_idEvent, Product_idProduct)
            VALUES (?, ?)
        `;

      for (const productId of eventData.productIds) {
        await connection.query(productQuery, [eventId, productId]);
      }
    }

    await connection.commit();
    return { insertId: eventId };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Update an existing event
async function updateEvent(eventId, eventData) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Update event
    const eventQuery = `
            UPDATE Event
            SET
                Event_Name = ?,
                Event_Description = ?,
                Event_Image_Url = ?,
                Status = ?
            WHERE idEvent = ?
        `;

    await connection.query(eventQuery, [
      eventData.eventName,
      eventData.eventDescription,
      eventData.eventImageUrl,
      eventData.status,
      eventId,
    ]);

    // Delete existing event products
    await connection.query(
      `DELETE FROM Event_has_Product WHERE Event_idEvent = ?`,
      [eventId]
    );

    // Insert new event products if any
    if (eventData.productIds && eventData.productIds.length > 0) {
      const productQuery = `
            INSERT INTO Event_has_Product (Event_idEvent, Product_idProduct)
            VALUES (?, ?)
        `;

      for (const productId of eventData.productIds) {
        await connection.query(productQuery, [eventId, productId]);
      }
    }

    await connection.commit();
    return { affectedRows: 1 };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Delete an event
async function deleteEvent(eventId) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Delete event products first
    await connection.query(
      `DELETE FROM Event_has_Product WHERE Event_idEvent = ?`,
      [eventId]
    );

    // Delete event
    const query = `
        DELETE FROM Event WHERE idEvent = ?
      `;
    const [result] = await connection.query(query, [eventId]);

    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  getAllEvents,
  getEventById,
  getEventProducts,
  createEvent,
  updateEvent,
  deleteEvent,
};
