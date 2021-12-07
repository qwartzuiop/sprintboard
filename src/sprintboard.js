import React from 'react';
import ReactDOM from 'react-dom';
import { Board } from './components/board/board';
import './sprintboard.scss';

ReactDOM.render(
    <Board />,
    document.querySelector('#root')
);