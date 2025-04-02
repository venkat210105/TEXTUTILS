import React from 'react';
import PropTypes from 'prop-types';

const TextActions = ({
  onUppercase,
  onLowercase,
  onCapitalize,  // Add this prop
  onClear,
  onCountDigits,
  onCountSpecialChars,
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
        {/* Add the Capitalize button */}
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
    </div>
  );
};

TextActions.propTypes = {
  onUppercase: PropTypes.func.isRequired,
  onLowercase: PropTypes.func.isRequired,
  onCapitalize: PropTypes.func.isRequired,  // Add this prop type
  onClear: PropTypes.func.isRequired,
  onCountDigits: PropTypes.func.isRequired,
  onCountSpecialChars: PropTypes.func.isRequired,
  hasText: PropTypes.bool.isRequired,
  mode: PropTypes.oneOf(['light', 'dark']).isRequired
};

export default TextActions;