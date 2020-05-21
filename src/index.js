import React from 'react';
import ReactDOM from 'react-dom';
//import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import Noty from 'noty';
import './i18n';

new Noty({
  text: "Loaded ConcertPOS!",
  type: "info",
  timeout: 1000,
  theme: "bootstrap-v4",
}).show();

console.log(`
/$$$$$$  /$$$$$$$   /$$$$$$   /$$$$$$ 
/$$__  $$| $$__  $$ /$$__  $$ /$$__  $$
| $$  \\__/| $$  \\ $$| $$  \\ $$| $$  \\__/
| $$      | $$$$$$$/| $$  | $$|  $$$$$$ 
| $$      | $$____/ | $$  | $$ \\____  $$
| $$    $$| $$      | $$  | $$ /$$  \\ $$
|  $$$$$$/| $$      |  $$$$$$/|  $$$$$$/
\\______/ |__/       \\______/  \\______/ 

Wait a second! This page is intended for developers, if someone sent you any code to paste in here, it's mostlikely a scam and they are trying to takeover this system.
`);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);