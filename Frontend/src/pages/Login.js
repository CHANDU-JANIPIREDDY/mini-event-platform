import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/events");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-page d-flex justify-center align-center" style={{ minHeight: '100vh' }}>
      <div className="auth-container card w-100" style={{maxWidth: '400px'}}>
        <div className="text-center mb-4">
          <div className="mb-3">
            <div className="d-flex justify-center">
              <div style={{ width: '64px', height: '64px', backgroundColor: '#f0f0f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '24px' }}>🔐</span>
              </div>
            </div>
          </div>
          <h2 className="mb-1">Welcome Back</h2>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit}>
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
            <button type="submit" className="btn btn-primary w-100">Login</button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">Don't have an account? <a href="/register" className="nav-link text-decoration-none">Register here</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
