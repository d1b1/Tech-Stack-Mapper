import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store/store';
import App from './App.tsx';
import './index.css';

// Create a custom event listener for node double-clicks
window.addEventListener('node-double-click', (e: any) => {
  const nodeId = e.detail.nodeId;
  const event = new CustomEvent('edit-node', { detail: { nodeId } });
  window.dispatchEvent(event);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);