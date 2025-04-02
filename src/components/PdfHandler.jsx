import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import './PdfHandler.css';

const PdfHandler = React.forwardRef(({ onTextExtracted, mode }, ref) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pdfImages, setPdfImages] = useState([]);
  const [showImages, setShowImages] = useState(false);
  const [originalPdfBytes, setOriginalPdfBytes] = useState(null);
  const [fileName, setFileName] = useState('');

  // Function to export modified PDF - wrapped in useCallback to avoid infinite loops
  const exportModifiedPdf = useCallback(async (modifiedText) => {
    if (!originalPdfBytes) {
      alert('No PDF loaded to modify. Please load a PDF first before exporting.');
      return false;
    }

    setIsProcessing(true);
    setProgress(10);

    try {
      // Load the original PDF document
      const pdfDoc = await PDFDocument.load(originalPdfBytes);
      setProgress(30);
      
      // Get the pages
      const pages = pdfDoc.getPages();
      const pageCount = Math.min(pages.length, 10);
      
      // Split the modified text by page breaks
      const textByPage = modifiedText.split('\n\n--- Page Break ---\n\n');
      
      // Process each page
      for (let i = 0; i < pageCount; i++) {
        setProgress(30 + (i / pageCount) * 60);
        
        if (i < textByPage.length) {
          const page = pages[i];
          
          // Clear existing text (this is a simplified approach)
          // In a real implementation, you'd need more sophisticated text replacement
          
          // Add the modified text
          const { width, height } = page.getSize();
          
          // Break text into lines to avoid overflow
          const maxCharsPerLine = Math.floor(width / 5) - 20; // Approximate chars per line
          const lines = [];
          let currentText = textByPage[i];
          
          while (currentText.length > 0) {
            if (currentText.length <= maxCharsPerLine) {
              lines.push(currentText);
              currentText = '';
            } else {
              // Find a good breaking point
              let breakPoint = currentText.lastIndexOf(' ', maxCharsPerLine);
              if (breakPoint === -1) breakPoint = maxCharsPerLine;
              
              lines.push(currentText.substring(0, breakPoint));
              currentText = currentText.substring(breakPoint + 1);
            }
          }
          
          // Add text line by line
          const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
          const fontSize = 10;
          const lineHeight = fontSize * 1.2;
          
          // Calculate max lines that can fit on page
          const maxLines = Math.floor((height - 100) / lineHeight);
          const linesToDraw = lines.slice(0, maxLines);
          
          linesToDraw.forEach((line, lineIndex) => {
            page.drawText(line, {
              x: 50,
              y: height - 50 - (lineIndex * lineHeight),
              size: fontSize,
              font: font,
              color: rgb(0, 0, 0)
            });
          });
          
          // Add note if text was truncated
          if (lines.length > maxLines) {
            page.drawText('(Text truncated due to page limits)', {
              x: 50,
              y: 30,
              size: 8,
              font: font,
              color: rgb(0.5, 0.5, 0.5)
            });
          }
        }
      }
      
      setProgress(90);
      
      // Save the modified PDF
      const modifiedPdfBytes = await pdfDoc.save();
      
      // Create a blob and download
      const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `modified_${fileName || 'document.pdf'}`;
      a.click();
      URL.revokeObjectURL(url);
      
      setProgress(100);
      alert('Modified PDF exported successfully!');
      return true;
    } catch (error) {
      console.error('Error exporting modified PDF:', error);
      alert('Failed to export modified PDF: ' + (error.message || 'Unknown error'));
      return false;
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  }, [originalPdfBytes, fileName]);

  // Expose the exportModifiedPdf method to parent components via ref
  useEffect(() => {
    if (ref) {
      ref.current = {
        exportModifiedPdf
      };
    }
  }, [ref, exportModifiedPdf]);

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
    setFileName(file.name);

    try {
      const arrayBuffer = await file.arrayBuffer();
      // Store the original PDF bytes for later modification
      setOriginalPdfBytes(new Uint8Array(arrayBuffer));
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
        
        // Improved text extraction with proper spacing
        let lastY = null;
        let pageText = '';
        let lastX = null;
        
        // Sort items by vertical position (top to bottom)
        const sortedItems = [...textContent.items].sort((a, b) => {
          return b.transform[5] - a.transform[5]; // Sort by Y position (descending)
        });
        
        // Group items by lines (based on Y position)
        const lines = [];
        let currentLine = [];
        
        for (const item of sortedItems) {
          if (currentLine.length === 0) {
            currentLine.push(item);
          } else {
            const prevItem = currentLine[currentLine.length - 1];
            // If Y positions are close, items are on the same line
            if (Math.abs(prevItem.transform[5] - item.transform[5]) < 3) {
              currentLine.push(item);
            } else {
              // Sort items in line by X position (left to right)
              lines.push([...currentLine].sort((a, b) => a.transform[4] - b.transform[4]));
              currentLine = [item];
            }
          }
        }
        
        if (currentLine.length > 0) {
          lines.push([...currentLine].sort((a, b) => a.transform[4] - b.transform[4]));
        }
        
        // Process each line
        for (const line of lines) {
          let lineText = '';
          let lastEndX = 0;
          
          for (const item of line) {
            const itemX = item.transform[4];
            const itemWidth = item.width || 0;
            
            // Add spaces based on horizontal distance between items
            if (lineText.length > 0) {
              const spacesNeeded = Math.max(0, Math.round((itemX - lastEndX) / 5));
              lineText += ' '.repeat(spacesNeeded);
            }
            
            lineText += item.str;
            lastEndX = itemX + itemWidth;
          }
          
          if (pageText.length > 0) {
            pageText += '\n';
          }
          pageText += lineText;
        }
        
        // Add page content to extracted content
        extractedText += pageText;
        
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
      alert(error.message?.includes('password') ? 
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
});

PdfHandler.propTypes = {
  onTextExtracted: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(['light', 'dark']).isRequired
};

PdfHandler.displayName = 'PdfHandler';

export default PdfHandler;
