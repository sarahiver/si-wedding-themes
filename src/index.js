import ReactDOM from 'react-dom/client';
import App from './App';

// StrictMode entfernt: R3F/@react-three/drei vertragen das doppelte
// Mount/Unmount/Mount unter StrictMode schlecht und hinterlassen dabei
// ein verwaistes drei-Scroll-`el` (führt im Parallax-Theme dazu, dass der
// HtmlContent-Layer doppelt mountet und der obere die Scroll-Events schluckt).
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
