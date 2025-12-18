import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const CreateEvent = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    dateTime: "",
    location: "",
    capacity: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that the date is in the future
    const eventDateTime = new Date(form.dateTime);
    const now = new Date();
    if (eventDateTime <= now) {
      alert("Please select a future date and time for the event");
      return;
    }

    try {
      const data = new FormData();
      Object.keys(form).forEach((key) => data.append(key, form[key]));
      if (image) data.append("image", image);

      await API.post("/events", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Event created successfully");
      navigate("/events");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create event");
    }
  };

  return (
    <div className="create-event-page">
      <div className="card">
        <div className="card-header pb-3">
          <h2 className="card-title mb-1">Create New Event</h2>
          <p className="text-gray-600 mb-0">Fill in the details for your new event</p>
        </div>

        <form onSubmit={handleSubmit} className="mb-0">
          <div className="form-group mb-3">
            <label className="mb-1">Event Title</label>
            <input
              name="title"
              type="text"
              placeholder="Enter event title"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label className="mb-1">Event Description</label>
            <textarea
              name="description"
              placeholder="Describe your event"
              className="form-control"
              rows="4"
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="form-group mb-3">
            <label className="mb-1">Date & Time</label>
            <input
              type="datetime-local"
              name="dateTime"
              className="form-control"
              onChange={handleChange}
              required
              min={new Date().toISOString().slice(0, 16)} // Set minimum to current time
            />
            <small className="text-gray-600">Please select a future date and time</small>
          </div>

          <div className="form-group mb-3">
            <label className="mb-1">Location</label>
            <input
              name="location"
              type="text"
              placeholder="Enter event location"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group mb-4">
            <label className="mb-1">Maximum Capacity</label>
            <input
              type="number"
              name="capacity"
              placeholder="Enter maximum number of attendees"
              className="form-control"
              onChange={handleChange}
              required
              min="1"
            />
          </div>

          <div className="form-group mb-4">
            <label className="mb-1">Event Image</label>

            {/* Preview of selected image */}
            {imagePreview && (
              <div className="mb-3">
                <div className="d-flex justify-center mb-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
                <div className="text-center">
                  <small className="text-gray-600">Selected: {image.name}</small>
                </div>
              </div>
            )}

            <label htmlFor="image-upload" className="btn btn-outline-secondary w-100 d-block">
              {image ? image.name || 'Selected file' : 'Upload Event Image'}
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="d-none"
            />
          </div>

          <div className="d-flex justify-between align-center pt-3 border-top">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => navigate('/events')}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
