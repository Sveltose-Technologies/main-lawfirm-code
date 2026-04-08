const Event = require("../models/eventmodel");
/**
 * CREATE EVENT
 */
exports.createEvent = async (req, res) => {
  try {

    if (req.body.subcategoryIds && typeof req.body.subcategoryIds === "string") {
      req.body.subcategoryIds = JSON.parse(req.body.subcategoryIds);
    }

    if (req.body.cityIds && typeof req.body.cityIds === "string") {
      req.body.cityIds = JSON.parse(req.body.cityIds);
    }

    if (req.body.attorneyIds && typeof req.body.attorneyIds === "string") {
      req.body.attorneyIds = JSON.parse(req.body.attorneyIds);
    }

if (req.file) {
  req.body.bannerImage = `/uploads/${req.file.filename}`;
}

    const event = await Event.create(req.body);

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * GET ALL EVENTS
 */
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET EVENT BY ID
 */
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * UPDATE EVENT
 */
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

 if (req.file) {
  req.body.bannerImage = `/uploads/${req.file.filename}`;
} else {
  req.body.bannerImage = event.bannerImage;
}
    // Parse JSON fields if they are strings
    if (req.body.subcategoryIds && typeof req.body.subcategoryIds === "string") {
      req.body.subcategoryIds = JSON.parse(req.body.subcategoryIds);
    }
    if (req.body.cityIds && typeof req.body.cityIds === "string") {
      req.body.cityIds = JSON.parse(req.body.cityIds);
    }
    if (req.body.attorneyIds && typeof req.body.attorneyIds === "string") {
      req.body.attorneyIds = JSON.parse(req.body.attorneyIds);
    }

    await event.update(req.body);

    return res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: event,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * DELETE EVENT
 */
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    await event.destroy();

    return res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
