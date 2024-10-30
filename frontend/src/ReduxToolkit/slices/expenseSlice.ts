import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { budgetBuddyApiUrl } from "../../configs/apiURLs";
import { setAlert } from "./alertSlice";

interface ExpenseState {
    fetchLoading: boolean;
    addLoading: boolean;
    fetchStatus: string | null;
    addStatus: string | null;
    expenses: any[];
    addMessage: string;
    fetchError: string | null;
    addError: string | null;
}


const initialState: ExpenseState = {
    fetchLoading: false,
    addLoading: false,
    fetchStatus: null,
    addStatus: null,
    expenses: [],
    addMessage: '',
    fetchError: null,
    addError: null,
}

export const fetchExpense = createAsyncThunk(
    'expense/read',
    async (userId: string | null, { rejectWithValue, dispatch }) => {
        try {
            const res = await axios.get(`${budgetBuddyApiUrl}/expense/fetch?userId=${userId}`);
            dispatch(setAlert({ message: res.data.message, variant: "success" }));
            return res.data;
        } catch (err: any) {
            const errorMessage = err.response
                ? Array.isArray(err.response.data.message)
                    ? err.response.data.message.join(',')
                    : err.response.data.message || err.message
                : err.message;
            dispatch(setAlert({ message: errorMessage, variant: "error" }));
            return rejectWithValue({ message: errorMessage, code: err.code });
        }
    }
)

export const addExpense = createAsyncThunk(
    'expense/add',
    async (formData: Object, { rejectWithValue, dispatch }) => {
        try {
            const res = await axios.post(`${budgetBuddyApiUrl}/expense/create`,
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer token'
                    }
                }
            )
            dispatch(setAlert({ message: res.data.message, variant: "success" }));
            return res.data;
        } catch (err: any) {
            const errorMessage = err.response
                ? Array.isArray(err.response.data.message)
                    ? err.response.data.message.join(',')
                    : err.response.data.message || err.message
                : err.message;
            dispatch(setAlert({ message: errorMessage, variant: 'error' }))
            return rejectWithValue({ message: errorMessage, code: err.code });
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
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Handling fetchExpense states
        builder
            .addCase(fetchExpense.pending, (state) => {
                state.fetchLoading = true;
                state.fetchError = null;
                state.fetchStatus = null;
            })
            .addCase(fetchExpense.fulfilled, (state, action: PayloadAction<any>) => {
                state.fetchLoading = false;
                state.fetchStatus = action.payload.status;
                state.expenses = action.payload.data;
                state.fetchError = null;
            })
            .addCase(fetchExpense.rejected, (state, action: PayloadAction<any>) => {
                state.fetchLoading = false;
                state.fetchStatus = 'failed';
                state.fetchError = action.payload.message || 'Failed to fetch expenses';
            })

            // Handling addExpense states
            .addCase(addExpense.pending, (state) => {
                state.addLoading = true;
                state.addError = null;
                state.addStatus = null;
            })
            .addCase(addExpense.fulfilled, (state, action: PayloadAction<any>) => {
                state.addLoading = false;
                state.addStatus = action.payload.status;
                state.addMessage = action.payload.data;
                state.addError = null;
            })
            .addCase(addExpense.rejected, (state, action: PayloadAction<any>) => {
                state.addLoading = false;
                state.addStatus = 'failed';
                state.addError = action.payload.message || 'Failed to add expense';
            });
    }
});

export const { reducer: expenseReducer } = expenseSlice;