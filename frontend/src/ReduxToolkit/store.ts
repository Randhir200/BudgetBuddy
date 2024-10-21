import { configureStore } from '@reduxjs/toolkit';
import { incomeReducer } from './slices/incomeSlice';
import { expenseReducer } from './slices/expenseSlice';
import { expenseTypeReducer } from './slices/expenseTypeSlice';

export const store = configureStore({
    reducer : {
            incomeReducer,
            expenseReducer,
            expenseTypeReducer
    }
})


export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
