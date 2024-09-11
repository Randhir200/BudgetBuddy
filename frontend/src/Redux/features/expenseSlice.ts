import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Define the Expense interface
interface Expense {
  id: number;
  date: string;
  type: string;
  category: string;
  item: string;
  price: number;
}

// Define the initial state interface
interface ExpensesState {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
}

const initialState: ExpensesState = {
  expenses: [],
  loading: false,
  error: null,
};

// Thunk to fetch expenses from an API using axios
export const fetchExpenses = createAsyncThunk(
  "expenses/fetchExpenses",
  async () => {
    const response = await axios.get("http://localhost:3000/expense/getAllExpense");
    return response.data; // Assuming the API returns a list of expenses
  }
);

// Thunk to post a new expense to the API using axios
export const postExpense = createAsyncThunk(
  "expenses/postExpense",
  async (newExpense: Expense) => {
    const response = await axios.post("http://localhost:3000/expense/getAllExpense", newExpense);
    return response.data; // Return the newly created expense
  }
);

// Create slice
const expenseSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    removeExpense: (state, action: PayloadAction<number>) => {
      state.expenses = state.expenses.filter(
        (expense) => expense.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetching expenses
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch expenses";
      })
      // Handle posting a new expense
      .addCase(postExpense.pending, (state) => {
        state.loading = true;
      })
      .addCase(postExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses.push(action.payload);
      })
      .addCase(postExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add expense";
      });
  },
});

export const { removeExpense } = expenseSlice.actions;
export default expenseSlice.reducer;
