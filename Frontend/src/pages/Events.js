import { useEffect, useState } from "react";
import API from "../api/axios";
import RSVP from "../components/RSVP";

const Events = () => {
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    try {
      const res = await API.get("/events");
      setEvents(res.data);
    } catch (error) {
      alert("Failed to load events");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle both Cloudinary URLs and local file paths
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';

    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    // For local storage fallback
    const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    if (imagePath.startsWith('uploads/')) {
      
      const pathParts = imagePath.split('/');
      const filename = pathParts[pathParts.length - 1];
      const encodedFilename = encodeURIComponent(filename);
      return `${apiBaseUrl}/uploads/${encodedFilename}`;
    } else {
      
      const encodedPath = encodeURIComponent(imagePath);
      return `${apiBaseUrl}/uploads/${encodedPath}`;
    }
  };

  return (
    <div className="events-page">
      <div className="d-flex justify-between align-center mb-4">
        <div>
          <h2 className="mb-0">Upcoming Events</h2>
          <p className="text-gray-600 mb-0">Discover and join our upcoming events</p>
        </div>
        <a href="/create-event" className="btn btn-primary">
          <span className="d-flex align-center gap-2">
            <span>+</span> Create New Event
          </span>
        </a>
      </div>

      {events.length === 0 ? (
        <div className="card text-center py-5">
          <div className="text-center">
            <div className="mb-3">🎫</div>
            <h3 className="mb-2">No events available</h3>
            <p className="text-gray-600 mb-3">Be the first to create an event!</p>
            <a href="/create-event" className="btn btn-primary">Create Event</a>
          </div>
        </div>
      ) : (
        <div className="row">
          {events.map((event) => (
            <div key={event._id} className="col-md-6 col-lg-4 mb-4">
              <div className="card event-card h-100 d-flex flex-column">
                {event.image ? (
                  <img
                    src={getImageUrl(event.image)}
                    alt={event.title}
                    className="card-img-top"
                    style={{ maxHeight: '200px', objectFit: 'cover' }}
                    onError={(e) => {
                      // Hide failed image and show fallback
                      e.target.style.display = 'none';
                      const fallback = e.target.nextElementSibling;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                    onLoad={(e) => {
                      // Hide fallback when image loads successfully
                      const fallback = e.target.nextElementSibling;
                      if (fallback) fallback.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="card-img-top d-flex align-items-center justify-content-center bg-light"
                       style={{ maxHeight: '200px' }}>
                    <div className="text-center text-muted">
                      <div className="mb-2">📷</div>
                      <small>No image available</small>
                    </div>
                  </div>
                )}
                {/* Fallback for failed image loads */}
                <div className="card-img-top d-flex align-items-center justify-content-center bg-light"
                     style={{ maxHeight: '200px', display: 'none' }}>
                  <div className="text-center text-muted">
                    <div className="mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                      </svg>
                    </div>
                    <small>Image failed to load</small>
                  </div>
                </div>
                <div className="card-body d-flex flex-column">
                  <h3 className="card-title mb-3">{event.title}</h3>
                  <p className="flex-grow-1 text-gray-700">{event.description}</p>
                  <div className="event-details mb-3">
                    <div className="d-flex align-center gap-1 mb-1">
                      <span>📍</span>
                      <span>{event.location}</span>
                    </div>
                    <div className="d-flex align-center gap-1 mb-1">
                      <span>📅</span>
                      <span>{new Date(event.dateTime).toLocaleString()}</span>
                    </div>
                    <div className="d-flex align-center gap-1">
                      <span>👥</span>
                      <span>{event.attendees.length} / {event.capacity} attendees</span>
                    </div>
                  </div>
                  <div className="mt-auto">
                    <RSVP eventId={event._id} refresh={fetchEvents} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
