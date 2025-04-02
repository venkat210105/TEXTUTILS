import { jsPDF } from 'jspdf';
import * as mammoth from 'mammoth';
import { saveAs } from 'file-saver';
import pdf from 'pdf-parse';

// Helper function to read files with retry logic
const readFileAsArrayBuffer = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => {
      // Retry once if there's an error
      const retryReader = new FileReader();
      retryReader.onload = () => resolve(retryReader.result);
      retryReader.onerror = () => reject(new Error('Failed to read file after retry'));
      retryReader.readAsArrayBuffer(file);
    };
    
    reader.readAsArrayBuffer(file);
  });
};

// 1. Export text to PDF
export const exportToPDF = async (text, additionalInfo, showAlert, setIsProcessing) => {
  if (!text.trim()) {
    showAlert('No text to export', 'warning');
    return;
  }

  setIsProcessing(true);
  
  try {
    const doc = new jsPDF();
    
    doc.setProperties({
      title: 'Text Export',
      subject: 'Exported from TextUtils App',
      author: 'TextUtils'
    });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('Text Content Export', 105, 15, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(text, 180);
    doc.text(lines, 15, 30);

    doc.setFontSize(14);
    doc.text('Summary', 15, doc.internal.pageSize.height - 40);
    doc.setFontSize(12);
    doc.text(`• Words: ${text.trim() === '' ? 0 : text.trim().split(/\s+/).length}`, 15, doc.internal.pageSize.height - 30);
    doc.text(`• Characters: ${text.length}`, 15, doc.internal.pageSize.height - 25);
    doc.text(`• ${additionalInfo || 'No additional info'}`, 15, doc.internal.pageSize.height - 20);

    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(`Exported on ${new Date().toLocaleString()}`, 105, doc.internal.pageSize.height - 10, { align: 'center' });

    doc.save('text-export.pdf');
    showAlert('PDF exported successfully!', 'success');
  } catch (error) {
    console.error('PDF generation error:', error);
    showAlert('Failed to export PDF', 'danger');
  } finally {
    setIsProcessing(false);
  }
};

// 2. Handle Word document import
export const handleWordImport = async (file, setText, showAlert) => {
  try {
    // First verify the file is accessible
    if (!file) {
      throw new Error('No file selected');
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size exceeds 5MB limit');
    }

    // Additional validation for DOCX files
    if (file.name.endsWith('.docx')) {
      const arrayBuffer = await readFileAsArrayBuffer(file);
      const header = new Uint8Array(arrayBuffer.slice(0, 4));
      const docxSignature = [0x50, 0x4B, 0x03, 0x04]; // PK.. (zip archive signature)
      const isDocx = header.every((val, i) => val === docxSignature[i]);
      
      if (!isDocx) {
        throw new Error('Invalid DOCX file format');
      }
    }

    const arrayBuffer = await readFileAsArrayBuffer(file);
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    if (!result.value.trim()) {
      throw new Error('Document appears to be empty or contains no extractable text');
    }
    
    setText(result.value);
    showAlert('Word document imported successfully!', 'success');
  } catch (error) {
    console.error('Word import error:', error);
    
    let errorMessage = 'Failed to import Word document';
    if (error.name === 'NotReadableError') {
      errorMessage = 'Cannot read file - it may be open in another program';
    } else if (error.message.includes('permission')) {
      errorMessage = 'File access denied - please check file permissions';
    } else if (error.message.includes('corrupt') || error.message.includes('Invalid')) {
      errorMessage = 'File appears to be corrupt or invalid';
    } else if (error.message.includes('size')) {
      errorMessage = 'File too large (max 5MB)';
    }
    
    showAlert(errorMessage, 'danger');
    throw error;
  }
};

// 3. Handle file import (PDF or Word)
export const handleFileImport = async (e, setText, showAlert, setIsProcessing) => {
  const file = e.target.files[0];
  if (!file) return;

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    showAlert('File size too large (max 5MB)', 'warning');
    e.target.value = '';
    return;
  }

  setIsProcessing(true);
  
  try {
    if (file.name.endsWith('.pdf')) {
      const arrayBuffer = await readFileAsArrayBuffer(file);
      const data = await pdf(arrayBuffer);
      setText(data.text);
      showAlert('PDF imported successfully!', 'success');
    } else if (file.name.match(/\.docx?$/i)) {
      await handleWordImport(file, setText, showAlert);
    } else {
      showAlert('Unsupported file type. Please upload PDF or Word documents.', 'warning');
    }
  } catch (error) {
    console.error('File import error:', error);
    // Error already handled in handleWordImport
  } finally {
    setIsProcessing(false);
    e.target.value = '';
  }
};

// 4. Convert PDF to Word
export const handlePdfToWord = async (e, showAlert, setIsProcessing) => {
  const file = e.target.files[0];
  if (!file) return;

  setIsProcessing(true);
  try {
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const data = await pdf(arrayBuffer);
    
    // Process only first 20 pages if needed
    const pages = data.text.split(/\f/); // Form feed character separates pages
    const pagesToProcess = pages.slice(0, 20);
    let extractedText = pagesToProcess.join('\n\n--- Page Break ---\n\n');
    
    if (pages.length > 20) {
      extractedText += `\n\n[Document truncated - showing first 20 of ${pages.length} pages]`;
    }

    const blob = new Blob([extractedText], { type: 'application/msword' });
    saveAs(blob, 'converted.docx');
    showAlert('PDF converted to Word successfully!', 'success');
  } catch (error) {
    console.error('Conversion error:', error);
    let errorMessage = 'Failed to convert PDF to Word';
    if (error.message.includes('encrypted')) {
      errorMessage = 'Cannot convert password-protected PDF';
    }
    showAlert(errorMessage, 'danger');
  } finally {
    setIsProcessing(false);
    e.target.value = '';
  }
};

// 5. Convert Word to PDF
export const handleWordToPdf = async (e, showAlert, setIsProcessing) => {
  const file = e.target.files[0];
  if (!file) return;

  setIsProcessing(true);
  try {
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const result = await mammoth.extractRawText({ arrayBuffer });
    const text = result.value;

    const doc = new jsPDF();
    const lines = doc.splitTextToSize(text, 180);
    doc.text(lines, 10, 10);
    
    doc.save('converted.pdf');
    showAlert('Word converted to PDF successfully!', 'success');
  } catch (error) {
    console.error('Conversion error:', error);
    showAlert('Failed to convert Word to PDF', 'danger');
  } finally {
    setIsProcessing(false);
    e.target.value = '';
  }
};