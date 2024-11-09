import React, { useState } from 'react';
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Grid } from '@mui/material';

interface DateRange {
  firstDay: Date | null;
  lastDay: Date | null;
}

const MonthYearPicker: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    firstDay: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    lastDay: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
  });

  const handleChange = (newValue: Date | null) => {
    if (newValue) {
      const firstDayOfMonth = new Date(newValue.getFullYear(), newValue.getMonth(), 1);
      const lastDayOfMonth = new Date(newValue.getFullYear(), newValue.getMonth() + 1, 0);

      console.log('First Day of Month:', firstDayOfMonth);
      console.log('Last Day of Month:', lastDayOfMonth);
      setDateRange({ firstDay: firstDayOfMonth, lastDay: lastDayOfMonth });
    }
  };

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
            value={dateRange.firstDay}
            onChange={handleChange}
            slotProps={{ textField: { variant: 'outlined' } }}
          />
        </LocalizationProvider>
      </Grid>
    </Grid>
  );
};

export default MonthYearPicker;
