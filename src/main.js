import React from 'react';
import ReactDOM from 'react-dom';
import store from './store'

import { Provider } from 'react-redux'
import { Board } from './components/board/board';

import './main.scss';

ReactDOM.render(
    <Provider store={store}>
        <Board />
    </Provider>,
    document.querySelector('#root')
);