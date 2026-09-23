import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

document.documentElement.classList.add('app-has-js');

document.documentElement.style.backgroundColor = 'var(--bg-primary)';
createRoot(rootElement).render(<React.StrictMode><App /></React.StrictMode>);
