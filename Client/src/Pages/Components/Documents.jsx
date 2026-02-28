// components/DocumentsSection/DocumentsSection.jsx
import { useEffect, useState } from 'react';
import API from '../../api';
import './Documents.css';
import { FaUserCircle, FaArrowLeft, FaEye, FaFilePdf } from 'react-icons/fa';
import { AnalysisResults } from './AnalysisPdfUpload';

const DocumentsSection = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingDocId, setEditingDocId] = useState(null);
  const [newFileName, setNewFileName] = useState('');
  const [viewingAnalysis, setViewingAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState('drafted');
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

      // For Axios, need to send data in the correct format
      const response = await API.delete(`/api/user/documents/${docId}`, {
        data: { username: username },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setDocuments(documents.filter(doc => doc.id !== docId));
        alert('Document deleted successfully!');
      } else {
        alert('Failed to delete document: ' + (response.data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert(`Failed to delete document: ${error.response?.data?.error || error.message}`);
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

  return (<>
    <div className="top-nav">
      <div className="user-section">
        <div className="user-info">
          <p className="username">Welcome, {username}!</p>
          <p className="tagline">Ready to transform your legal documents?</p>
        </div>
        <div className="user-avatar">
          <FaUserCircle />
        </div>
      </div>
    </div>
    <div className="documents-container">
      {viewingAnalysis ? (
        <AnalysisResults
          analysisData={viewingAnalysis.parsed_analysis_blob.analysis}
          onBack={() => setViewingAnalysis(null)}
          initialChatMessages={viewingAnalysis.parsed_analysis_blob.chatMessages}
          documentId={viewingAnalysis.id}
        />
      ) : (
        <>
          <div className="document-tabs">
            <button
              className={`document-tab-btn ${activeTab === 'drafted' ? 'active' : ''}`}
              onClick={() => setActiveTab('drafted')}
            >
              Drafted Documents
            </button>
            <button
              className={`document-tab-btn ${activeTab === 'analyzed' ? 'active' : ''}`}
              onClick={() => setActiveTab('analyzed')}
            >
              Analyzed Documents
            </button>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="document-card-list">
              {documents.filter(doc => doc.status === activeTab).length > 0 ? (
                documents.filter(doc => doc.status === activeTab).map((doc) => (
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
                      <div className="doc-card-title-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        {doc.status === 'analyzed' ? <FaFilePdf color="#ef4444" size={24} /> : <FaFilePdf color="#3b82f6" size={24} />}
                        <h3 style={{ margin: 0, fontSize: '18px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.filename}</h3>
                      </div>
                    )}

                    {doc.status === 'analyzed' && doc.parsed_analysis_blob && (
                      <div className="doc-card-mini-details" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '6px', fontSize: '14px', marginBottom: '12px' }}>
                        <p style={{ margin: '0 0 6px 0', color: '#475569' }}><strong>Lessor:</strong> {doc.parsed_analysis_blob.analysis.basicDetails.lessor || 'N/A'}</p>
                        <p style={{ margin: '0', color: '#475569' }}><strong>Lessee:</strong> {doc.parsed_analysis_blob.analysis.basicDetails.lessee || 'N/A'}</p>
                      </div>
                    )}

                    <p style={{ margin: '4px 0', fontSize: '14px' }}><strong>Status:</strong> <span style={{ textTransform: 'capitalize', color: doc.status === 'analyzed' ? '#10b981' : '#f59e0b' }}>{doc.status}</span></p>
                    <p style={{ margin: '0', fontSize: '14px', color: '#64748b' }}><strong>Created:</strong> {new Date(doc.created_at).toLocaleDateString()}</p>

                    <div className="document-actions">
                      {doc.status === 'analyzed' && doc.parsed_analysis_blob && (
                        <button
                          onClick={() => setViewingAnalysis(doc)}
                          className="view-btn"
                          style={{ background: '#10b981', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}
                        >
                          <FaEye /> View Analysis
                        </button>
                      )}

                      {doc.status !== 'analyzed' && (
                        <button
                          onClick={() => handleDownload(doc)}
                          className="download-btn"
                        >
                          Download
                        </button>
                      )}

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
        </>
      )}
    </div>
  </>
  );
};

export default DocumentsSection;