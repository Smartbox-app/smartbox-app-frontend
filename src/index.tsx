import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import 'font-awesome/css/font-awesome.min.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
console.log('ELOOOO');
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
