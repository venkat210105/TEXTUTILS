import React, { useState } from 'react';
import * as mammoth from 'mammoth';
import PropTypes from 'prop-types';
import './WordDocumentReader.css'
const WordDocumentReader = ({ onTextExtracted, mode }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState('');

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

    try {
      const arrayBuffer = await readFileAsArrayBuffer(file);
      const result = await mammoth.extractRawText({ arrayBuffer });
      
      if (result.value) {
        onTextExtracted(result.value, file.name);
      } else {
        throw new Error('Document appears to be empty');
      }
    } catch (error) {
      console.error('Error reading Word document:', error);
      alert(`Error reading document: ${error.message}`);
    } finally {
      setIsProcessing(false);
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
          `Processing ${fileName}...`
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
        Supports .doc and .docx files
      </div>
    </div>
  );
};

WordDocumentReader.propTypes = {
  onTextExtracted: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(['light', 'dark']).isRequired
};

export default WordDocumentReader;