import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ButtonComp from "../components/Common/ButtonComp";
import { useTheme, useMediaQuery, Typography, Box } from "@mui/material";
import { ExpenseTypeForm } from "../components/ExpenseType/ExpenseTypeForm";
import ExpenseTypeTable from "../components/ExpenseType/ExpenseTypeTable";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../ReduxToolkit/store";
import { useSnackbar } from 'notistack';
import { clearAlert } from "../ReduxToolkit/slices/alertSlice";
import { fetchExpenseType } from "../ReduxToolkit/slices/expenseTypeSlice";

// Create a Wrapper component that'll render a <section> tag with some styles
const Wrapper = styled.section`
  padding: 10px;
`;

const ExpenseType: React.FC = () => {
  const [toggleTypeAdd, setToggleTypeAdd] = useState(false);
  const [editingExpenseType, setEditingExpenseType] = useState<any>(null);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { message, variant } = useSelector((state: RootState) => state.alertReducer);
  const { addStatus, updateStatus } = useSelector((state: RootState) => state.expenseTypeReducer);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch: AppDispatch = useDispatch();

  function handleToggleTypeAdd() {
    setToggleTypeAdd(!toggleTypeAdd);
    if (toggleTypeAdd) {
      setEditingExpenseType(null);
    }
  }

  function handleEditExpenseType(expenseType: any) {
    setEditingExpenseType(expenseType);
    setToggleTypeAdd(true);
  }

  function handleEditComplete() {
    setEditingExpenseType(null);
    setToggleTypeAdd(false);
  }

  useEffect(() => {
    if (message) {
      enqueueSnackbar(message, { variant })
      dispatch(clearAlert());
    }
  }, [message, variant, dispatch]);

  useEffect(() => {
    //close form if data is upload otherwise wait.
    if (addStatus === 'success' || updateStatus === 'success') {
      setToggleTypeAdd(false);
      setEditingExpenseType(null);
      dispatch(fetchExpenseType(localStorage.getItem('userId')))
    }
  }, [addStatus, updateStatus])

  return (
    <>
      <Wrapper>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography
            gutterBottom
            sx={{ textAlign: "left", fontSize: isSmallScreen ? "1.2rem" : "1.5rem" }} // Smaller font for small screens
          >
            {editingExpenseType ? "Edit Expense Type" : "Config"}
          </Typography>
          <ButtonComp
            title={editingExpenseType ? "Close" : "Add Type"}
            variant="contained"
            color="primary"
            size={isSmallScreen ? "small" : "medium"} // Adjust button size
            event={handleToggleTypeAdd}
          />
        </Box>
        <div>
          {
            toggleTypeAdd &&
            <ExpenseTypeForm
              isSmallScreen={isSmallScreen}
              theme={theme}
              editData={editingExpenseType}
              onEditComplete={handleEditComplete}
            />
          }

        </div>
        <ExpenseTypeTable onEdit={handleEditExpenseType} />
      </Wrapper>
    </>
  );
};

export default ExpenseType;