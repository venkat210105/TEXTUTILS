export const createSearchRegex = (term, options) => {
    const pattern = options.useRegex ? term : term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const flags = options.caseSensitive ? 'g' : 'gi';
    return new RegExp(options.wholeWord ? `\\b${pattern}\\b` : pattern, flags);
  };
  
  export const highlightMatches = (text, searchResults) => {
    if (!text || !searchResults?.matches?.length) return text;
  
    let highlightedText = text;
    const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    searchResults.matches.forEach(match => {
      if (match[0]) {
        const escapedMatch = escapeRegExp(match[0]);
        highlightedText = highlightedText.replace(
          new RegExp(escapedMatch, 'g'),
          `<mark class="highlight">${match[0]}</mark>`
        );
      }
    });
    
    return highlightedText;
  };