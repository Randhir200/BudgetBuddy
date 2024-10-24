import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { budgetBuddyApiUrl } from "../../config/config";
import { setAlert } from "./alertSlice";


interface ExpenseTypeState {
    fetchLoading: boolean;
    addLoading: boolean;
    fetchStatus: string | null;
    addStatus: string | null;
    expenseTypes: any[];
    addMessage: string;
    fetchError: string | null;
    addError: string | null;
}

const initialState: ExpenseTypeState = {
    fetchLoading: false,
    addLoading: false,
    fetchStatus: null,
    addStatus: null,
    expenseTypes: [],
    addMessage: '',
    fetchError: null,
    addError: null,
};

// Thunk for fetching expense types
export const fetchExpenseType = createAsyncThunk(
    `expenseType/fetch`,
    async (userId: string | null, { rejectWithValue, dispatch }) => {
        try {
            const res = await axios.get(`${budgetBuddyApiUrl}/config/getAllConfigs?userId=${userId}`);
            dispatch(setAlert({ message: res.data.message, variant: 'success' }));
            return res.data;
        } catch (err: any) {
            const errorMessage = err.response
                ? Array.isArray(err.response.data.message)
                    ? err.response.data.message.join(',')
                    : err.response.data.message || err.message
                : err.message;

            dispatch(setAlert({ message: errorMessage, variant: 'error' }));
            return rejectWithValue({ message: errorMessage, code: err.code });
        }
    }
);

// Thunk for adding a new expense type
export const addExpenseType = createAsyncThunk(
    'expenseType/add',
    async (formData: Object, { rejectWithValue, dispatch }) => {
        try {
            const res = await axios.post(
                `${budgetBuddyApiUrl}/config/addConfig`,
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer token',
                    },
                }
            );
            dispatch(setAlert({ message: res.data.message, variant: 'success' }));
            return res.data;
        } catch (err: any) {
            const errorMessage = err.response
                ? Array.isArray(err.response.data.message)
                    ? err.response.data.message.join(',')
                    : err.response.data.message || err.message
                : err.message;

            dispatch(setAlert({ message: errorMessage, variant: 'error' }));
            return rejectWithValue({ message: errorMessage, code: err.code });
        }
    }
);
const expenseTypeSlice = createSlice({
    name: 'expenseType',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Handling fetchExpenseType thunk
            .addCase(fetchExpenseType.pending, (state) => {
                state.fetchLoading = true;
                state.fetchError = null;
                state.fetchStatus = null;
            })
            .addCase(fetchExpenseType.fulfilled, (state, action: PayloadAction<any>) => {
                state.fetchLoading = false;
                state.fetchStatus = action.payload.status;
                state.expenseTypes = action.payload.data;
                state.fetchError = null;
            })
            .addCase(fetchExpenseType.rejected, (state, action: PayloadAction<any>) => {
                state.fetchLoading = false;
                state.fetchStatus = 'failed';
                state.fetchError = action.payload?.error?.message || 'Failed to fetch expenses';
            })

            // Handling addExpenseType thunk
            .addCase(addExpenseType.pending, (state) => {
                state.addLoading = true;
                state.addError = null;
                state.addStatus = null;
            })
            .addCase(addExpenseType.fulfilled, (state, action: PayloadAction<any>) => {
                state.addLoading = false;
                state.addStatus = action.payload.status;
                state.addMessage = action.payload.message || 'Expense type added successfully';
                state.addError = null;
            })
            .addCase(addExpenseType.rejected, (state, action: PayloadAction<any>) => {
                state.addLoading = false;
                state.addStatus = 'failed';
                state.addError = action.payload.message || 'Something went wrong!';
            });
    }
});

export const { reducer: expenseTypeReducer } = expenseTypeSlice;
