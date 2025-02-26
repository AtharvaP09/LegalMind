import './Landing.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Objectives from './components/Objectives';
import Contact from './components/Contact';
import Footer from './components/Footer';

function LandingPage() {
  return (
    <>
      <div className="fade-in">
        <Navbar />
      </div>
      <div className="fade-in">
        <Hero />
      </div>
      <div className="fade-in">
        <Objectives />
      </div>
      <div className="fade-in">
        <Contact />
      </div>
      <div className="fade-in">
        <Footer />
      </div>
    </>
  );
}

export default LandingPage;