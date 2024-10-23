import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { budgetBuddyApiUrl } from "../../config/config";

interface AlertState {
    showAlert: boolean;
    message: string;
    severity: 'success' | 'error' | '';  // You can extend this as needed
}

interface ExpenseTypeState {
    fetchLoading: boolean;
    addLoading: boolean;
    expenseTypes: any[];
    addMessage: string;
    fetchError: string | null;
    addError: string | null;
    alert: AlertState; // New alert state added here
}

const initialState: ExpenseTypeState = {
    fetchLoading: false,
    addLoading: false,
    expenseTypes: [],
    addMessage: '',
    fetchError: null,
    addError: null,
    alert: {
        showAlert: false,
        message: '',
        severity: '',
    },
};

// Thunk for fetching expense types
export const fetchExpenseType = createAsyncThunk(
    `expenseType/fetch`,
    async (userId: string | null, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${budgetBuddyApiUrl}/config/getAllConfigs?userId=${userId}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

// Thunk for adding a new expense type
export const addExpenseType = createAsyncThunk(
    'expesnseType/add',
    async (formData: Object, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${budgetBuddyApiUrl}/config/addConfig`,
                formData,
                {
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': 'Bearer token',
                    }
                }
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

const expenseTypeSlice = createSlice({
    name: 'expenseType',
    initialState,
    reducers: {
        // Reducers to manage alert state
        showAlert: (state, action: PayloadAction<{ message: string, type: 'success' | 'error' }>) => {
            state.alert.showAlert = true;
            state.alert.message = action.payload.message;
            state.alert.severity = action.payload.type;
        },
        hideAlert: (state) => {
            state.alert.showAlert = false;
            state.alert.message = '';
            state.alert.severity = '';
        },
    },
    extraReducers: (builder) => {
        builder
            // Handling fetchExpenseType thunk
            .addCase(fetchExpenseType.pending, (state) => {
                state.fetchLoading = true;
                state.fetchError = null;
            })
            .addCase(fetchExpenseType.fulfilled, (state, action: PayloadAction<any>) => {
                state.fetchLoading = false;
                state.expenseTypes = action.payload.data;
                state.fetchError = null;
                state.alert = { showAlert: true, message: 'Expenses fetched successfully!', severity: 'success' }; // Success alert
            })
            .addCase(fetchExpenseType.rejected, (state, action: PayloadAction<any>) => {
                state.fetchLoading = false;
                state.fetchError = action.payload?.error?.message || 'Failed to fetch expenses';
                state.alert = { showAlert: true, message: 'Failed to fetch expenses!', severity: 'error' }; // Error alert
            })

            // Handling addExpenseType thunk
            .addCase(addExpenseType.pending, (state) => {
                state.addLoading = true;
                state.addError = null;
            })
            .addCase(addExpenseType.fulfilled, (state, action: PayloadAction<any>) => {
                state.addLoading = false;
                state.addMessage = action.payload.message || 'Expense type added successfully';
                state.addError = null;
                state.alert = { showAlert: true, message: 'Expense type added successfully!', severity: 'success' }; // Success alert
            })
            .addCase(addExpenseType.rejected, (state, action: PayloadAction<any>) => {
                state.addLoading = false;
                state.addError = action.payload?.error?.message || 'Something went wrong!';
                state.alert = { showAlert: true, message: 'Failed to add expense type!', severity: 'error' }; // Error alert
            });
    }
});

export const { showAlert, hideAlert } = expenseTypeSlice.actions;
export const { reducer: expenseTypeReducer } = expenseTypeSlice;
