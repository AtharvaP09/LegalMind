import { useEffect } from 'react';
import './Guide.css';

const LegalMindGuide = () => {
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    try {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } catch (error) {
      // Fallback for browsers that don't support smooth scrolling
      window.scrollTo(0, 0);
    }
  };
  // Total step counter for continuous numbering
  let stepCounter = 0;

  return (
    <div className="lm-container">
      <header className="lm-header">
        <h1 className="lm-main-heading">
          <span className="lm-icon">🧠</span> Welcome to LegalMind
        </h1>
        <p className="lm-subheading">Your Smart Lease Document Assistant</p>
      </header>

      <section className="lm-toc-section">
        <div className="lm-section-header">
          <h2 className="lm-section-title">
            <span className="lm-section-icon">📖</span> Quick Navigation
          </h2>
          <p className="lm-section-description">Jump to any section of this guide</p>
        </div>
        <div className="lm-toc-grid">
          <a href="#lm-features" className="lm-toc-card">
            <div className="lm-toc-card-icon">✨</div>
            <h3>What You Can Do</h3>
          </a>
          <a href="#lm-steps" className="lm-toc-card">
            <div className="lm-toc-card-icon">🚶</div>
            <h3>Step-by-Step Guide</h3>
          </a>
          <a href="#lm-disclaimer" className="lm-toc-card">
            <div className="lm-toc-card-icon">🛡️</div>
            <h3>Legal Disclaimer</h3>
          </a>
          <a href="#lm-usecases" className="lm-toc-card">
            <div className="lm-toc-card-icon">🎯</div>
            <h3>Best Use Cases</h3>
          </a>
          <a href="#lm-faq" className="lm-toc-card">
            <div className="lm-toc-card-icon">❓</div>
            <h3>FAQ</h3>
          </a>
        </div>
      </section>

      <section id="lm-features" className="lm-content-section">
        <div className="lm-section-header">
          <h2 className="lm-section-title">
            <span className="lm-section-icon">✨</span> What You Can Do
          </h2>
          <p className="lm-section-description">Discover LegalMind's powerful features</p>
        </div>
        <div className="lm-features-grid">
          <div className="lm-feature-card">
            <div className="lm-feature-icon">📝</div>
            <h3>Draft Lease Agreements</h3>
            <p>Create fully-formatted lease documents in minutes</p>
          </div>
          <div className="lm-feature-card">
            <div className="lm-feature-icon">🔍</div>
            <h3>Analyze Documents</h3>
            <p>AI-powered lease document analysis and simplification</p>
          </div>
          <div className="lm-feature-card">
            <div className="lm-feature-icon">📥</div>
            <h3>Download Documents</h3>
            <p>Export clean, professional legal documents</p>
          </div>
          <div className="lm-feature-card">
            <div className="lm-feature-icon">📂</div>
            <h3>Document History</h3>
            <p>Access all your previous documents anytime</p>
          </div>
        </div>
      </section>

      <section id="lm-steps" className="lm-content-section">
        <div className="lm-section-header">
          <h2 className="lm-section-title">
            <span className="lm-section-icon">🚶</span> Step-by-Step Guide
          </h2>
          <p className="lm-section-description">Follow these instructions to get the most out of LegalMind</p>
        </div>

        <div className="lm-step-group">
          <div className="lm-step-header">
            <div className="lm-step-number">1</div>
            <h3 className="lm-step-title">Getting Started</h3>
          </div>
          <ol className="lm-step-list" start={1}>
            <li className="lm-step-item">Visit <a href="http://localhost:5173/LeaseDraftInitial" className="lm-link">LegalMind Website</a></li>
            <li className="lm-step-item">Click <strong>"Get Started"</strong></li>
            <li className="lm-step-item">Login or create an account</li>
          </ol>
          
        </div>

        <div className="lm-step-group">
          <div className="lm-step-header">
            <div className="lm-step-number">2</div>
            <h3 className="lm-step-title">Draft a Lease Agreement</h3>
          </div>
          <ol className="lm-step-list" start={stepCounter + 1}>
            <li className="lm-step-item">Go to the Main Page after login</li>
            <li className="lm-step-item">Select <strong>"Draft Lease Agreement"</strong></li>
            <li className="lm-step-item">Enter the document name</li>
            <li className="lm-step-item">Fill in details: parties, property, rent, etc.</li>
            <li className="lm-step-item">Optionally add custom clauses</li>
            <li className="lm-step-item">Click <strong>Generate</strong> and download the document</li>
          </ol>
          
          <div className="lm-note-box">
            <div className="lm-note-icon">ℹ️</div>
            <div>
              <strong>Note:</strong> Review all entries carefully. This tool helps format your lease, but legal review is advised.
            </div>
          </div>
        </div>

        <div className="lm-step-group">
          <div className="lm-step-header">
            <div className="lm-step-number">3</div>
            <h3 className="lm-step-title">Analyze a Lease Document</h3>
          </div>
          <ol className="lm-step-list" start={stepCounter + 1}>
            <li className="lm-step-item">Select <strong>"Analyze Lease Document"</strong></li>
            <li className="lm-step-item">Upload a lease document (PDF/Word)</li>
            <li className="lm-step-item">Our AI will extract and simplify important clauses</li>
            <li className="lm-step-item">View terms like Termination, Subletting, etc.</li>
          </ol>
          
          <div className="lm-tip-box">
            <div className="lm-tip-icon">💡</div>
            <div>
              <strong>Tip:</strong> This feature is particularly useful for tenants reviewing complex lease agreements.
            </div>
          </div>
        </div>

        <div className="lm-step-group">
          <div className="lm-step-header">
            <div className="lm-step-number">4</div>
            <h3 className="lm-step-title">View and Download Documents</h3>
          </div>
          <ol className="lm-step-list" start={stepCounter + 1}>
            <li className="lm-step-item">Visit <strong>Document History</strong></li>
            <li className="lm-step-item">Download or review previous drafts or analysis</li>
          </ol>
          
        </div>

        <div className="lm-step-group">
          <div className="lm-step-header">
            <div className="lm-step-number">5</div>
            <h3 className="lm-step-title">Need Help?</h3>
          </div>
          <ol className="lm-step-list" start={stepCounter + 1}>
            <li className="lm-step-item">Open the <strong>Support</strong> menu</li>
            <li className="lm-step-item">Send a support request or use live chat</li>
          </ol>
        </div>
      </section>

      <section id="lm-disclaimer" className="lm-disclaimer-section">
        <div className="lm-section-header">
          <h2 className="lm-section-title">
            <span className="lm-section-icon">🛡️</span> Legal Disclaimer
          </h2>
        </div>
        <div className="lm-disclaimer-content">
          <div className="lm-disclaimer-icon">⚠️</div>
          <p>
            LegalMind is a tool to assist with lease drafting and understanding. It does not replace certified legal consultation. 
            Always verify documents with a legal expert before signing. The creators of LegalMind are not responsible 
            for any legal consequences resulting from the use of this tool.
          </p>
        </div>
      </section>

      <section id="lm-usecases" className="lm-content-section">
        <div className="lm-section-header">
          <h2 className="lm-section-title">
            <span className="lm-section-icon">🎯</span> Best Use Cases
          </h2>
          <p className="lm-section-description">Who can benefit most from LegalMind</p>
        </div>
        <div className="lm-usecase-grid">
          <div className="lm-usecase-card">
            <h3>Real Estate Agents</h3>
            <p>Quickly draft professional lease agreements for multiple properties</p>
          </div>
          <div className="lm-usecase-card">
            <h3>Tenants</h3>
            <p>Understand complex lease terms before signing</p>
          </div>
          <div className="lm-usecase-card">
            <h3>Landlords</h3>
            <p>Create customized, legally-formatted agreements</p>
          </div>
          <div className="lm-usecase-card">
            <h3>Legal Professionals</h3>
            <p>Save time on document drafting and review</p>
          </div>
        </div>
      </section>

      <section id="lm-faq" className="lm-faq-section">
        <div className="lm-section-header">
          <h2 className="lm-section-title">
            <span className="lm-section-icon">❓</span> Frequently Asked Questions
          </h2>
          <p className="lm-section-description">Common questions about LegalMind</p>
        </div>
        <div className="lm-faq-accordion">
          <div className="lm-faq-item">
            <button className="lm-faq-question">
              Is LegalMind legally binding?
              <span className="lm-faq-toggle">+</span>
            </button>
            <div className="lm-faq-answer">
              <p>LegalMind helps draft documents but they should be reviewed by a legal professional to ensure they meet all legal requirements in your jurisdiction.</p>
            </div>
          </div>
          <div className="lm-faq-item">
            <button className="lm-faq-question">
              Can I edit my documents later?
              <span className="lm-faq-toggle">+</span>
            </button>
            <div className="lm-faq-answer">
              <p>Yes, all your documents are saved in your Document History where you can view, edit, or download them at any time.</p>
            </div>
          </div>
          <div className="lm-faq-item">
            <button className="lm-faq-question">
              What file formats are supported?
              <span className="lm-faq-toggle">+</span>
            </button>
            <div className="lm-faq-answer">
              <p>For analysis, we support PDF and Word documents. You can download your leases as PDF or Word files.</p>
            </div>
          </div>
          <div className="lm-faq-item">
            <button className="lm-faq-question">
              Is my data secure?
              <span className="lm-faq-toggle">+</span>
            </button>
            <div className="lm-faq-answer">
              <p>We use industry-standard encryption and security practices to protect your data. However, we recommend not uploading highly sensitive documents.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="lm-footer">
        <div className="lm-footer-content">
          <div className="lm-footer-brand">
            <span className="lm-footer-icon">🧠</span>
            <span>LegalMind</span>
          </div>
          <p className="lm-footer-text">
            Built for simplified lease documentation • © 2025 LegalMind
          </p>
          <div className="lm-footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact Us</a>
          </div>
        </div>
      </footer>

      
    </div>
  );
};

export default LegalMindGuide;