import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      alert("Registration successful. Please login.");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-page d-flex justify-center align-center" style={{ minHeight: '100vh' }}>
      <div className="auth-container card w-100" style={{maxWidth: '400px'}}>
        <div className="text-center mb-4">
          <div className="mb-3">
            <div className="d-flex justify-center">
              <div style={{ width: '64px', height: '64px', backgroundColor: '#f0f0f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '24px' }}>🎫</span>
              </div>
            </div>
          </div>
          <h2 className="mb-1">Create Your Account</h2>
          <p className="text-gray-600">Join our community today</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mb-4">
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>
          <div className="d-flex justify-center">
            <button type="submit" className="btn btn-primary w-100">Register</button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">Already have an account? <a href="/login" className="nav-link text-decoration-none">Login here</a></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
