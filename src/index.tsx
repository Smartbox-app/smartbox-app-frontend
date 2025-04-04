import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import 'font-awesome/css/font-awesome.min.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
