// DocumentDetails.jsx
// Example integration into your document details page

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Divider, CircularProgress } from '@mui/material';
import ExtractedTextSection from './ExtractedTextSection';

// Your other imports

const DocumentDetails = () => {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Assuming you have context or state for username
  const username = localStorage.getItem('username');
  
  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        const response = await fetch(`/api/user/documents/${id}?username=${username}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch document details');
        }
        
        setDocument(data.document);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDocumentDetails();
  }, [id, username]);
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={5}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box textAlign="center" p={5}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }
  
  if (!document) {
    return (
      <Box textAlign="center" p={5}>
        <Typography>Document not found</Typography>
      </Box>
    );
  }
  
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        {document.filename}
      </Typography>
      
      <Box mb={4}>
        <Typography variant="body1" color="textSecondary">
          Created: {document.created_at}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Status: {document.status}
        </Typography>
      </Box>
      
      <Divider />
      
      {/* Your existing document content sections */}
      
      {/* Add the extracted text section if the document has been analyzed */}
      {document.status === 'analyzed' && document.has_extracted_text && (
        <ExtractedTextSection 
          documentId={document.id}
          documentName={document.filename}
          username={username}
        />
      )}
      
      {/* Other sections of your document details page */}
    </Container>
  );
};

export default DocumentDetails;