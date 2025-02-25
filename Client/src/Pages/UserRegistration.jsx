import { useState } from 'react';
import './UserAuth.css';
import { MdOutlineMail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { useNavigate} from 'react-router-dom';
import API from '../api';

const UserRegistration = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      await API.post('/api/UserRegistration', formData);
      alert('Registration successful');
      navigate('/UserLogin');
  } catch (error) {
      alert('An error occurred');
      console.log(error);
    }
  };

  return (
    <div className="wrapper">
    <div className="auth-container">
      <div className="auth-form-container">
        <div className="auth-form-box">
          <h1 className="auth-logo">LegalMind</h1>
          <p className="auth-subtitle">Create your account!!</p>


          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                name="username"
                className="form-input"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label"><MdOutlineMail />   Email</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label"><TbLockPassword />  Password</label>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }} className='remember-me'>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <input type="checkbox" />
                Remember me
              </label>
              <a href="/forgot-password" className="auth-link">Forgot Password?</a>
            </div>
            
            <button type="submit" className="auth-button">
              Create Account
            </button>
          </form>

          <p className="auth-alternate">
            Already have an account?{' '}
            <a href="/UserLogin" className="auth-link">Log in</a>
          </p>
        </div>
      </div>

      <div className="auth-info">
        <h2 className="auth-info-title">LegalMind</h2>
        <p className="auth-info-subtitle">
          Your AI-Powered Legal Document Assistant
        </p>
        <p className="auth-info-text">
          Transform your legal document workflow with LegalMind. Our advanced AI technology 
          streamlines document drafting, analysis, and review processes, helping legal 
          professionals work smarter and more efficiently. Experience the future of legal 
          document management today.
        </p>
      </div>
    </div>
    </div>
  );
};

export default UserRegistration;