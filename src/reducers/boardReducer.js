import { createSlice } from '@reduxjs/toolkit';
import getStarted from '../getStartedCards.json';
let { tasks, inProgress, done } = getStarted;

export const boardSlice = createSlice({
    name: 'board',
    initialState: {
        tasks: localStorage.tasks ? JSON.parse(localStorage.tasks) : Object.values(tasks),
        inProgress: localStorage.inProgress ? JSON.parse(localStorage.inProgress) : Object.values(inProgress),
        done: localStorage.done ? JSON.parse(localStorage.done) : Object.values(done),
    },
    reducers: {
        toggleSettings: (state) => {
            state.isSettingsHidden = !state.isSettingsHidden;
        },
        updateColumn: (state, action) => {
            state[action.payload.columnId] = action.payload.columnContent;
        },
        addCard: (state, action) => {
            state[action.payload.columnId].unshift({
                type: action.payload.type,
                content: action.payload.content,
                dateTime: action.payload.dateTime,
                timestamp: action.payload.timestamp,
                tagColor: action.payload.tagColor,
            });
        },
        clearBoard: (state) => {
            state.tasks = [];
            state.inProgress = [];
            state.done = [];
        },
    },
});

export const { updateColumn, addCard, clearBoard } = boardSlice.actions;

export default boardSlice.reducer;