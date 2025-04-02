import React, { useState, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import TextArea from './TextArea';
import SearchReplace from './SearchReplace';
import TextActions from './TextActions';
import TextSummary from './TextSummary';
import WordDocumentReader from './WordDocumentReader';
import { jsPDF } from 'jspdf';
import * as mammoth from 'mammoth';
import PdfHandler from './PdfHandler';
import './TextForm.css';

const TextForm = ({ heading, mode, showAlert }) => {
  // State
  const [text, setText] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Refs
  const textAreaRef = useRef(null);

  // Memoized calculations
  const wordCount = useMemo(() => text.trim() ? text.trim().split(/\s+/).length : 0, [text]);
  const charCount = useMemo(() => text.length, [text]);

  // Text manipulation handlers
  const handleTextChange = (e) => {
    setText(e.target.value);
    setSearchResults(null);
  };

  // Button action handlers
  const handleUppercase = () => {
    setText(text.toUpperCase());
    showAlert('Converted to uppercase!', 'success');
  };

  const handleLowercase = () => {
    setText(text.toLowerCase());
    showAlert('Converted to lowercase!', 'success');
  };

  const handleClearText = () => {
    setText('');
    setAdditionalInfo('');
    showAlert('Text cleared!', 'success');
  };

  //import pdf
  const handlePdfText = (extractedText, filename) => {
    setText(extractedText);
    showAlert(`Loaded PDF: ${filename}`, 'success');
  };

  const handleCountDigits = () => {
    const count = (text.match(/\d/g) || []).length;
    setAdditionalInfo(`Found ${count} digits`);
    showAlert(`Found ${count} digits`, 'info');
  };

  const handleCountSpecialChars = () => {
    const count = (text.match(/[^\w\s]/g) || []).length;
    setAdditionalInfo(`Found ${count} special characters`);
    showAlert(`Found ${count} special characters`, 'info');
  };

  // Word document handler
  const handleWordDocumentText = (extractedText, filename) => {
    setText(extractedText);
    showAlert(`Loaded document: ${filename}`, 'success');
  };

  // Search functionality
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      showAlert('Please enter a search term', 'warning');
      return;
    }

    setIsProcessing(true);
    try {
      const regex = new RegExp(searchTerm, 'gi');
      const matches = [];
      let match;
      while ((match = regex.exec(text)) !== null) {
        matches.push(match);
      }

      setSearchResults({ 
        matches, 
        currentMatch: matches.length > 0 ? 0 : -1 
      });

      showAlert(
        matches.length > 0 
          ? `Found ${matches.length} matches` 
          : 'No matches found',
        matches.length > 0 ? 'success' : 'info'
      );
    } catch (error) {
      showAlert('Invalid search pattern', 'danger');
    } finally {
      setIsProcessing(false);
    }
  };

  // Replace functionality
  const handleReplace = () => {
    if (!searchTerm.trim()) {
      showAlert('Please enter a search term', 'warning');
      return;
    }

    setIsProcessing(true);
    try {
      const regex = new RegExp(searchTerm, 'gi');
      const newText = text.replace(regex, replaceTerm);
      setText(newText);
      setSearchResults(null);
      showAlert('Replacement completed!', 'success');
    } catch (error) {
      showAlert('Invalid replace pattern', 'danger');
    } finally {
      setIsProcessing(false);
    }
  };
  
  //Convert text to word or pdf
  const handleExportPDF = () => {
    if (!text.trim()) {
      showAlert('No text to export', 'warning');
      return;
    }
  
    setIsProcessing(true);
    try {
      const doc = new jsPDF();
      doc.text(text, 10, 10);
      doc.save('text-export.pdf');
      showAlert('PDF exported successfully!', 'success');
    } catch (error) {
      console.error('PDF export error:', error);
      showAlert('Failed to export PDF', 'danger');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleExportWord = () => {
    if (!text.trim()) {
      showAlert('No text to export', 'warning');
      return;
    }
  
    setIsProcessing(true);
    try {
      const html = `<html><body>${text.replace(/\n/g, '<br>')}</body></html>`;
      const blob = new Blob([html], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'text-export.doc';
      a.click();
      URL.revokeObjectURL(url);
      showAlert('Word document exported!', 'success');
    } catch (error) {
      console.error('Word export error:', error);
      showAlert('Failed to export Word document', 'danger');
    } finally {
      setIsProcessing(false);
    }
  };
  

  const handleCapitalize = () => {
    const capitalizedText = text.replace(/\b\w/g, (char) => char.toUpperCase());
    setText(capitalizedText);
    showAlert('Text capitalized!', 'success');
  };

  return (
    <div className={`text-form-container ${mode === 'dark' ? 'dark-mode' : 'light-mode'}`}>
      <h1 className='text-form-header'>{heading}</h1>
      
      {/* Add WordDocumentReader here */}
      <WordDocumentReader 
        onTextExtracted={handleWordDocumentText} 
        mode={mode} 
      />

      <PdfHandler 
        onTextExtracted={handlePdfText} 
        mode={mode} 
      />
      
      <SearchReplace 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        replaceTerm={replaceTerm}
        setReplaceTerm={setReplaceTerm}
        onSearch={handleSearch}
        onReplace={handleReplace}
        mode={mode}
        isProcessing={isProcessing}
      />

      <TextArea 
        value={text}
        onChange={handleTextChange}
        searchResults={searchResults}
        mode={mode}
        ref={textAreaRef}
      />
      
      <TextActions 
        onUppercase={handleUppercase}
        onLowercase={handleLowercase}
        onCapitalize={handleCapitalize}
        onClear={handleClearText}
        onCountDigits={handleCountDigits}
        onExportPDF={handleExportPDF}
        onExportWord={handleExportWord}
        onCountSpecialChars={handleCountSpecialChars}
        hasText={text.length > 0}
        mode={mode}
      />
      
      <TextSummary 
        text={text}
        wordCount={wordCount}
        charCount={charCount}
        additionalInfo={additionalInfo}
        searchResults={searchResults}
        mode={mode}
      />
    </div>
  );
};

TextForm.propTypes = {
  heading: PropTypes.string.isRequired,
  mode: PropTypes.oneOf(['light', 'dark']).isRequired,
  showAlert: PropTypes.func.isRequired
};

export default TextForm;