const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  joinEvent,
  leaveEvent,
  getMyCreatedEvents,
  getMyAttendingEvents,
} = require("../controllers/eventController");

// Public routes
router.get("/", getAllEvents);
router.get("/:id", getEventById);

// Protected routes
router.post("/", protect, upload.single("image"), createEvent);
router.put("/:id", protect, upload.single("image"), updateEvent);
router.delete("/:id", protect, deleteEvent);

// RSVP routes
router.post("/:id/rsvp", protect, joinEvent);
router.delete("/:id/rsvp", protect, leaveEvent);

// User dashboards
router.get("/my/created", protect, getMyCreatedEvents);
router.get("/my/attending", protect, getMyAttendingEvents);

module.exports = router;
