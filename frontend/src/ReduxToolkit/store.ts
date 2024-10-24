import { configureStore } from '@reduxjs/toolkit';
import { incomeReducer } from './slices/incomeSlice';
import { expenseReducer } from './slices/expenseSlice';
import { expenseTypeReducer } from './slices/expenseTypeSlice';
import { alertReducer } from './slices/alertSlice';

export const store = configureStore({
    reducer : {
            incomeReducer,
            expenseReducer,
            expenseTypeReducer,
            alertReducer
    }
})


export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
