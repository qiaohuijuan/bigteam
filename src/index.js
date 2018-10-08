import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import './normalize.css';
import './animate.css';
import RouteComponent from './components/RouteComponent/main';
import { BrowserRouter } from 'react-router-dom';
import { unregister } from './registerServiceWorker';

ReactDOM.render(
    <BrowserRouter>
        <RouteComponent />
    </BrowserRouter>,
    document.getElementById('root')
);

unregister();
