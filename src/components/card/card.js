import React, { useState, useRef, useEffect } from 'react';
import store from '../../store';
import { useDispatch } from 'react-redux';
import { updateColumn } from '../../reducers/boardReducer';

import { Draggable } from 'react-beautiful-dnd';

import styles from './card.scss';

export function Card({ data, index, columnName }) {
    const [isMenuVisible, setMenuVisibility] = useState(false);
    const dispatch = useDispatch();
    const node = useRef(null);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuVisible]);

    function handleClickOutside(e) {
        if (node.current.contains(e.target)) return;
        setMenuVisibility(false);
    };

    function removeTask() {
        setMenuVisibility(false);

        let columnContent = [...store.getState().board[columnName]];
        columnContent.splice(index, 1);

        dispatch(updateColumn({ columnId: columnName, columnContent: columnContent }));
        localStorage.setItem(columnName, JSON.stringify(columnContent));
    };

    return (
        <Draggable
            draggableId={data.timestamp?.toString() || index.toString() + Date.now()}
            index={index}
        >
            {(provided, snapshot) => (
                <article
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    style={{ boxShadow: snapshot.isDragging ? '0 0 16px 4px rgba(0,0,0,0.15)' : null, ...provided.draggableProps.style }}
                    className={styles.card}
                >
                    <header className={styles.header}>
                        <div className={styles.labelWrapper}>
                            <div
                                className={styles.tag}
                                style={{ backgroundColor: data.tagColor || 'hsl(359deg, 97%, 57%)' }}
                            >
                            </div>
                            <p className={styles.title}>
                                {data.type || 'Help'}
                            </p>
                        </div>
                        <div
                            className={styles.dragZone}
                            {...provided.dragHandleProps}>
                        </div>
                        <span className={styles.date}>
                            {data.dateTime}
                        </span>
                    </header>

                    <main className={styles.main}>
                        <p className={styles.cardText}>
                            {data.content || 'Ooops! Looks like something gone wrong...\nTry reset the board to initial state using \'Edit\' menu.'}
                        </p>
                    </main>

                    <footer
                        className={styles.footer}
                        ref={node}
                    >
                        <button
                            className={`${styles.menuButton} ${isMenuVisible ? styles.active : ''}`}
                            onClick={() => setMenuVisibility(!isMenuVisible)}
                        >
                            <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                <rect x='17' y='10' width='4' height='4' rx='1' />
                                <rect x='10' y='10' width='4' height='4' rx='1' />
                                <rect x='3' y='10' width='4' height='4' rx='1' />
                            </svg>
                        </button>

                        {isMenuVisible &&
                            <div className={styles.menuList}>
                                <button
                                    className={styles.listItem}
                                    onClick={() => removeTask()}
                                >
                                    Remove
                                </button>
                            </div>
                        }
                    </footer>
                </article>
            )}
        </Draggable>
    )
}
