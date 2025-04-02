import React from 'react';
import PropTypes from 'prop-types';

const TextActions = ({
  onUppercase,
  onLowercase,
  onCapitalize,
  onClear,
  onCountDigits,
  onCountSpecialChars,
  onExportPDF,
  onExportWord,
  hasText,
  mode
}) => {
  return (
    <div className="action-buttons">
      <div className="btn-group">
        <button 
          className={`btn btn-primary ${mode === 'dark' ? 'dark' : ''}`}
          onClick={onUppercase}
          disabled={!hasText}
        >
          Uppercase
        </button>
        <button 
          className={`btn btn-primary ${mode === 'dark' ? 'dark' : ''}`}
          onClick={onLowercase}
          disabled={!hasText}
        >
          Lowercase
        </button>
        <button 
          className={`btn btn-primary ${mode === 'dark' ? 'dark' : ''}`}
          onClick={onCapitalize}
          disabled={!hasText}
        >
          Capitalize
        </button>
        <button 
          className={`btn btn-danger ${mode === 'dark' ? 'dark' : ''}`}
          onClick={onClear}
          disabled={!hasText}
        >
          Clear
        </button>
      </div>

      <div className="btn-group">
        <button 
          className={`btn btn-info ${mode === 'dark' ? 'dark' : ''}`}
          onClick={onCountDigits}
          disabled={!hasText}
        >
          Count Digits
        </button>
        <button 
          className={`btn btn-info ${mode === 'dark' ? 'dark' : ''}`}
          onClick={onCountSpecialChars}
          disabled={!hasText}
        >
          Count Special
        </button>
      </div>

      <div className="btn-group">
        <button 
          className={`btn btn-success ${mode === 'dark' ? 'dark' : ''}`}
          onClick={onExportPDF}
          disabled={!hasText}
        >
          Export PDF
        </button>
        <button 
          className={`btn btn-success ${mode === 'dark' ? 'dark' : ''}`}
          onClick={onExportWord}
          disabled={!hasText}
        >
          Export Word
        </button>
      </div>
    </div>
  );
};

TextActions.propTypes = {
  // ... existing prop types
  onExportPDF: PropTypes.func.isRequired,
  onExportWord: PropTypes.func.isRequired,
};

export default TextActions;