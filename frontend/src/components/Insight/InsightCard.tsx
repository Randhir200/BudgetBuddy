import React, { useEffect } from 'react';
import { AppDispatch, RootState } from '../../ReduxToolkit/store';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBalance } from '../../ReduxToolkit/slices/insightSlice';

import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from '@mui/material';

const userId = localStorage.getItem('userId');
const CurrentMonth = "November 2024"; // Adjust as needed

const InsightCard: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const {balanceLoading } = useSelector((state: RootState) => state.insightReducer);

  const data = [
    { title: 'Income', amount: 50000, color: 'rgba(128, 128, 128, 0.8)' },    // Blue for Income
    { title: 'Savings', amount: 20000, color: 'rgba(0, 128, 0, 0.8)' },    // Green for Savings
    { title: 'Expense', amount: 30000, color: 'rgba(255, 0, 0, 0.8)' },   // Orange for Expense
    { title: 'Current Balance', amount: 0, color: 'rgba(0, 0, 255, 0.8)' } // Grey for Current Balance
  ];
  useEffect(() => {
    dispatch(fetchBalance(userId || ''));
  }, []);
  return (
    <Box>
      <Grid container spacing={2}>
        {!balanceLoading && data.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.title}>
            <Card
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: 2,
                boxShadow: 3, // Adjust shadow for more depth
                textAlign: 'center',
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                  {item.title}
                </Typography>
                <Typography
                  variant="h4"
                  component="div"
                  sx={{
                    fontWeight: 'bold',
                    color: item.color,  // Set color based on the card type
                  }}
                >
                  ₹{item.amount.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {CurrentMonth}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {/* Your chart component goes here */}
    </Box>
  );
};

export default InsightCard;
