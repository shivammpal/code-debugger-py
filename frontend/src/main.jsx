// Import necessary libraries and components for the application.
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Import the CSS for syntax highlighting.
import 'prismjs/themes/prism-tomorrow.css';

// --- React App Rendering ---
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
