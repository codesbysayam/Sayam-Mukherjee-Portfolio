import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initUtmTracking } from './utils/utm';

// Initialize privacy-respecting UTM parameter attribution
if (typeof window !== 'undefined') {
  initUtmTracking();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
