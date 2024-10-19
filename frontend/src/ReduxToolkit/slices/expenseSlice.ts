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

export const createExpense = createAsyncThunk(
    'expense/create',
    async (formData, { rejectWithValue }) => {
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
        loading: false,
        expenses: [],
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchExpense.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchExpense.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.expenses = action.payload.data
                state.error = null;
            })
            .addCase(fetchExpense.rejected, (state, action: PayloadAction<any>) => {
                console.log(action);
                state.loading = false;
                state.error = action.payload.error.message || 'Failed to fetch expense';
            })
    }
})


export const { reducer: expenseReducer } = expenseSlice;