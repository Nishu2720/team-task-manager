import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
<<<<<<< HEAD
              background: 'rgba(15,15,30,0.95)',
              backdropFilter: 'blur(20px)',
              color: '#f1f0ff',
              border: '1px solid rgba(139,92,246,0.3)',
              borderRadius: '14px',
              fontSize: '13px',
              fontFamily: 'Inter, sans-serif',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              padding: '12px 16px',
            },
            success: { iconTheme: { primary: '#34d399', secondary: 'transparent' } },
            error:   { iconTheme: { primary: '#f87171', secondary: 'transparent' } },
=======
              background: '#1f2937',
              color: '#f9fafb',
              border: '1px solid #374151',
              borderRadius: '10px',
              fontSize: '13px',
            },
            success: { iconTheme: { primary: '#34d399', secondary: '#1f2937' } },
            error:   { iconTheme: { primary: '#f87171', secondary: '#1f2937' } },
>>>>>>> de827203aca71338eef4788aa9d8ef07728a1c90
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
