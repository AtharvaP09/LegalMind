import "./Hero.css";
import { Link } from "react-router-dom";

const LegalHero = () => {
  return (
    <div className="legal-hero-container">
      <div className="legal-intro">
        <h1>Create with Precision, Analyze with Insight, Ensure Compliance with Confidence.</h1>
        <p>Your AI-Powered Assistant for Effortless Lease Document Analysis and Drafting</p>
        <div className="legal-cta-buttons">
          <Link to={'/home'}>
            <button className="legal-button">Get Started</button>
          </Link>
          <a href="#obj">
            <button className="legal-button">Learn More</button>
          </a>
        </div>
      </div>
      <div className="legal-image-wrapper">
        <div className="legal-image-container">
          <img src="./LeaseLandingImg.png" alt="Lease Analysis" className="legal-hero-image" />
        </div>
      </div>
    </div>
  );
};

export default LegalHero;
