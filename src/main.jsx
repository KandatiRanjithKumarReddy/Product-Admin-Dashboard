import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Application entry point — renders the root React component
createRoot(document.getElementById('root')).render(
  //used in development purose only
  <StrictMode>
    <App />
  </StrictMode>,
)
