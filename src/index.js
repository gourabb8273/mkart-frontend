import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import 'bootstrap/dist/css/bootstrap.min.css';


import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './redux/store';
import { Provider } from 'react-redux';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
     <Provider store={store}>
    <Auth0Provider
    domain="dev-13meemmp8wticu8u.us.auth0.com"
    clientId="3Rzs8M5Hbr8uRpGb4oDHEkpRK4x2f81v"
    authorizationParams={{
      redirect_uri: 
      'http://localhost:5000/'
      // window.location.origin
    }}
  >
    <App />
    </Auth0Provider>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
