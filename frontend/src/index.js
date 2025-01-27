import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

console.log('Initializing application'); // Debug log

const root = createRoot(document.getElementById('root'));
root.render(<App />); 