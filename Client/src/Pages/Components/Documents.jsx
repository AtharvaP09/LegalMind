// components/DocumentsSection/DocumentsSection.jsx
import { useEffect, useState } from 'react';
import API from '../../api';
import './Documents.css';

const DocumentsSection = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingDocId, setEditingDocId] = useState(null);
  const [newFileName, setNewFileName] = useState('');
  const username = sessionStorage.getItem('username');

  useEffect(() => {
    fetchDocuments();
  }, [username]);

  const fetchDocuments = async () => {
    if (!username) return;
    
    try {
      setLoading(true);
      const response = await API.get(`/api/user/documents?username=${encodeURIComponent(username)}`);
      setDocuments(response.data.documents);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (doc) => {
    try {
      const username = sessionStorage.getItem('username');
      const response = await API.get(
        `/api/download/document/${doc.id}?username=${encodeURIComponent(username)}`,
        { responseType: 'blob' }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', doc.filename);
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download document:', error);
      alert('Failed to download document. Please try again.');
    }
  };

  const handleDelete = async (docId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }
    
    try {
      const username = sessionStorage.getItem('username');
      await API.delete(`/api/user/documents/${docId}`, {
        data: { username: username }
      });
      setDocuments(documents.filter(doc => doc.id !== docId));
    } catch (error) {
      console.error('Failed to delete document:', error);
      alert('Failed to delete document. Please try again.');
    }
  };

  const startEditing = (doc) => {
    setEditingDocId(doc.id);
    setNewFileName(doc.filename);
  };

  const cancelEditing = () => {
    setEditingDocId(null);
    setNewFileName('');
  };

  const handleRename = async (docId) => {
    if (!newFileName.trim()) {
      alert('Filename cannot be empty');
      return;
    }
    
    try {
      const username = sessionStorage.getItem('username');
      const response = await API.put(`/api/user/documents/${docId}`, {
        filename: newFileName,
        username: username
      });
      
      setDocuments(documents.map(doc => 
        doc.id === docId ? { ...doc, filename: newFileName } : doc
      ));
      
      setEditingDocId(null);
    } catch (error) {
      console.error('Failed to rename document:', error);
      alert('Failed to rename document. Please try again.');
    }
  };

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
                {editingDocId === doc.id ? (
                  <div className="edit-filename">
                    <input
                      type="text"
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                      className="filename-input"
                    />
                    <div className="edit-actions">
                      <button 
                        onClick={() => handleRename(doc.id)}
                        className="save-btn"
                      >
                        Save
                      </button>
                      <button 
                        onClick={cancelEditing}
                        className="cancel-btn"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <h3>{doc.filename}</h3>
                )}
                <p><strong>Status:</strong> {doc.status}</p>
                <p><strong>Created:</strong> {new Date(doc.created_at).toLocaleString()}</p>
                <div className="document-actions">
                  <button
                    onClick={() => handleDownload(doc)}
                    className="download-btn"
                  >
                    Download
                  </button>
                  {editingDocId !== doc.id && (
                    <>
                      <button
                        onClick={() => startEditing(doc)}
                        className="rename-btn"
                      >
                        Rename
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
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