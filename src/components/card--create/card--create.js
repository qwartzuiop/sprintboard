import React, { useState, useEffect, useRef } from 'react';
import './card--create.scss';

export function CardCreate(props) {
    const node = useRef(null);
    const { tagColors } = props;
    const [picker, pickerHidden] = useState(true);
    const [selectedColor, setColor] = useState(props.tagColor);

    function handleClick(e) {
        if (node.current.contains(e.target)) {
            return
        }
        pickerHidden(true);
    };
    useEffect(() => {
        document.addEventListener("mousedown", handleClick);
        return () => {
          document.removeEventListener("mousedown", handleClick);
        };
    }, []);

    function selectColor(e){
        for (let i of e.target.parentElement.children){
            if (i.className.includes('selected-color')) {
                i.classList.toggle('selected-color');
                break
            }
        };

        e.target.classList.toggle('selected-color');
        setColor(e.target.style.backgroundColor);
        props.setTagColor(e.target.style.backgroundColor);
        pickerHidden(true);
    };

    return(
        <div className="card card--create">
            <div className="card__header">
                <div ref={node} className="header__label">
                    {!picker && <div className="tag__picker">
                        <div onClick={(e) => {selectColor(e)}} className={selectedColor == tagColors.red ? "tag__picker__color selected-color" : "tag__picker__color"} style={{backgroundColor: tagColors.red}}></div>
                        <div onClick={(e) => {selectColor(e)}} className={selectedColor == tagColors.green ? "tag__picker__color selected-color" : "tag__picker__color"} style={{backgroundColor: tagColors.green}}></div>
                        <div onClick={(e) => {selectColor(e)}} className={selectedColor == tagColors.blue ? "tag__picker__color selected-color" : "tag__picker__color"} style={{backgroundColor: tagColors.blue}}></div>
                        <div onClick={(e) => {selectColor(e)}} className={selectedColor == tagColors.orange ? "tag__picker__color selected-color" : "tag__picker__color"} style={{backgroundColor: tagColors.orange}}></div>
                        <div onClick={(e) => {selectColor(e)}} className={selectedColor == tagColors.yellow ? "tag__picker__color selected-color" : "tag__picker__color"} style={{backgroundColor: tagColors.yellow}}></div>
                        <div onClick={(e) => {selectColor(e)}} className={selectedColor == tagColors.brown ? "tag__picker__color selected-color" : "tag__picker__color"} style={{backgroundColor: tagColors.brown}}></div>
                        <div onClick={(e) => {selectColor(e)}} className={selectedColor == tagColors.purple ? "tag__picker__color selected-color" : "tag__picker__color"} style={{backgroundColor: tagColors.purple}}></div>
                        <div onClick={(e) => {selectColor(e)}} className={selectedColor == tagColors.teal ? "tag__picker__color selected-color" : "tag__picker__color"} style={{backgroundColor: tagColors.teal}}></div>
                    </div> }
                    <div className="label__tag" onClick={() => pickerHidden(!picker)} style={{backgroundColor: props.tagColor}}></div>
                    <input className="input input--task-type" maxLength={22} placeholder={'Task type'} onChange={(e) => props.taskTypeValue(e.target.value)} autoFocus onFocus={() => pickerHidden(true)} />
                </div>
                <div onClick={() => props.closeButton(true)} className="header__close-button"></div>
            </div>
            <textarea onChange={(e) => props.taskContentValue(e.target.value)} className="input input--task-content" placeholder={'Task content...'}></textarea>
        </div>
    )
}