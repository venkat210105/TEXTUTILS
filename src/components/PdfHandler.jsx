import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import './PdfHandler.css';

const PdfHandler = ({ onTextExtracted, mode }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pdfImages, setPdfImages] = useState([]);
  const [showImages, setShowImages] = useState(false);
  const canvasRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.pdf')) {
      alert('Please upload a PDF file');
      return;
    }

    setIsProcessing(true);
    setProgress(10);
    setPdfImages([]);

    try {
      const arrayBuffer = await file.arrayBuffer();
      setProgress(20);
      
      // Use the global pdfjsLib from CDN
      const pdf = await window.pdfjsLib.getDocument(arrayBuffer).promise;
      setProgress(30);
      
      let extractedText = '';
      const pageCount = Math.min(pdf.numPages, 10);
      const pageImages = [];
      
      // Create a temporary canvas for rendering
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Process each page
      for (let i = 1; i <= pageCount; i++) {
        setProgress(30 + (i / pageCount) * 60);
        const page = await pdf.getPage(i);
        
        // Get text content
        const textContent = await page.getTextContent();
        const textItems = textContent.items.map(item => item.str).join(' ');
        
        // Render page to canvas to capture tables and images
        const viewport = page.getViewport({ scale: 1.5 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        await page.render({
          canvasContext: ctx,
          viewport: viewport
        }).promise;
        
        // Convert canvas to data URL for images
        const pageImage = canvas.toDataURL('image/jpeg', 0.8);
        pageImages.push(pageImage);
        
        // Add page content to extracted content
        extractedText += textItems;
        
        if (i < pageCount) {
          extractedText += '\n\n--- Page Break ---\n\n';
        }
      }

      if (pdf.numPages > 10) {
        extractedText += `\n\n[Document truncated - showing first 10 of ${pdf.numPages} pages]`;
      }

      setProgress(95);
      // Store the images for display
      setPdfImages(pageImages);
      
      // Add a note about images
      extractedText += '\n\n[PDF contains images or tables that can be viewed in the image viewer]';
      
      onTextExtracted(extractedText, file.name);
      setProgress(100);
      setShowImages(true);
    } catch (error) {
      console.error('PDF extraction error:', error);
      alert(error.message.includes('password') ? 
        'Cannot read password-protected PDF' : 'Failed to read PDF');
    } finally {
      setIsProcessing(false);
      setProgress(0);
      e.target.value = '';
    }
  };

  return (
    <div className={`pdf-handler ${mode === 'dark' ? 'dark-mode' : ''}`}>
      <div className="file-uploader">
        <label className="file-upload-label">
          {isProcessing ? (
            <>
              <span>Processing PDF... {progress}%</span>
              <div className="progress-bar">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </>
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
          Supports .pdf files with text, tables and images (first 10 pages)
        </div>
      </div>
      
      {pdfImages.length > 0 && (
        <div className="pdf-images-section">
          <button 
            className="toggle-images-btn"
            onClick={() => setShowImages(!showImages)}
          >
            {showImages ? 'Hide PDF Images' : 'Show PDF Images'}
          </button>
          
          {showImages && (
            <div className="pdf-images-container">
              {pdfImages.map((image, index) => (
                <div key={index} className="pdf-image-wrapper">
                  <h4>Page {index + 1}</h4>
                  <img 
                    src={image} 
                    alt={`PDF Page ${index + 1}`} 
                    className="pdf-page-image"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

PdfHandler.propTypes = {
  onTextExtracted: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(['light', 'dark']).isRequired
};

export default PdfHandler;
