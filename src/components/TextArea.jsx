import React from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';
import './TextArea.css'
const TextArea = React.forwardRef(({ value, onChange, searchResults, mode }, ref) => {
  const highlightMatches = () => {
    if (!searchResults?.matches?.length) return DOMPurify.sanitize(value);

    // Create a set of unique match indices to avoid duplicate highlighting
    const matchIndices = new Set();
    searchResults.matches.forEach(match => {
      matchIndices.add(match.index);
    });

    // Split the text into parts and highlight matches
    let lastIndex = 0;
    const parts = [];
    const sortedIndices = Array.from(matchIndices).sort((a, b) => a - b);

    sortedIndices.forEach(index => {
      const match = searchResults.matches.find(m => m.index === index);
      if (match) {
        // Add text before the match
        if (index > lastIndex) {
          parts.push(DOMPurify.sanitize(value.substring(lastIndex, index)));
        }
        // Add the highlighted match
        parts.push(`<mark class="highlight">${DOMPurify.sanitize(match[0])}</mark>`);
        lastIndex = index + match[0].length;
      }
    });

    // Add remaining text after last match
    if (lastIndex < value.length) {
      parts.push(DOMPurify.sanitize(value.substring(lastIndex)));
    }

    return parts.join('');
  };

  return (
    <div className="mb-3">
      <textarea 
        className={`text-area ${mode === 'dark' ? 'dark-mode' : ''}`}
        ref={ref}
        value={value}
        onChange={onChange}
        placeholder="Enter your text here..."
      />
      {searchResults?.matches?.length > 0 && (
        <div 
          className="preview-box"
          dangerouslySetInnerHTML={{ __html: highlightMatches() }}
        />
      )}
    </div>
  );
});

TextArea.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  searchResults: PropTypes.object,
  mode: PropTypes.oneOf(['light', 'dark']).isRequired
};

export default TextArea;