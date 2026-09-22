import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { WorkspaceProvider } from './context/WorkspaceProvider.tsx'
import './index.css'
import './styles/layout.css'
import './styles/sidebar.css'
import './styles/timeline.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WorkspaceProvider>
      <App />
    </WorkspaceProvider>
  </StrictMode>,
)
