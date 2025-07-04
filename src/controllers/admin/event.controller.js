const Event = require("../../models/event.model");
const fs = require("fs");
const path = require("path");
const pool = require("../../config/database");

// ------------------------
// Event Related Functions
// ------------------------

// Get all events
async function getAllEvents(req, res) {
  try {
    const events = await Event.getAllEvents();

    res.status(200).json({ message: "Events fetched successfully", events });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Failed to fetch events" });
  }
}

// Get a single event by ID
async function getEventById(req, res) {
  try {
    const { id } = req.params;
    const event = await Event.getEventById(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ message: "Event fetched successfully", event });
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ message: "Failed to fetch event" });
  }
}

// Get products for a specific event
async function getEventProducts(req, res) {
  try {
    const { eventId } = req.params;
    const data = await Event.getEventProducts(eventId);

    res.status(200).json({
      message: "Event products fetched successfully",
      products: data.products,
      discounts: data.discounts,
    });
  } catch (error) {
    console.error("Error fetching event products:", error);
    res.status(500).json({ message: "Failed to fetch event products" });
  }
}

// Create a new event
async function createEvent(req, res) {
  try {
    const { eventName, eventDescription, productIds, status, discounts } =
      req.body;

    // Handle image upload
    let eventImageUrl = null;
    if (req.file) {
      eventImageUrl = `${req.protocol}://${req.get("host")}/src/uploads/${
        req.file.filename
      }`;
    }

    const eventData = {
      eventName,
      eventDescription,
      eventImageUrl,
      productIds: productIds ? JSON.parse(productIds) : [],
      status: status || "active",
      discounts: discounts ? JSON.parse(discounts) : [],
    };

    const result = await Event.createEvent(eventData);

    // Log the admin action
    await pool.query(
      "INSERT INTO admin_logs (admin_id, action, device_info, new_user_info) VALUES (?, ?, ?, ?)",
      [
        req.user.userId,
        "Created event",
        req.headers["user-agent"],
        JSON.stringify({
          eventName,
          eventDescription,
          productCount: eventData.productIds.length,
          discountCount: eventData.discounts.length,
        }),
      ]
    );

    res.status(201).json({
      message: "Event created successfully",
      eventId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Failed to create event" });
  }
}

// Update an existing event
async function updateEvent(req, res) {
  try {
    const { id } = req.params;
    const {
      eventName,
      eventDescription,
      productIds,
      status,
      removeImage,
      discounts,
    } = req.body;

    // Check if event exists and get original data
    const existingEvent = await Event.getEventById(id);
    if (!existingEvent) {
      return res.status(400).json({ message: "Event not found" });
    }

    let eventImageUrl = existingEvent.Event_Image_Url;

    // Handle image removal
    if (removeImage === "true" && existingEvent.Event_Image_Url) {
      const relative = existingEvent.Event_Image_Url.replace(
        `${req.protocol}://${req.get("host")}/src`,
        ""
      );
      const oldPath = path.join(__dirname, "../../", relative);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
      eventImageUrl = null;
    }

    // Handle new image upload
    if (req.file) {
      // Remove old image if it exists
      if (existingEvent.Event_Image_Url) {
        // strip off the host URL so we get a relative filesystem path
        const relative = existingEvent.Event_Image_Url.replace(
          `${req.protocol}://${req.get("host")}/src`,
          ""
        );
        const oldPath = path.join(__dirname, "../../", relative);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      eventImageUrl = `${req.protocol}://${req.get("host")}/src/uploads/${
        req.file.filename
      }`;
    }

    const eventData = {
      eventName,
      eventDescription,
      eventImageUrl,
      productIds: productIds ? JSON.parse(productIds) : [],
      status,
      discounts: discounts ? JSON.parse(discounts) : [],
    };

    await Event.updateEvent(id, eventData);

    // Prepare logging data with original and updated values
    const logData = {
      originalData: {
        eventName: existingEvent.Event_Name,
        eventDescription: existingEvent.Event_Description,
        status: existingEvent.Status,
        productCount: existingEvent.products
          ? existingEvent.products.length
          : 0,
        discountCount: existingEvent.discounts
          ? existingEvent.discounts.length
          : 0,
      },
      updatedData: {
        eventName,
        eventDescription,
        status,
        productCount: eventData.productIds.length,
        discountCount: eventData.discounts.length,
      },
    };

    // Log the admin action with both original and updated data
    await pool.query(
      "INSERT INTO admin_logs (admin_id, action, device_info, new_user_info) VALUES (?, ?, ?, ?)",
      [
        req.user.userId,
        "Updated event",
        req.headers["user-agent"],
        JSON.stringify(logData),
      ]
    );

    res.status(200).json({ message: "Event updated successfully" });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Failed to update event" });
  }
}

// Delete an event
async function deleteEvent(req, res) {
  try {
    const { id } = req.params;

    // Check if event exists
    const event = await Event.getEventById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Remove event image if it exists
    if (event.Event_Image_Url) {
      const relative = event.Event_Image_Url.replace(
        `${req.protocol}://${req.get("host")}/src`,
        ""
      );
      const imagePath = path.join(__dirname, "../../", relative);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Log the admin action before deletion
    await pool.query(
      "INSERT INTO admin_logs (admin_id, action, device_info, new_user_info) VALUES (?, ?, ?, ?)",
      [
        req.user.userId,
        "Deleted event",
        req.headers["user-agent"],
        JSON.stringify({
          eventId: id,
          eventName: event.Event_Name,
          eventDescription: event.Event_Description,
        }),
      ]
    );

    await Event.deleteEvent(id);
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Failed to delete event" });
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
