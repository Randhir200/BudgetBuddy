import React, { useMemo, useState, useEffect } from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import {
  Box,
  Paper,
  Stack,
  Typography,
  LinearProgress,
  Alert,
  useTheme,
  useMediaQuery,
  Chip,
  Grid,
  Autocomplete,
  TextField,
  Tabs,
  Tab,
} from '@mui/material';
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMerchantAnalysis } from '../../ReduxToolkit/slices/insightSlice';
import { AppDispatch, RootState } from '../../ReduxToolkit/store';

echarts.use([TitleComponent, TooltipComponent, GridComponent, LegendComponent, LineChart, CanvasRenderer]);

function formatCurrency(value = 0) {
  return `₹${Math.round(value).toLocaleString('en-IN')}`;
}

function getMonthRange(value: Date) {
  return {
    firstDate: new Date(value.getFullYear(), value.getMonth(), 1),
    lastDate: new Date(value.getFullYear(), value.getMonth() + 1, 0),
  };
}

interface MerchantAnalysisProps {
  topMerchants?: any[];
  allTimeMerchants?: any[];
}

const MerchantAnalysis: React.FC<MerchantAnalysisProps> = ({ topMerchants = [], allTimeMerchants = [] }) => {
  const [tabValue, setTabValue] = useState<0 | 1>(0);
  const [selectedMerchant, setSelectedMerchant] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const dispatch: AppDispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { merchantAnalysis, merchantAnalysisLoading, merchantAnalysisError } = useSelector((state: RootState) => state.insightReducer);
  const userId = localStorage.getItem('userId');
  const dateRange = useMemo(() => getMonthRange(selectedMonth), [selectedMonth]);

  const currentMonthMerchantList = useMemo(() => {
    return topMerchants?.map((m: any) => m.merchant).filter(Boolean) || [];
  }, [topMerchants]);

  const allTimeMerchantList = useMemo(() => {
    return allTimeMerchants?.map((m: any) => m.merchant).filter(Boolean) || [];
  }, [allTimeMerchants]);

  const merchantList = tabValue === 1 ? allTimeMerchantList : currentMonthMerchantList;
  const hasAnyMerchant = currentMonthMerchantList.length > 0 || allTimeMerchantList.length > 0;

  useEffect(() => {
    if (!merchantList.length) {
      setSelectedMerchant('');
      return;
    }

    setSelectedMerchant((current) => merchantList.includes(current) ? current : merchantList[0]);
  }, [merchantList]);

  useEffect(() => {
    if (!selectedMerchant || !userId) return;
    dispatch(fetchMerchantAnalysis({ userId, merchant: selectedMerchant, dateRange, allTime: tabValue === 1 }));
  }, [selectedMerchant, dateRange, tabValue, dispatch, userId]);

  const chartOptions = useMemo(() => {
    const data = merchantAnalysis?.monthlyTrend || [];
    return data.length === 0
      ? {}
      : {
          backgroundColor: 'transparent',
          tooltip: { trigger: 'axis' },
          xAxis: { type: 'category', data: data.map((d: any) => d.month), axisLine: { lineStyle: { color: theme.palette.text.secondary } } },
          yAxis: { type: 'value', axisLine: { lineStyle: { color: theme.palette.text.secondary } } },
          series: [{ type: 'line', data: data.map((d: any) => d.amount), smooth: true }],
        };
  }, [merchantAnalysis, theme]);

  if (!hasAnyMerchant) return <Paper sx={{ p: 2 }}> <Typography color="text.secondary">No merchant data available.</Typography> </Paper>;

  return (
    <Paper sx={{ p: { xs: 1, sm: 1.5 }, borderRadius: 1, overflow: 'hidden' }}>
      <Stack spacing={2}>
        <Box>
          <Typography sx={{ fontWeight: 700, mb: 1.5 }}>Merchant Analysis</Typography>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tab label="Current Month" value={0} />
            <Tab label="All Time" value={1} />
          </Tabs>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
          <Autocomplete size="small" options={merchantList} value={selectedMerchant || null} onChange={(_, v) => setSelectedMerchant(v || '')} renderInput={(params) => <TextField {...params} label="Select Merchant" />} />
          {tabValue === 0 && (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker views={[ 'year', 'month' ]} openTo="month" label="Month" value={selectedMonth} onChange={(v) => v && setSelectedMonth(v)} slotProps={{ textField: { size: 'small', fullWidth: true } }} />
            </LocalizationProvider>
          )}
        </Box>

        {merchantAnalysisLoading && <LinearProgress />}
        {merchantAnalysisError && <Alert severity="error">{merchantAnalysisError}</Alert>}
        {!merchantList.length && (
          <Alert severity="info">
            {tabValue === 0 ? 'No merchant transactions found for this month. Switch to All Time to analyze older merchants.' : 'No all-time merchant transactions found yet.'}
          </Alert>
        )}

        {selectedMerchant && merchantAnalysis && (
          <>
            <Grid container spacing={1.5}>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 1.5 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>{tabValue === 0 ? 'This Month' : 'All Time'} Total</Typography>
                  <Typography sx={{ fontSize: '1.25rem', fontWeight: 800 }}>{formatCurrency(tabValue === 0 ? merchantAnalysis.monthlyTotal : merchantAnalysis.allTimeTotal)}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 1.5 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>{tabValue === 0 ? 'This Month' : 'All Time'} Transactions</Typography>
                  <Typography sx={{ fontSize: '1.25rem', fontWeight: 800 }}>{tabValue === 0 ? merchantAnalysis.monthlyCount : merchantAnalysis.allTimeCount}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 1.5 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Average Transaction</Typography>
                  <Typography sx={{ fontSize: '1.25rem', fontWeight: 800 }}>{formatCurrency(((tabValue === 0 ? merchantAnalysis.monthlyTotal : merchantAnalysis.allTimeTotal) || 0) / ((tabValue === 0 ? merchantAnalysis.monthlyCount : merchantAnalysis.allTimeCount) || 1))}</Typography>
                </Paper>
              </Grid>
            </Grid>

            {merchantAnalysis.monthlyTrend?.length > 0 && (
              <Box>
                <Typography sx={{ fontWeight: 700, mb: 1 }}>Monthly Trend</Typography>
                <ReactEChartsCore echarts={echarts} option={chartOptions} style={{ width: '100%', height: isMobile ? 240 : 320 }} />
              </Box>
            )}

            {merchantAnalysis.categories?.length > 0 && (
              <Box>
                <Typography sx={{ fontWeight: 700, mb: 1 }}>Categories</Typography>
                <Stack spacing={0.75}>
                  {merchantAnalysis.categories.map((cat: any, i: number) => (
                    <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{cat.category}</Typography>
                        <Typography variant="caption" color="text.secondary">{cat.count} transaction{cat.count !== 1 ? 's' : ''}</Typography>
                      </Box>
                      <Typography sx={{ fontWeight: 700 }}>{formatCurrency(cat.amount)}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}

            <Box>
              <Typography sx={{ fontWeight: 700, mb: 1 }}>{tabValue === 0 ? 'This Month' : 'All Time'} Transactions ({merchantAnalysis.transactions?.length || 0})</Typography>
              <Stack spacing={0.75} sx={{ maxHeight: 300, overflowY: 'auto', pr: 0.5 }}>
                {merchantAnalysis.transactions?.map((txn: any) => (
                  <Box key={txn.id} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr auto', sm: '1fr auto' }, gap: 1, alignItems: 'center', borderTop: `1px solid ${theme.palette.divider}`, pt: 0.75 }}>
                    <Box>
                      <Typography sx={{ fontWeight: 700 }}>{txn.item || txn.category}</Typography>
                      <Typography variant="caption" color="text.secondary">{new Date(txn.date).toLocaleString()}</Typography>
                    </Box>
                    <Chip label={formatCurrency(txn.amount)} size="small" />
                  </Box>
                ))}
              </Stack>
            </Box>
          </>
        )}
      </Stack>
    </Paper>
  );
};

export default MerchantAnalysis;
