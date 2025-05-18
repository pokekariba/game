import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/styles.scss';
import App from './app';

const rootElement = document.getElementById('root')!;

ReactDOM.createRoot(rootElement).render(<App />);
