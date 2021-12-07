import React, { useState, useRef, useEffect } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import './card.scss';

export function Card(props){
    const node = useRef(null);
    const [settings, settingsHidden] = useState(true);
    const [editable, setEditable] = useState(false);
    const [initialType, updateInitialType] = useState(props.taskType);
    const [initialContent, updateInitialContent] = useState(props.taskContent);

    function handleClick(e) {
        if (node.current.contains(e.target)) {
            return
        }
        settingsHidden(true);
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClick);
        return () => {
          document.removeEventListener("mousedown", handleClick);
        };
    }, [settings, editable]);

    function editCard() {
        settingsHidden(true);
        setEditable(true);
    };

    function saveEdit(){
        setEditable(false);
        let col = [...props.columnState];
        if (col[props.index].type === initialType && col[props.index].content === initialContent) return;
        col[props.index].type = initialType;
        col[props.index].content = initialContent;
        localStorage.setItem(props.columnName, JSON.stringify(col));
    };

    function cancelEdit(props) {
        setEditable(false);
        let col = [...props.columnState];
        if (col[props.index].type === initialType && col[props.index].content === initialContent) return;
        updateInitialType(props.taskType);
        updateInitialContent(props.taskContent);
    };

    function removeTask(props) {
        settingsHidden(true);
        let col = [...props.columnState];
        col.splice(props.index, 1);
        props.updateColumnState(col);
        localStorage.setItem(props.columnName, JSON.stringify(col));
    };

    return(
        <Draggable draggableId={props.timestamp.toString()} index={props.index}>
            {(provided, snapshot) => (
                <div ref={provided.innerRef} {...provided.draggableProps} style={{boxShadow: snapshot.isDragging ? '0 0 10px rgba(0,0,0,0.1)' : null, ...provided.draggableProps.style}} className={editable ? "card card--editing" : "card"}>
                    <div className="card__header">
                        <div className="header__label">
                            <div className="label__tag" style={{backgroundColor: props.tagColor}}></div>
                            {!editable ? <p className="label-text">{initialType}</p> : <input className="input input--task-type" maxLength={22} placeholder={'Task type'} value={initialType} onChange={(e) => updateInitialType(e.target.value)} autoFocus />}
                        </div>
                        <div className="drag-zone" {...provided.dragHandleProps}></div>
                        <div className="header__date">
                            <p className="small-text">{props.taskCreatedAt}</p>
                        </div>
                    </div>
                    <div className="card__content">
                        {!editable ?  <p className="body-text">{initialContent}</p> : <textarea className="input input--task-content" placeholder={'Task content...'} value={initialContent} onChange={(e) => updateInitialContent(e.target.value)} ></textarea>}
                    </div>
                    <div className="card__footer">
                        {editable && <div className="footer__edit-buttons"><p className="body-text" tabIndex={0} onClick={() => saveEdit(props)} onKeyPress={(e) => e.key == 'Enter' || e.key == ' ' ? saveEdit(props) : null}>Save</p><p className="body-text cancel" tabIndex={0} onClick={() => cancelEdit(props)} onKeyPress={(e) => e.key == 'Enter' || e.key == ' ' ? cancelEdit(props) : null}>Cancel</p></div>}
                        <div ref={node} className="footer__settings__wrapper">
                            <div className="footer__settings" tabIndex={0} onClick={() => settingsHidden(!settings)} onKeyPress={(e) => e.key == 'Enter' || e.key == ' ' ? settingsHidden(!settings) : null} style={!settings ? {backgroundColor: "rgba(196, 196, 196, 0.15)"} : null}></div>
                            {!settings && <div className="footer__settings--menu">
                                <div className="menu__item--edit" tabIndex={0} onClick={ () => editCard()} onKeyPress={(e) => e.key == 'Enter' || e.key == ' ' ? editCard() : null}>
                                    <p className="small-text">Edit</p>
                                    <div className="item--edit"></div>
                                </div>
                                <div className="menu__item--separator"></div>
                                <div className="menu__item--delete" tabIndex={0} onClick={ () => removeTask(props)} onKeyPress={(e) => e.key == 'Enter' || e.key == ' ' ? removeTask(props) : null}>
                                    <p className="small-text">Delete</p>
                                    <div className="item--delete"></div>
                                </div>
                            </div>}
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    )
}
