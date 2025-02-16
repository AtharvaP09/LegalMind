import React, { useState } from "react";
import { User, Mail, Lock } from "lucide-react";
import "./UserRegistration.css";

const UserRegistration = () => {

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User Registered:", formData);
  };

  return (
    <>
    <div className="register-container">
      <div className="register-wrapper">
        <h2 className="register-title">Register</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <div className="input-group">
            <User className="input-icon" size={20} />
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="input-field"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

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

          <button type="submit" className="register-button">
            Register
          </button>
        </form>
      </div>
    </div>
    </>
  )
}

export default UserRegistration