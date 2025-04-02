import './App.css';
import Alert from './components/Alert';
import Navbar from './components/Navbar';
import TextForm from './components/TextForm';
import React, { useState } from 'react';

function App() {
  const [mode, setMode] = useState('light');
  const [alert, setAlert] = useState(null);

  const toggleMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    document.body.style.backgroundColor = newMode === 'dark' ? '#212529' : 'white';
    showAlert(`${newMode === 'dark' ? 'Dark' : 'Light'} mode enabled`, 'success');
  };

  const showAlert = (msg, type) => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3000);
  };

  return (
    <>
      <Navbar 
        title="TextUtils" 
        aboutText="About" 
        mode={mode} 
        toggleMode={toggleMode} 
      />
      <Alert alert={alert} />
      <div className="container my-4">
        <TextForm 
          heading="Try TextUtils - Word Counter, Character Counter" 
          mode={mode}
          showAlert={showAlert}
        />
      </div>
    </>
  );
}

export default App;