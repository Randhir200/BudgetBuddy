import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiClient } from "../../configs/apiClient";
import { setAlert } from "./alertSlice";


interface ExpenseTypeState {
    fetchLoading: boolean;
    addLoading: boolean;
    updateLoading: boolean;
    deleteLoading: boolean;
    fetchStatus: string | null;
    addStatus: string | null;
    updateStatus: string | null;
    deleteStatus: string | null;
    expenseTypes: any[];
    addMessage: string;
    fetchError: string | null;
    addError: string | null;
}

const initialState: ExpenseTypeState = {
    fetchLoading: false,
    addLoading: false,
    updateLoading: false,
    deleteLoading: false,
    fetchStatus: null,
    addStatus: null,
    updateStatus: null,
    deleteStatus: null,
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
            const res = await apiClient.get(`/expenseType/fetch?userId=${userId}`);
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
            const res = await apiClient.post(`/expenseType/create`, formData);
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

// Thunk for updating an expense type
export const updateExpenseType = createAsyncThunk(
    'expenseType/update',
    async ({ id, formData }: { id: string; formData: Object }, { rejectWithValue, dispatch }) => {
        try {
            const res = await apiClient.patch(`/expenseType/update/${id}`, formData);
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

// Thunk for deleting an expense type
export const deleteExpenseType = createAsyncThunk(
    'expenseType/delete',
    async (id: string, { rejectWithValue, dispatch }) => {
        try {
            const res = await apiClient.delete(`/expenseType/delete/${id}`);
            dispatch(setAlert({ message: res.data.message, variant: 'success' }));
            return { id, ...res.data };
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
                state.expenseTypes.push(action.payload.data);
                state.addError = null;
            })
            .addCase(addExpenseType.rejected, (state, action: PayloadAction<any>) => {
                state.addLoading = false;
                state.addStatus = 'failed';
                state.addError = action.payload.message || 'Something went wrong!';
            })

            // Handling updateExpenseType thunk
            .addCase(updateExpenseType.pending, (state) => {
                state.updateLoading = true;
                state.updateStatus = null;
            })
            .addCase(updateExpenseType.fulfilled, (state, action: PayloadAction<any>) => {
                state.updateLoading = false;
                state.updateStatus = action.payload.status;
                const updatedExpenseType = action.payload.data;
                state.expenseTypes = state.expenseTypes.map((expenseType) =>
                    expenseType._id === updatedExpenseType._id ? updatedExpenseType : expenseType
                );
            })
            .addCase(updateExpenseType.rejected, (state) => {
                state.updateLoading = false;
                state.updateStatus = 'failed';
            })

            // Handling deleteExpenseType thunk
            .addCase(deleteExpenseType.pending, (state) => {
                state.deleteLoading = true;
                state.deleteStatus = null;
            })
            .addCase(deleteExpenseType.fulfilled, (state, action: PayloadAction<any>) => {
                state.deleteLoading = false;
                state.deleteStatus = action.payload.status;
                state.expenseTypes = state.expenseTypes.filter((expenseType) => expenseType._id !== action.payload.id);
            })
            .addCase(deleteExpenseType.rejected, (state) => {
                state.deleteLoading = false;
                state.deleteStatus = 'failed';
            });
    }
});

export const { reducer: expenseTypeReducer } = expenseTypeSlice;
