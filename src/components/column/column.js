import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { Droppable } from 'react-beautiful-dnd';
import { Card } from '../card/card';
import { CardCreate } from '../card/cardCreate';

import styles from './column.scss';

export function Column({ droppableId, title, addButton }) {
    const [addButtonVisible, isAddButtonVisible] = useState(true);
    const [cardCreateVisible, isCardCreateVisible] = useState(false);

    function handleTaskButton() {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
        isAddButtonVisible(false);
        isCardCreateVisible(true);
    }

    return (
        <Droppable droppableId={droppableId}>
            {(provided) => (
                <section className={styles.column}>
                    <header className={styles.header}>
                        <div></div>

                        <h3 className={styles.title}>
                            {title}
                        </h3>

                        <div>
                            {addButton && addButtonVisible &&
                                <button
                                    className={styles.addButton}
                                    onClick={() => handleTaskButton()}
                                    tabIndex={0}
                                >
                                    <span className={styles.addLabel}>ADD</span>
                                    <svg className={styles.addIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="11" y="4" width="2" height="16" rx="0.5" />
                                        <rect x="4" y="13" width="2" height="16" rx="0.5" transform="rotate(-90 4 13)" />
                                    </svg>
                                </button>
                            }
                        </div>
                    </header>

                    <section className={styles.content} ref={provided.innerRef}>
                        {addButton && cardCreateVisible &&
                            <CardCreate changeAddButtonState={isAddButtonVisible} changeCardCreateState={isCardCreateVisible} columnName={droppableId} />
                        }
                        {useSelector((state) => state.board[droppableId]).map((item, index) => {
                            return <Card data={item} index={index} key={item.timestamp || index} columnName={droppableId} />
                        })}
                        {provided.placeholder}
                    </section>
                </section>
            )}
        </Droppable>
    );
};