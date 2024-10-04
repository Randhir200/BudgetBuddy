import React, { useEffect, useState } from "react";
import { budgetBuddyApiUrl } from "../config/config";
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery
} from "@mui/material";
import ExpenseTable from "../components/ExpenseTable";
import ButtonComp from "../components/ButtonComp";
import axios, { AxiosError } from "axios";
import { AlertComp } from "../components/AlertComp";
import { ExpenseForm } from "../components/ExpenseForm";
import { AlertProps } from "@mui/material/Alert";
import { SnackbarOrigin } from "@mui/material/Snackbar";
import styled from "styled-components";

// Create a Wrapper component that'll render a <section> tag with some styles
const Wrapper = styled.section`
  padding: 10px;
`;

//getting userId from local storage
const userId = localStorage.getItem('userId');


interface State extends SnackbarOrigin {
  open: boolean;
}

interface alertState extends AlertProps {
  message: string
}

const formInitialState = {
  type: '',
  category: '',
  item: '',
  price: 0,
  createdAt: '',
  userId
}
const Expenses: React.FC = () => {
  const [toggleAdd, setToggleAdd] = useState(false);
  const [expensesData, setExpensesData] = useState([]);
  const [configData, setConfigData] = useState([]);
  const [toastState, setToastState] = React.useState<State>({
    open: false,
    vertical: 'top',
    horizontal: 'center',
  });
  const [alertState, setAlertState] = React.useState<alertState>({ severity: "success", message: '' });
  const [formData, setFormData] = useState(formInitialState);
  const [loading, setLoading] = useState(true);
  const { vertical, horizontal, open } = toastState;


  //mui theme
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleToggleAdd = () => {
    setToggleAdd(!toggleAdd);
  };

  //adding expense
  const addExpense = async () => {
    try {
      const response = await axios.post(`${budgetBuddyApiUrl}/expense/addExpense`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer token'
          }
        }
      );

      const data = response.data;
      setAlertState({
        ...alertState,
        severity: data.status,
        message: data.message
      });

      setFormData(formInitialState);

      // fetch again updated expenses with 1000ms delay
      setTimeout(() => { fetchExpenses() }, 1000);


    } catch (error: any) {
      setAlertState({ ...alertState, severity: 'error', message: error.response.data.message })

    } finally {
      setToastState({ ...toastState, open: true });
      setTimeout(() => {
        setToastState({ ...toastState, open: false });
      }, 2000); // Close after 2 seconds
    }

  }

  //fetching config
  async function fetchConfigs() {
    try {
      const response = await axios(`${budgetBuddyApiUrl}/config/getAllConfigs?userId=${userId}`);
      const data = response.data;
      setConfigData(data.data);
      setAlertState({ ...alertState, severity: data.status, message: data.message })
    } catch (error: any) {
      if (AxiosError) {
        setAlertState({ ...alertState, severity: 'error', message: error })
      }
      setAlertState({ ...alertState, severity: 'error', message: error.response.data.message })

    } finally {
      setToastState({ ...toastState, open: true });
      setTimeout(() => {
        setToastState({ ...toastState, open: false });
      }, 2000); // Close after 2 seconds
    }
  }



  //fetching expense
  const fetchExpenses = async () => {
    try {
      const response = await axios(`${budgetBuddyApiUrl}/expense/getAllExpense?userId=${userId}`);
      const data = response.data;
      setExpensesData(data.data);
      setLoading(false);
      setAlertState({ ...alertState, severity: data.status, message: data.message })
    } catch (error: any) {
      if (AxiosError) {
        setAlertState({ ...alertState, severity: 'error', message: error.message })
      }
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
    fetchConfigs();
  }, []);
  return (
    <Wrapper>
      <AlertComp vertical={vertical} horizontal={horizontal} open={open}
        alertState={alertState}
      />
  
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography
          gutterBottom
          sx={{ textAlign: "left", fontSize: isSmallScreen ? "1.2rem" : "1.5rem" }} // Smaller font for small screens
        >
          Expense
        </Typography>
        <ButtonComp
          title="Add Expense"
          variant="contained"
          color="primary"
          size={isSmallScreen ? "small" : "medium"} // Adjust button size
          event={handleToggleAdd}
        />
      </Box>
      {toggleAdd && (
        <ExpenseForm
          isSmallScreen={isSmallScreen}
          theme={theme}
          handleToggleAdd={handleToggleAdd}
          setFormData={setFormData}
          addExpense={addExpense}
          formData={formData}
          configData={configData}
        />
      )}

      <Box sx={{ mt: 2 }}>
        <ExpenseTable expenses={expensesData} loading={loading}/>
      </Box>
    </Wrapper>
  );
};

export default Expenses;
