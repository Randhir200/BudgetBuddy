import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { apiClient } from "../../configs/apiClient";
import { setAlert } from "./alertSlice";

interface ExpenseState {
    fetchLoading: boolean;
    addLoading: boolean;
    updateLoading: boolean;
    deleteLoading: boolean;
    fetchStatus: string | null;
    addStatus: string | null;
    updateStatus: string | null;
    deleteStatus: string | null;
    expenses: any[];
    addMessage: string;
    fetchError: string | null;
    addError: string | null;
}


const initialState: ExpenseState = {
    fetchLoading: false,
    addLoading: false,
    updateLoading: false,
    deleteLoading: false,
    fetchStatus: null,
    addStatus: null,
    updateStatus: null,
    deleteStatus: null,
    expenses: [],
    addMessage: '',
    fetchError: null,
    addError: null,
}

export const fetchExpense = createAsyncThunk(
    'expense/read',
    async (userId: string | null, { rejectWithValue, dispatch }) => {
        try {
            const res = await apiClient.get(`/expense/fetch?userId=${userId}`);
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
            const res = await apiClient.post(`/expense/create`, formData)
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
    async ({ body, id }: { body: any; id: string }, { rejectWithValue, dispatch }) => {
        try {
            const res = await apiClient.patch(`/expense/update/${id}`, body);
            dispatch(setAlert({ message: res.data.message, variant: "success" }));
            return res.data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message;
            dispatch(setAlert({ message: errorMessage, variant: "error" }));
            return rejectWithValue({ message: errorMessage, code: err.code });
        }
    }
)


export const expenseDelete = createAsyncThunk(
    'expense/delete',
    async (id: string, { rejectWithValue, dispatch }) => {
        try {
            const res = await apiClient.delete(`/expense/delete/${id}`);
            dispatch(setAlert({ message: res.data.message, variant: "success" }));
            return { id, ...res.data };
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message;
            dispatch(setAlert({ message: errorMessage, variant: "error" }));
            return rejectWithValue({ message: errorMessage, code: err.code });
        }
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
            })
            .addCase(expenseUpdate.pending, (state) => {
                state.updateLoading = true;
                state.updateStatus = null;
            })
            .addCase(expenseUpdate.fulfilled, (state, action: PayloadAction<any>) => {
                state.updateLoading = false;
                state.updateStatus = action.payload.status;
                const updatedExpense = action.payload.data;
                state.expenses = state.expenses.map((expense) =>
                    expense._id === updatedExpense._id ? updatedExpense : expense
                );
            })
            .addCase(expenseUpdate.rejected, (state) => {
                state.updateLoading = false;
                state.updateStatus = 'failed';
            })
            .addCase(expenseDelete.pending, (state) => {
                state.deleteLoading = true;
                state.deleteStatus = null;
            })
            .addCase(expenseDelete.fulfilled, (state, action: PayloadAction<any>) => {
                state.deleteLoading = false;
                state.deleteStatus = action.payload.status;
                state.expenses = state.expenses.filter((expense) => expense._id !== action.payload.id);
            })
            .addCase(expenseDelete.rejected, (state) => {
                state.deleteLoading = false;
                state.deleteStatus = 'failed';
            });
    }
});

export const { reducer: expenseReducer } = expenseSlice;
