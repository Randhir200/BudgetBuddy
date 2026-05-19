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
    merchantAnalysisLoading: boolean;
    monthlyOverviews: Overview[];
    balance: Balance,
    dashboard: any;
    merchantAnalysis: any;
    monthlyOverviewError: string | null;
    balanceError: string | null;
    dashboardError: string | null;
    merchantAnalysisError: string | null;
}

interface DateRange {
    firstDate : Date,
    lastDate: Date
}

const initialState: IncomeState = {
    monthlyOverviewLoading: true,
    balanceLoading: true,
    dashboardLoading: true,
    merchantAnalysisLoading: false,
    monthlyOverviews: [],
    balance: {currentBalance: 0},
    dashboard: null,
    merchantAnalysis: null,
    monthlyOverviewError: '',
    balanceError: '',
    dashboardError: '',
    merchantAnalysisError: ''
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

export const fetchMerchantAnalysis = createAsyncThunk(
    'insight/merchantAnalysis',
    async ({userId, merchant, dateRange, allTime}: {userId: string, merchant: string, dateRange: DateRange, allTime?: boolean}) => {
        const response = await apiClient.get(`/insight/merchant-analysis?userId=${userId}&merchant=${encodeURIComponent(merchant)}&firstDate=${dateRange.firstDate}&lastDate=${dateRange.lastDate}&allTime=${allTime || false}`);
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
            .addCase(fetchMerchantAnalysis.pending, (state) => {
                state.merchantAnalysisLoading = true;
                state.merchantAnalysisError = null;
            })
            .addCase(fetchMerchantAnalysis.fulfilled, (state, action: PayloadAction<any>) => {
                state.merchantAnalysisLoading = false;
                state.merchantAnalysis = action.payload.data;
                state.merchantAnalysisError = null;
            })
            .addCase(fetchMerchantAnalysis.rejected, (state, action: PayloadAction<any>) => {
                state.merchantAnalysisLoading = false;
                state.merchantAnalysisError = action.payload?.message || 'Failed to fetch merchant analysis';
            })
    }
});

export const { reducer: insightReducer } = insightSlice;
