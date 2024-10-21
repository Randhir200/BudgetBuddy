import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { budgetBuddyApiUrl } from "../../config/config";



export const fetchExpense = createAsyncThunk(
    'expense/read',
    async (userId: string | null, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${budgetBuddyApiUrl}/expense/getAllExpense?userId=${userId}`);
            return response.data;
        } catch (err) {
            return rejectWithValue(err);
        }
    }
)

export const addExpense = createAsyncThunk(
    'expense/create',
    async (formData : Object, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${budgetBuddyApiUrl}/expense/addExpense`,
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer token'
                    }
                }
            )
            return res.data;
        } catch (err) {
            return rejectWithValue(err);
        }
    }
)

export const expenseUpdate = createAsyncThunk(
    'expense/update',
    async (body, id) => {
        await axios.patch(`${budgetBuddyApiUrl}/expense/update?_id=${id}`,
            body,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer token'
                }
            }
        )
    }
)


export const expenseDelete = createAsyncThunk(
    'expense/delete',
    async (id) => {
        await axios.delete(`${budgetBuddyApiUrl}/expense/delete?_id=${id}`)
    }
)


//Expense Slice
const expenseSlice = createSlice({
    name: 'expense',
    initialState: {
        fetchLoading: false,   
        addLoading: false,     
        expenses: [],
        addMessage: '',        
        fetchError: null,     
        addError: null        
    },
    reducers: {},
    extraReducers: (builder) => {
        // Handling fetchExpense states
        builder
            .addCase(fetchExpense.pending, (state) => {
                state.fetchLoading = true;
                state.fetchError = null;
            })
            .addCase(fetchExpense.fulfilled, (state, action: PayloadAction<any>) => {
                state.fetchLoading = false;
                state.expenses = action.payload.data;
                state.fetchError = null;
            })
            .addCase(fetchExpense.rejected, (state, action: PayloadAction<any>) => {
                state.fetchLoading = false;
                state.fetchError = action.payload?.error?.message || 'Failed to fetch expenses';
            })
            
            // Handling addExpense states
            .addCase(addExpense.pending, (state) => {
                state.addLoading = true;
                state.addError = null;
            })
            .addCase(addExpense.fulfilled, (state, action: PayloadAction<any>) => {
                state.addLoading = false;
                state.addMessage = action.payload.data;
                state.addError = null;
            })
            .addCase(addExpense.rejected, (state, action: PayloadAction<any>) => {
                state.addLoading = false;
                state.addError = action.payload?.error?.message || 'Failed to add expense';
            });
    }
});

export const { reducer: expenseReducer } = expenseSlice;