import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  useTheme,
  useMediaQuery
} from "@mui/material";

import { SnackbarOrigin } from "@mui/material/Snackbar";
import { AlertProps } from "@mui/material/Alert";
import ExpenseTable from "../components/ExpenseTable";
import ButtonComp from "../components/ButtonComp";
import axios from "axios";
import { AlertComp } from "../components/AlertComp";
import { AddExpenseForm } from "../components/AddExpenseForm";


interface State extends SnackbarOrigin {
  open: boolean;
}

interface alertState extends AlertProps {
  message: string
}
const Expenses: React.FC = () => {
  const [toggleAdd, setToggleAdd] = useState(false);
  const [expensesData, setExpensesData] = useState([]);
  const [toastState, setToastState] = React.useState<State>({
    open: false,
    vertical: 'top',
    horizontal: 'center',
  });
  const [alertState, setAlertState] = React.useState<alertState>({ severity: 'success', message: '' })
  const { vertical, horizontal, open } = toastState;

  //mui theme
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleToggleAdd = () => {
    setToggleAdd(!toggleAdd);
  };

  //adding expense
  const addExpense = () => {

  }

  //fetching expense
  const fetchExpenses = async () => {
    try {
      const response = await axios(`http://localhost:3000/expense/getAllExpense?userId=66d89bda30bb3c771a5007c6`);
      const data = response.data;
      setExpensesData(data.data);
      setAlertState({ ...alertState, severity: data.status, message: data.message })
    } catch (error: any) {
      setAlertState({ ...alertState, severity: 'error', message: error.response.data.message })
    } finally {
      setToastState({ ...toastState, open: true });
      setTimeout(() => {
        setToastState({ ...toastState, open: false });
      }, 2000); // Close after 2 seconds
    }
  }



  useEffect(() => {
    fetchExpenses();
  }, []);
  return (
    <Container>
      <AlertComp vertical={vertical} horizontal={horizontal} open={open}
        alertState={alertState}
      />
      <Typography
        variant={isSmallScreen ? "h5" : "h4"} // Adjust the heading size based on screen size
        gutterBottom
        sx={{ fontSize: isSmallScreen ? "1.2rem" : "2rem" }} // Smaller font for small screens
      >
        Add Expense
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "end", mb: 2 }}>
        <ButtonComp
          title="Add Expense"
          variant="contained"
          color="primary"
          size={isSmallScreen ? "small" : "medium"} // Adjust button size
          event={handleToggleAdd}
        />
      </Box>
      {toggleAdd && (
        <AddExpenseForm isSmallScreen={isSmallScreen} theme={theme} handleToggleAdd={handleToggleAdd} />
      )}

      <Box sx={{ mt: 2 }}>
        <ExpenseTable expenses={expensesData} />
      </Box>
    </Container>
  );
};

export default Expenses;
