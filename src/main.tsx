import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import GlobalCrashFallback from './components/system/GlobalCrashFallback.tsx'

const rootElement = document.getElementById('root');

function renderCrashFallback() {
  if (!rootElement) return;
  createRoot(rootElement).render(<GlobalCrashFallback />);
}

window.addEventListener('error', (event) => {
  console.error('[NEXORA] Runtime error prevented blank screen:', event.error || event.message);
});
window.addEventListener('unhandledrejection', (event) => {
  console.error('[NEXORA] Promise rejection prevented blank screen:', event.reason);
});

try {
  if (!rootElement) throw new Error('Root element was not found.');
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
} catch (error) {
  console.error('[NEXORA] App bootstrap failed:', error);
  renderCrashFallback();
}
