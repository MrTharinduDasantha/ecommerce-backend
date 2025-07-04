const pool = require("../config/database");

// ------------------------
// Event Related Functions
// ------------------------

// Get all events with their products and discounts
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

// Get a single event by ID with its products and discounts
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

  // Get discounts associated with this event
  const discountsQuery = `
        SELECT * FROM Event_Discounts WHERE Event_idEvent = ?
  `;
  const [discounts] = await pool.query(discountsQuery, [eventId]);

  // Parse productIds from JSON strings
  const parsedDiscounts = discounts.map((discount) => ({
    ...discount,
    productIds: JSON.parse(discount.Product_Ids || "[]"),
  }));

  event.products = products;
  event.discounts = parsedDiscounts;
  return event;
}

// Get products for a specific event with discount information
async function getEventProducts(eventId) {
  const query = ` 
        SELECT p.idProduct, p.Description, p.Main_Image_Url, p.Long_Description, p.Selling_Price, p.Market_Price, p.History_Status
        FROM Product p
        INNER JOIN Event_has_Product ehp ON p.idProduct = ehp.Product_idProduct
        WHERE ehp.Event_idEvent = ?
    `;
  const [products] = await pool.query(query, [eventId]);

  // Get discounts for this event
  const discountsQuery = `
        SELECT * FROM Event_Discounts WHERE Event_idEvent = ?
  `;
  const [discounts] = await pool.query(discountsQuery, [eventId]);

  // Parse productIds from JSON strings
  const parsedDiscounts = discounts.map((discount) => ({
    ...discount,
    productIds: JSON.parse(discount.Product_Ids || "[]"),
  }));

  return { products, discounts: parsedDiscounts };
}

// Create a new event with optional discounts
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

    // Insert event discounts if any
    if (eventData.discounts && eventData.discounts.length > 0) {
      const discountQuery = `
            INSERT INTO Event_Discounts (
                Event_idEvent,
                Product_Ids,
                Description,
                Discount_Type,
                Discount_Value,
                Start_Date,
                End_Date,
                Status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

      for (const discount of eventData.discounts) {
        await connection.query(discountQuery, [
          eventId,
          JSON.stringify(discount.productIds),
          discount.Description,
          discount.Discount_Type,
          discount.Discount_Value,
          discount.Start_Date,
          discount.End_Date,
          discount.Status,
        ]);
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

// Update an existing event with optional discounts
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

    // Delete existing event discounts
    await connection.query(
      `DELETE FROM Event_Discounts WHERE Event_idEvent = ?`,
      [eventId]
    );

    // Insert new event discounts if any
    if (eventData.discounts && eventData.discounts.length > 0) {
      const discountQuery = `
            INSERT INTO Event_Discounts (
                Event_idEvent,
                Product_Ids,
                Description,
                Discount_Type,
                Discount_Value,
                Start_Date,
                End_Date,
                Status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

      for (const discount of eventData.discounts) {
        await connection.query(discountQuery, [
          eventId,
          JSON.stringify(discount.productIds),
          discount.Description,
          discount.Discount_Type,
          discount.Discount_Value,
          discount.Start_Date,
          discount.End_Date,
          discount.Status,
        ]);
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

// Delete an event and its associated discounts
async function deleteEvent(eventId) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Delete event products first
    await connection.query(
      `DELETE FROM Event_has_Product WHERE Event_idEvent = ?`,
      [eventId]
    );

    // Delete event discounts
    await connection.query(
      `DELETE FROM Event_Discounts WHERE Event_idEvent = ?`,
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
