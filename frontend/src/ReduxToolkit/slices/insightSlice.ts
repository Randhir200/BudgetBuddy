import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { budgetBuddyApiUrl } from '../../configs/apiURLs';
import { Balance } from '@mui/icons-material';

interface Balance { 
    currentBalance : number;
}

interface Category {
    category : string,
    tatalCat : number,
    totalCatAmount : number
}

interface Overview {
    categories : Category[],
    totalTypeAmount : number,
    type : string
}


interface IncomeState {
    monthlyOverviewLoading: boolean;
    balanceLoading: boolean;
    monthlyOverviews: Overview[];
    balance: Balance,
    monthlyOverviewError: string | null;
    balanceError: string | null;
}

interface DateRange {
    firstDate : Date,
    lastDate: Date
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
    async ({userId, dateRange}:{ userId: string, dateRange : DateRange}) => {
        const response = await axios.get(`${budgetBuddyApiUrl}/insight/monthlyOverview?userId=${userId}&firstDate=${dateRange.firstDate}&lastDate=${dateRange.lastDate}`);

        return response.data;
    });

export const fetchBalance = createAsyncThunk(
    'insight/balance',
    async (userId: string) => {
        const response = await axios.get(`${budgetBuddyApiUrl}/insight/balance?userId=${userId}`);
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