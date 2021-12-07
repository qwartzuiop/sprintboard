import React, { useState, useRef, useEffect } from 'react';
import changeLanguage from '../../img/change-language.svg';
import changeLanguageDark from '../../img/change-language--dark.svg';
import themeSwitcher from '../../img/theme-switcher.svg';
import themeSwitcherDark from '../../img/theme-switcher--dark.svg';
import './topBar.scss';

export function TopBar(props) {
    const node = useRef(null);
    const [menu, showMenu] = useState(false);
    const [theme, setTheme] = useState(localStorage.theme ? localStorage.theme : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    function handleClick(e) {
        if (node.current.contains(e.target)) {
            return
        }
        showMenu(false);
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClick);
        return () => {
          document.removeEventListener("mousedown", handleClick);
        };
    }, [menu]);

    useEffect(() => {
        document.body.classList.add(theme);
        localStorage.setItem('theme', theme);
        return () => {
            document.body.classList.remove(theme);
        };
    }, [theme]);

    function changeTheme() {
        theme === 'dark' ? setTheme('light') : setTheme('dark');
    };

    function clear(col) {
        (col === 'tasks') ? (() => {
            props.updateTasksCol([]);
            localStorage.setItem(col, JSON.stringify([]));
        })() : (col === 'inProgress') ? (() => {
            props.updateInProgressCol([]);
            localStorage.setItem(col, JSON.stringify([]));
        })() : (col === 'done') ? (() => {
            props.updateDoneCol([]);
            localStorage.setItem(col, JSON.stringify([]));
        })() : (() => {
            props.updateTasksCol([]);
            localStorage.setItem('tasks', JSON.stringify([]));
            props.updateInProgressCol([]);
            localStorage.setItem('inProgress', JSON.stringify([]));
            props.updateDoneCol([]);
            localStorage.setItem('done', JSON.stringify([]));
        })();
    };

    return(
        <div className="topBar">
            {/* TODO */}
            {/* <div className="topBar__item" onClick={() => alert('WIP')}><img src={theme === 'dark' ? changeLanguageDark : changeLanguage} title="Change language" alt="Change language" /></div> */}
            <div className="topBar__item" onClick={() => changeTheme()}><img src={theme === 'dark' ? themeSwitcherDark : themeSwitcher} title="Change theme color" alt="Switch theme" /></div>
            <div ref={node} className="topBar__item" style={menu ? {backgroundColor: "rgba(196, 196, 196, 0.15)"} : null} onClick={() => showMenu(!menu)}>Edit
                {menu && <div className="topBar__item__menu">
                    <div className="menu__item" onClick={() => clear()}>Clear board</div>
                    <div className="menu__item--separator"></div>
                    <div className="menu__item" onClick={() => clear('tasks')}>Clear 'Tasks' column</div>
                    <div className="menu__item" onClick={() => clear('inProgress')}>Clear 'In Progress' column</div>
                    <div className="menu__item" onClick={() => clear('done')}>Clear 'Done' column</div>
                </div>}
            </div>
        </div>
    );
};