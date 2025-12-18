const express = require("express");
const router = express.Router();

// Just test the imports separately
const { protect } = require("./middleware/authMiddleware");
const upload = require("./middleware/uploadMiddleware");

console.log('Protect function type:', typeof protect);
console.log('Upload object type:', typeof upload);
console.log('Upload.single type:', typeof upload.single);

// Import controllers
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
} = require("./controllers/eventController");

console.log('All controller functions imported');

// Test individual routes
router.get("/", getAllEvents);
router.get("/:id", getEventById);
console.log('Public routes added');

// Test the problematic routes one by one
try {
  router.post("/", protect, upload.single("image"), createEvent);
  console.log('POST route added successfully');
} catch (error) {
  console.error('Error adding POST route:', error.message);
}

try {
  router.put("/:id", protect, upload.single("image"), updateEvent);
  console.log('PUT route added successfully');
} catch (error) {
  console.error('Error adding PUT route:', error.message);
}

try {
  router.delete("/:id", protect, deleteEvent);
  console.log('DELETE route added successfully');
} catch (error) {
  console.error('Error adding DELETE route:', error.message);
}

module.exports = router;