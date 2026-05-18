import React, { useEffect, useMemo, useState } from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { BarChart, LineChart, PieChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  Alert,
  Box,
  Chip,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import InsightsIcon from '@mui/icons-material/Insights';
import SavingsIcon from '@mui/icons-material/Savings';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInsightDashboard } from '../ReduxToolkit/slices/insightSlice';
import { AppDispatch, RootState } from '../ReduxToolkit/store';

echarts.use([TitleComponent, TooltipComponent, GridComponent, LegendComponent, PieChart, BarChart, LineChart, CanvasRenderer]);

const palette = ['#2563eb', '#16a34a', '#f59e0b', '#dc2626', '#7c3aed', '#0891b2', '#db2777', '#65a30d'];
const userId = localStorage.getItem('userId');

function formatCurrency(value = 0) {
  return `₹${Math.round(value).toLocaleString('en-IN')}`;
}

function formatPercent(value = 0) {
  const prefix = value > 0 ? '+' : '';
  return `${prefix}${value}%`;
}

function getMonthRange(value: Date) {
  return {
    firstDate: new Date(value.getFullYear(), value.getMonth(), 1),
    lastDate: new Date(value.getFullYear(), value.getMonth() + 1, 0),
  };
}

const Insight: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedTrendDate, setSelectedTrendDate] = useState<string | null>(null);
  const dispatch: AppDispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { dashboard, dashboardLoading, dashboardError } = useSelector((state: RootState) => state.insightReducer);
  const dateRange = useMemo(() => getMonthRange(selectedMonth), [selectedMonth]);
  const axisColor = theme.palette.text.secondary;
  const textColor = theme.palette.text.primary;
  const panelBg = theme.palette.background.paper;
  const chartStyle = (height: number) => ({
    width: '100%',
    maxWidth: '100%',
    height,
    minWidth: 0,
    display: 'block',
  });
  const panelSx = {
    p: { xs: 1, sm: 1.5 },
    borderRadius: 1,
    minWidth: 0,
    overflow: 'hidden',
  };

  useEffect(() => {
    dispatch(fetchInsightDashboard({ userId: userId || '', dateRange }));
  }, [dispatch, dateRange]);

  const summary = dashboard?.summary || {};
  const topCategories = dashboard?.topCategories || [];
  const topMerchants = dashboard?.topMerchants || [];
  const monthlyOverview = dashboard?.monthlyOverview || [];
  const dailyTrend = dashboard?.dailyTrend || [];
  const dailyDetails = dashboard?.dailyDetails || [];
  const reviewStatus = dashboard?.reviewStatus || [];
  const insights = dashboard?.insights || [];
  const budgetHealth = dashboard?.budgetHealth;
  const gmailStatus = dashboard?.gmailStatus;

  const metricCards = [
    {
      title: 'Income',
      value: formatCurrency(summary.totalIncome),
      delta: formatPercent(summary.incomeChangePercent),
      icon: <TrendingUpIcon />,
      color: '#16a34a',
    },
    {
      title: 'Expense',
      value: formatCurrency(summary.totalExpense),
      delta: formatPercent(summary.expenseChangePercent),
      icon: <TrendingDownIcon />,
      color: '#dc2626',
    },
    {
      title: 'Net Savings',
      value: formatCurrency(summary.netSavings),
      delta: `${summary.savingsRate || 0}% rate`,
      icon: <SavingsIcon />,
      color: '#2563eb',
    },
    {
      title: 'Balance',
      value: formatCurrency(summary.currentBalance),
      delta: budgetHealth?.status || 'Good',
      icon: <AccountBalanceWalletIcon />,
      color: '#7c3aed',
    },
  ];

  const pieOptions = {
    backgroundColor: 'transparent',
    color: palette,
    tooltip: { trigger: 'item', formatter: '{b}: ₹{c} ({d}%)' },
    legend: {
      bottom: 0,
      type: 'scroll',
      textStyle: { color: axisColor },
    },
    series: [
      {
        name: 'Type',
        type: 'pie',
        radius: isMobile ? ['36%', '58%'] : ['42%', '66%'],
        center: ['50%', isMobile ? '42%' : '43%'],
        data: monthlyOverview.map((item: any) => ({ name: item.type, value: item.totalTypeAmount })),
        avoidLabelOverlap: true,
        label: {
          show: !isMobile,
          color: textColor,
          formatter: '{b}\n{d}%',
        },
      },
    ],
  };

  const categoryOptions = {
    backgroundColor: 'transparent',
    color: palette,
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: isMobile ? 44 : 56, right: 12, top: 24, bottom: isMobile ? 78 : 64, containLabel: true },
    xAxis: {
      type: 'category',
      data: topCategories.map((item: any) => item.category),
      axisLabel: {
        color: axisColor,
        interval: 0,
        rotate: isMobile ? 35 : 25,
        formatter: (value: string) => value.length > (isMobile ? 8 : 12) ? `${value.slice(0, isMobile ? 8 : 12)}...` : value,
      },
      axisLine: { lineStyle: { color: axisColor } },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: axisColor },
      splitLine: { lineStyle: { color: theme.palette.divider } },
    },
    series: [{ type: 'bar', data: topCategories.map((item: any) => item.amount), barMaxWidth: 42 }],
  };

  const trendOptions = {
    backgroundColor: 'transparent',
    color: ['#0891b2'],
    tooltip: { trigger: 'axis' },
    grid: { left: isMobile ? 44 : 56, right: 12, top: 24, bottom: 44, containLabel: true },
    xAxis: {
      type: 'category',
      data: dailyTrend.map((item: any) => Number(String(item.date).slice(8, 10))),
      axisLabel: { color: axisColor },
      axisLine: { lineStyle: { color: axisColor } },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: axisColor },
      splitLine: { lineStyle: { color: theme.palette.divider } },
    },
    series: [
      {
        type: 'line',
        smooth: true,
        areaStyle: { opacity: theme.palette.mode === 'dark' ? 0.18 : 0.12 },
        data: dailyTrend.map((item: any) => item.amount),
      },
    ],
  };
  const selectedDay = dailyDetails.find((item: any) => item.date === selectedTrendDate) || dailyDetails[dailyDetails.length - 1];
  const selectedDayTotal = selectedDay?.transactions?.reduce((sum: number, item: any) => sum + Number(item.amount || 0), 0) || 0;

  return (
    <Box sx={{ p: { xs: 1, sm: 2 }, maxWidth: 1440, mx: 'auto', width: '100%', minWidth: 0, overflowX: 'hidden' }}>
      <Stack spacing={2}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', gap: 1.5 }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ fontWeight: 700 }}>
              Insight
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Track spending patterns, review confidence, and month-over-month movement.
            </Typography>
          </Box>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              views={['year', 'month']}
              openTo="month"
              label="Month"
              minDate={new Date('2020-01-01')}
              maxDate={new Date()}
              disableFuture
              value={selectedMonth}
              onChange={(value) => value && setSelectedMonth(value)}
              slotProps={{ textField: { size: 'small', sx: { minWidth: { xs: '100%', sm: 220 } } } }}
            />
          </LocalizationProvider>
        </Box>

        {dashboardLoading && <LinearProgress />}
        {dashboardError && <Alert severity="error">{dashboardError}</Alert>}

        <Grid container spacing={1.5} sx={{ minWidth: 0 }}>
          {metricCards.map((card) => (
            <Grid item xs={12} sm={6} lg={3} key={card.title} sx={{ minWidth: 0 }}>
              <Paper sx={{ ...panelSx, height: '100%' }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" color="text.secondary">{card.title}</Typography>
                    <Typography sx={{ fontSize: { xs: '1.2rem', sm: '1.45rem' }, fontWeight: 800, color: card.color, overflowWrap: 'anywhere' }}>
                      {card.value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">{card.delta}</Typography>
                  </Box>
                  <Box sx={{ color: card.color, display: 'flex' }}>{card.icon}</Box>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={1.5} sx={{ minWidth: 0 }}>
          <Grid item xs={12} md={8} sx={{ minWidth: 0 }}>
            <Paper sx={{ ...panelSx, height: '100%' }}>
              <Typography sx={{ fontWeight: 700, mb: 1 }}>Daily Spend Trend</Typography>
              <ReactEChartsCore
                echarts={echarts}
                option={trendOptions}
                style={chartStyle(isMobile ? 240 : 340)}
                onEvents={{
                  click: (params: any) => {
                    const matched = dailyTrend.find((item: any) => String(Number(String(item.date).slice(8, 10))) === String(params.name));
                    if (matched) setSelectedTrendDate(matched.date);
                  },
                }}
              />
              <Box sx={{ mt: 1.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {selectedDay ? new Date(selectedDay.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Daily details'}
                  {selectedDay ? ` · ${formatCurrency(selectedDayTotal)}` : ''}
                </Typography>
                <Stack spacing={0.75} sx={{ mt: 1, maxHeight: 240, overflowY: 'auto', pr: 0.5 }}>
                  {selectedDay?.transactions?.length ? selectedDay.transactions.map((transaction: any) => (
                    <Box
                      key={transaction.id}
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr auto', sm: 'minmax(0, 1.4fr) minmax(0, 1fr) auto' },
                        gap: 1,
                        alignItems: 'center',
                        borderTop: `1px solid ${theme.palette.divider}`,
                        pt: 0.75,
                      }}
                    >
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, overflowWrap: 'anywhere' }}>
                          {transaction.merchant || transaction.item}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(transaction.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' }, overflowWrap: 'anywhere' }}>
                        {transaction.category} · {transaction.type}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 800 }}>
                        {formatCurrency(transaction.amount)}
                      </Typography>
                    </Box>
                  )) : (
                    <Typography variant="body2" color="text.secondary">Click a day in the chart to see transactions.</Typography>
                  )}
                </Stack>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4} sx={{ minWidth: 0 }}>
            <Paper sx={{ ...panelSx, height: '100%' }}>
              <Typography sx={{ fontWeight: 700, mb: 1 }}>Budget Health</Typography>
              <Stack spacing={1.25}>
                <Chip
                  icon={budgetHealth?.status === 'Risk' ? <WarningAmberIcon /> : <InsightsIcon />}
                  label={budgetHealth?.status || 'Good'}
                  color={budgetHealth?.status === 'Risk' ? 'error' : budgetHealth?.status === 'Watch' ? 'warning' : 'success'}
                  sx={{ alignSelf: 'flex-start' }}
                />
                <Typography variant="body2" color="text.secondary">{budgetHealth?.message || 'No budget signal yet.'}</Typography>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.75 }}>Review Status</Typography>
                  <Stack spacing={0.75}>
                    {reviewStatus.map((item: any) => (
                      <Box key={item.label} sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                        <Typography variant="body2">{item.label}</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{item.count}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>Gmail Sync</Typography>
                  <Typography variant="body2" color={gmailStatus?.lastError ? 'error.main' : 'text.secondary'}>
                    {gmailStatus?.connected ? 'Connected' : 'Not connected'}
                    {gmailStatus?.lastSyncedAtSeconds ? ` · ${new Date(gmailStatus.lastSyncedAtSeconds * 1000).toLocaleString()}` : ''}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={1.5} sx={{ minWidth: 0 }}>
          <Grid item xs={12} md={5} sx={{ minWidth: 0 }}>
            <Paper sx={panelSx}>
              <Typography sx={{ fontWeight: 700, mb: 1 }}>Expenses by Type</Typography>
              <ReactEChartsCore echarts={echarts} option={pieOptions} style={chartStyle(isMobile ? 260 : 380)} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={7} sx={{ minWidth: 0 }}>
            <Paper sx={panelSx}>
              <Typography sx={{ fontWeight: 700, mb: 1 }}>Top Categories</Typography>
              <ReactEChartsCore echarts={echarts} option={categoryOptions} style={chartStyle(isMobile ? 280 : 380)} />
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={1.5} sx={{ minWidth: 0 }}>
          <Grid item xs={12} md={6} sx={{ minWidth: 0 }}>
            <Paper sx={{ ...panelSx, height: '100%' }}>
              <Typography sx={{ fontWeight: 700, mb: 1 }}>Top Merchants</Typography>
              <Stack spacing={1}>
                {topMerchants.length ? topMerchants.map((merchant: any, index: number) => (
                  <Box key={merchant.merchant} sx={{ display: 'grid', gridTemplateColumns: { xs: '24px minmax(0, 1fr)', sm: '28px minmax(0, 1fr) auto' }, alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">#{index + 1}</Typography>
                    <Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>{merchant.merchant}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, gridColumn: { xs: '2 / 3', sm: 'auto' } }}>{formatCurrency(merchant.amount)}</Typography>
                  </Box>
                )) : <Typography variant="body2" color="text.secondary">No merchant data for this month.</Typography>}
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6} sx={{ minWidth: 0 }}>
            <Paper sx={{ ...panelSx, height: '100%', bgcolor: panelBg }}>
              <Typography sx={{ fontWeight: 700, mb: 1 }}>Actionable Insights</Typography>
              <Stack spacing={1}>
                {insights.length ? insights.map((item: any, index: number) => (
                  <Alert key={`${item.message}-${index}`} severity={item.type || 'info'} icon={item.message?.toLowerCase().includes('medical') ? <HealthAndSafetyIcon /> : undefined}>
                    {item.message}
                  </Alert>
                )) : <Alert severity="info">Not enough data yet. Add or sync more transactions to generate insights.</Alert>}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default Insight;
