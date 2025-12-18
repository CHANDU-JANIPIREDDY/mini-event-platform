# Event Management Platform – MERN Stack

A full-stack **Event Management Platform** built using the **MERN stack (MongoDB, Express.js, React.js, Node.js)**.  
The application allows users to create, view, and RSVP to events while strictly enforcing event capacity and handling concurrent RSVP requests safely.

This project was developed as part of a **Full Stack Developer Intern – Technical Screening Assignment**.

---

##  Live Demo

- **Frontend:** https://mini-event-platform-frontend.onrender.com  
- **Backend:** https://mini-event-platform-940z.onrender.com  

---

## Tech Stack

### Frontend
- React.js (Create React App)
- Axios
- React Router
- Responsive CSS

### Backend
- Node.js
- Express.js
- MongoDB (MongoDB Atlas)
- Mongoose
- JWT Authentication
- Multer & Cloudinary (Image Upload)

### Deployment
- **Frontend:** Render (Static Site)
- **Backend:** Render (Web Service)
- **Database:** MongoDB Atlas

---

##  Features Implemented

###  User Authentication
- User registration and login
- JWT-based authentication
- Protected routes and APIs

###  Event Management (CRUD)
Authenticated users can:
- Create events with:
  - Title
  - Description
  - Date & Time
  - Location
  - Capacity
  - Event image upload
- View all upcoming events
- Edit or delete **only events created by them**

###  RSVP System (Core Business Logic)
- Users can RSVP to events and cancel RSVPs
- Strict **capacity enforcement**
- Prevents **duplicate RSVPs**
- Handles **concurrent RSVP requests** safely (no overbooking)

###  Responsive UI
- Fully responsive design
- Optimized for Desktop, Tablet, and Mobile devices

---

##  RSVP Capacity & Concurrency Handling (Technical Explanation)

To prevent **overbooking when multiple users RSVP simultaneously**, the backend uses **atomic database operations**.

### Strategy Used
- MongoDB atomic updates with conditional checks
- RSVP is processed only if:
  - Event capacity has not been reached
  - The user has not already RSVPed

### Why This Works
- MongoDB guarantees atomicity at the document level
- Prevents race conditions
- Ensures data consistency even under high concurrency

---

##  How to Run the Project Locally

### 1️ Clone the Repository
```bash
git clone https://github.com/CHANDU-JANIPIREDDY/mini-event-platform.git
cd mini-event-platform


Backend Setup
cd Backend
npm install


Create a .env file inside the Backend folder:

PORT=5000
MONGO_URI=mongodb+srv://chandu:chandu%40%40104@cluster0.js6jphw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=CHANDU_JANIPIREDDY
CLOUDINARY_CLOUD_NAME=dtyges8mx
CLOUDINARY_API_KEY=761161386373216
CLOUDINARY_API_SECRET=q9iHWAoEXwLKAII1B0eL-LtdWv0


Run backend:

npm start


2.Frontend Setup
cd ../Frontend
npm install


Create a .env file inside the Frontend folder:

REACT_APP_API_URL=http://localhost:5000/api || https://mini-event-platform-940z.onrender.com/api


Run frontend:

npm start