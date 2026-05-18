import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiClient } from '../../configs/apiClient';

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
    dashboardLoading: boolean;
    monthlyOverviews: Overview[];
    balance: Balance,
    dashboard: any;
    monthlyOverviewError: string | null;
    balanceError: string | null;
    dashboardError: string | null;
}

interface DateRange {
    firstDate : Date,
    lastDate: Date
}

const initialState: IncomeState = {
    monthlyOverviewLoading: true,
    balanceLoading: true,
    dashboardLoading: true,
    monthlyOverviews: [],
    balance: {currentBalance: 0},
    dashboard: null,
    monthlyOverviewError: '',
    balanceError: '',
    dashboardError: ''
}


export const fetchMonthlyOverview = createAsyncThunk(
    'insight/monthlyOverview',
    async ({userId, dateRange}:{ userId: string, dateRange : DateRange}) => {
        const response = await apiClient.get(`/insight/monthlyOverview?userId=${userId}&firstDate=${dateRange.firstDate}&lastDate=${dateRange.lastDate}`);

        return response.data;
    });

export const fetchBalance = createAsyncThunk(
    'insight/balance',
    async (userId: string) => {
        const response = await apiClient.get(`/insight/balance?userId=${userId}`);
        return response.data;
    }
)

export const fetchInsightDashboard = createAsyncThunk(
    'insight/dashboard',
    async ({userId, dateRange}:{ userId: string, dateRange : DateRange}) => {
        const response = await apiClient.get(`/insight/dashboard?userId=${userId}&firstDate=${dateRange.firstDate}&lastDate=${dateRange.lastDate}`);
        return response.data;
    });



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
            .addCase(fetchInsightDashboard.pending, (state) => {
                state.dashboardLoading = true;
                state.dashboardError = null;
            })
            .addCase(fetchInsightDashboard.fulfilled, (state, action: PayloadAction<any>) => {
                state.dashboardLoading = false;
                state.dashboard = action.payload.data;
                state.monthlyOverviews = action.payload.data?.monthlyOverview || [];
                state.balance = { currentBalance: action.payload.data?.summary?.currentBalance || 0 };
                state.dashboardError = null;
            })
            .addCase(fetchInsightDashboard.rejected, (state, action: PayloadAction<any>) => {
                state.dashboardLoading = false;
                state.dashboardError = action.payload?.message || 'Failed to fetch dashboard data';
            })
    }
});

export const { reducer: insightReducer } = insightSlice;
