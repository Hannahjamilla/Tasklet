import { StrictMode, createElement } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import app_root from './app.tsx'

const root_element = document.getElementById('root');
if (root_element) {
  createRoot(root_element).render(
    createElement(StrictMode, null, 
      createElement(app_root)
    )
  )
}

