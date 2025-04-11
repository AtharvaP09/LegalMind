import { useEffect } from 'react';
import './Guide.css';

const LegalMindGuide = () => {
  useEffect(() => {
    const backToTopBtn = document.querySelector('.lm-back-to-top');
    const toggleBackToTop = () => {
      if (window.scrollY > 300) backToTopBtn.classList.add('lm-show');
      else backToTopBtn.classList.remove('lm-show');
    };
    window.addEventListener('scroll', toggleBackToTop);
    return () => window.removeEventListener('scroll', toggleBackToTop);
  }, []);

  // Total step counter for continuous numbering
  let stepCounter = 0;

  return (
    <div className="lm-container">
      <h1 className="lm-main-heading">
        🧠 Welcome to LegalMind <br />
        <span className="lm-subheading">Your Smart Lease Document Assistant</span>
      </h1>

      <section className="lm-toc-section">
        <h2 className="lm-section-title">📖 Quick Navigation</h2>
        <ul className="lm-toc-list">
          <li className="lm-toc-item"><a href="#lm-features" id='lm-link'>What You Can Do</a></li>
          <li className="lm-toc-item"><a href="#lm-steps" id='lm-link'>Step-by-Step Guide</a></li>
          <li className="lm-toc-item"><a href="#lm-disclaimer" id='lm-link'>Legal Disclaimer</a></li>
          <li className="lm-toc-item"><a href="#lm-usecases" id='lm-link'>Best Use Cases</a></li>
          <li className="lm-toc-item"><a href="#lm-faq" id='lm-link'>FAQ</a></li>
        </ul>
      </section>

      <section id="lm-features" className="lm-content-section">
        <h2 className="lm-section-title">📌 What You Can Do</h2>
        <ul className="lm-features-list">
          <li className="lm-feature-item">📝 Draft a fully-formatted lease agreement</li>
          <li className="lm-feature-item">🔍 Analyze lease documents with AI</li>
          <li className="lm-feature-item">📥 Download clean legal documents</li>
          <li className="lm-feature-item">📂 View your document history</li>
          <li className="lm-feature-item">💬 Chat with support for guidance</li>
        </ul>
      </section>

      <section id="lm-steps" className="lm-content-section">
        <h2 className="lm-section-title">🚶 Step-by-Step Guide</h2>

        <div className="lm-step-group">
          <h3 className="lm-step-title">Getting Started</h3>
          <ol className="lm-step-list" start={1}>
            <li className="lm-step-item">Visit <a href="http://localhost:5173/LeaseDraftInitial" id='lm-link'>LegalMind Website</a></li>
            <li className="lm-step-item">Click <strong>"Get Started"</strong></li>
            <li className="lm-step-item">Login or create an account</li>
          </ol>
          {stepCounter += 3}
        </div>

        <div className="lm-step-group">
          <h3 className="lm-step-title">Draft a Lease Agreement</h3>
          <ol className="lm-step-list" start={stepCounter + 1}>
            <li className="lm-step-item">Go to the Main Page after login</li>
            <li className="lm-step-item">Select <strong>"Draft Lease Agreement"</strong></li>
            <li className="lm-step-item">Enter the document name</li>
            <li className="lm-step-item">Fill in details: parties, property, rent, etc.</li>
            <li className="lm-step-item">Optionally add custom clauses</li>
            <li className="lm-step-item">Click <strong>Generate</strong> and download the document</li>
          </ol>
          {stepCounter += 6}
          <div className="lm-note-box">
            <strong>Note:</strong> Review all entries carefully. This tool helps format your lease, but legal review is advised.
          </div>
        </div>

        <div className="lm-step-group">
          <h3 className="lm-step-title">Analyze a Lease Document</h3>
          <ol className="lm-step-list" start={stepCounter + 1}>
            <li className="lm-step-item">Select <strong>"Analyze Lease Document"</strong></li>
            <li className="lm-step-item">Upload a lease document (PDF/Word)</li>
            <li className="lm-step-item">Our AI will extract and simplify important clauses</li>
            <li className="lm-step-item">View terms like Termination, Subletting, etc.</li>
          </ol>
          {stepCounter += 4}
          <div className="lm-tip-box">
            <strong>Tip:</strong> This feature is particularly useful for tenants reviewing complex lease agreements.
          </div>
        </div>

        <div className="lm-step-group">
          <h3 className="lm-step-title">View and Download Documents</h3>
          <ol className="lm-step-list" start={stepCounter + 1}>
            <li className="lm-step-item">Visit <strong>Document History</strong></li>
            <li className="lm-step-item">Download or review previous drafts or analysis</li>
          </ol>
          {stepCounter += 2}
        </div>

        <div className="lm-step-group">
          <h3 className="lm-step-title">Need Help?</h3>
          <ol className="lm-step-list" start={stepCounter + 1}>
            <li className="lm-step-item">Open the <strong>Support</strong> menu</li>
            <li className="lm-step-item">Send a support request or use live chat</li>
          </ol>
        </div>
      </section>

      <section id="lm-disclaimer" className="lm-disclaimer-section">
        <h3 className="lm-section-subtitle">🛡️ Legal Disclaimer</h3>
        <p className="lm-disclaimer-text">
          LegalMind is a tool to assist with lease drafting and understanding. It does not replace certified legal consultation. Always verify documents with a legal expert before signing.
        </p>
      </section>

      <section id="lm-usecases" className="lm-content-section">
        <h2 className="lm-section-title">🎯 Best Use Cases</h2>
        <ul className="lm-usecase-list">
          <li className="lm-usecase-item">Real estate agents needing quick drafts</li>
          <li className="lm-usecase-item">Tenants reviewing lease terms</li>
          <li className="lm-usecase-item">Landlords drafting new agreements</li>
          <li className="lm-usecase-item">Legal interns handling multiple documents</li>
        </ul>
      </section>

      <section id="lm-faq" className="lm-faq-section">
        <h2 className="lm-section-title">❓ Frequently Asked Questions</h2>
        <ul className="lm-faq-list">
          <li className="lm-faq-item">
            <strong className="lm-faq-question">Is LegalMind legally binding?</strong> 
            <span className="lm-faq-answer">– It helps draft documents but should be reviewed by a professional.</span>
          </li>
          <li className="lm-faq-item">
            <strong className="lm-faq-question">Can I edit my documents later?</strong> 
            <span className="lm-faq-answer">– Yes, go to your document history.</span>
          </li>
        </ul>
      </section>

      <footer className="lm-footer">
        &copy; 2025 LegalMind – Built for simplified lease documentation
      </footer>

      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
        className="lm-back-to-top"
      >
        ⬆️ Top
      </button>
    </div>
  );
};

export default LegalMindGuide;