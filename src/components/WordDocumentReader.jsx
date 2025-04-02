import React, { useState } from 'react';
import * as mammoth from 'mammoth';
import PropTypes from 'prop-types';
import './WordDocumentReader.css'

const WordDocumentReader = ({ onTextExtracted, mode }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState('');
  const [progress, setProgress] = useState(0);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if file is a Word document
    if (!file.name.match(/\.(docx|doc)$/i)) {
      alert('Please upload a Word document (.docx or .doc)');
      return;
    }

    setIsProcessing(true);
    setFileName(file.name);
    setProgress(10);

    try {
      const arrayBuffer = await readFileAsArrayBuffer(file);
      setProgress(30);
      
      // Validate DOCX file format (if applicable)
      if (file.name.endsWith('.docx')) {
        try {
          // Check for DOCX signature (PK zip header)
          const header = new Uint8Array(arrayBuffer.slice(0, 4));
          const docxSignature = [0x50, 0x4B, 0x03, 0x04]; // PK zip header
          if (!header.every((val, i) => val === docxSignature[i])) {
            throw new Error('The document appears to be corrupted or not a valid DOCX file');
          }
        } catch (validationError) {
          console.error('DOCX validation error:', validationError);
          throw new Error('Invalid or corrupted DOCX file');
        }
      }
      
      setProgress(50);
      
      // Enhanced options for mammoth
      const options = {
        convertImage: mammoth.images.dataUri,
        ignoreEmptyParagraphs: true,
        styleMap: [
          "p[style-name='Heading 1'] => h1:fresh",
          "p[style-name='Heading 2'] => h2:fresh",
          "p[style-name='Heading 3'] => h3:fresh",
          "r[style-name='Strong'] => strong"
        ]
      };
      
      const result = await mammoth.extractRawText({ 
        arrayBuffer,
        ...options
      });
      
      setProgress(80);
      
      // Check for warnings
      if (result.messages && result.messages.length > 0) {
        console.warn('Document conversion warnings:', result.messages);
        
        // Check for specific warning types
        const hasEncryptionWarning = result.messages.some(
          msg => msg.message && msg.message.includes('encrypted')
        );
        
        if (hasEncryptionWarning) {
          throw new Error('This document appears to be password-protected or encrypted');
        }
      }
      
      if (!result.value || !result.value.trim()) {
        throw new Error('Document appears to be empty or content could not be extracted');
      }
      
      setProgress(100);
      onTextExtracted(result.value, file.name);
    } catch (error) {
      console.error('Error reading Word document:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Error reading document';
      
      if (error.message.includes('password') || error.message.includes('encrypted')) {
        errorMessage = 'Cannot read password-protected document';
      } else if (error.message.includes('corrupted')) {
        errorMessage = 'The document appears to be corrupted';
      } else if (error.message.includes('empty')) {
        errorMessage = 'Document appears to be empty or content could not be extracted';
      } else {
        errorMessage = `Error: ${error.message}`;
      }
      
      alert(errorMessage);
    } finally {
      setIsProcessing(false);
      setProgress(0);
      e.target.value = ''; // Reset input
    }
  };

  const readFileAsArrayBuffer = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  return (
    <div className={`word-uploader ${mode === 'dark' ? 'dark-mode' : ''}`}>
      <label className="file-upload-label">
        {isProcessing ? (
          <>
            <span>Processing {fileName}... {progress}%</span>
            <div className="progress-bar">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </>
        ) : (
          <>
            <span>Upload Word Document</span>
            <input
              type="file"
              accept=".docx,.doc"
              onChange={handleFileChange}
              disabled={isProcessing}
              className="file-input"
            />
          </>
        )}
      </label>
      <div className="file-upload-info">
        Supports .doc and .docx files (non-protected)
        <div className="file-upload-tip">
          Note: Password-protected documents cannot be imported
        </div>
      </div>
    </div>
  );
};

WordDocumentReader.propTypes = {
  onTextExtracted: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(['light', 'dark']).isRequired
};

export default WordDocumentReader;
