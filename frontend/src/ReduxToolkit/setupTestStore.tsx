import { configureStore } from "@reduxjs/toolkit";
import { incomeReducer } from './slices/incomeSlice';
import { ReactNode } from "react";
import { expenseReducer } from './slices/expenseSlice';
import { expenseTypeReducer } from './slices/expenseTypeSlice';
import { alertReducer } from './slices/alertSlice';
import { insightReducer } from './slices/insightSlice';
import { AppStore } from "./store";
import { Provider } from "react-redux";



// Function to create a test store with optional preloaded state
export const setupTestStore = (preloadedState?:{}) => {
  return configureStore({
    reducer: {
      income: incomeReducer,
      expense: expenseReducer,
      expenseType: expenseTypeReducer,
      alert: alertReducer,
      insight: insightReducer,
    },
    preloadedState,
  });
};


export const withTestProvider = (store: AppStore, ui: ReactNode) => (
    <Provider store={store}>{ui}</Provider>
  );