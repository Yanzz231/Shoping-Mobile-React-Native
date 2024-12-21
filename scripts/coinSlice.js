import {createSlice} from '@reduxjs/toolkit';

export const coinSlice = createSlice({
    name: 'coin',
    initialState: {
        value: 500
    },
    reducers: {
        setCoin: (state, action) => {
            state.value = action.payload;
        },
        clear: (state) => {
            state = {};
        },
    },
});

export const {setCoin, clear} = coinSlice.actions;

export default coinSlice.reducer;
