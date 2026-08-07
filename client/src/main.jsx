import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const storedTheme = localStorage.getItem('kavyakosh-theme');
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
const theme = storedTheme || systemTheme;
document.documentElement.classList.remove('dark', 'light');
document.documentElement.classList.add(theme);

createRoot(document.getElementById('root')).render(
  <App />
);
