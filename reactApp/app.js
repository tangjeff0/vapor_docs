const React = require('react');
const ReactDOM = require('react-dom');
import {MemoryRouter} from 'react-router-dom';

import App from './components/App';
/* This can check if your electron app can communicate with your backend */
// fetch('http://localhost:3000')
// .then(resp => resp.text())
// .then(text => console.log(text))
// .catch(err => {throw err})

ReactDOM.render(
  <MemoryRouter>
    <App />
  </MemoryRouter>,
  document.getElementById('root')
);
