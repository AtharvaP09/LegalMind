// components/DocumentsSection/DocumentsSection.jsx
import { useEffect, useState } from 'react';
import API from '../../api';
import './Documents.css';

const DocumentsSection = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const username = sessionStorage.getItem('username');  // ✅ Get username from session

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await API.get(`/api/user/documents?username=${username}`);
        setDocuments(response.data.documents);
      } catch (error) {
        console.error('Failed to fetch documents:', error);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchDocuments();
    }
  }, [username]);

  return (
    <div className="documents-container">
      <h2>Your Drafted Documents</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="document-card-list">
          {documents.length > 0 ? (
            documents.map((doc) => (
              <div className="document-card" key={doc.id}>
                <h3>{doc.filename}</h3>
                <p><strong>Status:</strong> {doc.status}</p>
                <p><strong>Created:</strong> {new Date(doc.created_at).toLocaleString()}</p>
                <a
                  href={`http://127.0.0.1:5000/${doc.filepath}`}
                  target="_blank"
                  rel="noreferrer"
                  className="download-btn"
                >
                  Download
                </a>
              </div>
            ))
          ) : (
            <p>No documents found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentsSection;

