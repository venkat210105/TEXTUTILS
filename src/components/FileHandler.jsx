import React from 'react';
import PropTypes from 'prop-types';
import WordDocumentReader from './WordDocumentReader';
import PdfHandler from './PdfHandler';

const FileHandler = ({ onTextExtracted, mode }) => {
  return (
    <div className="file-handlers">
      <WordDocumentReader 
        onTextExtracted={onTextExtracted} 
        mode={mode} 
      />
      <PdfHandler 
        onTextExtracted={onTextExtracted} 
        mode={mode} 
      />
    </div>
  );
};

FileHandler.propTypes = {
  onTextExtracted: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(['light', 'dark']).isRequired
};

export default FileHandler;