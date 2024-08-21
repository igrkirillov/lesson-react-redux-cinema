import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {HashRouter} from "react-router-dom";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <HashRouter basename={import.meta.env.BASE_URL}>
        <App />
      </HashRouter>
  </StrictMode>,
)
