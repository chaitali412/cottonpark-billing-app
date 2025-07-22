import React from 'react';
import ReactDOM from 'react-dom/client'; // ✅ updated import
import { Provider } from 'react-redux';
import store from './redux/store';
import App from './components/App';
import './styles/styles.css';
import './index.css';
// src/index.js
import 'bootstrap/dist/css/bootstrap.min.css';


// ✅ createRoot instead of render
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
