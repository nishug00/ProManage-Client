import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { AppProvider } from './context/AppContext'; 
import './index.css';
import '@vscode/codicons/dist/codicon.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider> 
      <App />
    </AppProvider>
  </StrictMode>,
);
