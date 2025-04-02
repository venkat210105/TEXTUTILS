import React from 'react';
import PropTypes from 'prop-types';

const SearchReplace = ({ 
  searchTerm, 
  setSearchTerm,
  replaceTerm,
  setReplaceTerm,
  onSearch,
  onReplace,
  mode,
  isProcessing = false
}) => {
  return (
    <div className={`search-container ${mode === 'dark' ? 'dark-mode' : ''}`}>
      <div className="search-controls">
        <div className="input-group mb-2">
          <input
            type="text"
            className={`form-control ${mode === 'dark' ? 'dark' : ''}`}
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
            disabled={isProcessing}
          />
          <button 
            className={`btn btn-primary ${mode === 'dark' ? 'dark' : ''}`}
            onClick={onSearch}
            disabled={isProcessing || !searchTerm.trim()}
          >
            Search
          </button>
        </div>

        <div className="input-group mb-3">
          <input
            type="text"
            className={`form-control ${mode === 'dark' ? 'dark' : ''}`}
            placeholder="Replace with..."
            value={replaceTerm}
            onChange={(e) => setReplaceTerm(e.target.value)}
            disabled={isProcessing}
          />
          <button 
            className={`btn btn-warning ${mode === 'dark' ? 'dark' : ''}`}
            onClick={onReplace}
            disabled={isProcessing || !searchTerm.trim()}
          >
            Replace All
          </button>
        </div>
      </div>
    </div>
  );
};

SearchReplace.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  replaceTerm: PropTypes.string.isRequired,
  setReplaceTerm: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  onReplace: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(['light', 'dark']).isRequired,
  isProcessing: PropTypes.bool
};

export default SearchReplace;