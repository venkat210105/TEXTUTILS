import React from 'react';
import PropTypes from 'prop-types';
import { highlightMatches } from '../utils/searchHandlers';
import DOMPurify from 'dompurify';

export default function TextSummary({ text, additionalInfo, searchResults }) {
  const getPreviewContent = () => {
    const highlighted = highlightMatches(text, searchResults);
    return DOMPurify.sanitize(highlighted || 'Nothing to preview');
  };

  return (
    <div className="text-summary">
      <h2>Text Summary</h2>
      <p className="summary-stats">
        {text.trim() === '' ? 0 : text.trim().split(/\s+/).length} words and {text.length} characters
      </p>
      {additionalInfo && <div className="alert alert-info">{additionalInfo}</div>}
      
      <h2 className="mt-3">Preview</h2>
      <div 
        className="preview-box"
        dangerouslySetInnerHTML={{ __html: getPreviewContent() }}
        aria-live="polite"
      />
    </div>
  );
}

TextSummary.propTypes = {
  text: PropTypes.string.isRequired,
  additionalInfo: PropTypes.string,
  searchResults: PropTypes.shape({
    matches: PropTypes.array,
    currentMatch: PropTypes.number
  })
};

TextSummary.defaultProps = {
  additionalInfo: '',
  searchResults: null
};