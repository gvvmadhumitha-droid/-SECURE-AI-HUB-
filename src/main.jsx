import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AppProvider } from './context/AppContext'
import ErrorBoundary from './components/Shared/ErrorBoundary'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppProvider>
        <App />
        <Toaster position="top-right" />
      </AppProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
