const Event = require("../models/Event");

exports.createEvent = async (req, res) => {
  try {
    const { title, description, dateTime, location, capacity } = req.body;

    if (!title || !description || !dateTime || !location || !capacity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Ensure dateTime is properly converted to Date object
    const eventDateTime = new Date(dateTime);
    if (isNaN(eventDateTime.getTime())) {
      return res.status(400).json({ message: "Invalid date/time format" });
    }

    // Log file info for debugging
    console.log('File info:', req.file);

    // Get the image path (could be local path or Cloudinary URL)
    // For local storage, req.file.path will include the full path like "uploads/filename.jpg"
    const imagePath = req.file ? req.file.path || req.file.secure_url : null;

    const event = await Event.create({
      title,
      description,
      dateTime: eventDateTime,
      location,
      capacity,
      image: imagePath,  // Store the image path or URL
      createdBy: req.userId
    });

    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error: ' + error.message });
    }
    res.status(500).json({ message: error.message });
  }
};


exports.getAllEvents = async (req, res) => {
  try {
    // Get all events (both past and future) instead of just future events
    const events = await Event.find({})
      .sort({ dateTime: 1 })
      .populate("createdBy", "name email");

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("attendees", "name email");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Ownership check
    if (event.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Log file info for debugging
    console.log('Update file info:', req.file);

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        image: req.file ? (req.file.path || req.file.secure_url) : event.image  // Use path or URL if new file uploaded
      },
      { new: true }
    );

    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error: ' + error.message });
    }
    res.status(500).json({ message: error.message });
  }
};


exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Ownership check
    if (event.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await event.deleteOne();

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.joinEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.userId;

    const event = await Event.findOneAndUpdate(
      {
        _id: eventId,
        attendees: { $ne: userId },
        $expr: { $lt: [{ $size: "$attendees" }, "$capacity"] }
      },
      {
        $push: { attendees: userId }
      },
      { new: true }
    );

    if (!event) {
      return res.status(400).json({
        message: "Event full or already joined"
      });
    }

    res.json({
      message: "Successfully joined event",
      event
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.leaveEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.userId;

    const event = await Event.findByIdAndUpdate(
      eventId,
      { $pull: { attendees: userId } },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({
      message: "Successfully left event",
      event
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyCreatedEvents = async (req, res) => {
  try {
    const events = await Event.find({
      createdBy: req.userId
    }).sort({ createdAt: -1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyAttendingEvents = async (req, res) => {
  try {
    const events = await Event.find({
      attendees: req.userId
    }).sort({ dateTime: 1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};