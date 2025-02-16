import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";
import "./UserLogin.css"; 

const UserLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User Logged In:", formData);
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          {/* Email Field */}
          <div className="input-group">
            <Mail className="input-icon" size={20} />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="input-field"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password Field */}
          <div className="input-group">
            <Lock className="input-icon" size={20} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input-field"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserLogin;
