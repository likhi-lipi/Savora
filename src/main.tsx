import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SavoraProvider } from './context/SavoraContext'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SavoraProvider>
      <App />
    </SavoraProvider>
  </StrictMode>,
)
