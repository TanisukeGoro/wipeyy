// ボタンをクリックした瞬間はそのページで動画をみたい可能性が高いので
// current page のvideoタグを探索すること
import { createRoot } from 'react-dom/client';
import App from './App';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('app');
    const root = createRoot(container);
    root.render(<App />);
});
