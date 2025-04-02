/**
 * Converts text to uppercase and shows success alert
 * @param {string} text - The text to convert
 * @param {function} setText - State setter for the text
 * @param {function} showAlert - Function to show alert/notification
 */
export const convertToUppercase = (text, setText, showAlert) => {
    if (!text) {
      showAlert('No text to convert', 'warning');
      return;
    }
    setText(text.toUpperCase());
    showAlert('Converted to uppercase', 'success');
  };
  
  /**
   * Converts text to lowercase and shows success alert
   * @param {string} text - The text to convert
   * @param {function} setText - State setter for the text
   * @param {function} showAlert - Function to show alert/notification
   */
  export const convertToLowercase = (text, setText, showAlert) => {
    if (!text) {
      showAlert('No text to convert', 'warning');
      return;
    }
    setText(text.toLowerCase());
    showAlert('Converted to lowercase', 'success');
  };
  
  /**
   * Clears all text and shows success alert
   * @param {function} setText - State setter for the text
   * @param {function} setAdditionalInfo - State setter for additional info
   * @param {function} showAlert - Function to show alert/notification
   */
  export const clearText = (setText, setAdditionalInfo, showAlert) => {
    setText('');
    setAdditionalInfo('');
    showAlert('Text cleared', 'success');
  };
  
  /**
   * Counts digits in text and updates additional info
   * @param {string} text - The text to analyze
   * @param {function} setAdditionalInfo - State setter for additional info
   */
  export const countDigits = (text, setAdditionalInfo) => {
    if (!text) {
      setAdditionalInfo('No text to analyze');
      return;
    }
    const count = text.split('').filter(char => !isNaN(char) && char !== ' ' && char !== '').length;
    setAdditionalInfo(`Number of digits: ${count}`);
  };
  
  /**
   * Counts special characters in text and updates additional info
   * @param {string} text - The text to analyze
   * @param {function} setAdditionalInfo - State setter for additional info
   */
  export const countSpecialChars = (text, setAdditionalInfo) => {
    if (!text) {
      setAdditionalInfo('No text to analyze');
      return;
    }
    const count = text.split('').filter(char => {
      return isNaN(char) && 
             char !== ' ' && 
             !(char >= 'A' && char <= 'Z') && 
             !(char >= 'a' && char <= 'z');
    }).length;
    setAdditionalInfo(`Number of special characters: ${count}`);
  };
  
  /**
   * Capitalizes the first letter of each word
   * @param {string} text - The text to transform
   * @param {function} setText - State setter for the text
   * @param {function} showAlert - Function to show alert/notification
   */
  export const capitalizeWords = (text, setText, showAlert) => {
    if (!text) {
      showAlert('No text to transform', 'warning');
      return;
    }
    const transformed = text.split(' ').map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
    setText(transformed);
    showAlert('Capitalized each word', 'success');
  };
  
  /**
   * Removes extra spaces from text
   * @param {string} text - The text to clean
   * @param {function} setText - State setter for the text
   * @param {function} showAlert - Function to show alert/notification
   */
  export const removeExtraSpaces = (text, setText, showAlert) => {
    if (!text) {
      showAlert('No text to clean', 'warning');
      return;
    }
    const cleaned = text.replace(/\s+/g, ' ').trim();
    setText(cleaned);
    showAlert('Removed extra spaces', 'success');
  };
  
  /**
   * Copies text to clipboard
   * @param {string} text - The text to copy
   * @param {function} showAlert - Function to show alert/notification
   */
  export const copyToClipboard = (text, showAlert) => {
    if (!text) {
      showAlert('No text to copy', 'warning');
      return;
    }
    navigator.clipboard.writeText(text)
      .then(() => showAlert('Copied to clipboard!', 'success'))
      .catch(() => showAlert('Failed to copy text', 'danger'));
  };
  
  /**
   * Counts words and characters in text
   * @param {string} text - The text to analyze
   * @returns {object} Object with wordCount and charCount properties
   */
  export const countWordsAndChars = (text) => {
    if (!text) return { wordCount: 0, charCount: 0 };
    
    const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    const charCount = text.length;
    
    return { wordCount, charCount };
  };
  
  /**
   * Reverses the text
   * @param {string} text - The text to reverse
   * @param {function} setText - State setter for the text
   * @param {function} showAlert - Function to show alert/notification
   */
  export const reverseText = (text, setText, showAlert) => {
    if (!text) {
      showAlert('No text to reverse', 'warning');
      return;
    }
    const reversed = text.split('').reverse().join('');
    setText(reversed);
    showAlert('Text reversed', 'success');
  };
  
  /**
   * Generates lorem ipsum placeholder text
   * @param {function} setText - State setter for the text
   * @param {function} showAlert - Function to show alert/notification
   */
  export const generateLoremIpsum = (setText, showAlert) => {
    const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.";
    setText(lorem);
    showAlert('Generated placeholder text', 'success');
  };