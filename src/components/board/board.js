import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateColumn } from '../../reducers/boardReducer';
import { DragDropContext } from 'react-beautiful-dnd';

import { MenuBar } from '../menuBar/menuBar';
import { Column } from '../column/column';

import styles from './board.scss';

export function Board() {
    const boardStateArray = useSelector((state) => state.board);
    const dispatch = useDispatch();

    function updateState(result) {
        const { source, destination } = result;

        if (!destination) return;

        let fromArray = [...boardStateArray[source.droppableId]];
        // If destination column equals to source column create reference of 'fromArray'
        let toArray = source.droppableId === destination.droppableId ? fromArray : [...boardStateArray[destination.droppableId]];

        const elementToTransfer = fromArray.splice(source.index, 1)[0];

        toArray.splice(destination.index, 0, elementToTransfer);

        dispatch(updateColumn({ columnId: source.droppableId, columnContent: fromArray }));
        if (source.droppableId !== destination.droppableId) dispatch(updateColumn({ columnId: destination.droppableId, columnContent: toArray }));

        localStorage.setItem(source.droppableId, JSON.stringify(fromArray));
        if (source.droppableId !== destination.droppableId) localStorage.setItem(destination.droppableId, JSON.stringify(toArray));
    };

    return (
        <>
            <MenuBar />
            <section className={styles.board}>
                <DragDropContext onDragEnd={updateState}>
                    <Column droppableId={'tasks'} title={'TASKS'} addButton />
                    <Column droppableId={'inProgress'} title={'IN PROGRESS'} />
                    <Column droppableId={'done'} title={'DONE'} />
                </DragDropContext>
            </section>
        </>
    );
};