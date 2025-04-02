import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { 
  exportToPDF, 
  handleFileImport, 
  handlePdfToWord, 
  handleWordToPdf 
} from '../utils/fileHandlers';

export default function FileActions({ text, setText, additionalInfo, showAlert, isProcessing, setIsProcessing }) {
  const fileInputRef = useRef(null);
  const fileImportRef = useRef(null);

  const handleFileSelection = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.name.endsWith('.pdf')) {
      handlePdfToWord(e, showAlert, setIsProcessing);
    } else if (file.name.match(/\.docx?$/i)) {
      handleWordToPdf(e, showAlert, setIsProcessing);
    }
  };

  return (
    <>
      <button 
        className="btn btn-success" 
        onClick={() => exportToPDF(text, additionalInfo, showAlert, setIsProcessing)} 
        disabled={!text || isProcessing}
        aria-label="Export to PDF"
      >
        {isProcessing ? 'Processing...' : 'Export PDF'}
      </button>
      
      <div className="file-import-wrapper">
        <label className={`file-import-label ${isProcessing ? 'disabled' : ''}`}>
          {isProcessing ? 'Importing...' : 'Import File (PDF/Word)'}
          <input
            type="file"
            ref={fileImportRef}
            className="file-input-hidden"
            accept=".pdf,.doc,.docx"
            onChange={(e) => handleFileImport(e, setText, showAlert, setIsProcessing)}
            disabled={isProcessing}
            aria-label="File import"
          />
        </label>
      </div>

      <div className="btn-group">
        <button 
          className="btn btn-warning"
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          aria-label="Convert file"
        >
          Convert File
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="file-input-hidden"
          accept=".pdf,.doc,.docx"
          onChange={handleFileSelection}
          aria-label="File conversion input"
        />
      </div>
    </>
  );
}

FileActions.propTypes = {
  text: PropTypes.string.isRequired,
  setText: PropTypes.func.isRequired,
  additionalInfo: PropTypes.string.isRequired,
  showAlert: PropTypes.func.isRequired,
  isProcessing: PropTypes.bool.isRequired,
  setIsProcessing: PropTypes.func.isRequired
};