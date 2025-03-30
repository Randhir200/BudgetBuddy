import React, { Suspense, useEffect, useState } from "react";
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  LinearProgress
} from "@mui/material";
// import ExpenseTable from "../components/Expense/ExpenseTable";
const LazyExpenseTable = React.lazy(()=>import('../components/Expense/ExpenseTable'));
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

const formInitialState = {
  id:null,
  type: '',
  category: '',
  item: '',
  price: 0,
  createdAt: '',
  userId
}

const Expenses: React.FC = () => {
  const [toggle, setToggle] = useState({toggleType:"add", isToggle:false});
  const dispatch: AppDispatch = useDispatch();
  const { addStatus } = useSelector((state: RootState) => state.expenseReducer);
  const { message, variant } = useSelector((state: RootState) => state.alertReducer);
  const [formState, setFormState] = useState(formInitialState);

  //mui theme
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));


  //to identify same event clicked
  // const isSameEvent = (e) => {
  //   const isIt = false;
  //   if(formState.id === e.id) return true;
  //   return isIt;
  // }

  const handleToggle = (toggleType:string, event:any) => {
    console.log("e---\n", event);
    let isToggle = true;
    if(toggleType==="add"){
      if(event.id){
        return;
      }
     isToggle =  isToggle ? false : true;

    }else{
      if(formState.id === event.id){
        return;
      }
      isToggle =  isToggle ? false : true;
    }
    console.log("isToggle---\n", isToggle);
    setToggle({...toggle, toggleType, isToggle});
  };

  useEffect(() => {
    //close form if data is upload otherwise wait.
    if (addStatus === 'success') {
      setToggle({...toggle, isToggle:false});
      dispatch(fetchExpense(userId))
    }
  }, [addStatus, userId]);


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
          onClick={(event) => handleToggle("add", event)}
        />
      </Box>
      {toggle.isToggle && (
        <ExpenseForm
          isSmallScreen={isSmallScreen}
          theme={theme}
        />
      )}

      <Box sx={{ mt: 2 }}>
        {/* <ExpenseTable /> */}
        <Suspense fallback={<LinearProgress/>}>
          <LazyExpenseTable handleToggle={handleToggle}/>
        </Suspense>
      </Box>
    </Wrapper>
  );
};

export default React.memo(Expenses);
