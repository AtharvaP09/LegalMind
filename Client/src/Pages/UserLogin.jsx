import { useState } from 'react';
import './UserAuth.css';
import { Link } from 'react-router-dom';
import { MdOutlineMail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';
import API from '../api';

const UserLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    try{
      const response = await API.post('/api/UserLogin', formData , {withCredentials: true});

      if (response.data.username){
        sessionStorage.setItem('username', response.data.username);
        alert(`Welcome, ${response.data.username}!`);
        navigate('/Dashboard');
      }
      else {
        alert('Invalid email or password')
        console.log(response);
      }
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
          <p className="auth-subtitle">Welcome back! Please log in to continue.</p>


          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
            
              <label className="form-label"><MdOutlineMail />  Email</label>
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
                placeholder="Enter your password"
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
              Log In
            </button>
          </form>

          <p className="auth-alternate">
            Don't have an account?{' '}
            <Link to={'/UserRegistration'}>Sign Up</Link>
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

export default UserLogin;