import React from 'react';
import store from '../../store';
import { useDispatch } from 'react-redux';
import { updateColumn, clearBoard } from '../../reducers/boardReducer';

import { MenuItem } from './menuItem';

import styles from './menuBar.scss';

export function MenuBar() {
    const dispatch = useDispatch();

    function clear(columnId) {
        if (!columnId) {
            dispatch(clearBoard());
            localStorage.setItem('tasks', '[]');
            localStorage.setItem('inProgress', '[]');
            localStorage.setItem('done', '[]');
            return;
        };

        dispatch(updateColumn({ columnId: columnId, columnContent: [] }));
        localStorage.setItem(columnId, '[]');
    };

    function exportAsJSON() {
        const filename = 'sprintboard_data_' + Date.now() + '.json';
        const jsonStr = JSON.stringify({
            tasks: [...store.getState().board.tasks],
            inProgress: [...store.getState().board.inProgress],
            done: [...store.getState().board.done],
        });

        let downloadLink = document.createElement('a');
        downloadLink.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonStr));
        downloadLink.setAttribute('download', filename);
        downloadLink.click();
    };

    function importJSON() {
        let input = document.createElement('input');
        input.type = 'file';

        input.onchange = (e) => {
            let file = e.target.files[0];

            if (file.type !== 'application/json') {
                alert('Wrong file type. Only JSON files accepted.');
                return
            };

            let reader = new FileReader();
            reader.readAsText(file);
            reader.onload = (event) => {
                let content = JSON.parse(event.target.result);

                let tasks = content.tasks || [];
                let inProgress = content.inProgress || [];
                let done = content.done || [];

                dispatch(updateColumn({ columnId: 'tasks', columnContent: tasks }));
                dispatch(updateColumn({ columnId: 'inProgress', columnContent: inProgress }));
                dispatch(updateColumn({ columnId: 'done', columnContent: done }));

                localStorage.setItem('tasks', JSON.stringify(tasks));
                localStorage.setItem('inProgress', JSON.stringify(inProgress));
                localStorage.setItem('done', JSON.stringify(done));
            };
        };

        input.click();
    };

    return (
        <div className={styles.menuBar}>
            <MenuItem
                title={'Edit'}
                list={[
                    {
                        title: 'Clear Board',
                        action: () => clear(),
                    },
                    {
                        title: null,
                        action: null,
                    },
                    {
                        title: `Clear 'Tasks' column`,
                        action: () => clear('tasks'),
                    },
                    {
                        title: `Clear 'In Progress' column`,
                        action: () => clear('inProgress'),
                    },
                    {
                        title: `Clear 'Done' column`,
                        action: () => clear('done'),
                    },
                    {
                        title: null,
                        action: null,
                    },
                    {
                        title: 'Reset to initial state',
                        action: () => {
                            localStorage.clear();
                            location.reload();
                        },
                    },
                ]}
            />
            <MenuItem
                title={'File'}
                list={[
                    {
                        title: 'Export as JSON file',
                        action: () => exportAsJSON(),
                    },
                    {
                        title: null,
                        action: null,
                    },
                    {
                        title: 'Import JSON file',
                        action: () => importJSON(),
                    },
                ]}
            />
        </div>
    );
};