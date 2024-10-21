import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { budgetBuddyApiUrl } from "../../config/config";


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

export const addExpenseType = createAsyncThunk(
    'expesnseType/add',
    async (formData : Object, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${budgetBuddyApiUrl}/config/addConfig`,
                formData,
                {
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': 'berear token'
                    }
                }
            )
            return res.data;
        } catch (err) {
            return rejectWithValue(err);
        }
    }
)

const expenseTypeSlice = createSlice({
    name: 'expenseType',
    initialState: {
        fetchLoading: false,
        addLoading: false,
        expenseTypes: [],
        addMessage: '',
        fetchError: null,
        addError: null

    },
    reducers: {},
    extraReducers: ((builder) => {
        builder
            .addCase(fetchExpenseType.pending, (state) => {
                state.fetchLoading = true;
                state.fetchError = null;
            })
            .addCase(fetchExpenseType.fulfilled, (state, action: PayloadAction<any>) => {
                state.fetchLoading = false;
                state.expenseTypes = action.payload.data;
                state.fetchError = null;
            })
            .addCase(fetchExpenseType.rejected, (state, action: PayloadAction<any>) => {
                state.fetchLoading = false;
                state.fetchError = action.payload?.error?.message || 'Failed to fetch expenses';
            })
            .addCase(addExpenseType.pending, (state) => {
                state.addLoading = true;
                state.addError = null;
            })
            .addCase(addExpenseType.fulfilled, (state, action: PayloadAction<any>) => {
                state.addLoading = false;
                state.addMessage = action.payload.message || 'Expense type uploaded succssfully';
                state.addError = null;
            })
            .addCase(addExpenseType.rejected, (state, action: PayloadAction<any>) => {
                state.addLoading = false;
                state.addError = action.payload.err.message || 'Somthing went wrong!'
            })
    })
})

export const { reducer: expenseTypeReducer } = expenseTypeSlice;