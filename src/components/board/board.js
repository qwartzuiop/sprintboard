import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { TopBar } from '../topBar/topBar';
import { Card } from '../card/card';
import { CardCreate } from '../card--create/card--create';
import './board.scss';

export function Board(){
    const getStarted = JSON.stringify([
        {type:"Help",content:"A sprint is a short, time-boxed period when a team works to complete a set amount of work.\n\nSprintBoard is a tool that helps teams make sprint backlog items visible.",dateTime:'',timestamp:111111,tagColor:"rgb(252, 43, 45)"},
        {type:"FAQ",content:"How to add a new task?\n\n1. To add a task to the list, click on the ' + ' button below.\n2. Set 'Task type' and 'Task content'.\n3. Select a tag color to visually divide similar tasks into groups.",dateTime:'',timestamp:111112,"tagColor":"rgb(255, 214, 10)"},
        {type:"FAQ",content:"How to move a task to an adjacent list?\n\nYou can move a task to adjacent status lists by dragging it from the top of the card.",dateTime:'',timestamp:111113,tagColor:"rgb(255, 214, 10)"},
        {type:"Hotkeys",content:"When creating a task, press 'Tab' to move focus to the completion button and press 'Space' or 'Enter'.\nSimilarly, you can quickly add the next task.",dateTime:'',timestamp:111114,tagColor:"rgb(48, 211, 59)"},
        {type:"Accessibility",content:"Use 'Tab' to set focus on the card drag’n’drop area, press 'Space', use the arrows to move the task to the desired status list and press 'Space' again to confirm the transfer.",dateTime:'',timestamp:111115,tagColor:"rgb(90, 200, 245)"}
    ]);
    const tagColors = {red: 'rgb(252, 43, 45)', green: 'rgb(48, 211, 59)', blue: 'rgb(16, 107, 255)', orange: 'rgb(255, 159, 10)', yellow: 'rgb(255, 214, 10)', brown: 'rgb(172, 142, 104)', purple: 'rgb(191, 90, 242)', teal: 'rgb(90, 200, 245)'};
    const [card, isHidden] = useState(true);
    const [typeValue, getTypeValue] = useState('');
    const [contentValue, getContentValue] = useState('');
    const [tagColor, getTagColor] = useState(tagColors.red);
    const [tasksCol, updateTasksCol] = useState(JSON.parse(localStorage.tasks ? localStorage.tasks : getStarted));
    const [inProgressCol, updateInProgressCol] = useState(JSON.parse(localStorage.inProgress ? localStorage.inProgress : null));
    const [doneCol, updateDoneCol] = useState(JSON.parse(localStorage.done ? localStorage.done : null));

    function getDateTime() {
        let today = new Date();
        return today.toLocaleString("en-GB", {month: 'short'}).concat(' ', today.toLocaleString("en-GB", {day: 'numeric'}).concat('  ', today.toLocaleString("en-GB", {hour: 'numeric', minute: 'numeric'})));
    };

    function updateColState(column, newState){
        (column == 'droppableTasks') ? updateTasksCol(newState) :
        (column == 'droppableInProgress') ? updateInProgressCol(newState) :
        (column == 'droppableDone') ? updateDoneCol(newState) : null;
    };

    function handleOnDragEnd(result) {
        const { source, destination } = result;
        const stateArr = [tasksCol ? [...tasksCol] : [], inProgressCol ? [...inProgressCol] : [], doneCol ? [...doneCol] : []];
        const droppableIndex  = ['droppableTasks', 'droppableInProgress', 'droppableDone'];
        const storageIndex = ['tasks', 'inProgress', 'done'];

        if (!destination) return;

        if (source.droppableId === destination.droppableId) {
            let column = [...stateArr[droppableIndex.indexOf(source.droppableId)]];
            const [reorderingCard] = column.splice(source.index, 1);
            column.splice(destination.index, 0, reorderingCard);
            localStorage.setItem(storageIndex[droppableIndex.indexOf(source.droppableId)], JSON.stringify(column));
            updateColState(source.droppableId, column)
        } else {
            let from = [...stateArr[droppableIndex.indexOf(source.droppableId)]];
            const [draggingCard] = from.splice(source.index, 1);
            updateColState(source.droppableId, from);
            localStorage.setItem(storageIndex[droppableIndex.indexOf(source.droppableId)], JSON.stringify(from));

            let to = [...stateArr[droppableIndex.indexOf(destination.droppableId)]];
            to.splice(destination.index, 0, draggingCard);
            updateColState(destination.droppableId, to)
            localStorage.setItem(storageIndex[droppableIndex.indexOf(destination.droppableId)], JSON.stringify(to));
        };
    };

    function handleTaskButton() {
        if (card) {
            isHidden(!card);
        } else if (typeValue != 0 && contentValue != 0) {
            let tasksList = tasksCol ? [...tasksCol] : [];
            tasksList.push({type: typeValue, content: contentValue, dateTime: getDateTime(), timestamp: Date.now(), tagColor: tagColor});
            localStorage.setItem('tasks', JSON.stringify(tasksList));
            updateTasksCol(tasksList);
            getTypeValue('');
            getContentValue('');
            isHidden(!card);
        };
    };

    return(
        <>
            <TopBar updateTasksCol={updateTasksCol} updateInProgressCol={updateInProgressCol} updateDoneCol={updateDoneCol} />
            <section className='board'>
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="droppableTasks">
                        {(provided) => (
                            <div className='col col--tasks'>
                                <div className='tasks title-text'>TASKS</div>
                                <div className="col__content"  ref={provided.innerRef}>
                                    {tasksCol?.map((item, index) => (
                                        <Card taskType={item.type} taskContent={item.content} taskCreatedAt={item.dateTime} tagColor={item.tagColor} key={item.timestamp} timestamp={item.timestamp} index={index} columnState={tasksCol} updateColumnState={updateTasksCol} columnName={'tasks'} />
                                    ))}
                                    {provided.placeholder}
                                    {!card && <CardCreate closeButton={isHidden} taskTypeValue={getTypeValue} taskContentValue={getContentValue} tagColors={tagColors} tagColor={tagColor} setTagColor={getTagColor} />}
                                    <div onClick={() => handleTaskButton()} onKeyPress={(e) => e.key == 'Enter' || e.key == ' ' ? handleTaskButton() : null} className={card ? 'task-button task-button--create body-text' : 'task-button task-button--done body-text'} role={'button'} tabIndex={0}>Add task</div>
                                </div>
                            </div>
                        )}
                    </Droppable>
                    <Droppable droppableId="droppableInProgress">
                        {(provided) => (
                            <div className='col col--progress'>
                                <div className='progress title-text'>IN PROGRESS</div>
                                <div className="col__content"  ref={provided.innerRef}>
                                    {inProgressCol?.map((item, index) => (
                                        <Card taskType={item.type} taskContent={item.content} taskCreatedAt={item.dateTime} tagColor={item.tagColor} key={item.timestamp} timestamp={item.timestamp} index={index} columnState={inProgressCol} updateColumnState={updateInProgressCol} columnName={'inProgress'} />
                                    ))}
                                    {provided.placeholder}
                                </div>
                            </div>
                        )}
                    </Droppable>
                    <Droppable droppableId="droppableDone">
                        {(provided) => (
                            <div className='col col--completed'>
                                <div className='completed title-text'>DONE</div>
                                <div className="col__content"  ref={provided.innerRef}>
                                    {doneCol?.map((item, index) => (
                                        <Card taskType={item.type} taskContent={item.content} taskCreatedAt={item.dateTime} tagColor={item.tagColor} key={item.timestamp} timestamp={item.timestamp} index={index} columnState={doneCol} updateColumnState={updateDoneCol} columnName={'done'} />
                                    ))}
                                    {provided.placeholder}
                                </div>
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </section>
        </>
    );
};