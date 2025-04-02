import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Remove the import that's causing issues
// import { getDocument } from 'pdfjs-dist';

const PdfHandler = ({ onTextExtracted, mode }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.pdf')) {
      alert('Please upload a PDF file');
      return;
    }

    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      // Use the global pdfjsLib from the CDN instead of the imported module
      const pdf = await window.pdfjsLib.getDocument(arrayBuffer).promise;
      let extractedText = '';
      
      // Extract text from first 10 pages (adjust as needed)
      const pageCount = Math.min(pdf.numPages, 10);
      for (let i = 1; i <= pageCount; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        extractedText += content.items.map(item => item.str).join(' ');
        
        if (i < pageCount) {
          extractedText += '\n\n--- Page Break ---\n\n';
        }
      }

      if (pdf.numPages > 10) {
        extractedText += `\n\n[Document truncated - showing first 10 of ${pdf.numPages} pages]`;
      }

      onTextExtracted(extractedText, file.name);
    } catch (error) {
      console.error('PDF extraction error:', error);
      alert(error.message.includes('password') ? 
        'Cannot read password-protected PDF' : 'Failed to read PDF');
    } finally {
      setIsProcessing(false);
      e.target.value = '';
    }
  };

  return (
    <div className={`file-uploader ${mode === 'dark' ? 'dark-mode' : ''}`}>
      <label className="file-upload-label">
        {isProcessing ? (
          'Processing PDF...'
        ) : (
          <>
            <span>Upload PDF</span>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              disabled={isProcessing}
              className="file-input"
            />
          </>
        )}
      </label>
      <div className="file-upload-info">
        Supports .pdf files (first 10 pages)
      </div>
    </div>
  );
};

PdfHandler.propTypes = {
  onTextExtracted: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(['light', 'dark']).isRequired
};

export default PdfHandler;
