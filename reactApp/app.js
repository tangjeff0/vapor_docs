const React = require('react');
const ReactDOM = require('react-dom');
import {MemoryRouter} from 'react-router-dom';

import App from './components/App';

ReactDOM.render(
  <MemoryRouter>
    <App />
  </MemoryRouter>,
  document.getElementById('root')
);
