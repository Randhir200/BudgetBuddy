import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { budgetBuddyApiUrl } from '../../configs/apiURLs';

interface IncomeState {
    loading: boolean;
    incomeData: any;
    error: string | null;
}

const initialState: IncomeState = {
    loading: true,
    incomeData: [],
    error: ''
}

// async thunk for fetching income
export const fetchIncome = createAsyncThunk(
    'income/fetchIncome', 
    async (userId: string) => {
    const response = await axios.get(`${budgetBuddyApiUrl}/expense/getAllExpense?userId=${userId}`)
    return response.data;
});

const incomeSlice = createSlice({
    name: 'income',
    initialState,
    reducers: {}, //for synchronus actions
    extraReducers: (builder) => {
        builder
        .addCase(fetchIncome.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchIncome.fulfilled, (state, action: PayloadAction<any>)=>{
            state.loading = false;
            state.incomeData = action.payload.data;
            state.error = null;
        })
    }
})

export const { reducer: incomeReducer } = incomeSlice

