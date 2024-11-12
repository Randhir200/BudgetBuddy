import React, { useEffect, useState } from 'react';
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Grid } from '@mui/material';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../ReduxToolkit/store';
import { fetchMonthlyOverview } from '../../ReduxToolkit/slices/insightSlice';

interface DateRange {
  firstDate: Date;
  lastDate: Date;
}

const MonthYearPicker: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    firstDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    lastDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
  });

  const dispatch:AppDispatch = useDispatch()

  const handleChange = (newValue: Date | null) => {
    if (newValue) {
      const firstDayOfMonth = new Date(newValue.getFullYear(), newValue.getMonth(), 1);
      const lastDayOfMonth = new Date(newValue.getFullYear(), newValue.getMonth() + 1, 0);
      setDateRange({ firstDate: new Date(firstDayOfMonth), lastDate: new Date(lastDayOfMonth) });
    }
  };

  useEffect(()=>{
    const userId = localStorage.getItem('userId');
    dispatch(fetchMonthlyOverview({userId : userId || '', dateRange}))
  }, [dateRange]);

  return (
    <Grid container justifyContent="right" mt={2}>
      <Grid item>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DesktopDatePicker
            views={['year', 'month']}
            openTo="month"
            label="Select Month and Year"
            minDate={new Date('2020-01-01')}
            maxDate={new Date()}
            disableFuture
            value={dateRange.firstDate}
            onChange={handleChange}
            slotProps={{ textField: { variant: 'outlined' } }}
          />
        </LocalizationProvider>
      </Grid>
    </Grid>
  );
};

export default MonthYearPicker;
