import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import './main.css';

var isDev = window.location.href.includes('dev');

ReactDOM.render(<App isDev={isDev} />, document.getElementById('root'));
