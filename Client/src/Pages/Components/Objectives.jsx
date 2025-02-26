import { ShieldCheck, FileSearch, FileEdit, Users } from 'lucide-react';
import './Objectives.css';

const LegalObjectives = () => {
    return (
        <section className="legal-objectives-section">
            <h2 className="legal-objectives-title" id="obj">Our Objectives</h2>
            <div className="legal-objectives-content">
                <div className="legal-objective-card">
                    <ShieldCheck />
                    <h3 className="legal-objective-heading">Secure Lease Management</h3>
                    <p className="legal-objective-description">Ensure data security and compliance with advanced encryption and secure access controls for lease document analysis and drafting.</p>
                </div>
                <div className="legal-objective-card">
                    <FileSearch />
                    <h3 className="legal-objective-heading">AI-Powered Document Analysis</h3>
                    <p className="legal-objective-description">Analyze lease agreements with AI to identify key terms, obligations, and compliance risks efficiently.</p>
                </div>
                <div className="legal-objective-card">
                    <FileEdit />
                    <h3 className="legal-objective-heading">Automated Lease Drafting</h3>
                    <p className="legal-objective-description">Generate legally compliant lease documents based on user inputs, reducing manual effort and ensuring accuracy.</p>
                </div>
                <div className="legal-objective-card">
                    <Users />
                    <h3 className="legal-objective-heading">User-Friendly Experience</h3>
                    <p className="legal-objective-description">Simplify lease creation and analysis with an intuitive interface designed for both landlords and tenants.</p>
                </div>
            </div>
        </section>
    );
};

export default LegalObjectives;
