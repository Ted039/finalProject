import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { HelmetProvider } from 'react-helmet-async'; // ✅ New
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>          {/* Wraps your entire metadata system */}
      <AuthProvider>          {/* Auth stays nested inside */}
        <App />
      </AuthProvider>
    </HelmetProvider>
  </React.StrictMode>
);
