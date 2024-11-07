import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { budgetBuddyApiUrl } from '../../configs/apiURLs';
import { Balance } from '@mui/icons-material';

interface Balance { 
    currentBalance : number;
}

interface IncomeState {
    monthlyOverviewLoading: boolean;
    balanceLoading: boolean;
    monthlyOverviews: [];
    balance: Balance,
    monthlyOverviewError: string | null;
    balanceError: string | null;
}

const initialState: IncomeState = {
    monthlyOverviewLoading: true,
    balanceLoading: true,
    monthlyOverviews: [],
    balance: {currentBalance: 0},
    monthlyOverviewError: '',
    balanceError: ''
}


export const fetchMonthlyOverview = createAsyncThunk(
    'insight/monthlyOverview',
    async (userId: string) => {
        const response = await axios.get(`${budgetBuddyApiUrl}/insight/monthlyOverview?userId=${userId}`);
        return response.data;
    });

export const fetchBalance = createAsyncThunk(
    'insight/balance',
    async (userId: string) => {
        const response = await axios.get(`${budgetBuddyApiUrl}/insight/balance?userId=${userId}`);
        console.log(response.data);
        return response.data;
    }
)



const insightSlice = createSlice({
    name: 'insight',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMonthlyOverview.pending, (state) => {
                state.monthlyOverviewLoading = true;
                state.monthlyOverviewError = null;
            })
            .addCase(fetchMonthlyOverview.fulfilled, (state, action: PayloadAction<any>) => {
                state.monthlyOverviewLoading = false;
                state.monthlyOverviews = action.payload.data;
            })
            .addCase(fetchMonthlyOverview.rejected, (state, action: PayloadAction<any>) => {
                state.monthlyOverviewLoading = false;
                state.monthlyOverviewError = action.payload?.error?.message || 'Failed to fetch overview data';
            })
            .addCase(fetchBalance.pending, (state) => {
                state.balanceLoading = true;
                state.balanceError = null;
            })
            .addCase(fetchBalance.fulfilled, (state, action: PayloadAction<any>) => {
                state.balanceLoading = false;
                state.balanceError = null;
                state.balance = action.payload.data;
            })
            .addCase(fetchBalance.rejected, (state, action: PayloadAction<any>) => {
                state.balanceLoading = false;
                state.balanceError = action.payload?.message || 'Something went wrong!';
            })
    }
});

export const { reducer: insightReducer } = insightSlice;