import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { SearchProvider } from './Components/SearchContext';







const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);


root.render(

  <React.StrictMode>
    
  <SearchProvider>
    <App />
  </SearchProvider>
  
    
  </React.StrictMode>
);


reportWebVitals();
