import React, { useState, useEffect, useRef } from 'react';
import store from '../../store';
import { useDispatch } from 'react-redux';
import { addCard } from '../../reducers/boardReducer';

import styles from './card.scss';

const tagColors = {
    red: 'var(--color-red)',
    green: 'var(--color-green)',
    blue: 'var(--color-blue)',
    orange: 'var(--color-orange)',
    yellow: 'var(--color-yellow)',
    brown: 'var(--color-brown)',
    purple: 'var(--color-purple)',
    teal: 'var(--color-teal)'
};

export function CardCreate({ changeAddButtonState, changeCardCreateState, columnName }) {
    const [isPickerVisible, setPickerVisibility] = useState(false);
    const [tagColor, setTagColor] = useState(tagColors.red);
    const [cardType, setCardType] = useState('');
    const [cardContent, setCardContent] = useState('');
    const [cardTypeError, setCardTypeError] = useState(false);
    const [cardContentError, setCardContentError] = useState(false);
    const dispatch = useDispatch();
    const tagPickerButton = useRef(null);
    const tagPicker = useRef(null);


    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isPickerVisible]);

    function handleClickOutside(e) {
        if (tagPickerButton.current?.contains(e.target) || tagPicker.current?.contains(e.target)) return;
        setPickerVisibility(false);
    };

    function changeTagColor(color) {
        setTagColor(color);
        setPickerVisibility(false);
        tagPickerButton.current.focus();
    };

    function togglePicker() {
        setPickerVisibility(!isPickerVisible);
    };

    function hideCardCreate() {
        changeCardCreateState(false);
        changeAddButtonState(true);
    };

    function checkIfInputsEmpty() {
        let result;

        if (cardType.length == 0) {
            setCardTypeError(true);
            result = true;
        };

        if (cardContent.length == 0) {
            setCardContentError(true);
            result = true;
        };

        return result;
    };

    function addCardButtonHandler() {
        if (checkIfInputsEmpty()) return;

        const formattedDateTime = new Date().toLocaleString("en-GB", { month: 'short' }).concat(' ', new Date().toLocaleString("en-GB", { day: 'numeric' }).concat(' ', new Date().toLocaleString("en-GB", { hour: 'numeric', minute: 'numeric' })));

        const createdCard = {
            type: cardType,
            content: cardContent,
            dateTime: formattedDateTime,
            timestamp: Date.now(),
            tagColor: tagColor,
        };

        dispatch(addCard({ columnId: columnName, ...createdCard }));

        const updatedColumnState = store.getState().board[columnName];

        localStorage.setItem(columnName, JSON.stringify(updatedColumnState));

        hideCardCreate();
    };

    return (
        <div className={styles.card}>
            <div
                className={styles.labelWrapper}
            >
                <button
                    className={styles.tagCardCreate}
                    onClick={() => togglePicker()}
                    style={{ backgroundColor: tagColor }}
                    ref={tagPickerButton}
                />
                {isPickerVisible &&
                    <div
                        className={styles.picker}
                        ref={tagPicker}
                    >
                        {Object.values(tagColors).map((color, index) => {
                            return <button
                                className={styles.tagCardCreate}
                                onClick={() => changeTagColor(color)}
                                style={{ backgroundColor: color }}
                                key={index}
                            />
                        })}
                    </div>
                }
                <input
                    className={`${styles.cardTypeInput} ${cardTypeError ? styles.error : ''}`}
                    maxLength={22}
                    placeholder={'Task type...'}
                    onChange={(e) => setCardType(e.target.value)}
                    onFocus={() => setCardTypeError(false)}
                />
            </div>

            <textarea
                className={`${styles.cardContentInput} ${cardContentError ? styles.error : ''}`}
                rows={4}
                placeholder={'Task content...'}
                onChange={(e) => setCardContent(e.target.value)}
                onFocus={() => setCardContentError(false)}
            />

            <div className={styles.buttonsWrapper}>
                <button
                    className={styles.button}
                    onClick={() => addCardButtonHandler()}
                >
                    Add
                </button>
                <button
                    className={`${styles.button} ${styles.buttonCancel}`}
                    onClick={() => hideCardCreate()}
                >
                    Cancel
                </button>
            </div>
        </div>
    )
}