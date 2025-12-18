import { Routes, Route, Navigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Events from "./pages/Events";
import CreateEvent from "./pages/CreateEvent";

function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));

  // Listen for changes to localStorage to update auth state
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuth(!!localStorage.getItem("token"));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuth(false);
  };

  return (
    <div className="app-container">
      <header className="app-header bg-white shadow-md">
        <div className="container d-flex justify-between align-center">
          <Link to="/" className="nav-brand text-decoration-none text-primary">
            📅 Mini Event Platform
          </Link>
          <nav className="nav">
            {isAuth ? (
              <div className="nav-links d-flex align-center gap-3">
                <Link to="/events" className="nav-link">Events</Link>
                <Link to="/create-event" className="nav-link">Create Event</Link>
                <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
              </div>
            ) : (
              <div className="nav-links d-flex align-center gap-3">
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="nav-link">Register</Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="app-main">
        <div className="container py-4">
          <Routes>
            <Route
              path="/"
              element={isAuth ? <Navigate to="/events" /> : <Navigate to="/login" />}
            />
            <Route path="/login" element={!isAuth ? <Login /> : <Navigate to="/events" />} />
            <Route path="/register" element={!isAuth ? <Register /> : <Navigate to="/events" />} />
            <Route
              path="/create-event"
              element={isAuth ? <CreateEvent /> : <Navigate to="/login" />}
            />
            <Route path="/events" element={<Events />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
