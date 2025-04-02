import React, { useState } from 'react';
import PropTypes from 'prop-types';

function SearchBar({ text, onSearch, onReplace, mode }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [options, setOptions] = useState({
    caseSensitive: false,
    wholeWord: false,
    useRegex: false
  });

  const handleSearch = () => {
    if (!searchTerm) return;
    
    const searchResults = {
      searchTerm,
      options,
      matches: findMatches(text, searchTerm, options)
    };
    
    onSearch(searchResults);
  };

  const handleReplace = () => {
    if (!searchTerm || !replaceTerm) return;
    
    const replaceResults = {
      searchTerm,
      replaceTerm,
      options,
      newText: replaceMatches(text, searchTerm, replaceTerm, options)
    };
    
    onReplace(replaceResults);
  };

  // Helper functions
  const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const findMatches = (text, searchTerm, options) => {
    try {
      const pattern = options.useRegex
        ? new RegExp(options.wholeWord ? `\\b${searchTerm}\\b` : searchTerm, options.caseSensitive ? 'g' : 'gi')
        : new RegExp(options.wholeWord ? `\\b${escapeRegExp(searchTerm)}\\b` : escapeRegExp(searchTerm), options.caseSensitive ? 'g' : 'gi');
      return [...text.matchAll(pattern)];
    } catch (e) {
      console.error("Invalid regex:", e);
      return [];
    }
  };

  const replaceMatches = (text, searchTerm, replaceTerm, options) => {
    try {
      const pattern = options.useRegex
        ? new RegExp(options.wholeWord ? `\\b${searchTerm}\\b` : searchTerm, options.caseSensitive ? 'g' : 'gi')
        : new RegExp(options.wholeWord ? `\\b${escapeRegExp(searchTerm)}\\b` : escapeRegExp(searchTerm), options.caseSensitive ? 'g' : 'gi');
      return text.replace(pattern, replaceTerm);
    } catch (e) {
      console.error("Invalid regex:", e);
      return text;
    }
  };

  return (
    <div className={`search-container mb-4 p-3 border rounded ${mode === 'dark' ? 'bg-dark text-white' : 'bg-light'}`}>
      <div className="input-group mb-2">
        <input
          type="text"
          className={`form-control ${mode === 'dark' ? 'bg-secondary text-white' : ''}`}
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
      </div>

      <div className="input-group mb-3">
        <input
          type="text"
          className={`form-control ${mode === 'dark' ? 'bg-secondary text-white' : ''}`}
          placeholder="Replace with..."
          value={replaceTerm}
          onChange={(e) => setReplaceTerm(e.target.value)}
        />
        <button className="btn btn-warning" onClick={handleReplace}>
          Replace All
        </button>
      </div>

      <div className="search-options">
        <div className="form-check form-check-inline">
          <input
            type="checkbox"
            className="form-check-input"
            id="caseSensitive"
            checked={options.caseSensitive}
            onChange={() => setOptions({...options, caseSensitive: !options.caseSensitive})}
          />
          <label className="form-check-label" htmlFor="caseSensitive">
            Case Sensitive
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input
            type="checkbox"
            className="form-check-input"
            id="wholeWord"
            checked={options.wholeWord}
            onChange={() => setOptions({...options, wholeWord: !options.wholeWord})}
          />
          <label className="form-check-label" htmlFor="wholeWord">
            Whole Word
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input
            type="checkbox"
            className="form-check-input"
            id="useRegex"
            checked={options.useRegex}
            onChange={() => setOptions({...options, useRegex: !options.useRegex})}
          />
          <label className="form-check-label" htmlFor="useRegex">
            Use Regex
          </label>
        </div>
      </div>
    </div>
  );
}

SearchBar.propTypes = {
  text: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
  onReplace: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(['light', 'dark']).isRequired
};

export default SearchBar;