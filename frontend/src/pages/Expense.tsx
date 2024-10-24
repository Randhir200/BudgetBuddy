import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery
} from "@mui/material";
import ExpenseTable from "../components/Expense/ExpenseTable";
import ButtonComp from "../components/Common/ButtonComp";
import { ExpenseForm } from "../components/Expense/ExpenseForm";
import styled from "styled-components";
import { fetchExpense } from "../ReduxToolkit/slices/expenseSlice";
import { AppDispatch, RootState } from "../ReduxToolkit/store";
import { useDispatch, useSelector } from "react-redux";
import { enqueueSnackbar } from "notistack";
import { clearAlert } from "../ReduxToolkit/slices/alertSlice";

// Create a Wrapper component that'll render a <section> tag with some styles
const Wrapper = styled.section`
  padding: 10px;
`;

//getting userId from local storage
const userId = localStorage.getItem('userId');

const Expenses: React.FC = () => {
  const [toggleAdd, setToggleAdd] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const { addStatus } = useSelector((state: RootState) => state.expenseReducer);
  const { message, variant } = useSelector((state: RootState) => state.alertReducer);

  //mui theme
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleToggleAdd = () => {
    setToggleAdd(!toggleAdd);
  };

  useEffect(() => {
    //close form if data is upload otherwise wait.
    if (addStatus === 'success') {
      setToggleAdd(false);
      dispatch(fetchExpense(userId))
    }
  }, [addStatus]);


  useEffect(() => {
    if (message) {
      enqueueSnackbar(message, { variant })
      dispatch(clearAlert());
    }
  }, [message, variant]);

  return (
    <Wrapper>
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
        />
      )}

      <Box sx={{ mt: 2 }}>
        <ExpenseTable />
      </Box>
    </Wrapper>
  );
};

export default React.memo(Expenses);
