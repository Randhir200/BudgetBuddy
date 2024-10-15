import { configureStore } from '@reduxjs/toolkit';
import { incomeReducer } from './incomeSlice/incomeSlice';

export const store = configureStore({
    reducer : {
            incomeReducer,
    }
})


export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
